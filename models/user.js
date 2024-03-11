import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: [true, "Name is required"],
      trim: true,
      minLength: 1,
      maxLength: 20,
    },
    email: {
      type: 'string',
      required: [true, "Email is required"],
      index: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 20,
    },
    password: String, // someone may log in using GOOGLE
    role: {
      type: String,
      default: "user", // admin role will be set by mongodb
    },
    image: String,
    resetCode: {
      data: String,
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    },

  }, { timestamps: true });

userSchema.plugin(uniqueValidator, " is already taken.");

export default mongoose.models.User || mongoose.model("User", userSchema); 