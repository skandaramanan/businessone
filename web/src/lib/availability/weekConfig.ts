export const weekStartDate = "2026-03-09";
export const weekDaysCount = 7;

export function getWeekDates(): string[] {
  const start = new Date(`${weekStartDate}T00:00:00`);
  return Array.from({ length: weekDaysCount }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current.toISOString().slice(0, 10);
  });
}

export function formatWeekDate(dateValue: string): string {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
