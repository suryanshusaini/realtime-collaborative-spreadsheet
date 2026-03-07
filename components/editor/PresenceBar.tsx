"use client";

import type { PresenceUser } from "@/types";

type PresenceBarProps = {
  users: PresenceUser[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PresenceBar({ users }: PresenceBarProps) {
  return (
    <div className="mb-4 rounded-lg border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Active collaborators
        </h2>
        <span className="text-xs text-slate-500">{users.length} online</span>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-slate-500">No active collaborators</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {users.map((user) => (
            <div
              key={user.uid}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${user.color}`}
              >
                {getInitials(user.displayName)}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  {user.displayName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
