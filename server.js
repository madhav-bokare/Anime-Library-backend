import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import router from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

// ===== JSON & URL-encoded body =====
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ===== MongoDB Connect (single time) =====
connectDB();

// ===== CORS (optimized) =====
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== Routes =====
app.use("/api/book", router);

// ===== Health Check (FAST ping) =====
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ===== Server Start =====
const PORT = process.env.LOGIN_PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
