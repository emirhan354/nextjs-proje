// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// DB ve Redis
const db = require("./db"); // db.query çalışıyorsa pool.promise() dönüyor demektir
const redisClient = require("./redisClient");

// CORS ayarı (önemli: credentials true ve origin localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // <-- EKLENDİ
  })
);

// Middleware
app.use(express.json());

// Rotalar
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const contactRoutes = require("./routes/contact"); // <-- EKLENDİ
const videosRouter = require("./routes/videos");

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", contactRoutes);
app.use("/api/videos", videosRouter); // önce /videos idi

// Basit kontrol
app.get("/", (req, res) => res.send("Backend çalışıyor!"));

// Bootstrap
(async () => {
  try {
    if (!redisClient.isOpen) await redisClient.connect();
    console.log("✅ Redis bağlantısı başarılı.");

    await db.query("SELECT 1");
    console.log("✅ Veritabanı bağlantısı başarılı.");

    const PORT = Number(process.env.PORT || 3001);
    app.listen(PORT, () =>
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`)
    );
  } catch (err) {
    console.error("❌ Başlatma hatası:", err.message);
    process.exit(1);
  }
})();
