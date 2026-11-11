import { SearchIcon } from ".";

interface SearchBarProps {
  onClick: () => void;
}

export default function SearchBar({ onClick }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search for a task"
      className="mb-8 flex h-11 w-full shrink-0 items-center justify-between border border-[#E2E2E6] bg-white px-4.75 text-left"
    >
      <span className="text-[12px] font-normal text-[#858585]">Search for a task</span>
      <SearchIcon />
    </button>
  );
}
