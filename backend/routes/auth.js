const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // promise pool
const verifyToken = require("../middleware/verifyToken");
const redisClient = require("../redisClient");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL_MIN = 20;

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email ve şifre zorunlu" });

    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashed,
    ]);
    return res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    return res.status(500).json({ message: "Hata oluştu" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email ve şifre zorunlu" });

    const [rows] = await db.query(
      "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ message: "Geçersiz kimlik bilgileri" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Geçersiz kimlik bilgileri" });

    const payload = { sub: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: `${TOKEN_TTL_MIN}m`,
    });

    return res.json({ message: "Giriş başarılı", token });
  } catch (err) {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", verifyToken, async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(400).json({ message: "Token bulunamadı" });

    const ttlSec = Math.max(
      (req.user.exp ?? 0) - Math.floor(Date.now() / 1000),
      1
    );
    await redisClient.set(`bl_${token}`, "1", { EX: ttlSec });

    return res.json({ message: "Başarıyla çıkış yapıldı" });
  } catch {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
