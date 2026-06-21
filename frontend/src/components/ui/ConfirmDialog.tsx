"use client";

import { useEffect } from "react";

/**
 * 재사용 가능한 확인(Confirm) 모달.
 * - 위험/되돌릴 수 없는 동작 전에 사용자에게 한 번 더 확인받는다.
 * - 배경(overlay) 클릭 또는 ESC 키로 취소된다.
 * - 도메인 로직을 모르는 순수 UI 컴포넌트로, 동작은 콜백으로 위임받는다.
 */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // 모달이 열려 있을 때 ESC 키로 닫는다.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  // 닫힌 상태면 아무것도 렌더링하지 않는다.
  if (!open) return null;

  return (
    // 반투명 배경 오버레이. 클릭 시 취소 처리.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
      role="presentation"
    >
      {/* 모달 패널. 내부 클릭이 배경까지 전파되지 않도록 막는다. */}
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
