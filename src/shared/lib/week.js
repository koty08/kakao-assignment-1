export function getWeekDays(date) {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function getWeekLabel(date) {
  const days = getWeekDays(date)
  const monday = days[0]
  const year = monday.getFullYear()
  const month = monday.getMonth()
  return `${year}년 ${month + 1}월 ${weekNumInMonth(monday)}주차`
}

function weekNumInMonth(monday) {
  const year = monday.getFullYear()
  const month = monday.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const firstMondayDate = 1 + ((1 - firstOfMonth.getDay() + 7) % 7)
  const firstMonday = new Date(year, month, firstMondayDate)
  firstMonday.setHours(0, 0, 0, 0)
  return Math.round((monday - firstMonday) / (7 * 24 * 60 * 60 * 1000)) + 1
}

// 해당 월의 모든 주(월요일 기준)를 반환
export function getMonthWeeks(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const firstMondayDate = 1 + ((1 - firstOfMonth.getDay() + 7) % 7)
  const lastOfMonth = new Date(year, month + 1, 0)

  const weeks = []
  const current = new Date(year, month, firstMondayDate)
  current.setHours(0, 0, 0, 0)
  let weekNum = 1

  while (current <= lastOfMonth) {
    weeks.push({ weekNum, label: `${month + 1}월 ${weekNum}주차`, firstDay: new Date(current) })
    current.setDate(current.getDate() + 7)
    weekNum++
  }
  return weeks
}
