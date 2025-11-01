import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Cloudinary from "./Cloudinary/connect.js";
import animeRoutes from "./routes/animeRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// ===== MongoDB Atlas Connect =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(" MongoDB Connected Successfully!"))
  .catch((err) => console.log(" MongoDB Connection Error:", err));

// ===== Cloudinary Connect =====
Cloudinary();

// ===== Routes =====
app.use("/api/anime", animeRoutes);

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
