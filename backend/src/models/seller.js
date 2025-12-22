import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storeName: String,
    businessType: {
      type: String,
      enum: ["self-publish", "publisher"],
      required: true,
    },
    ppImage: String,
    role: { type: String, default: "seller" },
    bookList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

// hash password
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
sellerSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// generate JWT
sellerSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "seller",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
