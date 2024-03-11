// backend api (for tag)
// publicablely available for evevryone (for not logged user)

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from '@/models/tag';


// http://localhost:3000/api/tags

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
