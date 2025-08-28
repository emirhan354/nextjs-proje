// backend/routes/videos.js
const express = require("express");
const router = express.Router();
const { COMPANIES } = require("./companies"); // ✅ Tek kaynaktan şirketleri al

// Mock videolar
let VIDEOS = [
  {
    id: 1,
    name: "Kamera-01_2025-08-10_09-30",
    recordedAt: "2025-08-10T09:30:00Z",
    lat: 40.945,
    lng: 29.16,
    description: "Kartal / Bumerang Plaza girişi",
    companyId: null,
  },
  {
    id: 2,
    name: "Kamera-02_2025-08-11_18-05",
    recordedAt: "2025-08-11T18:05:00Z",
    lat: 40.9825,
    lng: 29.0883,
    description: "Doğuş Üni. ön kapı",
    companyId: null,
  },
];

// Yardımcı → companyName ekle
function decorate(video) {
  const company = video.companyId
    ? COMPANIES.find((c) => c.id === video.companyId)
    : null;
  return { ...video, companyName: company ? company.name : null };
}

// ✅ Listeleme → GET /api/videos
router.get("/", (req, res) => {
  let items = VIDEOS.map(decorate);

  const { q, from, to, sort = "recordedAt", order = "desc" } = req.query;

  if (q) {
    const s = String(q).toLowerCase();
    items = items.filter(
      (v) =>
        v.name.toLowerCase().includes(s) ||
        (v.description || "").toLowerCase().includes(s) ||
        (v.companyName || "").toLowerCase().includes(s)
    );
  }

  if (from) {
    const f = new Date(from);
    if (!isNaN(+f)) items = items.filter((v) => new Date(v.recordedAt) >= f);
  }
  if (to) {
    const t = new Date(to);
    if (!isNaN(+t)) items = items.filter((v) => new Date(v.recordedAt) <= t);
  }

  items.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(a.recordedAt) - new Date(b.recordedAt);
  });
  if (String(order).toLowerCase() === "desc") items.reverse();

  res.json({ items });
});

// ✅ Video ↔ Şirket eşleştirme → POST /api/videos/:id/company
router.post("/:id/company", (req, res) => {
  const id = Number(req.params.id);
  const { companyId } = req.body;

  const video = VIDEOS.find((v) => v.id === id);
  if (!video) return res.status(404).json({ message: "Video bulunamadı" });

  const company = COMPANIES.find((c) => c.id === Number(companyId));
  if (!company) return res.status(400).json({ message: "Geçersiz şirket ID" });

  video.companyId = company.id;
  res.json(decorate(video));
});

module.exports = router;
