// backend api (for Products of certain page), publicly available
// http://localhost:3000/api/product

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import queryString from "query-string";

// http://localhost:3000/api/product?page=3
// list  // fetch(`${process.env.API}/product?page=${page}` (in context)
export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = process.env.PAGESIZE;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalProducts = await Product.countDocuments({}); // total products in db

    const products = await Product.find({})
      .populate("category", "name slug") // id is automatically included, we do this because we only know category id
      .populate("tags", "name slug")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageSize),
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
