// backend api (for Product) post

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from '@/models/product';
import slugify from "slugify";


// http://localhost:3000/api/admin/product
// create
export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    // console.log("body in POST : ", body);
    // return;

    try {
        const product = await Product.create({
          ...body,
          slug: slugify(body.title),
        });
    
        return NextResponse.json(product);
    
      } catch (err) {
        console.log("err in server: ",err);
        return NextResponse.json({ err: err._message }, { status: 500 });
      }
}
