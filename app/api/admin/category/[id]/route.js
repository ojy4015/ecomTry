// backend api

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";
import slugify from "slugify";

// update, you can access id from context
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { name } = body;

  try {
    const updatingCategory = await Category.findByIdAndUpdate(
      context.params.id,
      {
        ...body,
        slug: slugify(name),
      },
      { new: true }
    );

    return NextResponse.json(updatingCategory);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}

// delete
export async function DELETE(req, context) {
  await dbConnect();

  try {
  const deletingCategory = await Category.findByIdAndDelete(context.params.id);

    return NextResponse.json(deletingCategory);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
