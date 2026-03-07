"use client";

import { useMemo } from "react";
import Cell from "@/components/editor/Cell";
import { cellId, colToLetter } from "@/lib/formula";
import { useCells } from "@/hooks/useCells";

const ROWS = 20;
const COLS = 10;

type SpreadsheetGridProps = {
  docId: string;
};

export default function SpreadsheetGrid({ docId }: SpreadsheetGridProps) {
  const { cells, saveCell, saving } = useCells(docId);

  const columns = useMemo(() => Array.from({ length: COLS }, (_, i) => i), []);
  const rows = useMemo(() => Array.from({ length: ROWS }, (_, i) => i), []);

  return (
    <div>
      <div className="mb-3 text-sm text-slate-500">
        {saving ? "Saving..." : "Saved"}
      </div>

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

                  return (
                    <td key={id} className="border border-slate-200 p-0">
                      <Cell
                        value={cell?.value ?? ""}
                        displayValue={cell?.computed ?? cell?.value ?? ""}
                        onSave={(value) => saveCell(id, value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
