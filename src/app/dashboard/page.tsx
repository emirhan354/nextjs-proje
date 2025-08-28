"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logout } from "@/services/auth";
import { useToast } from "@/components/ToastProvider";
import { MapModal } from "@/components/MapModal";
import type { Location } from "@/models/Location";
import { getLocations } from "@/services/locationService";

// Video listesi
import VideoList from "@/components/VideoList";
import { getVideos } from "@/services/video";
import type { VideoItem } from "@/models/Video";

// Şirket formu
import AddCompanyForm from "@/components/AddCompanyForm";
import { getCompanies } from "@/services/company";
import type { Company } from "@/models/Company";

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

  // Şirket modal & liste
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companiesModalOpen, setCompaniesModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

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

    // ✅ ilk yüklemede şirketleri çek
    getCompanies({ q: "" })
      .then(setCompanies)
      .catch(() => showError("Şirketler alınamadı"));

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Genel haritayı açarken lokasyonları çek
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

  // Video satırından “Haritayı Göster” → tek marker ile modal aç
  const handleShowVideoOnMap = (v: VideoItem) => {
    const loc: Location = {
      id: v.id,
      position: [v.lat, v.lng],
      title: v.name,
      description: v.description || new Date(v.recordedAt).toLocaleString(),
    };
    setLocations([loc]);
    setMapOpen(true);
  };

  if (loading) return <p style={{ padding: 16 }}>Yükleniyor...</p>;
  if (err) return <p style={{ color: "red", padding: 16 }}>{err}</p>;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", marginBottom: 8 }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gap: 12 }}>
        {/* Kullanıcı / Kontrol paneli */}
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
                color: "#111",
              }}
            >
              Genel Haritayı Aç
            </button>

            <button
              onClick={() => setCompanyModalOpen(true)}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                background: "#2563eb",
                color: "#fff",
              }}
            >
              + Şirket Ekle
            </button>

            <button
              onClick={() => setCompaniesModalOpen(true)}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                background: "#047857",
                color: "#fff",
              }}
            >
              Şirketleri Gör
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

        {/* Video listesi */}
        <div
          style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Video Kayıtları</h2>
          <VideoList fetcher={getVideos} onShowMap={handleShowVideoOnMap} />
        </div>
      </div>

      {/* ✅ Şirket ekleme modalı */}
      {companyModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "100%",
              maxWidth: 400,
              position: "relative",
            }}
          >
            <button
              onClick={() => setCompanyModalOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h2 style={{ marginBottom: 12 }}>Yeni Şirket Ekle</h2>
            <AddCompanyForm
              onAdded={async () => {
                await getCompanies({ q: "" }).then(setCompanies);
                setCompanyModalOpen(false);
                showSuccess("Şirket başarıyla eklendi");
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Şirketleri gör modalı */}
      {companiesModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1f1f1f", // koyu gri arka plan
              padding: 20,
              borderRadius: 12,
              width: "100%",
              maxWidth: 900,
              position: "relative",
            }}
          >
            <button
              onClick={() => setCompaniesModalOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
                color: "#fff",
              }}
            >
              ✖
            </button>

            <h2 style={{ marginBottom: 16, color: "white" }}>Şirketler</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 16,
              }}
            >
              {companies.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: "1px solid #333",
                    borderRadius: 10,
                    padding: 12,
                    background: "#fff", // kart beyaz
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)", // gölge
                  }}
                >
                  <h3 style={{ marginBottom: 6, color: "#2563eb" }}>
                    {c.name}
                  </h3>
                  {c.address && (
                    <p style={{ margin: 0, fontSize: 14, color: "#111" }}>
                      📍 {c.address}
                    </p>
                  )}
                  {c.email && (
                    <p style={{ margin: 0, fontSize: 14, color: "#047857" }}>
                      ✉️ {c.email}
                    </p>
                  )}
                  {c.phone && (
                    <p style={{ margin: 0, fontSize: 14, color: "#dc2626" }}>
                      📞 {c.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mapOpen && (
        <MapModal onClose={() => setMapOpen(false)} locations={locations} />
      )}
    </div>
  );
}
