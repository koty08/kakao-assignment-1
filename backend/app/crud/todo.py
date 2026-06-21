"""Todo 데이터 접근(CRUD) 계층.

- DB 세션을 받아 실제 SQLAlchemy 쿼리를 수행하는 함수들을 모은다.
- 라우터(HTTP 계층)와 DB 로직을 분리해, 라우터는 요청/응답에만 집중하게 한다.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.todo import Todo, TodoState
from app.schemas.todo import TodoCreate, TodoUpdate


def get_todos(db: Session, state: TodoState | None = None) -> list[Todo]:
    """Todo 목록을 최신 생성순(내림차순)으로 조회한다.

    - state가 주어지면 해당 상태의 Todo만 필터링한다 (서버 사이드 필터링).
    - state가 None이면 전체를 반환한다.
    """
    statement = select(Todo)
    if state is not None:
        statement = statement.where(Todo.state == state)
    statement = statement.order_by(Todo.created_at.desc())
    return list(db.scalars(statement).all())


def get_todo(db: Session, todo_id: int) -> Todo | None:
    """id로 단일 Todo를 조회한다. 없으면 None을 반환한다."""
    return db.get(Todo, todo_id)


def create_todo(db: Session, payload: TodoCreate) -> Todo:
    """새 Todo를 생성하고 저장한다."""
    todo = Todo(content=payload.content, state=payload.state, date=payload.date)
    db.add(todo)
    db.commit()
    db.refresh(todo)  # DB가 채운 id, created_at 등을 객체에 반영
    return todo


def update_todo(db: Session, todo: Todo, payload: TodoUpdate) -> Todo:
    """기존 Todo를 부분 수정한다. 전달된(=None이 아닌) 필드만 갱신한다."""
    # exclude_unset=True: 요청 본문에 포함된 필드만 추출 → 부분 수정 구현
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, todo: Todo) -> None:
    """Todo를 삭제한다."""
    db.delete(todo)
    db.commit()
