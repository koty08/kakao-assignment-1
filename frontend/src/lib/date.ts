/**
 * 날짜 관련 순수 유틸 함수 모음 (주간 뷰 계산).
 * - 외부 의존성 없이 Date 객체만 다룬다.
 * - 타임존 문제를 피하기 위해 ISO 변환은 로컬 시간 기준으로 직접 포맷한다.
 */

// 월요일 시작 기준 요일 라벨 (월 ~ 일)
export const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

/** Date를 'YYYY-MM-DD' 문자열로 변환한다 (로컬 시간 기준). */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 시/분/초를 0으로 초기화한 새 Date를 반환한다. */
function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** 주어진 날짜가 속한 주의 월요일을 반환한다. */
export function getMonday(date: Date): Date {
  const result = startOfDay(date);
  const day = result.getDay(); // 0(일) ~ 6(토)
  // 일요일(0)이면 6일 전, 그 외에는 (요일-1)일 전이 월요일
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  return result;
}

/** 날짜에 n일을 더한 새 Date를 반환한다. */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** 날짜에 n주를 더한 새 Date를 반환한다. */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/** 월요일을 받아 그 주의 7일(월~일) 배열을 반환한다. */
export function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

/** 두 날짜가 같은 '일'인지 비교한다. */
export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

/**
 * 한 달에 속한 '주(week)'들의 시작 월요일 목록을 반환한다.
 * - 월요일이 해당 월에 포함되는 주만 대상으로 한다.
 */
export function getMondaysOfMonth(year: number, monthIndex: number): Date[] {
  const mondays: Date[] = [];
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day += 1) {
    const date = new Date(year, monthIndex, day);
    if (date.getDay() === 1) {
      mondays.push(startOfDay(date));
    }
  }
  return mondays;
}

/** 월요일이 해당 월에서 몇 번째 주인지(1부터) 반환한다. */
export function getWeekOfMonth(monday: Date): number {
  const mondays = getMondaysOfMonth(monday.getFullYear(), monday.getMonth());
  const index = mondays.findIndex((m) => isSameDay(m, monday));
  return index + 1; // 못 찾으면 0 → 1 (이론상 monday는 항상 자기 월에 존재)
}

/** "2026년 6월 3주차" 형식의 주차 라벨을 만든다. */
export function formatWeekLabel(monday: Date): string {
  const year = monday.getFullYear();
  const month = monday.getMonth() + 1;
  const weekOfMonth = getWeekOfMonth(monday);
  return `${year}년 ${month}월 ${weekOfMonth}주차`;
}

/** "6/1 ~ 6/7" 형식의 주간 날짜 범위 라벨을 만든다. */
export function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  return `${monday.getMonth() + 1}/${monday.getDate()} ~ ${sunday.getMonth() + 1}/${sunday.getDate()}`;
}
