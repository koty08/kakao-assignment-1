/**
 * UI 작업용 임시 Todo 데이터.
 * - API 연동 전 단계이므로 화면 확인을 위한 mock 데이터를 제공한다.
 * - 오늘 날짜를 기준으로 분산 배치해, 주간 뷰에서 데이터가 보이도록 한다.
 */

import type { Todo } from "@/types/todo";
import { addDays, toISODate } from "@/lib/date";

const today = new Date();

// 오늘 기준 상대 날짜로 mock 데이터 구성
export const MOCK_TODOS: Todo[] = [
  {
    id: 1,
    content: "주간 회의 자료 준비",
    state: "in_progress",
    date: toISODate(today),
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    content: "FastAPI CRUD 복습",
    state: "completed",
    date: toISODate(today),
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    content: "운동 30분",
    state: "in_progress",
    date: toISODate(addDays(today, 1)),
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    content: "장보기",
    state: "in_progress",
    date: toISODate(addDays(today, 2)),
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    content: "책 1챕터 읽기",
    state: "completed",
    date: toISODate(addDays(today, -1)),
    createdAt: new Date().toISOString(),
  },
];
