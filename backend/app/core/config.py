"""애플리케이션 설정(Settings) 정의 모듈.

- pydantic-settings를 사용해 환경변수(.env)로 값을 덮어쓸 수 있게 한다.
- 설정 값을 한 곳에서 관리해, 코드 곳곳에 하드코딩되는 것을 방지한다.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend 디렉토리 경로 (이 파일: backend/app/core/config.py → parents[2] = backend)
BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # 앱 메타 정보
    APP_NAME: str = "Todo API"

    # SQLite 데이터베이스 연결 URL (backend 디렉토리에 todos.db 파일 생성)
    DATABASE_URL: str = "sqlite:///./todos.db"

    # CORS 허용 출처 목록 (프론트엔드 개발 서버 주소)
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # backend/.env 파일을 읽는다 (실행 위치와 무관하게 절대 경로로 지정).
    # 정의되지 않은 추가 환경변수는 무시한다.
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# 앱 전역에서 import 해 사용하는 단일 설정 인스턴스
settings = Settings()
