"use client";

import ProductCard from "@/components/product/ProductCard";
import Head from "next/head";

import { Fragment, useEffect } from "react";
import toast from "react-hot-toast";

import { useProduct } from "@/context/product";
import { useSearchParams } from "next/navigation";

export default async function SearchProductsPage() {
  const {
    setProductSearchQuery,
    productSearchResults,
    setProductSearchReults,
  } = useProduct();

  // get search result on page reload
  // http://localhost:3000/api/search/products?productSearchQuery=macbook
  const productSearchParams = useSearchParams();
  const query = productSearchParams.get("productSearchQuery");

    // console.log("productSearchQuery => ", productSearchQuery);
  // productSearchQuery =>  dresses

  useEffect(() => {
    if (query) {
      setProductSearchQuery(query);
      fetchProductSearchResultsOnLoad(query);
    }
  }, [query]);

  // fetchproductResultsOnLoad after search function
  const fetchProductSearchResultsOnLoad = async (query) => {
    // if (e && e.preventDefault) { e.preventDefault(); }
    try {
      // GET http://localhost:3000/api/search/products?productSearchQuery=macbook 404 (Not Found)
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error(data?.err);
        throw new Error("Network response wan not ok for search results");
      } else {
        const data = await response.json(); // array of tag objects
        setProductSearchReults(data);

        // redirect product serarch result page
        // http://localhost:3000/search/products 로 redirect
        // we don't need this because we are already here(http://localhost:3000/search/products)
        //    router.push(`/search/products?productSearchQuery=${productSearchQuery}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Searching products");
    }
  };
  

  return (
    <Fragment>
      <Head>
        <title>Next Ecommerce</title>
        <meta name="description" content="Ecommerce Exercise" />
      </Head>
      <h1 className="text-center fw-bold mt-3">
        <strong>
          Search Results ({productSearchResults?.length} products)
        </strong>
      </h1>

      <div className="row">
        {productSearchResults?.map((product) => (
          <div className=" col-lg-4">
            <ProductCard key={product?._id} product={product} />
          </div>
        ))}
      </div>

      <pre>{JSON.stringify(productSearchResults, null, 4)}</pre>
    </Fragment>
  );
}
