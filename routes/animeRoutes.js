import express from "express";
import Anime from "../models/anime.js";

const router = express.Router();

// =====================
// CREATE 
// =====================
router.post("/", async (req, res) => {
  try {
    const newAnime = new Anime({
      name: req.body.name,
      img: req.body.img,
      link: req.body.link,
      category: req.body.category,
      videos: [
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
//  READ BY NAME 
// =====================
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
        videos: [
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
