import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    priceAtPurchase: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["esewa", "khalti"],
      default: "esewa",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    purchaseStatus: {
      type: String,
      enum: ["completed", "refunded"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
