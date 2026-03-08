"use client";

type FormulaBarProps = {
  selectedCell: string | null;
  rawValue: string;
};

export default function FormulaBar({
  selectedCell,
  rawValue,
}: FormulaBarProps) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border bg-white p-3">
      <div className="min-w-20 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
        {selectedCell ?? "-"}
      </div>

      <div className="flex-1 rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {rawValue || "Select a cell to view its raw value or formula"}
      </div>
    </div>
  );
}
