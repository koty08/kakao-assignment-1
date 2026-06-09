import { toDateKey, formatDate } from "@/shared/lib";

export function DateNavigator({ selectedDate, onPrev, onNext, onToday }) {
  const isToday = toDateKey(selectedDate) === toDateKey(new Date());

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="이전 날짜"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{formatDate(selectedDate)}</span>
        {!isToday && (
          <button
            onClick={onToday}
            className="text-xs px-2 py-0.5 rounded-md bg-primary text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            오늘로 돌아가기
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="다음 날짜"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
