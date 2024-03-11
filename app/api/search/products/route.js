// backend api (for search Products ), publicly available
// http://localhost:3000/api/srarch/products/?productSearchQuery=${productSearchQuery}

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Tag from "@/models/tag";

import queryString from "query-string";


// http://localhost:3000/api/srarch/products/?productSearchQuery=macbook
// list  http://localhost:3000/api/srarch/products/?productSearchQuery=${productSearchQuery} (in context)
export async function GET(req) {
    await dbConnect();
    const { productSearchQuery } = queryString.parseUrl(req.url).query;
  
    try {
      // search for categories and tags based on the productSearchQuery (looking for category name and tag name)
      const [categories, tags] = await Promise.all([
        Category.find({ name: { $regex: productSearchQuery, $options: "i" } }), // case incentive
        Tag.find({ name: { $regex: productSearchQuery, $options: "i" } }),
      ]);
  
      // grap caegory id and tag id
      const categoryIds = categories.map((category) => category._id);
      const tagIds = tags.map((tag) => tag._id);

    //   tagIds ->  [
    //     new ObjectId('65b6435bc13dd08ee2d0fe21'),
    //     new ObjectId('65b64253c13dd08ee2d0fdba'),
    //     new ObjectId('65b64332c13dd08ee2d0fe0f')
    //   ]
  
      // main product search query
      const products = await Product.find({
        $or: [
          { title: { $regex: productSearchQuery, $options: "i" } }, // by title
          { description: { $regex: productSearchQuery, $options: "i" } }, // by description
          { category: { $in: categoryIds } }, // by category
          { tags: { $in: tagIds } }, // by tags
        ],
      })
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .sort({ createdAt: -1 });
  
      return NextResponse.json(products);
    } catch (err) {
      return NextResponse.json(
        {
          err: err.message,
        },
        { status: 500 }
      );
    }
  }

