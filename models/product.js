import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import Category from "@/models/category";
import Tags from "@/models/tag";
import User from "@/models/user";

// const likeSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId, // string
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

const ratingSchema = new mongoose.Schema(
  {
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        maxlength: 200,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, // string
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A product must have a title"],
      unique: true,
      trim: true,
      maxlength: [
        160,
        "A product name must have less or equal then 160 characters",
      ],
      minlength: [
        1,
        "A product name must have more or equal then 1 characters",
      ],
      text: true, // to allow text based search
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
      trim: true,
      maxlength: [
        1000000,
        "A product description must have less or equal then 1000000 characters",
      ],
      minlength: [
        1,
        "A product description must have more or equal then 1 characters",
      ],
      text: true, // to allow text based search
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 6,
      validate: {
        validator: function (value) {
          return value !== 0;
        },
        message: "Price must be greater than 0",
      },
    },
    previousPrice: Number, // for sale
    color: String,
    brand: String,
    stock: Number,
    shipping: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // string
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId, // string
        ref: "Tag",
        required: true,
      },
    ], // array of tag object
    images: [
      {
        secure_url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        }, // to delete image
      },
    ], // array of image object
    sold: {
      type: Number,
      default: 0,
    },
    // array of user id(string)
    likes:[
      {
         type: mongoose.Schema.Types.ObjectId, // string
          ref: "User"
      }
    ],
 
    ratings: [ratingSchema], // array of rating object
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator, " is already taken.");

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
