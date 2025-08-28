// src/services/video.ts
import { api } from "@/services/axios";
import type { VideoItem } from "@/models/Video";

export type VideoQuery = {
  q?: string;
  from?: string; // "yyyy-mm-dd"
  to?: string; // "yyyy-mm-dd"
  sort?: "recordedAt" | "name";
  order?: "asc" | "desc";
};

// 🔹 Videoları listele
export async function getVideos(params?: VideoQuery): Promise<VideoItem[]> {
  const { data } = await api.get("/videos", { params });
  return data?.items ?? [];
}

// 🔹 Bir videoyu şirkete eşleştir (kalıcı)
// ✅ Artık doğru endpoint olan POST /videos/:id/company kullanılıyor
export async function assignCompanyToVideo(
  videoId: number,
  companyId: number
): Promise<VideoItem> {
  const { data } = await api.post(`/videos/${videoId}/company`, {
    companyId,
  });
  return data;
}
