import express from "express";
import Anime from "../models/anime.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ===== READ (Get all anime) =====
router.get("/", async (req, res) => {
  try {
    const data = await Anime.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== CREATE (Add new anime with image upload) =====
router.post("/", upload.single("image"), async (req, res) => {
  try {
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

    const data = await newAnime.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== UPDATE (Update by ID) =====
router.put("/:id", async (req, res) => {
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAnime)
      return res.status(404).json({ message: "Anime not found" });
    res.json(updatedAnime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== DELETE (Delete by ID) =====
router.delete("/:id", async (req, res) => {
  try {
    const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
    if (!deletedAnime)
      return res.status(404).json({ message: "Anime not found" });
    res.json({ message: "Anime deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
