import Link from "next/link";

/**
 * 홈 페이지
 * - 프로젝트 초기 세팅이 정상 동작하는지 확인하기 위한 기본 랜딩 화면.
 * - 메인 브랜드 컬러(#3182F6)와 모던한 카드 레이아웃을 적용했다.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* 중앙 정렬된 카드 형태의 환영 영역 */}
      <section className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
        {/* 브랜드 컬러 뱃지 */}
        <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          Todo App
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          프론트엔드 세팅 완료
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Next.js · TypeScript · Tailwind CSS · Tanstack Query
          <br />
          기본 환경이 정상적으로 구성되었습니다.
        </p>

        {/* Todo 목록 페이지로 이동 */}
        <Link
          href="/todos"
          className="mt-8 block w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          시작하기
        </Link>
      </section>
    </main>
  );
}
