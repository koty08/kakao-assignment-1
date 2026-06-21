"use client";

/**
 * /todos 영역의 에러 화면.
 * - 하위 페이지에서 렌더링 중 예외가 발생하면 이 컴포넌트가 대신 표시된다.
 * - reset()을 호출하면 해당 구간을 다시 렌더링(복구 시도)한다.
 * - error.tsx는 반드시 클라이언트 컴포넌트여야 한다.
 */
export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-lg font-bold text-foreground">
        문제가 발생했습니다
      </h2>
      <p className="text-sm text-gray-500">
        {error.message || "잠시 후 다시 시도해 주세요."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        다시 시도
      </button>
    </main>
  );
}
