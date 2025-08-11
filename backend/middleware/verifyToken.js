const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

module.exports = async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Token gerekli" });

    // Blacklist kontrol
    const bl = await redisClient.get(`bl_${token}`);
    if (bl) return res.status(401).json({ message: "Token blacklisted" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Hem {sub,...} hem {id,...} payload’ını destekle
    req.user = {
      id: decoded.sub ?? decoded.id,
      email: decoded.email,
      exp: decoded.exp,
    };
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Token geçersiz veya süresi dolmuş" });
  }
};
