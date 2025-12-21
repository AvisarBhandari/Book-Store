import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    ppImage: String,
    role: {
      type: String,
      default: "seller",
    },
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

///  Compare password (login)
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
