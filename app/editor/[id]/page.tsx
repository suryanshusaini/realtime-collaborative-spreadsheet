"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import SpreadsheetGrid from "@/components/editor/SpreadsheetGrid";

export default function EditorPage() {
  const params = useParams();
  const docId = params.id as string;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Spreadsheet Editor
          </h1>
          <p className="mt-2 text-sm text-slate-600">Document ID: {docId}</p>
        </div>

        <SpreadsheetGrid docId={docId} />
      </main>
    </div>
  );
}
