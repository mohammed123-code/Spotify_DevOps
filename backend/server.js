require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const connectCloudinary = require("./src/config/cloudinary");
const songRoutes  = require("./src/routes/songRoutes");
const albumRoutes = require("./src/routes/albumRoutes");
const authRoutes  = require("./src/routes/authRoutes");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

// Create tmp directory for multer uploads
if (!fs.existsSync("tmp")) {
  fs.mkdirSync("tmp");
}

// Connect to MySQL and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:80",
      "http://localhost",
      "http://localhost:8080",
      "http://localhost:8081",
    ],
    credentials: true,
  })
);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎵 Spotify Clone API is running!",
    version: "1.0.0",
    database: "MySQL",
  });
});

// API Routes
app.use("/api/songs",  songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/auth",   authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
