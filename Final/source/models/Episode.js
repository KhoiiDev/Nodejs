const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    nameEpisode: { type: String },
    slug: { type: String },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
    },
    linkPhim: { type: String },
    episode: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Episode", episodeSchema);
