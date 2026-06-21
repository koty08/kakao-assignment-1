import TodosView from "@/components/todos/TodosView";
import { normalizeFilter } from "@/lib/todo-filter";

/**
 * Todo 목록 페이지 (/todos)
 * - URL 파라미터 ?filter=...&search=... 를 서버에서 읽어 TodosView에 전달한다.
 * - Next.js 16에서는 searchParams가 Promise이므로 await로 받는다.
 * - 상태/로직은 TodosView 컨테이너에 위임하고, 라우트 파일은 조합만 담당한다.
 */
export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const { filter, search } = await searchParams;
  return <TodosView filter={normalizeFilter(filter)} search={search ?? ""} />;
}
