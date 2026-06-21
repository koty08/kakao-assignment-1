"use client";

import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";
import type { CSSProperties } from "react";
import { formatKoreanDate, fromISODate, toISODate } from "@/lib/date";
import { useClickOutside } from "@/hooks/useClickOutside";

/**
 * react-day-picker 기반 날짜 선택 필드.
 * - 트리거는 다른 폼 입력과 같은 모양, 클릭 시 달력 패널이 열린다.
 * - 달력의 강조 색(--rdp-accent-color 등)을 전역 브랜드 컬러에 맞춘다.
 * - 값은 'YYYY-MM-DD' 문자열로 주고받아 폼/백엔드 형식과 일치시킨다.
 */
interface DatePickerFieldProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

// react-day-picker의 CSS 변수를 전역 브랜드 컬러로 덮어쓴다.
const brandCalendarStyle = {
  "--rdp-accent-color": "var(--brand)",
  "--rdp-accent-background-color": "color-mix(in srgb, var(--brand) 12%, white)",
} as CSSProperties;

export default function DatePickerField({
  value,
  onChange,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  // 문자열 값을 Date로 변환 (달력 선택 표시에 사용)
  const selectedDate = value ? fromISODate(value) : undefined;

  // 날짜 선택: 문자열로 변환해 올려보내고 패널을 닫는다.
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(toISODate(date));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 트리거: 선택된 날짜 표시 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-brand"
      >
        {selectedDate ? formatKoreanDate(selectedDate) : "날짜 선택"}
        <span className="text-xs text-gray-400">▾</span>
      </button>

      {/* 달력 패널 */}
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-100">
          <DayPicker
            mode="single"
            required
            locale={ko}
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={handleSelect}
            style={brandCalendarStyle}
          />
        </div>
      )}
    </div>
  );
}
