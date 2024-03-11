import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";
import Head from "next/head";
import { Fragment } from "react";
import toast from "react-hot-toast";

// hard coded meta data
export const metadata = {
  title: "Next Ecommerce",
  description: "Find the latest in fashion, electonics, and more",
}

// server side rendering( Next.js will pre-render this page at build time)
export default async function HomePage({ searchParams }) {
  // console.log("searchParams in homePage => ", searchParams);

  // http://localhost:3000/?page=2 ---> searchParams ==>  { page: '2' }
  // http://localhost:3000 ---> searchParams ==>  {}

  // const data = await getProducts(searchParams);
  const { products, currentPage, totalPages } = await getProducts(searchParams);
  // console.log(data);

  return (
    <Fragment>
      {/* <Head>
        <title>Next Ecommerce</title>
        <meta name="description" content="Ecommerce Exercise" />
      </Head> */}
      <h1 className="text-center fw-bold mt-3">
        <strong>Latest Products</strong>
      </h1>
      <div className="row">
        {products?.map((product) => (
          <div className=" col-lg-4">
            <ProductCard key={product?._id} product={product} />
          </div>
        ))}
      </div>

      <pre>{JSON.stringify(products, null, 4)}</pre>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/"
      />
    </Fragment>
  );
}

// getProducts in homepage
async function getProducts(searchParams) {
  // searchParams ==>  { page: '2' }
  const searchQuery = new URLSearchParams({
    page: searchParams?.page || 1, // get page from searchParams or page = 1,
  }).toString();
  // console.log("searchQuery ==> ", searchQuery);
  // http://localhost:3000/?page=2 ---> searchQuery ==>  page=2
  // http://localhost:3000 ---> searchQuery ==>  page=1

  try {
    const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 1 }, // updated every 1 second
    });

    const data = await response.json(); // array of tag objects

    if (!response.ok) {
      toast.error(data?.err);
    } else {
      return data;
      // setProducts(data.products);
      // setCurrentPage(data.currentPage);
      // setTotalPages(data.totalPages);
    }
  } catch (err) {
    console.log(err);
    toast.error("Error listing products");
  }
}
