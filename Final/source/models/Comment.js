const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const moment = require('moment');

const commentSchema = new mongoose.Schema(
  {
    Content: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    film:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
    },
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

commentSchema.plugin(beautifyUnique, {
  defaultMessage: "Định dạng ngày tháng không hợp lệ",
  customMessages: {
    updatedAt: "Ngày cập nhật không hợp lệ",
  },
});

module.exports = mongoose.model("Comment", commentSchema);