"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Todo } from "@/types/todo";
import { MOCK_TODOS } from "@/mocks/todos";
import { getMonday, isSameDay, toISODate } from "@/lib/date";
import WeekNavigator from "./WeekNavigator";
import TodoList from "./TodoList";

/**
 * Todo 목록 페이지의 상태 컨테이너.
 * - 주간 뷰(선택 날짜/주차)와 목록의 상태를 한곳에서 관리한다.
 * - 선택한 날짜로 목록을 필터링하고, 주간 뷰에 날짜별 개수를 전달한다.
 * - (UI 단계) 데이터는 mock을 사용하며, 삭제는 로컬 상태에서만 반영한다.
 */
export default function TodosView() {
  const today = new Date();

  // 화면 상태
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonday, setCurrentMonday] = useState<Date>(getMonday(today));

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

  // 주 이동 시: 주의 월요일 갱신 + 선택 날짜도 해당 주로 옮긴다(같은 요일 유지).
  const handleChangeWeek = (monday: Date) => {
    setCurrentMonday(monday);
    setSelectedDate(monday);
  };

  // 삭제: 로컬 상태에서만 제거 (API 연동 전)
  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
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

      {/* 목록 */}
      <TodoList todos={visibleTodos} onDelete={handleDelete} />
    </main>
  );
}
