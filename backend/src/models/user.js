import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ppImage: String,
    role: { type: String, default: "user" },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

// compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
