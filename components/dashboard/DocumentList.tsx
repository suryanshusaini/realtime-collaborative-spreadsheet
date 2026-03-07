"use client";

import type { DocumentMeta } from "@/types";
import DocumentCard from "@/components/dashboard/DocumentCard";

type DocumentListProps = {
  documents: DocumentMeta[];
};

export default function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          No spreadsheets yet. Create your first one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
