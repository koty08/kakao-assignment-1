import Link from "next/link";
import { notFound } from "next/navigation";
import TodoForm from "@/components/todos/TodoForm";
import { MOCK_TODOS } from "@/mocks/todos";

/**
 * Todo 수정 페이지 (/todos/[todoId])
 * - Next.js 16에서는 params가 Promise이므로 await로 받는다.
 * - (UI 단계) mock 데이터에서 해당 id의 Todo를 찾아 폼 초기값으로 사용한다.
 * - 없는 id면 notFound()로 404 화면을 표시한다.
 */
export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = MOCK_TODOS.find((item) => item.id === Number(todoId));

  if (!todo) {
    notFound();
  }

  const initialValues = {
    content: todo.content,
    date: todo.date,
    state: todo.state,
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
        <h1 className="text-xl font-bold text-foreground">Todo 수정</h1>
      </header>

      <TodoForm initialValues={initialValues} submitLabel="저장" />
    </main>
  );
}
