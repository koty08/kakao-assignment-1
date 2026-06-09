import { useState } from "react";
import { toDateKey, getWeekDays, getWeekLabel, getMonthWeeks } from "@/shared/lib";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

export function WeeklyView({ selectedDate, todos, onDateSelect }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const days = getWeekDays(selectedDate);
  const weekLabel = getWeekLabel(selectedDate);
  const todayKey = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);
  const currentWeekMondayKey = toDateKey(days[0]);

  const countByDate = (key) => todos.filter((t) => t.date === key).length;

  const shiftWeek = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta * 7);
    onDateSelect(d);
  };

  const dropdownMonths = [-1, 0, 1].map((offset) => {
    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
      weeks: getMonthWeeks(d.getFullYear(), d.getMonth()),
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      {/* 주차 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => shiftWeek(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="이전 주"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {weekLabel}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 max-h-60 overflow-y-auto">
                {dropdownMonths.map(({ year, month, label, weeks }) => (
                  <div key={`${year}-${month}`}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-50 sticky top-0">{label}</div>
                    {weeks.map(({ label: wLabel, firstDay }) => {
                      const isActive = toDateKey(firstDay) === currentWeekMondayKey;
                      return (
                        <button
                          key={wLabel}
                          onClick={() => {
                            onDateSelect(firstDay);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer
                            ${isActive ? "text-primary font-semibold bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {wLabel}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => shiftWeek(1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="다음 주"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const key = toDateKey(day);
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;
          const count = countByDate(key);

          return (
            <button
              key={key}
              onClick={() => onDateSelect(day)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors cursor-pointer
                ${isSelected ? "bg-primary" : isToday ? "bg-blue-50" : "hover:bg-gray-100"}`}
            >
              <span className={`text-xs ${isSelected ? "text-white/70" : "text-gray-400"}`}>{DAY_NAMES[i]}</span>
              <span
                className={`text-sm font-semibold
                ${isSelected ? "text-white" : isToday ? "text-primary" : "text-gray-800"}`}
              >
                {day.getDate()}
              </span>
              <span
                className={`text-xs font-medium min-h-4
                ${isSelected ? "text-white/80" : "text-primary"}`}
              >
                {count > 0 ? count : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
