import Link from "next/link";
import type { TodoFilter } from "@/types/todo";
import { TODO_FILTERS, buildFilterHref } from "@/lib/todo-filter";

/**
 * 상태 필터 탭 (전체 / 진행 중 / 완료).
 * - 각 탭은 ?filter=... URL로 이동하는 링크다 (필터 상태를 URL로 관리).
 * - 현재 선택된 필터는 브랜드 컬러로 강조한다.
 */
interface TodoFilterTabsProps {
  current: TodoFilter;
}

export default function TodoFilterTabs({ current }: TodoFilterTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
      {TODO_FILTERS.map(({ value, label }) => {
        const isActive = current === value;
        return (
          <Link
            key={value}
            href={buildFilterHref(value)}
            // 같은 페이지 내 쿼리 변경이므로 스크롤 위치를 유지한다.
            scroll={false}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-brand shadow-sm"
                : "text-gray-500 hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
