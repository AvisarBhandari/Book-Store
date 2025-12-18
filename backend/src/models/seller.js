import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    storeName: { type: String, required: false },

    businessType: {
      type: String,
      enum: ["self-publish", "publisher"],
      required: true,
    },

    role: {
      type: String,
      default: "seller",
    },
  },
  { timestamps: true }
);

export default Seller = mongoose.model("Seller", sellerSchema);
