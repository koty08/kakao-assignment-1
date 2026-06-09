import { useState } from "react";

export function useSelectedDate() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const goToPrev = () =>
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });

  const goToNext = () =>
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });

  const goToToday = () => setSelectedDate(new Date());

  return { selectedDate, goToPrev, goToNext, goToToday };
}
