import TodosView from "@/components/todos/TodosView";

/**
 * Todo 목록 페이지 (/todos)
 * - 상태/로직은 TodosView 컨테이너에 위임하고, 라우트 파일은 조합만 담당한다.
 */
export default function TodosPage() {
  return <TodosView />;
}
