// backend api (for brands of certain page), publicly available
// get this property from product model
// http://localhost:3000/api/product/brands

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";


// http://localhost:3000/api/product/brands?page=3
// list  // fetch(`${process.env.API}/product/brands?page=${page}` (in context)

// The Mongoose Query API distinct() method is used to find the distinct values for a particular field in a collection and return the response as an array.
export async function GET(req) {
  await dbConnect();

  try {
    const brands = await Product.distinct('brand');

    return NextResponse.json(brands);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
