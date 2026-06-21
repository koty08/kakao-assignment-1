import Link from "next/link";
import type { Todo } from "@/types/todo";
import { TODO_STATE_LABEL } from "@/types/todo";

/**
 * 단일 Todo 항목 카드.
 * - 상태 토글 체크박스, 내용, 그리고 [수정 페이지 이동 / 삭제] 액션을 표시한다.
 * - 상태 토글/삭제는 부모가 내려준 콜백에 위임한다 (렌더링/액션 책임 분리).
 */
interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const isCompleted = todo.state === "completed";

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100 transition-shadow hover:shadow-sm">
      {/* 상태 토글 체크박스: 클릭 시 진행 중 ↔ 완료 전환 */}
      <button
        type="button"
        onClick={() => onToggle(todo)}
        aria-label={isCompleted ? "진행 중으로 변경" : "완료로 변경"}
        aria-pressed={isCompleted}
        className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${
          isCompleted
            ? "border-brand bg-brand text-white"
            : "border-gray-300 bg-white hover:border-brand"
        }`}
      >
        {/* 완료 상태일 때만 체크 표시 */}
        {isCompleted && (
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3 w-3"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.29 6.8-6.79a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* 내용 + 상태 라벨 */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-medium ${
            isCompleted ? "text-gray-400 line-through" : "text-foreground"
          }`}
        >
          {todo.content}
        </p>
        <span className="text-xs text-gray-400">
          {TODO_STATE_LABEL[todo.state]}
        </span>
      </div>

      {/* 수정 페이지 이동 */}
      <Link
        href={`/todos/${todo.id}`}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-brand"
      >
        수정
      </Link>

      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
