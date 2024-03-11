// component (List All Products of certain page, only available for admin)

"use client";
import { useEffect } from "react";
import { useProduct } from "@/context/product";
import {
  useRouter,
  usePathname,
  userSearchParams,
  useSearchParams,
} from "next/navigation";

import Image from "next/image";

import Pagination from "@/components/product/Pagination";

export default function ProductList() {
  const {
    product,
    setProduct,
    products,
    setProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    updatingProduct,
    setUpdatingProduct,
    uploading,
    setUploading,
    uploadImages,
    deleteImage,
    createProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
  } = useProduct();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // for pagination (get value of 'page' from Url)
  const page = searchParams.get("page"); // http://localhost:3000/dashboard/admin/products?page=1

  // products will be fetched only after the component mounts
  useEffect(() => {
    fetchProducts(page);
  }, [page]); // called each time page changes

  // when you clicks, we first need to put this product in the context state as uptaing stae, and then it goes to "add product" page either to update or delete
  const handleClick = (product) => {
    setUpdatingProduct(product);
    router.push("/dashboard/admin/product");
  };

  return (
    // <div className="container my-5">
    //   <div className="row">
    //     <pre>{JSON.stringify(products, null, 4)}</pre>
    //     <pre>{JSON.stringify(currentPage, null, 4)}</pre>
    //     <pre>{JSON.stringify(totalPages, null, 4)}</pre>
    //   </div>
    // </div>

    <div className="container my-5">
      <div className="row gx-3">
        {products?.map((product) => (
          <div key={product?._id} className="col-lg-6 my-3">
            <div style={{ height: "200px", overflow: "hidden" }}>
              <Image
                // default image is in the public folder
                src={product?.images[0]?.secure_url || "/images/default.jpeg"}
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
              {/* when you clicks, we first need to put this product in the context state as uptaing stae, and then it goes to "add product" page either to update or delete */}
              <h5
                className="card-title pointer"
                onClick={() => handleClick(product)}
              >
                ${product?.price?.toFixed(2)} {product?.title}
              </h5>

              <p className="card-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      product?.description?.length > 160
                        ? `${product?.description?.substring(0, 160)}...`
                        : product?.description,
                  }}
                />
              </p>
            </div>
          </div>
        ))}
        <pre>{JSON.stringify(products, null, 4)}</pre>
      </div>

      {/* pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} pathname={pathname} />
    </div>
  );
}
