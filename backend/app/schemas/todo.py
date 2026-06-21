"""Todo 요청/응답 스키마(Pydantic) 정의 모듈.

- API의 입력 검증과 출력 직렬화를 담당한다.
- 용도별로 스키마를 분리한다:
  - TodoCreate: 생성 요청 본문
  - TodoUpdate: 수정 요청 본문 (모든 필드 선택적 → 부분 수정 허용)
  - TodoRead: 응답 본문 (DB 모델을 직렬화)

참고: 필드명 `date`와 타입명 `date`가 충돌하지 않도록,
datetime 모듈을 통째로 import 해 `datetime.date`로 타입을 참조한다.
"""

import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.todo import TodoState


class TodoCreate(BaseModel):
    """새 Todo 생성 요청 본문."""

    # 내용은 최소 1글자 이상 (공백만 입력 방지)
    content: str = Field(min_length=1)
    date: datetime.date
    # 생성 시 상태를 지정하지 않으면 '진행 중'으로 시작
    state: TodoState = TodoState.IN_PROGRESS


class TodoUpdate(BaseModel):
    """Todo 수정 요청 본문 (전달된 필드만 갱신)."""

    content: str | None = Field(default=None, min_length=1)
    date: datetime.date | None = None
    state: TodoState | None = None


class TodoRead(BaseModel):
    """Todo 응답 본문."""

    id: int
    content: str
    state: TodoState
    date: datetime.date
    created_at: datetime.datetime

    # ORM 객체(속성 접근)를 그대로 직렬화할 수 있도록 설정
    model_config = ConfigDict(from_attributes=True)
