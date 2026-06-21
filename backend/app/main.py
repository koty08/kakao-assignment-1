"""FastAPI 애플리케이션 진입점.

- FastAPI 앱 인스턴스를 생성하고 CORS 등 전역 설정을 적용한다.
- 앱 시작 시 DB 테이블을 생성한다.
- todos 라우터를 등록하고, 동작 확인용 기본 엔드포인트를 제공한다.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine

# 모델을 import 해야 Base.metadata에 테이블이 등록된다. (테이블 생성에 필요)
from app.models import todo as _todo_model  # noqa: F401
from app.routers import todos


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 생애주기 훅: 시작 시 아직 없는 테이블을 생성한다."""
    Base.metadata.create_all(bind=engine)
    yield


# FastAPI 앱 생성 (문서 제목으로 설정값 사용)
app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# CORS 설정: 프론트엔드(Next.js)에서 API를 호출할 수 있도록 허용 출처를 등록한다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# todos 라우터 등록
app.include_router(todos.router)


@app.get("/")
def read_root() -> dict[str, str]:
    """루트 엔드포인트: 서버가 살아있는지 확인하는 환영 메시지."""
    return {"message": "Todo API 서버가 정상 동작 중입니다."}


@app.get("/health")
def health_check() -> dict[str, str]:
    """헬스 체크 엔드포인트: 모니터링/배포 환경에서 상태 확인용."""
    return {"status": "ok"}
