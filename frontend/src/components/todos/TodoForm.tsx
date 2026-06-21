"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TodoState } from "@/types/todo";
import { TODO_STATE_LABEL } from "@/types/todo";

/**
 * Todo 생성/수정 공용 폼.
 * - 내용, 대상 날짜, 상태를 입력받는다.
 * - 이번 단계는 API 연동 없이 UI만 동작한다. 제출 시 목록으로 이동한다.
 * - 초기값(initialValues)을 받아 생성/수정 화면 모두에서 재사용한다.
 */
export interface TodoFormValues {
  content: string;
  date: string; // YYYY-MM-DD
  state: TodoState;
}

interface TodoFormProps {
  initialValues: TodoFormValues;
  submitLabel: string; // 제출 버튼 라벨 (예: "추가", "저장")
}

export default function TodoForm({
  initialValues,
  submitLabel,
}: TodoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TodoFormValues>(initialValues);

  // 입력 필드 변경 핸들러 (필드명 기준으로 부분 업데이트)
  const handleChange = (
    field: keyof TodoFormValues,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // 제출: API 연동 전이므로 목록 페이지로 이동만 한다.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 추후 API 연동 시 생성/수정 요청 호출
    router.push("/todos");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-gray-100"
    >
      {/* 내용 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">내용</span>
        <input
          type="text"
          value={values.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="할 일을 입력하세요"
          required
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
        />
      </label>

      {/* 대상 날짜 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">날짜</span>
        <input
          type="date"
          value={values.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
        />
      </label>

      {/* 상태 */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">상태</span>
        <select
          value={values.state}
          onChange={(e) => handleChange("state", e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
        >
          {(Object.keys(TODO_STATE_LABEL) as TodoState[]).map((state) => (
            <option key={state} value={state}>
              {TODO_STATE_LABEL[state]}
            </option>
          ))}
        </select>
      </label>

      {/* 액션 버튼 */}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/todos")}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
