"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "@/types/todo";
import { fetchTodos, todoKeys } from "@/lib/todos-client";
import { deleteTodo } from "@/app/todos/actions";
import { getMonday, isSameDay, toISODate } from "@/lib/date";
import WeekNavigator from "./WeekNavigator";
import TodoList from "./TodoList";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

/**
 * Todo 목록 페이지의 상태 컨테이너 (클라이언트 컴포넌트).
 * - 목록 데이터: Tanstack Query로 Next API Route(/api/todos)를 호출해 가져온다.
 * - 삭제: deleteTodo Server Action 호출 후 쿼리를 무효화해 목록을 갱신한다.
 * - 주간 뷰(선택 날짜/주차)와 날짜별 필터링은 클라이언트 상태로 관리한다.
 */
export default function TodosView() {
  const today = new Date();
  const queryClient = useQueryClient();

  // 목록 조회. staleTime 0 → 생성/수정 후 목록으로 돌아올 때 항상 최신 데이터를 다시 가져온다.
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: todoKeys.all,
    queryFn: fetchTodos,
    staleTime: 0,
  });

  // 화면 상태
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonday, setCurrentMonday] = useState<Date>(getMonday(today));
  // 삭제 확인 모달의 대상 Todo (null이면 모달 닫힘)
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);

  // 삭제 mutation: 서버 액션 실행 후 목록 쿼리 무효화 → 자동 재조회
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });

  // 날짜별 Todo 개수 맵 ('YYYY-MM-DD' → 개수). 주간 뷰 셀에 표시한다.
  const todoCountByDate = useMemo(() => {
    return todos.reduce<Record<string, number>>((counts, todo) => {
      counts[todo.date] = (counts[todo.date] ?? 0) + 1;
      return counts;
    }, {});
  }, [todos]);

  // 선택한 날짜에 해당하는 Todo만 필터링
  const visibleTodos = useMemo(() => {
    const selectedISO = toISODate(selectedDate);
    return todos.filter((todo) => todo.date === selectedISO);
  }, [todos, selectedDate]);

  // 주 이동 시: 주의 월요일 갱신 + 선택 날짜도 해당 주로 옮긴다.
  const handleChangeWeek = (monday: Date) => {
    setCurrentMonday(monday);
    setSelectedDate(monday);
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
        <TodoList todos={visibleTodos} onDelete={handleRequestDelete} />
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
