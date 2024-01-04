const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
    },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
