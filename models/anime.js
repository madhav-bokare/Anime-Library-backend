import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  link: { type: String },
  category:{type:String}
});

const Anime = mongoose.model("Anime", animeSchema);
export default Anime;
