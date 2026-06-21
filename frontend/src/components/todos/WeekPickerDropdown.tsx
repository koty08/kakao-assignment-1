"use client";

import { useState } from "react";
import {
  formatWeekRange,
  getMondaysOfMonth,
  isSameDay,
} from "@/lib/date";

/**
 * 주차 선택 드롭다운 패널.
 * - 상단에서 월(month)을 앞뒤로 이동할 수 있다.
 * - 선택한 월에 속한 주차들을 목록으로 보여주고, 클릭 시 해당 주로 이동한다.
 */
interface WeekPickerDropdownProps {
  currentMonday: Date; // 현재 보고 있는 주의 월요일 (드롭다운 초기 월 기준)
  onSelectWeek: (monday: Date) => void;
}

export default function WeekPickerDropdown({
  currentMonday,
  onSelectWeek,
}: WeekPickerDropdownProps) {
  // 드롭다운에서 탐색 중인 월 (현재 주의 월로 초기화)
  const [viewYear, setViewYear] = useState(currentMonday.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentMonday.getMonth());

  // 탐색 중인 월에 속한 주차들의 월요일 목록
  const mondays = getMondaysOfMonth(viewYear, viewMonth);

  // 월 이동 (delta: -1 이전 달, +1 다음 달)
  const moveMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-100">
      {/* 월 이동 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="rounded-lg px-2 py-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-foreground">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="rounded-lg px-2 py-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* 주차 목록 */}
      <ul className="flex flex-col gap-1">
        {mondays.map((monday, index) => {
          const isCurrent = isSameDay(monday, currentMonday);
          return (
            <li key={monday.toISOString()}>
              <button
                type="button"
                onClick={() => onSelectWeek(monday)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  isCurrent
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{index + 1}주차</span>
                <span className="text-xs text-gray-400">
                  {formatWeekRange(monday)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
