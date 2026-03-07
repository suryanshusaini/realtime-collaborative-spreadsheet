"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

export default function NewDocumentButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleCreateDocument() {
    if (!user) return;

    try {
      setLoading(true);
      const docId = await createDocument(user);
      router.push(`/editor/${docId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Could not create a new spreadsheet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCreateDocument}
      disabled={loading || !user}
      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Creating..." : "New Spreadsheet"}
    </button>
  );
}
