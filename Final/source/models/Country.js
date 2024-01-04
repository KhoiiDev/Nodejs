const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    nameCountry: {
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

module.exports = mongoose.model("Country", countrySchema);
