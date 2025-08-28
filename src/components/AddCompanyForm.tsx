"use client";
import { useState } from "react";
import { addCompany } from "@/services/company";
import { useToast } from "@/components/ToastProvider";
import type { Company } from "@/models/Company";

interface Props {
  onAdded?: (c: Company) => void;
}

export default function AddCompanyForm({ onAdded }: Props) {
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Şirket adı zorunlu");
      return;
    }
    try {
      setLoading(true);
      const newCompany = await addCompany({ name, address, phone, email });
      showSuccess("Şirket başarıyla eklendi!");
      if (onAdded) onAdded(newCompany);
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
    } catch {
      showError("Şirket eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 10,
        border: "1px solid #333",
        borderRadius: 12,
        padding: 16,
        background: "#111", // 🔥 siyah arka plan
        color: "#eee", // yazılar açık renk
        minWidth: 320,
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#3b82f6" }}>
        Yeni Şirket Ekle
      </h3>

      <input
        type="text"
        placeholder="Şirket adı *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
        }}
      />

      <input
        type="text"
        placeholder="Adres"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
        }}
      />

      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
        }}
      />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #444",
          background: "#222",
          color: "#fff",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "10px 14px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Kaydediliyor..." : "Ekle"}
      </button>
    </form>
  );
}
