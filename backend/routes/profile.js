// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// GET /api/profile
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Profil bilgileri",
    user: {
      id: req.user.sub, // JWT payload'daki sub alanı
      email: req.user.email,
    },
  });
});

module.exports = router;
