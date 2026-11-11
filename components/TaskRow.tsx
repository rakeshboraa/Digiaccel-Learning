import type { Task } from "@/types/todo";
import { CheckIcon, EditIcon, TrashIcon } from ".";

interface TaskRowProps {
  task: Task;
  showDate?: boolean;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskRow({ task, onToggle, onDelete, onEdit }: TaskRowProps) {
  return (
    <div className="flex h-16  items-center">
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
        aria-pressed={task.completed}
        className="grid size-5 shrink-0 place-items-center border-[1.5px] border-[#4566F5] text-[#4566F5]"
      >
        {task.completed && <CheckIcon />}
      </button>

      <div className="ml-3 flex h-full min-w-0 flex-1 items-center justify-between border-b border-[#E7E7E7]">
        <div className="min-w-0">
          <span className={`block truncate text-[14px] font-medium ${task.completed ? "line-through text-[#151515]" : "text-[#101426]"}`}>
            {task.title}
          </span>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-3 text-[#BDBDBD]">
          <button type="button" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} className="transition-colors hover:text-red-500">
            <TrashIcon />
          </button>
          <button type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} className="transition-colors hover:text-[#4566ED]">
            <EditIcon />
          </button>
        </div>
      </div>
    </div>
  );
}