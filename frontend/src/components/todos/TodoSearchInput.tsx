"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TodoFilter } from "@/types/todo";
import { buildTodosHref } from "@/lib/todo-filter";

/**
 * Todo 내용 검색 입력창.
 * - 입력값을 디바운스(300ms)해 ?search= URL 파라미터로 반영한다 (서버 검색으로 이어짐).
 * - 현재 필터(filter)는 그대로 보존해, 검색과 필터를 동시에 적용한다.
 * - 초기값(initialSearch)은 서버 페이지가 URL에서 읽어 내려준다.
 */
interface TodoSearchInputProps {
  filter: TodoFilter;
  initialSearch: string;
}

export default function TodoSearchInput({
  filter,
  initialSearch,
}: TodoSearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch);

  // 최신 filter 값을 디바운스 콜백에서 참조하기 위한 ref (타이머 클로저의 stale 방지)
  const filterRef = useRef(filter);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // 첫 렌더(마운트)에서는 URL을 갱신하지 않는다.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 입력이 멈춘 뒤 URL을 갱신 (history 누적 방지를 위해 replace 사용)
    const timer = setTimeout(() => {
      router.replace(buildTodosHref({ filter: filterRef.current, search: value }), {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <div className="relative">
      {/* 검색 아이콘 */}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a1 1 0 01-1.42 1.42l-3.08-3.08A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="내용으로 검색"
        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-brand"
      />

      {/* 입력값이 있을 때만 노출되는 지우기 버튼 */}
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="검색어 지우기"
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-1 text-gray-400 transition-colors hover:text-foreground"
        >
          ✕
        </button>
      )}
    </div>
  );
}
