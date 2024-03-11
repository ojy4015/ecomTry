// backend api for category
// available for logged user only

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from '@/models/category';
import slugify from "slugify";


// http://localhost:3000/api/admin/category
// create
export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const {name} = body;

    try {
        const category = await Category.create({
          name,
          slug: slugify(name),
        });
    
        return NextResponse.json(category);
    
      } catch (err) {
        console.log("err in server: ",err);
        return NextResponse.json({ err: err._message }, { status: 500 });
      }
}

// list
export async function GET() {
    await dbConnect();

    try {
        const categories = await Category.find({}).sort({createdAt: -1});
    
        return NextResponse.json(categories);
    
      } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err._message }, { status: 500 });
      }
}
