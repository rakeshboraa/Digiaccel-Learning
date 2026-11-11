import { CheckIcon, CloseIcon } from ".";

interface WeeklyStatsProps {
  done: number;
  pending: number;
}

export default function WeeklyStats({ done, pending }: WeeklyStatsProps) {
  return (
    <div className="mt-8 grid h-24 shrink-0 grid-cols-2 gap-4">
      <div className="bg-[#EFF2FF] px-3.75 py-4">
        <div className="flex items-center gap-2.75">
          <div className="grid size-7 place-items-center bg-[#7891f8] text-[#1C3082]">
            <div className="grid size-4.75 place-items-center rounded-[3px] border-[1.5px] border-[#1C3082]">
              <CheckIcon />
            </div>
          </div>
          <span className="whitespace-nowrap text-[12px]">Task Complete</span>
        </div>
        <div className="mt-1.25 flex items-baseline pl-9.75">
          <span className="text-[24px] font-semibold leading-none">{String(done).padStart(2, "0")}</span>
          <span className="ml-1.25 whitespace-nowrap text-[10px] text-[#777B88]">This Week</span>
        </div>
      </div>

      <div className="bg-[#FFE8E9] px-3.75 py-4">
        <div className="flex items-center gap-2.75">
          <div className="grid size-7 place-items-center bg-[#FFBFC2] text-[#C52E39]">
            <div className="grid size-4.75 place-items-center rounded-[3px] border-[1.5px] border-[#C52E39]">
              <CloseIcon />
            </div>
          </div>
          <span className="whitespace-nowrap text-[12px]">Task Pending</span>
        </div>
        <div className="mt-1.25 flex items-baseline pl-9.75">
          <span className="text-[24px] font-semibold leading-none">{String(pending).padStart(2, "0")}</span>
          <span className="ml-1.25 whitespace-nowrap text-[10px] text-[#777B88]">This Week</span>
        </div>
      </div>
    </div>
  );
}
