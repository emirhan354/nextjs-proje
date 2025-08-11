// src/services/locationService.ts
import type { Location } from "@/models/Location";
import { locations as mockLocations } from "@/lib/locations";
// import { api } from "@/services/api"; // API'ye geçince aç

const USE_MOCK = true; // Gerçek API'ye geçince false yap

export async function getLocations(): Promise<Location[]> {
  try {
    if (USE_MOCK) {
      return mockLocations; // Mock veri döner
    }

    // API örneği:
    // const { data } = await api.get("/locations");
    // return Array.isArray(data?.locations) ? data.locations : [];

    return []; // Emniyet fallback
  } catch (error) {
    console.error("Konum verileri alınırken hata oluştu:", error);
    return []; // UI patlamasın diye boş dizi döner
  }
}
