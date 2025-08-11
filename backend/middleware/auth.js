// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

module.exports = async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    // blacklist kontrol
    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted)
      return res.status(401).json({ message: "Token blacklisted" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Geçersiz/eksik token" });
  }
};
