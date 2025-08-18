// src/services/videoService.ts
import type { VideoItem } from "@/models/Video";
import { api } from "@/services/axios";

// Mock istersen hızlı test için bunu kullan; gerçek API'ye geçince yoruma al
const USE_MOCK = false;
const MOCK: VideoItem[] = [
  {
    id: 1,
    name: "Kamera-01_2025-08-10_09-30",
    recordedAt: "2025-08-10T09:30:00Z",
    lat: 40.945,
    lng: 29.16,
    description: "Kartal / Bumerang Plaza girişi",
  },
  {
    id: 2,
    name: "Kamera-02_2025-08-11_18-05",
    recordedAt: "2025-08-11T18:05:00Z",
    lat: 40.9825,
    lng: 29.0883,
    description: "Doğuş Üni. ön kapı",
  },
];

export async function getVideos(): Promise<VideoItem[]> {
  if (USE_MOCK) return MOCK;
  const { data } = await api.get("/videos"); // backend/index.js'te "/videos" bağladık
  const items = Array.isArray(data?.items) ? data.items : [];
  return items;
}
