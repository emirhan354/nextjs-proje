const express = require("express");
const router = express.Router();

// Mock veri (ileride DB'ye bağlanırız)
let COMPANIES = [
  {
    id: 1,
    name: "OpenAI",
    address: "San Francisco",
    phone: "123456",
    email: "info@openai.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Doğuş Teknoloji",
    address: "İstanbul",
    phone: "0212 123 45 67",
    email: "iletisim@dogus.com",
    createdAt: new Date().toISOString(),
  },
];

// Şirket listeleme (LIKE sorgusu destekli)
router.get("/", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  let result = COMPANIES;

  if (q) {
    result = COMPANIES.filter((c) => c.name.toLowerCase().includes(q));
  }

  res.json({ items: result });
});

// Yeni şirket ekleme
router.post("/", (req, res) => {
  const { name, address, phone, email } = req.body;
  if (!name) return res.status(400).json({ message: "Şirket adı zorunlu" });

  const newCompany = {
    id: COMPANIES.length + 1,
    name,
    address: address || "",
    phone: phone || "",
    email: email || "",
    createdAt: new Date().toISOString(),
  };

  COMPANIES.push(newCompany);
  res.status(201).json(newCompany);
});

// ✅ router ana export
module.exports = router;
// ✅ COMPANIES ayrıca export ediliyor
module.exports.COMPANIES = COMPANIES;
