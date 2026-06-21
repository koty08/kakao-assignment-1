import axios from "axios";
import type { Todo, TodoFilter } from "@/types/todo";

/**
 * 브라우저(클라이언트)에서 사용하는 Todo 조회 유틸.
 * - 백엔드를 직접 호출하지 않고, 같은 출처의 Next API Route(/api/todos)를 호출한다.
 * - Tanstack Query의 queryFn으로 사용한다.
 */

// 쿼리 키를 한곳에서 관리 (캐시 무효화 시 일관성 유지)
export const todoKeys = {
  all: ["todos"] as const,
  // 필터/검색어 조합별로 캐시를 구분한다. (값이 바뀌면 자동 재조회)
  list: (filter: TodoFilter, search: string) =>
    ["todos", filter, search] as const,
};

/** Next API Route를 통해 (필터/검색이 적용된) Todo 목록을 가져온다. */
export async function fetchTodos(
  filter: TodoFilter,
  search: string,
): Promise<Todo[]> {
  const { data } = await axios.get<Todo[]>("/api/todos", {
    params: { filter, search },
  });
  return data;
}
