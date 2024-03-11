//  anyone who logged in can make likes or unlikes

// backend api (for unlikes) put

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

import { currentUser } from "@/utils/currentUser";

// need to know logged in user's id because when they unlike the product,
//  we are going to take that current user's ID from the likes array

// http://localhost:3000/api/user/product/unlike
// update likes
export async function PUT(req) {
  await dbConnect();

  // excute this function whenever you need to know current user
  const user = await currentUser();

  // you need to send the product ID from frontend
  const { productID } = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(
      productID,
      {
        $pull: { likes: user._id }, // avoid duplicate( to prevent take same userID from the likes array more than once)
      },
      { new: true }
    );
    return NextResponse.json(updated);

  } catch (err) {
    console.log("err in server: ", err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
