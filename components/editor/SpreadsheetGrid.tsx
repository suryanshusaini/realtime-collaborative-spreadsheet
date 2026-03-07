"use client";

import { useMemo, useState } from "react";
import Cell from "@/components/editor/Cell";
import { cellId, colToLetter } from "@/lib/formula";

const ROWS = 20;
const COLS = 10;

export default function SpreadsheetGrid() {
  const [cells, setCells] = useState<Record<string, string>>({});

  const columns = useMemo(() => Array.from({ length: COLS }, (_, i) => i), []);
  const rows = useMemo(() => Array.from({ length: ROWS }, (_, i) => i), []);

  function handleCellChange(id: string, value: string) {
    setCells((prev) => ({
      ...prev,
      [id]: value,
    }));
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

                return (
                  <td key={id} className="border border-slate-200 p-0">
                    <Cell
                      value={cells[id] ?? ""}
                      onChange={(value) => handleCellChange(id, value)}
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
