"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

export default function EditorPage() {
  const params = useParams();
  const docId = params.id as string;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Spreadsheet Editor
        </h1>

        <p className="text-sm text-slate-600 mb-6">Document ID: {docId}</p>

        <div className="border bg-white rounded-lg p-6">
          Spreadsheet grid will appear here.
        </div>
      </main>
    </div>
  );
}
