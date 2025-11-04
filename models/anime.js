import mongoose from "mongoose";

// Video Schema
const videoSchema = new mongoose.Schema({
  episodeNumber: { type: Number },
  title: { type: String },
  videoUrl: { type: String },
});


//  Main Anime Schema
const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  link: { type: String },
  category: { type: String },
  videos: [videoSchema],
});

const Anime = mongoose.model("Anime", animeSchema);
export default Anime;
