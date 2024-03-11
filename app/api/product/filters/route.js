// backend api (for filtered Products of certain page), publicly available
// http://localhost:3000/api/product/filters

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import queryString from "query-string";
import { calculateAverageRating } from "@/utils/helpers";

// http://localhost:3000/api/product/filters?page=3&...
// list  // fetch(`${process.env.API}/product/filters?page=${page}&...` (in context)
export async function GET(req) {
  await dbConnect();

  // parse query params from the req url
  const searchParams = queryString.parseUrl(req.url).query;

  // destructure query searchParams otherwise empty object
  const { page, minPrice, maxPrice, ratings, category, tag, brand } =
    searchParams || {};
  // console.log("searchParams in filter api --> ",searchParams);
  // searchParams in filter api -->  [Object: null prototype] {
  //   brand: '',
  //   category: '',
  //   maxPrice: '50',
  //   minPrice: '20',
  //   page: '1',
  //   ratings: '',
  //   tag: ''
  // }
  const pageSize = process.env.PAGESIZE;

  // initialize an empty filter object
  const filter = {};

  // apply filters based on query params
  if (category) {
    filter.category = category;
  }
  if (tag) {
    filter.tags = tag;
  }
  if (brand) {
    filter.brand = brand;
  }
  if (minPrice && maxPrice) {
    filter.price = {
      $gte: minPrice,
      $lte: maxPrice,
    };
  }

  try {
    // determine the current page and calculate the skip value for pagination
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // retrieve all filtered propducts based on the applied filters(price, category, tag, brand)
    const filteredProducts = await Product.find(filter)
      .populate("category", "name slug") // id is automatically included, we do this because we only know category id
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    // calculate average rating for each product of the filteredProducts
    const filteredProductsWithAverageRating = filteredProducts.map(
      (product) => ({
        ...product.toObject(),
        // add the averageRating property to each product because model doesn't have averageRating
        averageRating: calculateAverageRating(product.ratings),
      })
    );

    // filter products based on the ratings query param (from the frontEnd)
    const ratingFilteredProducts = filteredProductsWithAverageRating.filter((product) => {
      if (!ratings) {
        return true; // no rating filter applied
      }

      const targetRating = Number(ratings);

      const difference = product.averageRating - targetRating;
      // console.log("difference ----> ", difference);
      // rating = 1 : averageRating =[0 to 1.5]
      // rating = 2 : averageRating =[1.5 to 2.5]
      // rating = 3 : averageRating =[2.5 to 3.5]
      // rating = 4 : averageRating =[3.5 to 4.5]
      // rating = 5 : averageRating =[4.5 to 5]
      return difference >= -0.5 && difference <= 0.5;
    });

    // total ratingFilteredProducts
    const totalRatingFilteredProducts = ratingFilteredProducts.length;

    // apply pagination to ratingFilteredProducts
    const paginatedProducts = ratingFilteredProducts.slice(
      skip,
      skip + pageSize
    );

    // return the paginated prduct data as json
    return NextResponse.json(
      {
        products: paginatedProducts,
        currentPage,
        totalPages: Math.ceil(totalRatingFilteredProducts / pageSize),
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(
      "filter products after applying minPrice, maxPrice, category, tag, brand err => ",
      err
    );
    return NextResponse.json({ err: err._message }, { status: 500 });
  }
}
