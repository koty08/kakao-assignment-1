import { useState, useEffect } from "react";
import { loadJson, saveJson, toDateKey } from "@/shared/lib";

const STORAGE_KEY = "selectedDate";

export function useSelectedDate() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = loadJson(STORAGE_KEY);
    return saved ? new Date(saved) : new Date();
  });

  useEffect(() => {
    saveJson(STORAGE_KEY, toDateKey(selectedDate));
  }, [selectedDate]);

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
