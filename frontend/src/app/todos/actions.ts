"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backendApi } from "@/lib/backend";
import type { TodoState } from "@/types/todo";

/**
 * Todo 변경(mutation)을 담당하는 Server Action 모음.
 * - 파일 최상단의 "use server"로 모든 export가 Server Action이 된다.
 * - 브라우저에서 직접 호출되며, 내부에서 FastAPI 백엔드를 호출한다.
 * - 변경 후 revalidatePath로 /todos의 서버 캐시를 갱신한다.
 */

// 폼(FormData)에서 Todo 입력값을 추출한다 (생성/수정 공용).
function parseTodoForm(formData: FormData) {
  return {
    content: String(formData.get("content") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    state: String(formData.get("state") ?? "in_progress") as TodoState,
  };
}

/** 새 Todo 생성 → 목록으로 이동. */
export async function createTodo(formData: FormData) {
  const payload = parseTodoForm(formData);
  await backendApi.post("/todos", payload);

  revalidatePath("/todos");
  redirect("/todos"); // redirect는 예외를 던지므로 항상 마지막에 호출한다.
}

/** 기존 Todo 수정 → 목록으로 이동. (id는 페이지에서 bind로 주입) */
export async function updateTodo(id: number, formData: FormData) {
  const payload = parseTodoForm(formData);
  await backendApi.put(`/todos/${id}`, payload);

  revalidatePath("/todos");
  redirect("/todos");
}

/** Todo 삭제 (목록 페이지에서 직접 호출). */
export async function deleteTodo(id: number) {
  await backendApi.delete(`/todos/${id}`);
  revalidatePath("/todos");
}
