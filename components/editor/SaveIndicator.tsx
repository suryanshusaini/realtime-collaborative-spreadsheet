"use client";

import type { SaveState } from "@/hooks/useSaveStatus";

type SaveIndicatorProps = {
  status: SaveState;
};

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  let label = "Ready";

  if (status === "saving") label = "Saving...";
  if (status === "saved") label = "Saved";

  return (
    <div className="rounded-md border bg-white px-3 py-2 text-sm text-slate-600">
      {label}
    </div>
  );
}
