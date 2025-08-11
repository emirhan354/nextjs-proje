const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("❌ Redis bağlantı hatası:", err);
});

module.exports = redisClient;
