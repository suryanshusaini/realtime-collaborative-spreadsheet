"use client";

import { useEffect, useState } from "react";

type CellProps = {
  value: string;
  displayValue: string;
  onSave: (value: string) => Promise<void>;
  onSelect: () => void;
};

export default function Cell({
  value,
  displayValue,
  onSave,
  onSelect,
}: CellProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  async function handleBlur() {
    setEditing(false);
    await onSave(localValue);
  }

  return (
    <input
      value={editing ? localValue : displayValue}
      onFocus={() => {
        setEditing(true);
        onSelect();
      }}
      onClick={onSelect}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className="h-10 w-28 border border-slate-200 px-2 text-sm text-black outline-none focus:bg-blue-50"
    />
  );
}
