const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    nameGenre: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    film: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Genre", genreSchema);
