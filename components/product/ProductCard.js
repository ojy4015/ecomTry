// for displaying each Product

import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ProductLike from "@/components/product/ProductLike";
import ProductRating from "@/components/product/ProductRating";
import Stars from "@/components/product/Stars";
import AddToCart from "@/components/product/AddToCart";

dayjs.extend(relativeTime); // .fromNow()

export default function ProductCard({ product }) {
  return (
    <div className="card my-3">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <Image
          // default image is in the public folder
          src={product?.images?.[0]?.secure_url || "/images/default.jpeg"}
          alt={product?.title}
          width={500}
          height={300}
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />
      </div>
      <div className="card-body">
        <Link href={`/product/${product?.slug}`}>
          <h5 className="card-title">
            <small>Title : </small> {product?.title}
          </h5>
        </Link>
        <samall>description : </samall>
        <div
          dangerouslySetInnerHTML={{
            __html:
              product?.description?.length > 160
                ? `${product?.description?.substring(0, 160)}...`
                : product?.description,
          }}
        />
      </div>
      <div className="alert alert-success mt-1">Price: ${product?.price?.toFixed(2)}</div>
      <div className="alert alert-primary">Brand: {product?.brand}</div>
      {/* before accessing category and tags, make sure .populate() is used in api routes and ref: 'Category' models are imported in `Product` model */}
      <div className="card-footer d-flex justify-content-between">
        <small>Category: {product?.category?.name}</small>
        <small>Tags: {product?.tags?.map((t) => t?.name).join(" ")}</small>
      </div>

      <div className="card-footer d-flex justify-content-between">
        {/* <small>💕 Likes</small> */}
        <ProductLike product={product} />
        <small>Posted {dayjs(product?.createdAt).fromNow()}</small>
      </div>
      <div className="card-footer d-flex justify-content-center align-items-center">
        <ProductRating product={product} leaveARating={false} />
      </div>
      <div className="card-footer d-flex justify-content-center align-items-center">
        <AddToCart product={product} />
      </div>
    </div>
  );
}
