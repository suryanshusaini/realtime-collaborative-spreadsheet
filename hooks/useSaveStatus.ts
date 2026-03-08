"use client";

import { useEffect, useState } from "react";

export type SaveState = "idle" | "saving" | "saved";

export function useSaveStatus(isSaving: boolean) {
  const [status, setStatus] = useState<SaveState>("idle");

  useEffect(() => {
    if (isSaving) {
      setStatus("saving");
      return;
    }

    setStatus("saved");

    const timeout = window.setTimeout(() => {
      setStatus("idle");
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [isSaving]);

  return status;
}
