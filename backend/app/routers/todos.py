"""Todo API 라우터.

- /todos 경로의 HTTP 엔드포인트를 정의한다.
- 요청 검증/응답 직렬화는 스키마에, DB 작업은 crud 계층에 위임한다.
- 존재하지 않는 리소스 접근 시 404를 반환한다.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import todo as todo_crud
from app.models.todo import TodoState
from app.schemas.todo import TodoCreate, TodoFilter, TodoRead, TodoUpdate

# 이 라우터의 모든 경로는 /todos 로 시작하고, 문서상 "todos" 태그로 묶인다.
router = APIRouter(prefix="/todos", tags=["todos"])

# 필터 값 → 실제 Todo 상태 매핑 (all은 전체이므로 매핑 없음)
_FILTER_TO_STATE: dict[TodoFilter, TodoState] = {
    TodoFilter.active: TodoState.IN_PROGRESS,
    TodoFilter.completed: TodoState.COMPLETED,
}


def get_todo_or_404(todo_id: int, db: Session = Depends(get_db)):
    """id로 Todo를 조회하고, 없으면 404 예외를 발생시키는 공통 의존성."""
    todo = todo_crud.get_todo(db, todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"id={todo_id} 인 Todo를 찾을 수 없습니다.",
        )
    return todo


@router.get("", response_model=list[TodoRead])
def read_todos(
    todo_filter: TodoFilter = Query(default=TodoFilter.all, alias="filter"),
    db: Session = Depends(get_db),
):
    """Todo 목록 조회. ?filter=all|active|completed 로 상태별 필터링."""
    state = _FILTER_TO_STATE.get(todo_filter)  # all이면 None → 전체 조회
    return todo_crud.get_todos(db, state=state)


@router.get("/{todo_id}", response_model=TodoRead)
def read_todo(todo=Depends(get_todo_or_404)):
    """단일 Todo 조회 (수정 페이지 등에서 사용). 없으면 404."""
    return todo


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    """새 Todo 생성."""
    return todo_crud.create_todo(db, payload)


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    payload: TodoUpdate,
    todo=Depends(get_todo_or_404),
    db: Session = Depends(get_db),
):
    """Todo 수정 (전달된 필드만 갱신)."""
    return todo_crud.update_todo(db, todo, payload)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo=Depends(get_todo_or_404),
    db: Session = Depends(get_db),
):
    """Todo 삭제."""
    todo_crud.delete_todo(db, todo)
