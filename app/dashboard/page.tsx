"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import NewDocumentButton from "@/components/dashboard/NewDocumentButton";
import DocumentList from "@/components/dashboard/DocumentList";
import { useAuth } from "@/context/AuthContext";
import { getUserDocuments } from "@/lib/firestore";
import type { DocumentMeta } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    async function loadDocuments() {
      if (!user) return;
      try {
        setFetching(true);
        const docs = await getUserDocuments(user.uid);
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setFetching(false);
      }
    }

    loadDocuments();
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading session...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Your Documents
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create and manage collaborative spreadsheets.
            </p>
          </div>

          <NewDocumentButton />
        </div>

        {fetching ? (
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">Loading documents...</p>
          </div>
        ) : (
          <DocumentList documents={documents} />
        )}
      </main>
    </div>
  );
}
