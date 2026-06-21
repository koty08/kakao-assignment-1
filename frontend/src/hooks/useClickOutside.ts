import { useEffect, type RefObject } from "react";

/**
 * 지정한 요소(ref) 바깥을 클릭하면 handler를 호출하는 훅.
 * - 드롭다운/팝오버를 바깥 클릭으로 닫을 때 재사용한다.
 * - enabled가 false면(보통 닫힌 상태) 리스너를 등록하지 않는다.
 *
 * @param ref     기준이 되는 요소의 ref
 * @param handler 바깥 클릭 시 실행할 콜백 (예: 닫기)
 * @param enabled 활성화 여부 (열려 있을 때만 true)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      // 클릭 지점이 기준 요소 안이면 무시, 바깥이면 handler 실행
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, handler, enabled]);
}
