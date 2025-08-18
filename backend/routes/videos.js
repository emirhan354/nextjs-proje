// backend/routes/videos.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const VIDEOS = [
  {
    id: 1,
    name: "Kamera-01_2025-08-10_09-30",
    recordedAt: "2025-08-10T09:30:00Z",
    lat: 40.945,
    lng: 29.16,
    description: "Kartal / Bumerang Plaza girişi",
  },
  {
    id: 2,
    name: "Kamera-02_2025-08-11_18-05",
    recordedAt: "2025-08-11T18:05:00Z",
    lat: 40.9825,
    lng: 29.0883,
    description: "Doğuş Üni. ön kapı",
  },
];

// GET /api/videos?q=&from=2025-08-10&to=2025-08-12&sort=recordedAt&order=desc
router.get("/", verifyToken, (req, res) => {
  const q = (req.query.q || "").toString().trim().toLocaleLowerCase("tr");
  const from = req.query.from
    ? new Date(`${req.query.from}T00:00:00Z`).getTime()
    : Number.NEGATIVE_INFINITY;
  const to = req.query.to
    ? new Date(`${req.query.to}T23:59:59Z`).getTime()
    : Number.POSITIVE_INFINITY;
  const sort = (req.query.sort || "recordedAt").toString(); // "recordedAt" | "name"
  const order = (req.query.order || "desc").toString(); // "asc" | "desc"

  let data = VIDEOS.filter((v) => {
    const hay = `${v.name ?? ""} ${v.description ?? ""}`.toLocaleLowerCase(
      "tr"
    );
    const textOk = q === "" || hay.includes(q);
    const t = new Date(v.recordedAt).getTime();
    const dateOk = t >= from && t <= to;
    return textOk && dateOk;
  });

  data.sort((a, b) => {
    let cmp = 0;
    if (sort === "name") {
      cmp = a.name.localeCompare(b.name, "tr");
    } else {
      cmp = new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
    }
    return order === "asc" ? cmp : -cmp;
  });

  res.json({ items: data });
});

module.exports = router;
