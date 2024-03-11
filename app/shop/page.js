'use client';
// Shop page for advance product filtering

// app/shop/page
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import toast from "react-hot-toast";
// import { useLocation } from "react-router-dom/dist";

// import {useLocation} from 'react-router-dom';

// to prevent default caching so that you can get instant page update whenever filtering options changes
export const dynamic = "force-dynamic";

// searchParams is a object (getProducts in shop page)

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams.page || 1,
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    ratings: searchParams.ratings || "",
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    brand: searchParams.brand || "",
  }).toString();

  // console.log("searchQuery in shop => ", searchQuery);
  // searchQuery in shop =>  page=1&minPrice=20&maxPrice=50&ratings=5&category=65af749979ebc932faa968e4&tag=65b64253c13dd08ee2d0fdba&brand=MANGOPOP+Store

  // make a fetch request (list products of certain page after filtering)
  try {
    const response = await fetch(`${process.env.API}/product/filters?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error(data?.err);
      throw new Error("Failed to fetch products after filtering");
    }

    const data = await response.json(); // array of filtered objects

    // console.log("data in shop ==> ", data);
    if (!data || !Array.isArray(data.products)) {
      throw new Error("No products returned");
    }
    return data;
  } catch (err) {
    console.log(err);
    // toast.error("Error filtering products");
    return { products: [], currentPage: 1, totalPages: 1 }; // default return value
  }
}

export default async function Shop({ searchParams }) {
// console.log("searchParams in shop page => ", searchParams);
// searchParams in shop page =>{minPrice: '20', maxPrice: '50', page: '1', category: '65af749979ebc932faa968e4', ratings: '4'}
// 문제 : page를 바꾸면 searchParms가 searchParams in shop page =>  {page: '2'}로 변함

  const { products, currentPage, totalPages } = await getProducts(searchParams);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 overflow-auto" style={{ maxHeight: "90vh" }}>
          <ProductFilter searchParams={searchParams} />
        </div>
        <div className="col-lg-9 overflow-auto" style={{ maxHeight: "90vh" }}>
          {/* displaying each products */}
          <h1 className="text-center fw-bold mt-3">
            <strong>Filtered Latest Products</strong>
          </h1>
          <div className="row">
            {products?.map((product) => (
              <div className=" col-lg-4">
                <ProductCard key={product?._id} product={product} />
              </div>
            ))}
          </div>

          {/* <pre>{JSON.stringify({products, currentPage, totalPages}, null, 4)}</pre> */}
          {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
          <br />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pathname="/shop"
            // search={search}
          />

        </div>
      </div>
    </div>
  );
}
