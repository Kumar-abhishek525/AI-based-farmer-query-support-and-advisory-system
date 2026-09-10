// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["farmer", "expert", "admin"],
      default: "farmer",
    },
    location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
    },
    preferredLanguage: { type: String, default: "en" }, // "en", "hi", etc.
  },
  { timestamps: true }
);

// Hash password before saving, only if it's new/changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
 
});

// Instance method used by authController during login
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Never send the password hash back in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);