import type { Todo } from "@/types/todo";
import TodoCard from "./TodoCard";

/**
 * Todo 목록 영역.
 * - 전달받은 todos를 카드 리스트로 렌더링한다.
 * - 항목이 없으면 빈 상태 메시지를 보여준다.
 */
interface TodoListProps {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  // 빈 상태: 선택한 날짜에 Todo가 없을 때
  if (todos.length === 0) {
    return (
      <div className="rounded-xl bg-white py-16 text-center ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">이 날짜에 등록된 Todo가 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
