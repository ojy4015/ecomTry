// backend api (for Product) update and delete

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import slugify from "slugify";

// fetch(`${process.env.API}/admin/product/${updatingProduct?._id}`
// update, you can access id from context
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  // body in PUT :  {
  //   _id: '65b20f302712c10671fb4e4d',
  //   name: 'skirts3333',
  //   slug: 'skirts',
  //   parentCategory: '65af749979ebc932faa968e4',
  //   createdAt: '2024-01-25T07:35:12.731Z',
  //   updatedAt: '2024-01-25T07:35:12.731Z',
  //   __v: 0
  // }
  
  // console.log("body in PUT : ", body);
  // return;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      context.params.id,
      {
        ...body,
        slug: slugify(body.title),
      },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}

// delete
export async function DELETE(req, context) {
  await dbConnect();

  try {
  const deletedProduct = await Product.findByIdAndDelete(context.params.id);
    return NextResponse.json(deletedProduct);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
