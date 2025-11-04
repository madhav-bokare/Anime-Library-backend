import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js"; 
import animeRoutes from "./routes/animeRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// ===== MongoDB Connect =====
connectDB()

// ===== Middleware =====
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== Routes =====//
app.use("/api/anime", animeRoutes);

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
