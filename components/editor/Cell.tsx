"use client";

import { useEffect, useState } from "react";

type CellProps = {
  value: string;
  displayValue: string;
  onSave: (value: string) => Promise<void>;
};

export default function Cell({ value, displayValue, onSave }: CellProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  async function handleBlur() {
    setEditing(false);
    await onSave(localValue);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalValue(e.target.value);
  }

  return (
    <input
      value={editing ? localValue : displayValue}
      onFocus={() => setEditing(true)}
      onChange={handleChange}
      onBlur={handleBlur}
      className="h-10 w-28 border border-slate-200 px-2 text-sm text-black outline-none focus:bg-blue-50"
    />
  );
}
