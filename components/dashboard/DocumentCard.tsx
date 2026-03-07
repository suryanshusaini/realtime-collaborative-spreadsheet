"use client";

import Link from "next/link";
import type { DocumentMeta } from "@/types";

type DocumentCardProps = {
  document: DocumentMeta;
};

function formatDate(value: DocumentMeta["updatedAt"]) {
  try {
    return value?.toDate().toLocaleString();
  } catch {
    return "Just now";
  }
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link
      href={`/editor/${document.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {document.title}
        </h3>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
          Open
        </span>
      </div>

      <p className="mb-1 text-sm text-slate-600">
        Author: {document.authorName}
      </p>

      <p className="text-xs text-slate-500">
        Last modified: {formatDate(document.updatedAt)}
      </p>
    </Link>
  );
}
