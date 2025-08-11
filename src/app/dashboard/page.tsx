// src/app/dashboard/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logout } from "@/services/auth";
import { useToast } from "@/components/ToastProvider";
import { MapModal } from "@/components/MapModal";
import type { Location } from "@/models/Location";
import { getLocations } from "@/services/locationService";

type User = {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
};

export default function Dashboard() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef<number | null>(null);

  // Harita modalı
  const [mapOpen, setMapOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locLoading, setLocLoading] = useState(false);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const doLogout = async () => {
    try {
      await logout();
      showSuccess("Çıkış yapıldı", { duration: 10000 });
    } catch {
      showError("Çıkış sırasında hata", { duration: 10000 });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";
      }
      await delay(400);
      router.replace("/login");
    }
  };

  const scheduleAutoLogout = (exp?: number) => {
    if (!exp) return;
    const msLeft = exp * 1000 - Date.now();
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (msLeft <= 0) {
      doLogout();
      return;
    }
    logoutTimerRef.current = window.setTimeout(doLogout, msLeft);
  };

  useEffect(() => {
    const tok =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!tok) {
      router.replace("/login");
      return;
    }

    getProfile()
      .then((res) => {
        setUser(res?.user);
        scheduleAutoLogout(res?.user?.exp);
      })
      .catch((e: any) => {
        setErr(e?.response?.data?.message || "Profil alınamadı");
      })
      .finally(() => setLoading(false));

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "token" && ev.newValue === null) router.replace("/login");
    };
    window.addEventListener("storage", onStorage);

    const onVisibility = () => {
      if (!document.hidden && user?.exp) scheduleAutoLogout(user.exp);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
    };
    // dependency boş, mevcut akışı bozmayalım
  }, []);

  // Haritayı açarken lokasyonları çek
  const openMap = async () => {
    setMapOpen(true);
    if (locations.length === 0) {
      try {
        setLocLoading(true);
        const locs = await getLocations();
        setLocations(locs);
      } catch {
        showError("Harita verileri yüklenemedi");
      } finally {
        setLocLoading(false);
      }
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Yükleniyor...</p>;
  if (err) return <p style={{ color: "red", padding: 16 }}>{err}</p>;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", marginBottom: 8 }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}
        >
          <p>
            Hoş geldin, <b>{user?.email}</b>
          </p>
          <p style={{ opacity: 0.8 }}>Kullanıcı ID: {user?.id}</p>
          {user?.exp && (
            <p style={{ opacity: 0.7 }}>
              Oturum bitişi: {new Date(user.exp * 1000).toLocaleString()}
            </p>
          )}

          <div
            style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}
          >
            <button
              onClick={openMap}
              style={{
                padding: "10px 14px",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                cursor: "pointer",
                background: "#fff",
                color: "#111", // yazı rengi
              }}
            >
              Haritayı Aç
            </button>

            <button
              onClick={doLogout}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                background: "#ef4444",
                color: "#fff",
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {locLoading && (
            <p style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
              Lokasyonlar yükleniyor…
            </p>
          )}
        </div>
      </div>

      {mapOpen && (
        <MapModal onClose={() => setMapOpen(false)} locations={locations} />
      )}
    </div>
  );
}
