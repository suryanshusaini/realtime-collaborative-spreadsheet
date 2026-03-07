"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { PresenceUser } from "@/types";

const USER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

function getUserColor(uid: string) {
  let sum = 0;
  for (let i = 0; i < uid.length; i += 1) {
    sum += uid.charCodeAt(i);
  }
  return USER_COLORS[sum % USER_COLORS.length];
}

export function usePresence(docId: string) {
  const { user } = useAuth();
  const [users, setUsers] = useState<PresenceUser[]>([]);

  const currentColor = useMemo(() => {
    if (!user) return "bg-slate-500";
    return getUserColor(user.uid);
  }, [user]);

  useEffect(() => {
    if (!docId || !user) return;
    const currentUser = user;
    const presenceRef = doc(db, "documents", docId, "presence", user.uid);

    async function writePresence() {
      await setDoc(
        presenceRef,
        {
          uid: currentUser.uid,
          displayName:
            currentUser.displayName ?? currentUser.email ?? "Unknown User",
          photoURL: currentUser.photoURL ?? "",
          activeCell: "",
          color: currentColor,
          lastSeen: serverTimestamp(),
        },
        { merge: true },
      );
    }

    writePresence();

    const interval = setInterval(() => {
      writePresence();
    }, 15000);

    const unsubscribe = onSnapshot(
      collection(db, "documents", docId, "presence"),
      (snapshot) => {
        const now = Date.now();

        const activeUsers = snapshot.docs
          .map((item) => {
            const data = item.data() as PresenceUser & {
              color?: string;
              lastSeen?: Timestamp;
            };
            return {
              ...data,
              color: data.color ?? "bg-slate-500",
            };
          })
          .filter((item) => {
            if (!item.lastSeen) return false;
            const lastSeenMs = item.lastSeen.toMillis();
            return now - lastSeenMs < 30000;
          });

        setUsers(activeUsers);
      },
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
      deleteDoc(presenceRef).catch(() => {});
    };
  }, [docId, user, currentColor]);

  return { users };
}
