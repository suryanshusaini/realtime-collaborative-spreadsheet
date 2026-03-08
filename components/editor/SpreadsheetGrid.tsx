"use client";

import { useEffect, useMemo, useState } from "react";
import Cell from "@/components/editor/Cell";
import { cellId, colToLetter } from "@/lib/formula";
import { useCells } from "@/hooks/useCells";

const ROWS = 20;
const COLS = 10;

type SpreadsheetGridProps = {
  docId: string;
  onSavingChange?: (saving: boolean) => void;
  onSelectionChange?: (cellId: string | null, rawValue: string) => void;
};

export default function SpreadsheetGrid({
  docId,
  onSavingChange,
  onSelectionChange,
}: SpreadsheetGridProps) {
  const { cells, saveCell, saving } = useCells(docId);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const columns = useMemo(() => Array.from({ length: COLS }, (_, i) => i), []);
  const rows = useMemo(() => Array.from({ length: ROWS }, (_, i) => i), []);

  useEffect(() => {
    onSavingChange?.(saving);
  }, [saving, onSavingChange]);

  function handleSelect(id: string) {
    setSelectedCell(id);
    onSelectionChange?.(id, cells[id]?.value ?? "");
  }

  return (
    <div className="overflow-auto rounded-lg border bg-white">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 h-10 min-w-14 border border-slate-200 bg-slate-100" />
            {columns.map((col) => (
              <th
                key={col}
                className="sticky top-0 z-10 h-10 min-w-28 border border-slate-200 bg-slate-100 text-sm font-medium text-slate-700"
              >
                {colToLetter(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th className="sticky left-0 z-10 h-10 min-w-14 border border-slate-200 bg-slate-100 text-sm font-medium text-slate-700">
                {row + 1}
              </th>

              {columns.map((col) => {
                const id = cellId(col, row);
                const cell = cells[id];
                const isSelected = selectedCell === id;

                return (
                  <td
                    key={id}
                    className={`border p-0 ${isSelected ? "border-blue-400" : "border-slate-200"}`}
                  >
                    <Cell
                      value={cell?.value ?? ""}
                      displayValue={cell?.computed ?? cell?.value ?? ""}
                      onSave={async (value) => {
                        await saveCell(id, value);
                        onSelectionChange?.(id, value);
                      }}
                      onSelect={() => handleSelect(id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
