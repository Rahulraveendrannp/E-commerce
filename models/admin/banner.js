const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    description: String,
    videoURL: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const bannerCollection = mongoose.model("Banner", bannerSchema);
module.exports = bannerCollection;
