const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "UserDetails",
  },
  totalPrice: Number,
  totalQuantity: {
    type: Number,
    default: 0,
  },
  products: [
    {
      name: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
      },
      quantity: { type: Number, default: 1, min: 1 },
      price: Number,
    },
  ],
});

const cartCollection = mongoose.model("Cart", cartSchema);
module.exports = cartCollection;
