const mongoose = require("mongoose");

const orderShema = mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "UserDetails",
  },
  totalQuantity: Number,
  summary: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
      },
      quantity: Number,
      totalPrice: Number,
    },
  ],
  shippingAddress: {
    building: String,
    address: String,
    pincode: Number,
    country: String,
    contactNumber: Number,
  },
  delivered: { type: Boolean, default: false },
  status: {
    type: String,
    default: "In-transit",
  },
  modeOfPayment: String,
  couponUsed: { type: mongoose.Types.ObjectId, ref: "Coupon" },
  price: Number,
  finalPrice: Number,
  discountPrice: { type: Number, default: 0 },
  orderedOn: { type: Date, default: new Date()},
  deliveredOn: { type: Date, default: null },
  returnedOn: { type: Date, default: null },
});

const orderCollection = mongoose.model("Orders", orderShema);
module.exports = orderCollection;
