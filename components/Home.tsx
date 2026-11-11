
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addDays,
  getDateKeyInTimezone,
  getLocalDateKey,
  getMondayKey,
  getSunday,
  normalizeTask,
  parseDate,
} from "@/lib/date-utils";

import {
  createTodo,
  deleteTodo,
  getTodos,
  getWeeklySummary,
  updateTodo,
  updateTodoStatus,
} from "@/services/todo-api";

import type {
  Task,
  TodoPayload,
  TodoStatus,
  WeeklySummary,
} from "@/types/todo";

import SearchBar from "./SearchBar";
import WeekCalendar from "./WeekCalendar";
import WeeklyStats from "./WeeklyStats";
import WeeklyProgress from "./WeeklyProgress";
import TaskList from "./TaskList";
import { PlusIcon } from ".";
import SearchScreen from "./SearchScreen";
import AllTasksScreen from "./AllTasksScreen";
import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [todayDate, setTodayDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [calendarStart, setCalendarStart] = useState<Date | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const now = new Date();
    const today = getLocalDateKey(now);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayDate(today);
    setSelectedDate(today);
    setCalendarStart(getSunday(now));
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const [todos, summary] = await Promise.all([
          getTodos(),
          getWeeklySummary(),
        ]);

        if (!active) return;

        setTasks(todos.map(normalizeTask));
        setWeeklySummary(summary);
        setError("");
      } catch (err) {
        if (!active) return;

        console.error("Load data error:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load tasks"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      active = false;
    };
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const list = await getTodos();

      setTasks(list.map(normalizeTask));
      setError("");
    } catch (err) {
      console.error("Load tasks error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load tasks"
      );
    }
  }, []);

  const loadWeeklySummary = useCallback(async () => {
    try {
      setWeeklySummary(await getWeeklySummary());
    } catch (err) {
      console.error("Weekly summary error:", err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      loadTasks(),
      loadWeeklySummary(),
    ]);
  }, [loadTasks, loadWeeklySummary]);

  const saveTask = useCallback(
    async (payload: TodoPayload) => {
      if (editingTask) {
        await updateTodo(editingTask.id, payload);
      } else {
        await createTodo(payload);
      }

      await refreshData();
    },
    [editingTask, refreshData]
  );

  const toggleTask = useCallback(
    async (task: Task) => {
      const status: TodoStatus = task.completed
        ? "IN_PROGRESS"
        : "COMPLETED";

      try {
        await updateTodoStatus(task.id, status);
        await refreshData();
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Unable to update status"
        );
      }
    },
    [refreshData]
  );

  const removeTask = useCallback((id: string) => {
    setTaskToDelete(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!taskToDelete || isDeleting) return;

    try {
      setIsDeleting(true);

      await deleteTodo(taskToDelete);

      setTasks((prev) =>
        prev.filter((task) => task.id !== taskToDelete)
      );

      setTaskToDelete(null);

      await loadWeeklySummary();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Unable to delete task"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [taskToDelete, isDeleting, loadWeeklySummary]);

  const isDateReady = Boolean(todayDate && selectedDate && calendarStart);

  // Selected week.
  const selectedWeekKey = useMemo(() => {
    if (!selectedDate) return "";

    return getMondayKey(parseDate(selectedDate));
  }, [selectedDate]);

  const weekTasks = useMemo(
    () =>
      tasks.filter(
        (task) => getMondayKey(parseDate(task.date)) === selectedWeekKey
      ),
    [tasks, selectedWeekKey]
  );

  const selectedSummary = useMemo(
    () =>
      weeklySummary.find(
        (item) =>
          getDateKeyInTimezone(item.weekStart, "Asia/Kolkata") ===
          selectedWeekKey
      ),
    [weeklySummary, selectedWeekKey]
  );

  const statistics = useMemo(() => {
    const localDone = weekTasks.filter(
      (task) => task.completed
    ).length;

    const localPending = weekTasks.length - localDone;

    const useLocal = weekTasks.length > 0 || !selectedSummary;

    const done = useLocal
      ? localDone
      : selectedSummary.completedTasks;

    const pending = useLocal
      ? localPending
      : selectedSummary.openTasks;

    const total = done + pending;

    return {
      done,
      pending,
      percentage: total ? (done / total) * 100 : 0,
    };
  }, [weekTasks, selectedSummary]);

  const shownTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [tasks, selectedDate]
  );

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return "";

    return parseDate(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }, [selectedDate]);

  const tasksHeading = useMemo(() => {
    if (!selectedDate) return "Tasks";

    if (selectedDate === todayDate) {
      return "Tasks Today";
    }

    return `Tasks ${parseDate(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    })}`;
  }, [selectedDate, todayDate]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const changeWeek = useCallback((amount: number) => {
    setCalendarStart((current) =>
      current ? addDays(current, amount * 7) : current
    );

    setSelectedDate((current) =>
      current
        ? getLocalDateKey(addDays(parseDate(current), amount * 7))
        : current
    );
  }, []);

  return (
    <section className="absolute inset-0 flex flex-col overflow-hidden bg-[#FDFDFF] px-6.5 pt-8.75 pb-6 font-sans text-[#101426]">
      <SearchBar onClick={openSearch} />

      <div>
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          aria-label="Previous week"
          className="sr-only"
        >
          Previous week
        </button>

        {isDateReady && (
          <WeekCalendar
            calendarStart={calendarStart!}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        )}

        <button
          type="button"
          onClick={() => changeWeek(1)}
          aria-label="Next week"
          className="sr-only"
        >
          Next week
        </button>
      </div>

      <WeeklyStats
        done={statistics.done}
        pending={statistics.pending}
      />

      <WeeklyProgress percentage={statistics.percentage} />

      <div className="mt-8.25 flex shrink-0 items-center justify-between">
        <h2 className="text-[18px] font-bold">
          {tasksHeading}
        </h2>

        <button
          type="button"
          onClick={() => setIsViewAllOpen(true)}
          className="text-[15px] font-medium text-[#4566EC] transition hover:opacity-75"
        >
          View All
        </button>
      </div>

      <div className="mt-2.25 flex-1 overflow-y-auto">
        <TaskList
          tasks={shownTasks}
          loading={loading || !isDateReady}
          error={error}
          emptyMessage={
            isDateReady
              ? `No tasks scheduled for ${selectedDateLabel}. Tap + to add one.`
              : "Loading tasks..."
          }
          onToggle={toggleTask}
          onDelete={removeTask}
          onEdit={openEditModal}
        />
      </div>

      <button
        type="button"
        onClick={openCreateModal}
        aria-label="Add new task"
        disabled={!isDateReady}
        className="absolute bottom-6.5 left-1/2 z-10 grid size-19 -translate-x-1/2 place-items-center rounded-full bg-[#4566ED] text-white shadow-[0_6px_16px_rgba(68,104,236,.35)] disabled:opacity-50"
      >
        <PlusIcon />
      </button>

      {isSearchOpen && (
        <SearchScreen
          onBack={closeSearch}
          onToggle={toggleTask}
          onDelete={removeTask}
          onEdit={openEditModal}
        />
      )}

      {isViewAllOpen && (
        <AllTasksScreen
          tasks={tasks}
          loading={loading}
          error={error}
          onBack={() => setIsViewAllOpen(false)}
          onToggle={toggleTask}
          onDelete={removeTask}
          onEdit={openEditModal}
        />
      )}

      {isModalOpen && isDateReady && (
        <TaskModal
          task={editingTask}
          defaultDate={selectedDate}
          onClose={closeModal}
          onSave={saveTask}
        />
      )}

      {taskToDelete && (
        <DeleteTaskModal
          onClose={() => setTaskToDelete(null)}
          onConfirm={confirmDelete}
          loading={isDeleting}
        />
      )}
    </section>
  );
}
