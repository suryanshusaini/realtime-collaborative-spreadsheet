import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import type { CellData, DocumentMeta, PresenceUser } from "@/types";

export async function createDocument(user: User): Promise<string> {
  const ref = await addDoc(collection(db, "documents"), {
    title: "Untitled Spreadsheet",
    authorId: user.uid,
    authorName: user.displayName ?? user.email ?? "Unknown",
    authorEmail: user.email ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateDocumentTitle(
  docId: string,
  title: string,
): Promise<void> {
  await setDoc(
    doc(db, "documents", docId),
    { title, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function getUserDocuments(
  userId: string,
): Promise<DocumentMeta[]> {
  const q = query(collection(db, "documents"), where("authorId", "==", userId));
  const snap = await getDocs(q);

  const docs = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<DocumentMeta, "id">),
  }));

  return docs.sort((a, b) => {
    const aTime = (a.updatedAt as Timestamp)?.toMillis() ?? 0;
    const bTime = (b.updatedAt as Timestamp)?.toMillis() ?? 0;
    return bTime - aTime;
  });
}

export async function updateCell(
  docId: string,
  cellId: string,
  value: string,
  computed: string,
): Promise<void> {
  const cellRef = doc(db, "documents", docId, "cells", cellId);

  const payload: CellData = {
    value,
    computed,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(cellRef, payload);
}

export async function upsertPresence(
  docId: string,
  userId: string,
  data: Omit<PresenceUser, "uid" | "lastSeen">,
): Promise<void> {
  const ref = doc(db, "documents", docId, "presence", userId);

  await setDoc(ref, {
    ...data,
    uid: userId,
    lastSeen: serverTimestamp(),
  });
}

export async function deletePresence(
  docId: string,
  userId: string,
): Promise<void> {
  await deleteDoc(doc(db, "documents", docId, "presence", userId));
}
