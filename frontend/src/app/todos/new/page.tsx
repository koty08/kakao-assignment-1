import Link from "next/link";
import TodoForm from "@/components/todos/TodoForm";
import { toISODate } from "@/lib/date";

/**
 * Todo 생성 페이지 (/todos/new)
 * - 빈 초기값으로 폼을 렌더링한다. (날짜 기본값은 오늘)
 */
export default function NewTodoPage() {
  const initialValues = {
    content: "",
    date: toISODate(new Date()),
    state: "in_progress" as const,
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <header className="flex items-center gap-2">
        <Link
          href="/todos"
          className="rounded-lg px-2 py-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="목록으로"
        >
          ‹
        </Link>
        <h1 className="text-xl font-bold text-foreground">새 Todo</h1>
      </header>

      <TodoForm initialValues={initialValues} submitLabel="추가" />
    </main>
  );
}
