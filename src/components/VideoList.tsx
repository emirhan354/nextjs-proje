"use client";
import { useEffect, useState } from "react";
import type { VideoItem } from "@/models/Video";
import type { VideoQuery } from "@/services/video";
import { assignCompanyToVideo } from "@/services/video";
import CompanySelectModal from "@/components/CompanySelectModal";
import type { Company } from "@/models/Company";
import { useToast } from "@/components/ToastProvider";

type Props = {
  fetcher: (params?: VideoQuery) => Promise<VideoItem[]>;
  onShowMap: (v: VideoItem) => void;
};

const DEBOUNCE_MS = 300;

export default function VideoList({ fetcher, onShowMap }: Props) {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { showSuccess, showError } = useToast();

  // filtre state
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [sort, setSort] = useState<"recordedAt" | "name">("recordedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // debounce edilmiş sorgu değerleri
  const [dq, setDq] = useState(q);
  const [dFrom, setDFrom] = useState(from);
  const [dTo, setDTo] = useState(to);

  // şirket eşleştirme için state
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  // debounce
  useEffect(() => {
    const t = window.setTimeout(() => {
      setDq(q);
      setDFrom(from);
      setDTo(to);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [q, from, to]);

  // server-side fetch
  useEffect(() => {
    setLoading(true);
    setErr("");
    fetcher({
      q: dq || undefined,
      from: dFrom || undefined,
      to: dTo || undefined,
      sort,
      order,
    })
      .then(setItems)
      .catch(() => setErr("Video listesi alınamadı"))
      .finally(() => setLoading(false));
  }, [fetcher, dq, dFrom, dTo, sort, order]);

  // ✅ şirket seçildiğinde backend'e sadece companyId gönderiyoruz
  const handleSelectCompany = async (company: Company) => {
    if (selectedVideoId !== null) {
      try {
        const updated = await assignCompanyToVideo(selectedVideoId, company.id);

        // backend’den dönen güncel video objesiyle state’i güncelle
        setItems((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v))
        );

        showSuccess(
          `Video "${updated.name}" başarıyla "${updated.companyName}" ile eşleştirildi!`
        );
      } catch (e) {
        showError("Eşleştirme başarısız oldu");
      } finally {
        setSelectedVideoId(null);
      }
    }
  };

  // ——— UI ———
  if (loading)
    return <div className="mt-3 text-white/80">Videolar yükleniyor…</div>;
  if (err) return <div className="mt-3 text-red-500">{err}</div>;

  const toggleSort = (key: "recordedAt" | "name") => {
    if (sort !== key) {
      setSort(key);
      setOrder("asc");
    } else {
      setOrder((p) => (p === "asc" ? "desc" : "asc"));
    }
  };
  const sortArrow = (key: "recordedAt" | "name") =>
    sort === key ? (order === "asc" ? "↑" : "↓") : "";

  const countText = `${items.length} kayıt listeleniyor.`;

  return (
    <div className="mt-3 space-y-3">
      {/* Filtre barı */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-xs text-white/60 mb-1">Metin Ara</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Video adı / açıklama"
            className="w-full rounded-md bg-white/5 text-white placeholder-white/40 px-3 py-2 outline-none border border-white/10 focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-1">Başlangıç</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md bg-white/5 text-white px-3 py-2 outline-none border border-white/10 focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-1">Bitiş</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md bg-white/5 text-white px-3 py-2 outline-none border border-white/10 focus:border-white/30"
          />
        </div>

        <button
          onClick={() => {
            setQ("");
            setFrom("");
            setTo("");
          }}
          className="h-[38px] sm:ml-2 rounded-md border border-white/20 px-3 text-sm text-white hover:bg-white/10 transition"
        >
          Temizle
        </button>
      </div>

      {/* Sayaç */}
      <div className="text-xs text-white/60">{countText}</div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="text-[13px] uppercase tracking-wide text-white/70 bg-white/5">
              <th
                className="p-3 text-left cursor-pointer select-none"
                onClick={() => toggleSort("name")}
                title="İsme göre sırala"
              >
                Video {sortArrow("name")}
              </th>
              <th
                className="p-3 text-left cursor-pointer select-none"
                onClick={() => toggleSort("recordedAt")}
                title="Tarihe göre sırala"
              >
                Kayıt Tarihi {sortArrow("recordedAt")}
              </th>
              <th className="p-3 text-left">Şirket</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="p-3 text-white/70" colSpan={4}>
                  Kriterlere uygun kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              items.map((v) => (
                <tr
                  key={v.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 align-middle text-white">{v.name}</td>
                  <td className="p-3 align-middle text-white/90">
                    {new Date(v.recordedAt).toLocaleString()}
                  </td>
                  <td className="p-3 align-middle text-white/90">
                    {v.companyName || "-"}
                  </td>
                  <td className="p-3 align-middle text-right space-x-2">
                    <button
                      onClick={() => onShowMap(v)}
                      className="inline-flex items-center rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10 active:scale-[.98] transition"
                    >
                      Haritayı Göster
                    </button>
                    <button
                      onClick={() => setSelectedVideoId(v.id)}
                      className="inline-flex items-center rounded-md border border-blue-500 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/20 active:scale-[.98] transition"
                    >
                      Eşleştir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Şirket seçme modalı */}
      {selectedVideoId !== null && (
        <CompanySelectModal
          onClose={() => setSelectedVideoId(null)}
          onSelect={handleSelectCompany}
        />
      )}
    </div>
  );
}
