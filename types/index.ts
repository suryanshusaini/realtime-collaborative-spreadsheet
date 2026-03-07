import type { Timestamp } from "firebase/firestore";

// Firestore document shapes

export interface DocumentMeta {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CellData {
  value: string;
  computed: string;
  updatedAt: Timestamp;
}

export interface PresenceUser {
  uid: string;
  displayName: string;
  photoURL: string;
  activeCell: string;
  color: string;
  lastSeen: Timestamp;
}

// Runtime types

export type CellMap = Record<string, CellData>;

export interface CellAddress {
  col: number;
  row: number;
}

export interface ActiveCell {
  id: string;
  editing: boolean;
}
