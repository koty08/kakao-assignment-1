import { WEEKDAY_LABELS } from "@/lib/date";

/**
 * 주간 뷰의 단일 날짜 셀.
 * - 요일, 날짜, 해당 날짜의 Todo 개수를 표시한다.
 * - 선택된 날짜는 브랜드 컬러로 강조하고, 오늘은 점으로 표시한다.
 */
interface WeekDayCellProps {
  date: Date;
  weekdayIndex: number; // 0(월) ~ 6(일)
  todoCount: number;
  isSelected: boolean;
  isToday: boolean;
  onSelect: (date: Date) => void;
}

export default function WeekDayCell({
  date,
  weekdayIndex,
  todoCount,
  isSelected,
  isToday,
  onSelect,
}: WeekDayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 transition-colors ${
        isSelected ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {/* 요일 */}
      <span
        className={`text-xs ${isSelected ? "text-white/80" : "text-gray-400"}`}
      >
        {WEEKDAY_LABELS[weekdayIndex]}
      </span>

      {/* 날짜 숫자 */}
      <span className="text-base font-semibold">{date.getDate()}</span>

      {/* Todo 개수 (0이면 자리만 유지) */}
      <span
        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium ${
          todoCount === 0
            ? "text-transparent"
            : isSelected
              ? "bg-white/25 text-white"
              : "bg-brand/10 text-brand"
        }`}
      >
        {todoCount}
      </span>

      {/* 오늘 표시 점 */}
      <span
        className={`h-1 w-1 rounded-full ${
          isToday ? (isSelected ? "bg-white" : "bg-brand") : "bg-transparent"
        }`}
        aria-hidden
      />
    </button>
  );
}
