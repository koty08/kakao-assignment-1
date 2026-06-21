import Link from "next/link";
import { notFound } from "next/navigation";
import TodoForm from "@/components/todos/TodoForm";
import { getTodoById } from "@/lib/todos-server";
import { updateTodo } from "../actions";

/**
 * Todo 수정 페이지 (/todos/[todoId])
 * - Next.js 16에서는 params가 Promise이므로 await로 받는다.
 * - 서버에서 백엔드를 호출해 해당 id의 Todo를 불러와 폼 초기값으로 사용한다.
 * - 없는 id면 notFound()로 404 화면을 표시한다.
 * - 수정 Server Action(updateTodo)에 id를 bind해 폼에 전달한다.
 */
export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodoById(Number(todoId));

  if (!todo) {
    notFound();
  }

  const initialValues = {
    content: todo.content,
    date: todo.date,
    state: todo.state,
  };

  // 첫 번째 인자(id)를 미리 고정한 Server Action을 폼에 전달한다.
  const updateTodoWithId = updateTodo.bind(null, todo.id);

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

      <TodoForm
        initialValues={initialValues}
        submitLabel="저장"
        action={updateTodoWithId}
      />
    </main>
  );
}
