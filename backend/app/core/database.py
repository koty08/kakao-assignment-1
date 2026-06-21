"""데이터베이스 연결 및 세션 관리 모듈.

- SQLAlchemy 엔진과 세션 팩토리를 생성한다.
- ORM 모델이 상속할 Base 클래스를 정의한다.
- 요청마다 세션을 열고 닫는 FastAPI 의존성(get_db)을 제공한다.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# SQLite 엔진 생성.
# check_same_thread=False: FastAPI는 여러 스레드에서 동작하므로 SQLite의 동일 스레드 제약을 해제한다.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# 세션 팩토리: DB 작업 단위(트랜잭션)를 담당하는 Session 인스턴스를 생성한다.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """모든 ORM 모델이 상속하는 선언적 베이스 클래스."""


def get_db() -> Generator[Session, None, None]:
    """요청 처리 동안 사용할 DB 세션을 제공하는 의존성.

    - yield로 세션을 넘겨주고, 요청이 끝나면 finally에서 반드시 close 한다.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
