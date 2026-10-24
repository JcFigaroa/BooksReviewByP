// The API stores DateTime.UtcNow but SQL Server hands it back without a "Z", so treat zone-less dates as UTC.
export function parseApiDate(value) {
  if (!value) return null;
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
  const date = new Date(hasZone ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = parseApiDate(value);
  return date ? date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const steps = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

// "3 days ago", "yesterday", "just now"
export function timeAgo(value) {
  const date = parseApiDate(value);
  if (!date) return "";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
