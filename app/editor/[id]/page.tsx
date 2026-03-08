"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import SpreadsheetGrid from "@/components/editor/SpreadsheetGrid";
import PresenceBar from "@/components/editor/PresenceBar";
import FormulaBar from "@/components/editor/FormulaBar";
import SaveIndicator from "@/components/editor/SaveIndicator";
import { usePresence } from "@/hooks/usePresence";
import { useSaveStatus } from "@/hooks/useSaveStatus";

export default function EditorPage() {
  const params = useParams();
  const docId = params.id as string;
  const { users } = usePresence(docId);

  const [saving, setSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedRawValue, setSelectedRawValue] = useState("");

  const saveStatus = useSaveStatus(saving);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Spreadsheet Editor
            </h1>
            <p className="mt-2 text-sm text-slate-600">Document ID: {docId}</p>
          </div>

          <SaveIndicator status={saveStatus} />
        </div>

        <PresenceBar users={users} />
        <FormulaBar selectedCell={selectedCell} rawValue={selectedRawValue} />

        <SpreadsheetGrid
          docId={docId}
          onSavingChange={setSaving}
          onSelectionChange={(cellId, rawValue) => {
            setSelectedCell(cellId);
            setSelectedRawValue(rawValue);
          }}
        />
      </main>
    </div>
  );
}
