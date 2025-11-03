import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cloudinary from "./Cloudinary/connect.js"; // <-- new import (no function call)
import animeRoutes from "./routes/animeRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// ===== MongoDB Connect =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ===== Cloudinary (Auto-configured) =====
console.log("✅ Cloudinary Config Loaded");

// ===== Middleware =====
app.use(
  cors({
    origin: "https://anime-library-three.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== Routes =====
app.use("/api/anime", animeRoutes);

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
