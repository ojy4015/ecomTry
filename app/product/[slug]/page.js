// frontend page for each signle prouct view(depending on the slug)
// server rendered page

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductImage from "@/components/product/ProductImage";
import ProductLike from "@/components/product/ProductLike";
import ProductRating from "@/components/product/ProductRating";
// import ProductRating from "@/components/product/ProductRating";
import UserReviews from "@/components/product/UserReviews";

import AddToCart from "@/components/product/AddToCart";

// import CouponCode from "@/components/product/CouponCode";
// import AddToCart from "@/components/product/AddToCart";

// server rendered page
// export async function generateMetadata({ params }) {
//   const product = await getProduct(params?.slug);

//   return {
//     title: product?.title,
//     description: product?.description?.substring(0, 160),
//     openGraph: {
//       images: product?.images[0]?.secure_url,
//     },
//   };
// }

dayjs.extend(relativeTime);

// dynamic meta data
export async function generateMetadata({ params }) {
  const product = await getProduct(params?.slug);

  return {
    title: product?.title,
    description: product?.description?.substring(0, 160),
    openGraph: {
      images: product?.images[0]?.secure_url,
    },
  };
}

async function getProduct(slug) {
  // http://localhost:3000/api/product/slug
  const response = await fetch(`${process.env.API}/product/${slug}`, {
    method: "GET",
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();
  return data;
}

export default async function ProductViewPage({ params }) {
  const product = await getProduct(params?.slug);

  return (
    <>
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 card py-5">
            <h1 className="text-center">{product?.title}</h1>
            {/* <CouponCode product={product} /> */}
            {/* show product images in modal */}
            <ProductImage product={product} />
            <div className="card-body">
              <div
                dangerouslySetInnerHTML={{
                  // replace . with .<br><br>
                  __html: product?.description.replace(/\./g, ".<br><br>"),
                }}
              />

              <div className="alert alert-primary mt-4">
                Brand: {product?.brand}
              </div>
            </div>
            {/* before accessing category and tags, make sure .populate() is used in api routes and ref: 'Category' models are imported in `Product` model */}
            <div className="card-footer d-flex justify-content-between">
              <small>Category: {product?.category?.name}</small>
              <small>
                Tags: {product?.tags?.map((t) => t?.name).join(" ")}
              </small>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <ProductLike product={product} />
              <small>Posted {dayjs(product?.createdAt).fromNow()}</small>
            </div>
            <div className="card-footer">
              <ProductRating product={product} />
            </div>
            <div className="card-footer d-flex justify-content-center align-items-center">
              <AddToCart product={product} />
            </div>

            {/* <div className="card-footer">
            <ProductRating product={product} />

            <div className="my-3">
              <AddToCart product={product} />
            </div>
          </div> */}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h4 className="text-center my-5">Related Products</h4>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 offset-lg-2 my-5">
            <UserReviews reviews={product?.ratings} />
          </div>
        </div>
      </div>

      <pre>{JSON.stringify(product, null, 4)}</pre>
    </>
  );
}

//----------------------------------------------------------------------

// frontend page for each prouct view (depending on the slug)
// server rendered page

// async function getProduct(slug) {
//     // http://localhost:3000/api/product/slug
//   const response = await fetch(`${process.env.API}/product/${slug}`, {
//     method: "GET",
//     next: { revalidate: 1 },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   const data = await response.json();
//   return data;
// }

// // http://localhost:3000/api/product/slug
// export default async function ProductViewPage({ params }) {
//   const product = await getProduct(params?.slug);

//   return (
//     <div className="container my-4">
//       <div className="row">
//         <div className="col-log-8 offset-lg-2">
//         {/* http://localhost:3000/product/levi's-women's-low-pro-jeans */}
//         {/* params?.slug ==> levi's-women's-low-pro-jeans   */}
//             {/* <h1 className="text-center">{params?.slug}</h1> */}
//             {/* <h1 className="text-center">{JSON.stringify(product, null, 4)}</h1> */}

//         </div>
//       </div>

//       {/* <div className="row">
//         <div className="col">
//           <h4 className="text-center my-5">Related Products</h4>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-lg-8 offset-lg-2 my-5">
//           <UserReviews reviews={product?.ratings} />
//         </div>
//       </div> */}
//     </div>
//   );
// }
