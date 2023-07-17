const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: String,
    discount: Number,
    category:{
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    startingDate: Date,
    expiryDate: Date
  },
);

const offerCollection = mongoose.model("Offer", offerSchema);
module.exports = offerCollection;