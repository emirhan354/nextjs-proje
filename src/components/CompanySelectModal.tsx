"use client";
import { useEffect, useState } from "react";
import { getCompanies } from "@/services/company";
import type { Company } from "@/models/Company";

interface Props {
  onClose: () => void;
  onSelect: (company: Company) => void;
}

const DEBOUNCE_MS = 300;

export default function CompanySelectModal({ onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 debounce edilmiş query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // 🔎 Şirketleri çek
  useEffect(() => {
    let active = true;
    setLoading(true);

    getCompanies(debouncedQuery ? { q: debouncedQuery } : {})
      .then((res) => {
        if (active) setCompanies(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
      }}
    >
      <div
        style={{
          background: "#1f1f1f",
          color: "white",
          padding: 20,
          borderRadius: 12,
          width: "100%",
          maxWidth: 420,
          position: "relative",
        }}
      >
        {/* Kapatma butonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
            color: "white",
          }}
        >
          ✖
        </button>

        <h2 style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>
          Şirket Ara & Eşleştir
        </h2>

        {/* 🔍 Arama inputu */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şirket adı ara..."
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #555",
            marginBottom: 12,
            background: "#111",
            color: "white",
          }}
        />

        {/* Liste */}
        {loading ? (
          <p>Aranıyor...</p>
        ) : companies.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Sonuç bulunamadı</p>
        ) : (
          <ul style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
            {companies.map((c) => (
              <li
                key={c.id}
                onClick={() => onSelect(c)}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #333",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <b>{c.name}</b>
                {c.address && (
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {" "}
                    - {c.address}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
