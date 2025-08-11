const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get("/user", verifyToken, (req, res) => {
  const user = req.user;
  res.json({ user });
});

module.exports = router;
