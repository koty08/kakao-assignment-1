"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import type { TodoState } from "@/types/todo";
import StateSelect from "./StateSelect";
import DatePickerField from "./DatePickerField";

/**
 * Todo 생성/수정 공용 폼.
 * - 제출은 Server Action(action prop)에 위임한다. (실제 백엔드 호출/리다이렉트는 액션이 수행)
 * - 날짜/상태는 커스텀 컴포넌트라 값이 폼에 자동 포함되지 않으므로 hidden input으로 함께 전송한다.
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
  action: (formData: FormData) => void | Promise<void>; // Server Action
}

export default function TodoForm({
  initialValues,
  submitLabel,
  action,
}: TodoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TodoFormValues>(initialValues);

  // 입력 필드 변경 핸들러 (필드명 기준으로 부분 업데이트)
  const handleChange = (field: keyof TodoFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-2xl bg-white p-6 ring-1 ring-gray-100"
    >
      {/* 내용 (네이티브 input → name으로 FormData에 자동 포함) */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">내용</span>
        <input
          type="text"
          name="content"
          value={values.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="할 일을 입력하세요"
          required
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
        />
      </label>

      {/* 대상 날짜 (커스텀 달력 + hidden input으로 값 전송) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">날짜</span>
        <DatePickerField
          value={values.date}
          onChange={(date) => handleChange("date", date)}
        />
        <input type="hidden" name="date" value={values.date} />
      </div>

      {/* 상태 (커스텀 드롭다운 + hidden input으로 값 전송) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">상태</span>
        <StateSelect
          value={values.state}
          onChange={(state) => handleChange("state", state)}
        />
        <input type="hidden" name="state" value={values.state} />
      </div>

      {/* 액션 버튼 */}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/todos")}
          className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          취소
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

/**
 * 제출 버튼.
 * - useFormStatus로 폼 전송(pending) 상태를 읽어, 처리 중에는 비활성화/문구를 바꾼다.
 * - useFormStatus는 form 내부 자식에서만 동작하므로 별도 컴포넌트로 분리한다.
 */
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 cursor-pointer rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "처리 중..." : label}
    </button>
  );
}
