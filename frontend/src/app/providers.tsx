"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * 앱 전역 Provider 컴포넌트
 * - Tanstack Query의 QueryClient를 생성하고 하위 트리에 제공한다.
 * - QueryClient를 useState로 1회만 생성해, 리렌더링 시 새로 만들어지지 않도록 한다.
 * - 클라이언트 컴포넌트이므로 파일 최상단에 "use client" 선언이 필요하다.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // 컴포넌트 생애주기 동안 단일 QueryClient 인스턴스를 유지한다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분 동안은 데이터를 fresh로 간주해 불필요한 재요청 방지
            retry: 1, // 요청 실패 시 1회만 재시도
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 쿼리 상태를 시각적으로 확인할 수 있는 devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
