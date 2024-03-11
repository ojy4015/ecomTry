import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const categorySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true,
        trim: true,
        maxlength: [20, 'A category name must have less or equal then 20 characters'],
        minlength: [1, 'A category name must have more or equal then 1 characters'],
      },
      slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
      },

  }, { timestamps: true });

categorySchema.plugin(uniqueValidator, " is already taken.");

export default mongoose.models.Category || mongoose.model("Category", categorySchema); 