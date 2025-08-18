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

export async function getVideos(params?: VideoQuery): Promise<VideoItem[]> {
  const { data } = await api.get("/videos", { params });
  return data?.items ?? [];
}
