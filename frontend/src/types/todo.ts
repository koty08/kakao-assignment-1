/**
 * Todo 도메인 타입 정의.
 * - 백엔드 API 스키마와 1:1로 맞춘다. (state는 백엔드 Enum 값과 동일)
 */

// Todo 진행 상태
export type TodoState = "in_progress" | "completed";

export interface Todo {
  id: number;
  content: string;
  state: TodoState;
  date: string; // 대상 날짜 (YYYY-MM-DD)
  created_at: string; // 등록 시각 (백엔드 응답 필드명과 동일)
}

// 상태 → 한국어 라벨 매핑 (UI 표시에 사용)
export const TODO_STATE_LABEL: Record<TodoState, string> = {
  in_progress: "진행 중",
  completed: "완료",
};
