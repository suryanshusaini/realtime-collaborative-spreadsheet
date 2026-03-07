"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateCell } from "@/lib/firestore";
import { evaluateFormula } from "@/lib/formula";

type CellRecord = {
  value: string;
  computed: string;
};

export function useCells(docId: string) {
  const [cells, setCells] = useState<Record<string, CellRecord>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!docId) return;

    const ref = collection(db, "documents", docId, "cells");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const next: Record<string, CellRecord> = {};

      snapshot.forEach((doc) => {
        const data = doc.data() as CellRecord;
        next[doc.id] = {
          value: data.value ?? "",
          computed: data.computed ?? "",
        };
      });

      setCells(next);
      setSaving(false);
    });

    return unsubscribe;
  }, [docId]);

  async function saveCell(cellId: string, rawValue: string) {
    setSaving(true);

    const computedMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(cells)) {
      computedMap[key] = value.computed || value.value || "";
    }

    const computed = evaluateFormula(rawValue, computedMap);

    await updateCell(docId, cellId, rawValue, computed);
  }

  return {
    cells,
    saveCell,
    saving,
  };
}
