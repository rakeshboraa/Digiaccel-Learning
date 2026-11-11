interface WeeklyProgressProps {
  percentage: number;
}

export default function WeeklyProgress({ percentage }: WeeklyProgressProps) {
  return (
    <div className="mt-8 shrink-0">
      <h2 className="text-[17px] font-semibold text-black">Weekly Progress</h2>
      <div className="mt-3.75 h-6 w-full bg-[#DCDFFF]">
        <div
          className="h-full bg-[#293F9B] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
