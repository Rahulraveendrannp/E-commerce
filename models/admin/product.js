const mongoose = require("mongoose");
const categoryDetails = require("./category");
const brandDetails=require("./brand")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: categoryDetails,
    require,
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: brandDetails,
    require,
  },
  price: {
    type: Number,
    require,
  },
  color: {
    type: String,
    require,
  },
  size: {
    type: Number,
    require,
  },
  thumbnail: {
    type: String,
    require,
  },
  frontImage: {
    type: String,
    require,
  },
  images: [String],
  stock: Number,
  listed: { type: Boolean, default: true },
});


const productCollection = mongoose.model("Products", productSchema);
module.exports = productCollection;
