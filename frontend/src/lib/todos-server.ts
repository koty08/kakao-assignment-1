import axios from "axios";
import { backendApi } from "@/lib/backend";
import type { Todo } from "@/types/todo";

/**
 * 서버 측에서 단일 Todo를 조회한다 (수정 페이지의 초기값 로딩 등).
 * - 백엔드 GET /todos/{id}를 직접 호출한다 (서버→서버, 추가 홉 없음).
 * - 존재하지 않으면(404) null을 반환해, 호출부에서 notFound() 처리를 하도록 한다.
 */
export async function getTodoById(id: number): Promise<Todo | null> {
  try {
    const { data } = await backendApi.get<Todo>(`/todos/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error; // 그 외 오류는 상위로 전파 (에러 화면 처리)
  }
}
