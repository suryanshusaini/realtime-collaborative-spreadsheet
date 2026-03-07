"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Trademarkia Sheets
          </h1>
          <p className="text-sm text-slate-500">
            Real-time collaborative spreadsheet
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">
              {user?.displayName ?? "User"}
            </p>
            <p className="text-xs text-slate-500">{user?.email ?? ""}</p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
