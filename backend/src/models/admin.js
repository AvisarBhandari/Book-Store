import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ppImage: String,
    avatarType: {
      type: String,
      enum: ["uploaded", "generated"],
      default: "generated",
    },
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

// hash password
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

// compare password
adminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
/**
 * ! generate JWT
 */
adminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

const admin = mongoose.model("admin", adminSchema);

export default admin;
