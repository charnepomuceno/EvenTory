import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  registrationType: {
    type: String,
    enum: ["phone", "email"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
