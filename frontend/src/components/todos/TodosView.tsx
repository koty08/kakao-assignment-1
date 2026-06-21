"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo, TodoFilter, TodoState } from "@/types/todo";
import { fetchTodos, todoKeys } from "@/lib/todos-client";
import { deleteTodo, setTodoState } from "@/app/todos/actions";
import { getMonday, isSameDay, toISODate } from "@/lib/date";
import WeekNavigator from "./WeekNavigator";
import TodoList from "./TodoList";
import TodoFilterTabs from "./TodoFilterTabs";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

/**
 * Todo 목록 페이지의 상태 컨테이너 (클라이언트 컴포넌트).
 * - 상태 필터(filter)는 URL 파라미터로 관리되며, 서버 페이지에서 prop으로 받는다.
 * - 목록 데이터: Tanstack Query로 Next API Route(/api/todos?filter=)를 호출 → 서버 필터링.
 * - 토글/삭제: Server Action 호출 후 쿼리를 무효화해 목록을 갱신한다.
 * - 주간 뷰(선택 날짜/주차)와 날짜별 필터링은 클라이언트 상태로 관리한다.
 */
interface TodosViewProps {
  filter: TodoFilter;
}

export default function TodosView({ filter }: TodosViewProps) {
  const today = new Date();
  const queryClient = useQueryClient();

  // 목록 조회 (필터별 캐시). staleTime 0 → 변경 후 돌아올 때 항상 최신 데이터 재조회.
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: todoKeys.list(filter),
    queryFn: () => fetchTodos(filter),
    staleTime: 0,
  });

  // 화면 상태
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonday, setCurrentMonday] = useState<Date>(getMonday(today));
  // 삭제 확인 모달의 대상 Todo (null이면 모달 닫힘)
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);

  // 모든 필터 캐시를 무효화한다 (상태 변경은 여러 탭의 목록에 영향을 주므로).
  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: todoKeys.all });

  // 상태 토글 mutation: 진행 중 ↔ 완료
  const toggleMutation = useMutation({
    mutationFn: ({ id, state }: { id: number; state: TodoState }) =>
      setTodoState(id, state),
    onSuccess: invalidateTodos,
  });

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: invalidateTodos,
  });

  // 날짜별 Todo 개수 맵 ('YYYY-MM-DD' → 개수). 주간 뷰 셀에 표시한다.
  const todoCountByDate = useMemo(() => {
    return todos.reduce<Record<string, number>>((counts, todo) => {
      counts[todo.date] = (counts[todo.date] ?? 0) + 1;
      return counts;
    }, {});
  }, [todos]);

  // 선택한 날짜에 해당하는 Todo만 필터링 (상태 필터는 서버에서 이미 적용됨)
  const visibleTodos = useMemo(() => {
    const selectedISO = toISODate(selectedDate);
    return todos.filter((todo) => todo.date === selectedISO);
  }, [todos, selectedDate]);

  // 주 이동 시: 주의 월요일 갱신 + 선택 날짜도 해당 주로 옮긴다.
  const handleChangeWeek = (monday: Date) => {
    setCurrentMonday(monday);
    setSelectedDate(monday);
  };

  // 토글: 현재 상태의 반대로 전환
  const handleToggle = (todo: Todo) => {
    const nextState: TodoState =
      todo.state === "completed" ? "in_progress" : "completed";
    toggleMutation.mutate({ id: todo.id, state: nextState });
  };

  // 삭제 요청: 바로 지우지 않고 확인 모달을 띄운다.
  const handleRequestDelete = (id: number) => {
    const target = todos.find((todo) => todo.id === id) ?? null;
    setDeleteTarget(target);
  };

  // 삭제 확정: 서버 액션 실행 후 모달을 닫는다.
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      {/* 헤더: 제목 + 새 Todo 생성 버튼 */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Todo</h1>
        <Link
          href="/todos/new"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          + 새 Todo
        </Link>
      </header>

      {/* 주간 뷰 */}
      <WeekNavigator
        currentMonday={currentMonday}
        selectedDate={selectedDate}
        todoCountByDate={todoCountByDate}
        onChangeWeek={handleChangeWeek}
        onSelectDate={setSelectedDate}
      />

      {/* 상태 필터 탭 */}
      <TodoFilterTabs current={filter} />

      {/* 선택 날짜 라벨 */}
      <p className="px-1 text-sm text-gray-500">
        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        {isSameDay(selectedDate, today) && " (오늘)"} · {visibleTodos.length}개
      </p>

      {/* 목록: 로딩/에러/정상 분기 */}
      {isLoading ? (
        <p className="py-16 text-center text-sm text-gray-400">
          불러오는 중...
        </p>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-red-500">
          목록을 불러오지 못했습니다. 백엔드 서버 상태를 확인해 주세요.
        </p>
      ) : (
        <TodoList
          todos={visibleTodos}
          onToggle={handleToggle}
          onDelete={handleRequestDelete}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Todo를 삭제할까요?"
        description={
          deleteTarget
            ? `"${deleteTarget.content}" 항목이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`
            : undefined
        }
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
