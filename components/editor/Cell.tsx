"use client";

type CellProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function Cell({ value, onChange }: CellProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-28 border border-slate-200 px-2 text-sm outline-none focus:bg-blue-50"
    />
  );
}
