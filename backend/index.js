require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend adresi
    credentials: true,
  })
);

app.use(express.json());

// Rotalar
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const contactRoutes = require("./routes/contact");
const videosRouter = require("./routes/videos");
const companiesRouter = require("./routes/companies");

// Burada her router kendi path’i ile bağlanıyor
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/videos", videosRouter);
app.use("/api/companies", companiesRouter);

// Basit kontrol
app.get("/", (req, res) => res.send("Backend çalışıyor!"));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () =>
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor.`)
);
