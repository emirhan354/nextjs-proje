// src/models/Location.ts
export type Location = {
  id?: number; // mock veride yoksa sorun olmasın
  position: [number, number]; // [lat, lng]
  title: string;
  description: string; // <-- doğru alan adı
};
