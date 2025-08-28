import { api } from "@/services/axios";
import type { Company } from "@/models/Company";

// ✅ Şirketleri listele (opsiyonel arama parametresi ile)
export async function getCompanies(params?: {
  q?: string;
}): Promise<Company[]> {
  const res = await api.get("/companies", { params });
  return res.data.items;
}

// ✅ Yeni şirket ekle
export async function addCompany(
  data: Omit<Company, "id" | "createdAt">
): Promise<Company> {
  const res = await api.post("/companies", data);
  return res.data;
}
