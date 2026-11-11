import { normalizeTask } from "@/lib/date-utils";
import { ApiTodo, Task, TodoPayload, TodoStatus } from "@/types/todo";

const API_URL = "https://digiaccel-learning-todo-backend.onrender.com";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

export function extractList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["data", "todos", "items", "results", "summary"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }

  return [];
}

export async function getTodos(signal?: AbortSignal) {
  const payload = await apiRequest<unknown>("/todos", { signal });
  return extractList<ApiTodo>(payload);
}

export async function getWeeklySummary() {
  const payload = await apiRequest<unknown>(
    "/todos/weekly-summary?timezone=Asia/Kolkata",
  );
  return extractList<{
    weekStart: string;
    openTasks: number;
    completedTasks: number;
    totalTasks: number;
  }>(payload);
}

export async function createTodo(payload: TodoPayload) {
  return apiRequest<ApiTodo>("/todos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTodo(id: string, payload: TodoPayload) {
  return apiRequest<ApiTodo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateTodoStatus(id: string, status: TodoStatus) {
  return apiRequest<ApiTodo>(`/todos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteTodo(id: string) {
  return apiRequest(`/todos/${id}`, { method: "DELETE" });
}
export async function searchTodos(
  query: string,
  signal?: AbortSignal
): Promise<Task[]> {
  const payload = await apiRequest<unknown>(
    `/todos?search=${encodeURIComponent(query)}`,
    { signal }
  );

  const todos = extractList<ApiTodo>(payload);

  return todos.map(normalizeTask);
}