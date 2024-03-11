// backend api for categories
// publicablely available for evevryone (for not logged user)

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from '@/models/category';


// http://localhost:3000/api/categories

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
