"""Todo ORM 모델 정의 모듈.

- 데이터베이스의 todos 테이블 구조를 SQLAlchemy 모델로 표현한다.
- 상태 값은 문자열 Enum(TodoState)으로 제한해 잘못된 값이 저장되는 것을 방지한다.

참고: 필드명 `date`와 타입명 `date`가 충돌하지 않도록,
datetime 모듈을 통째로 import 해 `datetime.date`로 타입을 참조한다.
"""

import datetime
import enum

from sqlalchemy import Date, DateTime, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TodoState(str, enum.Enum):
    """Todo의 진행 상태."""

    IN_PROGRESS = "in_progress"  # 진행 중
    COMPLETED = "completed"  # 완료


class Todo(Base):
    """todos 테이블에 매핑되는 Todo 모델."""

    __tablename__ = "todos"

    # 기본 키 (자동 증가)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Todo 내용
    content: Mapped[str] = mapped_column(String, nullable=False)

    # Todo 상태 (기본값: 진행 중)
    state: Mapped[TodoState] = mapped_column(
        Enum(TodoState), nullable=False, default=TodoState.IN_PROGRESS
    )

    # Todo 대상 날짜 (시간 없는 날짜)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    # 생성 시각 (목록 정렬 기준). UTC 기준으로 저장한다.
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )
