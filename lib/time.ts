/**
 * Time and date helpers for room display and Graph time windows.
 */

/**
 * Minutes since midnight (0–1439) for the given date.
 */
export function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Minutes since midnight in a given IANA timezone (e.g. "America/New_York").
 * Used to filter schedule to only future/current meetings when room uses that zone.
 */
export function minutesSinceMidnightInZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * Start and end of the calendar day in local time (00:00:00 and 23:59:59.999).
 * Useful for requesting "today" from Graph calendar view.
 */
export function getDayBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Format a date as 12-hour time string (e.g. "10:00 AM", "2:30 PM").
 */
export function formatTime12h(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
