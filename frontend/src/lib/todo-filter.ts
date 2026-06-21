import type { TodoFilter } from "@/types/todo";

/**
 * Todo 상태 필터 관련 상수/유틸.
 * - 필터 탭 UI, URL 파라미터 파싱, 백엔드 쿼리에서 공통으로 사용한다.
 */

// 필터 탭 정의 (표시 순서대로)
export const TODO_FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

/**
 * URL 파라미터 등 임의의 문자열을 안전한 TodoFilter 값으로 정규화한다.
 * - active/completed가 아니면 전체(all)로 간주한다.
 */
export function normalizeFilter(value?: string | null): TodoFilter {
  return value === "active" || value === "completed" ? value : "all";
}

/**
 * filter/search를 반영한 /todos URL을 만든다.
 * - 기본값(filter=all, 빈 search)은 쿼리에서 생략해 URL을 깔끔하게 유지한다.
 * - 필터 탭/검색창이 서로의 값을 보존하며 URL을 갱신할 때 공통으로 사용한다.
 */
export function buildTodosHref({
  filter = "all",
  search = "",
}: {
  filter?: TodoFilter;
  search?: string;
}): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (search.trim()) params.set("search", search.trim());

  const queryString = params.toString();
  return queryString ? `/todos?${queryString}` : "/todos";
}
