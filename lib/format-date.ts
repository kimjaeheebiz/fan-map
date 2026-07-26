/** 일자 · 일시 표기 통일 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toValidDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

/** yyyy-mm-dd */
export function formatDate(value: string | Date) {
  if (typeof value === "string" && DATE_ONLY.test(value)) return value;
  const date = toValidDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** yyyy-mm-dd hh:mm:ss */
export function formatDateTime(value: string | Date) {
  if (typeof value === "string" && DATE_ONLY.test(value)) {
    return `${value} 00:00:00`;
  }
  const date = toValidDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return `${formatDate(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}
