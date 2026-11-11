export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TodoStatus = "IN_PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  startTime: string;
  endTime: string;
  date: string;
  description: string;
  priority: Priority;
}

export interface TodoPayload {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface WeeklySummary {
  weekStart: string;
  openTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export interface ApiTodo {
  _id?: string;
  id?: string;

  title: string;
  description?: string;

  startTime?: string;
  endTime?: string;

  dateTime?: string;
  date?: string;
  dueDate?: string;
  createdAt?: string;

  priority?: Priority;
  status?: TodoStatus;
  completed?: boolean;
  updatedAt?: string;
}