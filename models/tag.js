import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import Category from "@/models/category";

const tagSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'A tqg must have a name'],
        unique: true,
        trim: true,
        maxlength: [20, 'A tqg name must have less or equal then 20 characters'],
        minlength: [1, 'A tqg name must have more or equal then 1 characters'],
      },
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
      },
      parentCategory: {
        type: mongoose.Schema.Types.ObjectId, // string
        ref: 'Category',
        required: true,
      },

  }, { timestamps: true });

tagSchema.plugin(uniqueValidator, " is already taken.");

export default mongoose.models.Tag || mongoose.model("Tag", tagSchema); 