
import type { Task } from "@/types/todo";
import TaskRow from "./TaskRow";

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string;
  emptyMessage: string;
  showDate?: boolean;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({
  tasks,
  loading = false,
  error = "",
  emptyMessage,
  showDate = false,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps) {
  if (loading) {
    return (
      <p className="py-5 text-center text-[12px] text-[#858585]">
        Loading tasks...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-5 text-center text-[12px] text-red-500">
        {error}
      </p>
    );
  }

  if (!tasks.length) {
    return (
      <p className="py-5 text-center text-[12px] text-[#858585]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex h-62 min-h-0 shrink-0 flex-col overflow-y-auto">
      {tasks.map((task) => (
        <div key={task.id} className="shrink-0">
          <TaskRow
            task={task}
            showDate={showDate}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
