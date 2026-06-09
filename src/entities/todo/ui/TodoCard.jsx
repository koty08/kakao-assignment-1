import { Button } from "@/shared/ui";

export function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  return (
    <li
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
        ${todo.completed ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"}`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        aria-label="완료 토글"
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors hover:cursor-pointer
          ${todo.completed ? "bg-primary border-primary" : "border-gray-300 hover:border-primary"}`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm break-all
          ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}
      >
        {todo.text}
      </span>

      <div className="flex gap-1 flex-shrink-0">
        <Button variant="ghost" onClick={() => onEdit(todo.id)}>
          수정
        </Button>
        <Button variant="danger" onClick={() => onDelete(todo.id)}>
          삭제
        </Button>
      </div>
    </li>
  );
}
