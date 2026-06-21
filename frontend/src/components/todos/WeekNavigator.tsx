"use client";

import { useEffect, useRef, useState } from "react";
import { addWeeks, formatWeekLabel, getWeekDates, isSameDay, toISODate } from "@/lib/date";
import WeekDayCell from "./WeekDayCell";
import WeekPickerDropdown from "./WeekPickerDropdown";

/**
 * 주간 뷰 네비게이터.
 * - 이전/다음 주 이동 버튼과 주차 라벨(클릭 시 드롭다운)을 제공한다.
 * - 월~일 7개 날짜 셀을 나열하고, 각 날짜의 Todo 개수를 표시한다.
 * - 날짜 선택/주차 이동은 부모로 콜백을 올려 상태를 위임한다.
 */
interface WeekNavigatorProps {
  currentMonday: Date;
  selectedDate: Date;
  todoCountByDate: Record<string, number>; // 'YYYY-MM-DD' → 개수
  onChangeWeek: (monday: Date) => void;
  onSelectDate: (date: Date) => void;
}

export default function WeekNavigator({ currentMonday, selectedDate, todoCountByDate, onChangeWeek, onSelectDate }: WeekNavigatorProps) {
  // 주차 선택 드롭다운 열림 상태
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const weekDates = getWeekDates(currentMonday);

  // 영역 바깥 클릭 시 닫힘 처리
  useEffect(() => {
    if (!isPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (pickerRef.current && !pickerRef.current.contains(target)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPickerOpen]);

  // 주차 라벨 클릭 → 드롭다운 토글
  const togglePicker = () => setIsPickerOpen((prev) => !prev);

  // 드롭다운에서 주 선택 시: 주 이동 + 드롭다운 닫기
  const handleSelectWeek = (monday: Date) => {
    onChangeWeek(monday);
    setIsPickerOpen(false);
  };

  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
      {/* 상단: 이전 주 / 주차 라벨(드롭다운) / 다음 주 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChangeWeek(addWeeks(currentMonday, -1))}
          className="rounded-lg px-3 py-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="이전 주"
        >
          ‹
        </button>

        {/* 주차 라벨 + 드롭다운 (relative 기준점, 바깥 클릭 판별 ref) */}
        <div ref={pickerRef} className="relative">
          <button
            type="button"
            onClick={togglePicker}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50"
          >
            {formatWeekLabel(currentMonday)}
            <span className="text-xs text-gray-400">▾</span>
          </button>

          {isPickerOpen && <WeekPickerDropdown currentMonday={currentMonday} onSelectWeek={handleSelectWeek} />}
        </div>

        <button
          type="button"
          onClick={() => onChangeWeek(addWeeks(currentMonday, 1))}
          className="rounded-lg px-3 py-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="다음 주"
        >
          ›
        </button>
      </div>

      {/* 날짜 셀 7개 (월~일) */}
      <div className="flex gap-1">
        {weekDates.map((date, index) => (
          <WeekDayCell
            key={toISODate(date)}
            date={date}
            weekdayIndex={index}
            todoCount={todoCountByDate[toISODate(date)] ?? 0}
            isSelected={isSameDay(date, selectedDate)}
            isToday={isSameDay(date, today)}
            onSelect={onSelectDate}
          />
        ))}
      </div>
    </section>
  );
}
