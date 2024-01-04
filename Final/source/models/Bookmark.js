const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const moment = require('moment');

const bookmarkSchema = new mongoose.Schema(
  {
    user:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, 
    film: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film",
      },
    ],
    createdAt: {
      type: String,
      default: () => moment().format('D MMMM YYYY'),
    },
    updatedAt: {
      type: String,
      default: () => moment().format('D MMMM YYYY'),
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

bookmarkSchema.plugin(beautifyUnique, {
  defaultMessage: "Định dạng ngày tháng không hợp lệ",
  customMessages: {
    updatedAt: "Ngày cập nhật không hợp lệ",
  },
});

module.exports = mongoose.model("bookmark", bookmarkSchema);