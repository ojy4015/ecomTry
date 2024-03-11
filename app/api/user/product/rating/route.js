//  anyone who logged in and purchased item can make rating

// backend api (for rating) post

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

// import Order from "@/models/Order";

import { currentUser } from "@/utils/currentUser";

// need to know logged in user's id because when they leave a rating the product,
//  we are going to push that current user's ID to the likes array

// http://localhost:3000/api/user/product/rating
// record rating
export async function POST(req) {
  await dbConnect();

  // excute this function whenever you need to know current user
  const user = await currentUser();

  // you need to send the roductID, rating, comment(of logged in user) from frontend
  const body = await req.json();
  const { productID, rating, comment } = body;

  try {
    const product = await Product.findById(productID);

    // check if user has alrady left a rating(test in backEnd)
    const existingRating = product.ratings.find(
      (rate) => rate.postedBy.toString() === user._id.toString()
    );

    // existingRating: prodcut안의 ratings 배열안에 있는 user가 이미 만든 single object {rating, comment, prostedBy}

    // check if the user has purchased the product

    // if user has alrady left a rating then update it
    if (existingRating) {
      // update the existing rating and comment
      existingRating.rating = rating;
      existingRating.comment = comment;
      await product.save();
      return NextResponse.json(product);
    }
    // if the user has not alredady rated, add a new rating
    product.ratings.push({
      rating,
      comment,
      postedBy: user._id,
    });
    const updated = await product.save();
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
