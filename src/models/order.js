const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    ordercode: {
      type: String,
      required: true,
      trim: true
    },
    total_price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending"
    },
    ordered_at: {
      type: Date,
      default: Date.now
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },

    amount: {
      type: Number,
      required: true
    },
    payment_method: {
      type: String,
      enum: ["momo", "banking", "visa/mastercard", "cash"],
      required: true
    },
    paid_at: {
      type: Date,
      default: Date.now
    },
    discount_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discounts",
      default: null
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", OrderSchema);

module.exports = Order;
