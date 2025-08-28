export interface VideoItem {
  id: number;
  name: string;
  recordedAt: string;
  lat: number;
  lng: number;
  description?: string;

  companyName?: string;
}
