const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Normalize any stored event date to YYYY-MM-DD in local time. */
export function normalizeEventDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';

  const trimmed = dateStr.trim();
  const dateOnly = trimmed.split('T')[0];

  // Pure date strings are already calendar dates — keep as-is.
  if (ISO_DATE_PATTERN.test(dateOnly) && !trimmed.includes('T') && !trimmed.includes(' ')) {
    return dateOnly;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (ISO_DATE_PATTERN.test(dateOnly)) {
    return dateOnly;
  }

  return dateOnly;
}

/** Today's date as YYYY-MM-DD in the user's local timezone. */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function compareEventDates(a: string, b: string): number {
  return normalizeEventDate(a).localeCompare(normalizeEventDate(b));
}

/** Date used to decide if an event is still active (end date takes priority). */
export function getEventStatusDate(eventDate: string, endDate?: string): string {
  return normalizeEventDate(endDate || eventDate);
}

/** Upcoming includes events whose active period ends today or later. */
export function isEventUpcoming(eventDate: string, endDate?: string): boolean {
  return getEventStatusDate(eventDate, endDate) >= getTodayDateString();
}

/** Past events are those whose active period ended before today. */
export function isEventPast(eventDate: string, endDate?: string): boolean {
  return getEventStatusDate(eventDate, endDate) < getTodayDateString();
}

export function formatEventDate(dateStr: string): string {
  const normalized = normalizeEventDate(dateStr);
  if (!normalized) return dateStr;

  const [year, month, day] = normalized.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getEventMonthShort(dateStr: string): string {
  const normalized = normalizeEventDate(dateStr);
  if (!normalized) return '';

  const [year, month, day] = normalized.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short' });
}

export function getEventDay(dateStr: string): number {
  const normalized = normalizeEventDate(dateStr);
  if (!normalized) return 0;

  const [year, month, day] = normalized.split('-').map(Number);
  return day;
}
