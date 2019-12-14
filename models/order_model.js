const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cart: { type: Object, required: true },
  paymentId: { type: String, required: true }
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
