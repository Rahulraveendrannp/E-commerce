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
  subCategory: {
    type: String,
    require,
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: brandDetails,
    require,
  },
  initialPrice:Number,
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
  offer:Number,
  stock: Number,
  listed: { type: Boolean, default: true },
});


const productCollection = mongoose.model("Products", productSchema);
module.exports = productCollection;
