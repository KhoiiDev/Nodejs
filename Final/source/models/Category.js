const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    nameCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model("Category", categorySchema);
