import express from "express";
import multer from "multer";
import cloudinary from "../Cloudinary/connect.js";
import fs from "fs";
import Anime from "../models/anime.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================
// 📌 CREATE (Add New Anime)
// =====================
router.post("/", upload.single("img"), async (req, res) => {
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
      videos: req.body.videos
        ? JSON.parse(req.body.videos) // array of videos from frontend
        : [
            {
              episodeNumber: req.body.episodeNumber || 1,
              title: req.body.videoTitle,
              videoUrl: req.body.videoUrl,
            },
          ],
    });

    const saved = await newAnime.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("CREATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// READ ALL
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
// READ BY ID
// =====================
router.get("/id/:id", async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ error: "Anime not found" });
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// READ BY NAME
// =====================
router.get("/name/:name", async (req, res) => {
  try {
    const nameParam = decodeURIComponent(req.params.name).trim();
    const anime = await Anime.findOne({
      name: { $regex: new RegExp(`^${nameParam}$`, "i") },
    });

    if (!anime) return res.status(404).json({ error: "Anime not found" });
    res.json(anime);
  } catch (err) {
    console.error("Error fetching anime by name:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// UPDATE
// =====================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Anime.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        img: req.body.img,
        link: req.body.link,
        category: req.body.category,
        videos: req.body.videos
          ? JSON.parse(req.body.videos)
          : [
              {
                episodeNumber: req.body.episodeNumber || 1,
                title: req.body.videoTitle,
                videoUrl: req.body.videoUrl,
              },
            ],
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Anime not found" });
    res.json(updated);
  } catch (err) {
    console.error("UPDATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// DELETE
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Anime.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Anime not found" });
    res.json({ message: "Anime deleted successfully!" });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
