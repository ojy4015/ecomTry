// backend api (for one specific single Product), publicly available

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

// http://localhost:3000/api/product/slug
export async function GET(req, context) {
  await dbConnect();
  try {
    const product = await Product.findOne({ slug: context.params.slug })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate({
        path: "ratings.postedBy",
        model: "User",
        select:"name", // _id is included (default)
      });

    return NextResponse.json(product);
    // slug based on the filename
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
