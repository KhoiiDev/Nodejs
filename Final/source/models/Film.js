const mongoose = require("mongoose");
const escapeHtml = require("escape-html");

const filmSchema = new mongoose.Schema(
  {
    nameFilm: {
      type: String,
    },
    slug: {
      type: String,
    },
    nameEng: {
      type: String,
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    describe: {
      type: String,
    },
    director: {
      type: String,
    },
    actor: {
      type: String,
    },
    YearFilm: {
      type: String,
    },
    duration: {
      type: String,
    },
    image: {
      type: String,
    },
    resolutions: {
      type: String,
    },
    linkFilm: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    trailer: {
      type: String,
    },
    season: {
      type: String,
    },
    episode: {
      type: String,
    },
    viewCounts: {
      type: Number,
      default: 0,
    },
    linkPhim: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Film", filmSchema);
