const startHour = 9;
const endHour = 20;
const intervalMinutes = 30;

export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const hourLabel = String(hour).padStart(2, "0");
      const minuteLabel = String(minute).padStart(2, "0");
      slots.push(`${hourLabel}:${minuteLabel}`);
    }
  }
  return slots;
}

export function buildSlotKey(day: string, time: string): string {
  return `${day}|${time}`;
}

export function formatSlotKey(slotKey: string): string {
  const [day, time] = slotKey.split("|");
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(`${day}T00:00:00`);
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
