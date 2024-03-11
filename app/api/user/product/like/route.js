//  anyone who logged in can make likes or unlikes

// backend api (for likes) put

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

import { currentUser } from "@/utils/currentUser";

// need to know logged in user's id because when they like the product,
//  we are going to push that current user's ID to the likes array

// http://localhost:3000/api/user/product/like
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
        $addToSet: { likes: user._id }, // avoid duplicate( to prevent save same userID in the likes array more than once)
      },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.log("err in server: ", err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}

// http://localhost:3000/api/user/like
// return all the liked products of the current user
export async function GET(req) {
  await dbConnect();

  // excute this function whenever you need to know current user
  const user = await currentUser();

  // return all the liked products of the current user
  // if products likes array has current user ID,
  try {
    const likedProducts = await Product.findBy({ likes: user._id });
    return NextResponse.json(likedProducts);
  } catch (err) {
    console.log("err in server: ", err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
