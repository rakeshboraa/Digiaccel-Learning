"use client";
import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import type { Task, TodoPayload } from "@/types/todo";
import { getDateTime, parseDate } from "@/lib/date-utils";
import { CalendarIcon, ClockIcon, CloseIcon } from ".";

interface TaskModalProps {
  onClose: () => void;
  onSave: (payload: TodoPayload) => Promise<void>;
  task?: Task | null;
  defaultDate: string;
}

function openPicker(event: MouseEvent<HTMLInputElement>) {
  try {
    event.currentTarget.showPicker();
  } catch {}
}

export default function TaskModal({ onClose, onSave, task, defaultDate }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [startTime, setStartTime] = useState(task?.startTime || "");
  const [endTime, setEndTime] = useState(task?.endTime || "");
  const [date, setDate] = useState(task?.date || defaultDate);
  const [description, setDescription] = useState(task?.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (value: string) =>
    value
      ? parseDate(value).toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long",
        })
      : "Select date";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !date || !startTime || !endTime) {
      setError("Please enter title, date, start time and end time.");
      return;
    }

    const startDateTime = getDateTime(date, startTime);
    const endDateTime = getDateTime(date, endTime);

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave({
        title: title.trim(),
        description: description.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/25" onClick={onClose}>
      <div
        className="relative flex h-auto w-full max-w-125 flex-col bg-white px-6.5 pt-6 pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5.5 flex shrink-0 items-center justify-between">
          <h2 className="text-[18px] font-semibold leading-5.5 text-[#101426]">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="grid size-6 place-items-center text-[#101426]">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4.5">
            <label className="mb-2 block text-[12px] text-[#777777]">Task title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title"
              required
              maxLength={100}
              className="h-10 w-full border border-[#E5E5E5] bg-white px-2.25 text-[14px] text-[#101426] outline-none focus:border-[#4566F5]"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2 block text-[12px] text-[#777777]">Set Time</label>
            <div className="grid grid-cols-2 gap-7.5">
              <div className="relative flex h-10.25 items-center border border-[#E5E5E5] px-2.75">
                <ClockIcon />
                <span className="pointer-events-none ml-3.25 text-[14px] text-[#101426]">{startTime || "Start"}</span>
                <input
                  type="time"
                  aria-label="Start time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  onClick={openPicker}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <div className="relative flex h-10.25 items-center border border-[#E5E5E5] px-2.75">
                <ClockIcon />
                <span className="pointer-events-none ml-3.25 text-[14px] text-[#101426]">{endTime || "Ends"}</span>
                <input
                  type="time"
                  aria-label="End time"
                  required
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  onClick={openPicker}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2 block text-[12px] text-[#777777]">Set Date</label>
            <div className="relative flex h-10 items-center justify-between border border-[#E5E5E5] px-2.25">
              <span className="pointer-events-none text-[14px] text-[#101426]">{formatDate(date)}</span>
              <CalendarIcon />
              <input
                type="date"
                aria-label="Task date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                onClick={openPicker}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2 block text-[12px] text-[#777777]">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add Description"
              maxLength={500}
              className="h-22.5 w-full resize-none overflow-hidden border border-[#E5E5E5] bg-white px-2.25 py-2.5 text-[14px] text-[#101426] outline-none placeholder:text-[#101426] focus:border-[#4566F5]"
            />
          </div>

          {error && <p className="mb-3 text-[12px] text-red-500">{error}</p>}

          <button type="submit" disabled={saving} className="flex min-h-12.25 w-full shrink-0 items-center justify-center bg-[#4566ED] text-[15px] font-medium text-white transition-colors hover:bg-[#3455D5] disabled:opacity-60">
            {saving ? "Saving..." : task ? "Save Changes" : "Create task"}
          </button>
        </form>
      </div>
    </div>
  );
}
