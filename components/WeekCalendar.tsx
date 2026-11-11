import { addDays, getLocalDateKey } from "@/lib/date-utils";

interface WeekCalendarProps {
  calendarStart: Date;
  selectedDate: string;
  onSelect: (date: string) => void;
}

export default function WeekCalendar({
  calendarStart, selectedDate, onSelect,
}: WeekCalendarProps) {
  const days = Array.from({ length: 8 }, (_, index) => {
    const date = addDays(calendarStart, index);
    return {
      date: getLocalDateKey(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: String(date.getDate()).padStart(2, "0"),
    };
  });

  return (
    <div className="grid h-15.75 shrink-0 grid-cols-8">
      {days.map((item) => {
        const active = item.date === selectedDate;
        return (
          <button
            type="button"
            key={item.date}
            onClick={() => onSelect(item.date)}
            aria-label={`Show tasks for ${item.day} ${item.number}`}
            aria-pressed={active}
            className={`flex h-15.75 flex-col items-center justify-center text-[10px] leading-4 ${
              active ? "bg-[#4566F5] text-white" : "text-[#C2C2C7]"
            }`}
          >
            <span>{item.day}</span>
            <span className="mt-px text-[14px] leading-5">{item.number}</span>
            {active && <span className="mt-0.75 size-1 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
}
