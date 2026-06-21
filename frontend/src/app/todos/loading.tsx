/**
 * /todos 영역의 로딩 화면.
 * - 페이지/데이터 준비 중 Next.js가 자동으로 이 컴포넌트를 보여준다.
 * - 실제 레이아웃과 유사한 스켈레톤으로 깜빡임을 줄인다.
 */
export default function TodosLoading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      {/* 헤더 자리 */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-16 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-100" />
      </div>

      {/* 주간 뷰 자리 */}
      <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />

      {/* 목록 자리 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    </main>
  );
}
