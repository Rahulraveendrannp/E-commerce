const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    discount: Number,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Catgory",
    },
    startingDate: Date,
    expiryDate: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
);

const couponCollection = mongoose.model("Coupon", couponSchema);
module.exports = couponCollection;

