// backend/routes/contact.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // <-- ARTIK db.query kullanacağız

const isBlank = (v) => !v || !String(v).trim();
const MAX_NAME = 255;
const MAX_EMAIL = 255;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (isBlank(name) || isBlank(email) || isBlank(message)) {
      return res.status(400).json({ message: "name, email, message zorunlu" });
    }
    if (name.length > MAX_NAME) {
      return res.status(400).json({ message: "İsim çok uzun" });
    }
    if (email.length > MAX_EMAIL || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Geçersiz e-posta" });
    }

    await db.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name.trim(), email.trim(), String(message).trim()]
    );

    return res.status(200).json({ message: "Mesaj alındı" });
  } catch (err) {
    console.error("Contact insert hatası:", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
