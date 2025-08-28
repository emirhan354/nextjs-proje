// backend/redisClient.js
const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("❌ Redis bağlantı hatası:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis bağlantısı başarılı.");
  } catch (err) {
    console.error("❌ Redis bağlantısı kurulamadı:", err);
  }
})();

module.exports = redisClient;
