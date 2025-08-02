import { Location } from "@/models/Location";
import { locations } from "@/lib/locations"; // mock veriyi buradan al

export const fetchLocations = async (): Promise<Location[] | null> => {
  try {
    return locations; // API yerine mock veri
  } catch (error) {
    console.error("Konum verileri alınırken hata oluştu:", error);
    return null;
  }
};
