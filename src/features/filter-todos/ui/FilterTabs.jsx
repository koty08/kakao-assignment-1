import { FILTER } from '../model/useFilter'

const TABS = [
  { value: FILTER.ALL,       label: '전체' },
  { value: FILTER.ACTIVE,    label: '진행 중' },
  { value: FILTER.COMPLETED, label: '완료' },
]

export function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer
            ${currentFilter === value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
