
"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types/todo";
import { BackIcon, SearchIcon } from ".";
import TaskList from "./TaskList";
import { searchTodos } from "@/services/todo-api";

interface SearchScreenProps {
  onBack: () => void;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function SearchScreen({ onBack, onToggle, onDelete, onEdit }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    setTasks((previous) => previous.map((item) => item.id === task.id ? updatedTask : item));

    try {
      await onToggle(task);
    } catch {
      setTasks((previous) => previous.map((item) => item.id === task.id ? task : item));
    }
  };

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchTodos(query, controller.signal);
        if (!controller.signal.aborted) setTasks(results);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Unable to search tasks. Please try again.");
          setTasks([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  const hasQuery = Boolean(searchQuery.trim());

  return (
    <div className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-white px-6 pt-8">
      <button type="button" onClick={onBack} aria-label="Go back" className="flex h-6 w-fit shrink-0 items-center text-[#101426]">
        <BackIcon />
      </button>

      <div className="mt-7.25 flex h-12 shrink-0 items-center justify-between border border-[#E2E2E6] bg-white px-4.75">
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search for a task"
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#101426] outline-none placeholder:text-[#858585]"
        />
        <SearchIcon />
      </div>

      <div className="mt-7.25 flex-1 overflow-y-auto">
        {!hasQuery ? (
          <p className="py-5 text-center text-[13px] text-[#858585]">Search for your tasks</p>
        ) : loading ? (
          <p className="py-5 text-center text-[13px] text-[#858585]">Searching...</p>
        ) : error ? (
          <p className="py-5 text-center text-[13px] text-red-500">{error}</p>
        ) : (
          <TaskList tasks={tasks} emptyMessage="No tasks found" showDate onToggle={handleToggle} onDelete={onDelete} onEdit={onEdit} />
        )}
      </div>
    </div>
  );
}
