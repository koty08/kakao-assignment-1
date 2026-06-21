"use client";

import { useRef, useState } from "react";
import type { TodoState } from "@/types/todo";
import { TODO_STATE_LABEL } from "@/types/todo";
import { useClickOutside } from "@/hooks/useClickOutside";

/**
 * Todo 상태 선택 커스텀 드롭다운.
 * - 기본 <select> 대신, 주차 선택 드롭다운과 동일한 스타일의 패널을 사용한다.
 * - 트리거는 폼 입력 필드와 같은 모양, 패널 항목은 선택 시 브랜드 컬러로 강조.
 * - 바깥 클릭 시 닫힘은 공용 useClickOutside 훅에 위임한다.
 */
interface StateSelectProps {
  value: TodoState;
  onChange: (state: TodoState) => void;
}

// 드롭다운에 노출할 상태 목록 (라벨 매핑의 키 순서)
const STATE_OPTIONS = Object.keys(TODO_STATE_LABEL) as TodoState[];

export default function StateSelect({ value, onChange }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기 (열려 있을 때만 활성화)
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  // 항목 선택: 값 변경 후 닫기
  const handleSelect = (state: TodoState) => {
    onChange(state);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 트리거: 다른 폼 입력과 동일한 모양 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-brand"
      >
        {TODO_STATE_LABEL[value]}
        <span className="text-xs text-gray-400">▾</span>
      </button>

      {/* 패널: 주차 드롭다운과 동일한 스타일 */}
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-100">
          <ul className="flex flex-col gap-1">
            {STATE_OPTIONS.map((state) => {
              const isSelected = state === value;
              return (
                <li key={state}>
                  <button
                    type="button"
                    onClick={() => handleSelect(state)}
                    className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-brand/10 font-semibold text-brand"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {TODO_STATE_LABEL[state]}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
