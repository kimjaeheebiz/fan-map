/** 일자 · 일시 표기 통일 */

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

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

/** yyyy-mm-dd hh:mm */
export function formatDateTimeMinute(value: string | Date) {
  if (typeof value === "string" && DATE_ONLY.test(value)) {
    return `${value} 00:00`;
  }
  const date = toValidDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return `${formatDate(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
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

/** datetime-local input value (yyyy-mm-ddThh:mm) */
export function toDateTimeLocalValue(value: string | Date) {
  if (typeof value === "string" && DATE_TIME_LOCAL.test(value)) return value;
  const date =
    typeof value === "string" && DATE_ONLY.test(value)
      ? new Date(`${value}T12:00:00`)
      : toValidDate(value);
  if (!date) return "";
  return `${formatDate(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** datetime-local → ISO (로컬 시각 기준) */
export function dateTimeLocalToIso(value: string) {
  if (DATE_ONLY.test(value)) {
    return new Date(`${value}T12:00:00`).toISOString();
  }
  const date = toValidDate(value);
  if (!date) return value;
  return date.toISOString();
}
