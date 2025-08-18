// src/models/Video.ts
export type VideoItem = {
  id: number;
  name: string;
  recordedAt: string; // ISO
  lat: number;
  lng: number;
  description?: string;
};
