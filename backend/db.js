// backend/db.js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ÖNEMLİ: Promise API döndür
const db = pool.promise();
module.exports = db;

// (Opsiyonel) açılışta hızlı test:
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Veritabanı bağlantısı başarılı.");
  } catch (e) {
    console.error("❌ Veritabanı bağlantı hatası:", e.message);
  }
})();
