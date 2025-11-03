import express from "express";
import Anime from "../models/anime.js";
import multer from "multer";
import cloudinary from "../Cloudinary/connect.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Cloudinary Config (ENV से values)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================
// 📌 CREATE (Add New Anime)
// =====================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 File received:", req.file);
    console.log("📦 Body received:", req.body);

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "anime-library",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newAnime = new Anime({
      name: req.body.name,
      img: imageUrl,
      link: req.body.link,
      category: req.body.category,
    });

    const saved = await newAnime.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ CREATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 📌 READ (Get All Anime)
// =====================
router.get("/", async (req, res) => {
  try {
    const data = await Anime.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 📌 UPDATE (Edit Anime)
// =====================
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl = req.body.img;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "anime-library",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updated = await Anime.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        img: imageUrl,
        link: req.body.link,
        category: req.body.category,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ UPDATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 📌 DELETE (Remove Anime)
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Anime.findByIdAndDelete(id);
    res.json({ message: "Anime deleted successfully!" });
  } catch (err) {
    console.error("❌ DELETE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
