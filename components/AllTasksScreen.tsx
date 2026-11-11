"use client";
import { useMemo, useState } from "react";
import { addDays, getMondayKey, parseDate } from "@/lib/date-utils";
import type { Task } from "@/types/todo";
import TaskList from "./TaskList";

interface AllTasksScreenProps {
  tasks: Task[];
  loading: boolean;
  error: string;
  onBack: () => void;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function AllTasksScreen({
  tasks,
  loading,
  error,
  onBack,
  onToggle,
  onDelete,
  onEdit,
}: AllTasksScreenProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    () => new Set([getMondayKey(new Date())]),
  );

  const groupedWeeks = useMemo(() => {
    const groups = new Map<string, Task[]>();

    tasks.forEach((task) => {
      const weekKey = getMondayKey(parseDate(task.date));

      if (!groups.has(weekKey)) {
        groups.set(weekKey, []);
      }

      groups.get(weekKey)!.push(task);
    });

    return Array.from(groups.entries())
      .map(([weekStart, weekTasks]) => ({
        weekStart,
        weekTasks: [...weekTasks].sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            a.startTime.localeCompare(b.startTime),
        ),
      }))
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [tasks]);

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((previous) => {
      const next = new Set(previous);

      if (next.has(weekKey)) {
        next.delete(weekKey);
      } else {
        next.add(weekKey);
      }

      return next;
    });
  };

  const getWeekLabel = (weekStart: string) => {
    const monday = parseDate(weekStart);
    const sunday = addDays(monday, 6);

    const startLabel = monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const endLabel = sunday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startLabel} – ${endLabel}`;
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <section className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#F7F8FD] px-5 pt-8 pb-5 font-sans text-[#101426] sm:px-6">
      <header className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#E9ECF7] bg-white text-xl text-[#4566EC] shadow-sm transition hover:bg-[#EEF1FF] active:scale-95"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[#101426]">
            All Tasks
          </h1>
          <p className="mt-0.5 text-xs text-[#85899A]">
            Manage and track your weekly progress
          </p>
        </div>
      </header>

      {/* Overview */}
      <div className="mt-6 grid shrink-0 grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#E9ECF7] bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium text-[#85899A]">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-[#101426]">
            {tasks.length}
          </p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#EEF0F7]">
            <div className="h-full w-full rounded-full bg-[#4566EC]" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E9ECF7] bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium text-[#85899A]">
            Completed
          </p>
          <p className="mt-1 text-2xl font-bold text-[#4566EC]">
            {completedTasks}
          </p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#EEF0F7]">
            <div
              className="h-full rounded-full bg-[#4566EC]"
              style={{
                width: `${
                  tasks.length
                    ? (completedTasks / tasks.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E9ECF7] bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium text-[#85899A]">
            Pending
          </p>
          <p className="mt-1 text-2xl font-bold text-[#F0A33A]">
            {pendingTasks}
          </p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#EEF0F7]">
            <div
              className="h-full rounded-full bg-[#F0A33A]"
              style={{
                width: `${
                  tasks.length
                    ? (pendingTasks / tasks.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-7 mb-3 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#101426]">
            Weekly Overview
          </h2>
          <p className="mt-0.5 text-xs text-[#9296A7]">
            Your tasks organized by week
          </p>
        </div>

        <span className="rounded-full bg-[#EAEFFF] px-3 py-1 text-xs font-semibold text-[#4566EC]">
          {groupedWeeks.length}{" "}
          {groupedWeeks.length === 1 ? "Week" : "Weeks"}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-5 scrollbar-none [&::-webkit-scrollbar]:hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-[3px] border-[#E1E7FF] border-t-[#4566EC]" />
            <p className="mt-3 text-sm text-[#85899A]">
              Loading tasks...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white px-4 py-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : groupedWeeks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8DEF5] bg-white px-5 py-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#EEF1FF] text-2xl text-[#4566EC]">
              ✓
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#101426]">
              No tasks yet
            </h3>
            <p className="mt-1 text-xs text-[#9296A7]">
              Add your first task to get started!
            </p>
          </div>
        ) : (
          groupedWeeks.map(({ weekStart, weekTasks }) => {
            const isExpanded = expandedWeeks.has(weekStart);

            const completed = weekTasks.filter(
              (task) => task.completed,
            ).length;

            const open = weekTasks.length - completed;

            const progress = weekTasks.length
              ? (completed / weekTasks.length) * 100
              : 0;

            return (
              <article
                key={weekStart}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                  isExpanded
                    ? "border-[#C9D4FF] shadow-[0_4px_18px_rgba(69,102,236,0.07)]"
                    : "border-[#E9ECF4] shadow-sm hover:border-[#D6DEFF]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleWeek(weekStart)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-[#FAFBFF]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">

                    {/* Week icon */}
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl text-lg transition ${
                        isExpanded
                          ? "bg-[#4566EC] text-white"
                          : "bg-[#EEF1FF] text-[#4566EC]"
                      }`}
                    >
                      <span aria-hidden="true">▦</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-[#101426]">
                        {getWeekLabel(weekStart)}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                        <span className="font-medium text-[#85899A]">
                          {open} Pending
                        </span>

                        <span className="font-medium text-[#4566EC]">
                          {completed} Done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-lg bg-[#F3F4F9] px-2.5 py-1.5 text-[10px] font-semibold text-[#85899A]">
                      {weekTasks.length}{" "}
                      {weekTasks.length === 1 ? "Task" : "Tasks"}
                    </span>

                    <div
                      className={`grid size-7 place-items-center rounded-full transition-all ${
                        isExpanded
                          ? "rotate-180 bg-[#EEF1FF] text-[#4566EC]"
                          : "bg-[#F4F5F9] text-[#85899A]"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Progress bar */}
                <div className="px-4 pb-3">
                  <div className="h-1 overflow-hidden rounded-full bg-[#EEF0F7]">
                    <div
                      className="h-full rounded-full bg-[#4566EC] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#EEF0F7] bg-[#FAFBFF] px-3 py-3 sm:px-4">
                    <TaskList
                      tasks={weekTasks}
                      loading={false}
                      error=""
                      emptyMessage="No tasks in this week."
                      showDate
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
