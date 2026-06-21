import Link from "next/link";
import type { Todo } from "@/types/todo";
import { TODO_STATE_LABEL } from "@/types/todo";

/**
 * 단일 Todo 항목 카드.
 * - 상태 뱃지, 내용, 그리고 [수정 페이지 이동 / 삭제] 액션을 표시한다.
 * - 삭제는 부모가 내려준 onDelete 콜백에 위임한다 (렌더링/액션 책임 분리).
 */
interface TodoCardProps {
  todo: Todo;
  onDelete: (id: number) => void;
}

export default function TodoCard({ todo, onDelete }: TodoCardProps) {
  const isCompleted = todo.state === "completed";

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100 transition-shadow hover:shadow-sm">
      {/* 상태 표시 점 */}
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isCompleted ? "bg-gray-300" : "bg-brand"}`} aria-hidden />

      {/* 내용 + 상태 라벨 */}
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${isCompleted ? "text-gray-400 line-through" : "text-foreground"}`}>{todo.content}</p>
        <span className="text-xs text-gray-400">{TODO_STATE_LABEL[todo.state]}</span>
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
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors cursor-pointer hover:bg-red-50 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
