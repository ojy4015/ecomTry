// backend api (for tag)
// available for logged user only

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from '@/models/tag';
import slugify from "slugify";


// http://localhost:3000/api/admin/tag
// create
export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    // console.log("body in POST : ", body);
    // return;
    const {name, parentCategory} = body; // parentCategory is a id, parent is a reserved word of NextJS

    try {
        const tag = await Tag.create({
          name,
          parentCategory,
          slug: slugify(name),
        });
    
        return NextResponse.json(tag);
    
      } catch (err) {
        console.log("err in server: ",err);
        return NextResponse.json({ err: err._message }, { status: 500 });
      }
}

// list
export async function GET() {
    await dbConnect();
  

    try {
        const tags = await Tag.find({}).sort({createdAt: -1}); 
    
        return NextResponse.json(tags); // array of tag objects
    
      } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err._message }, { status: 500 });
      }
}
