// src/models/Company.ts
export interface Company {
  id: number; // benzersiz şirket ID
  name: string; // şirket adı
  address?: string; // adres (opsiyonel)
  phone?: string; // telefon (opsiyonel)
  email?: string; // email (opsiyonel)
  createdAt?: string; // oluşturulma tarihi
}
