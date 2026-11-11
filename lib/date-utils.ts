import { ApiTodo, Task } from "@/types/todo";

export function getLocalDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseDate(value?: string): Date {
  if (!value || typeof value !== "string") {
    return new Date();
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  const date = new Date(year, month - 1, day, 12);

  return isNaN(date.getTime()) ? new Date() : date;
}

export function formatTaskDate(value?: string): string {
  if (!value) return "No date";

  return parseDate(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function getSunday(date: Date): Date {
  const sunday = new Date(date);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  sunday.setHours(12, 0, 0, 0);
  return sunday;
}

export function getMondayKey(date: Date): string {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(monday.getDate() - ((day + 6) % 7));

  return getLocalDateKey(monday);
}

export function getDateKeyInTimezone(value: string, timezone: string): string {
  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsed);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function getDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

function getLocalTime(value: string): string {
  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) return "";

  return [
    String(parsed.getHours()).padStart(2, "0"),
    String(parsed.getMinutes()).padStart(2, "0"),
  ].join(":");
}

export function normalizeTask(todo: ApiTodo): Task {
  // Support old records containing dateTime.
  const startDateValue =
    todo.startTime ||
    todo.dateTime ||
    todo.date ||
    todo.dueDate ||
    todo.createdAt;

  const startDate = startDateValue ? new Date(startDateValue) : new Date();

  const validStartDate = isNaN(startDate.getTime()) ? new Date() : startDate;

  const endTime = todo.endTime ? getLocalTime(todo.endTime) : "";

  return {
    id: todo._id || todo.id || "",
    title: todo.title || "Untitled task",
    completed: todo.status === "COMPLETED" || todo.completed === true,
    startTime: todo.startTime
      ? getLocalTime(todo.startTime)
      : todo.dateTime
        ? getLocalTime(todo.dateTime)
        : "",
    endTime,
    date: getLocalDateKey(validStartDate),
    description: todo.description || "",
    priority: todo.priority || "MEDIUM",
  };
}
