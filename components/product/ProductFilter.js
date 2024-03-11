"use client";

import { priceRanges } from "@/utils/filterData";
// Link component can easily push the searchParams to the url
// http://localhost:3000/shop?minPrice=100&maxPrice=200&page=1
//                   pathname?query
import Link from "next/link";
import { useRouter } from "next/navigation";
import Stars from "@/components/product/Stars";

import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";
import { useEffect } from "react";
import { useProduct } from "@/context/product";

import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ProductFilter({ searchParams }) {
  const pathname = "/shop";
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;

  // console.log(
  //   "minPrice, maxPrice, ratings, category, tag, brand in ProductFilter:",
  //   minPrice,
  //   maxPrice,
  //   ratings,
  //   category,
  //   tag,
  //   brand
  // );

  // context for category
  const {
    // name,
    // setName,
    categories,
    fetchCategoriesPublic,
  } = useCategory();

  // context for tag
  const { tags, fetchTagsPublic } = useTag();

  // context for product
  const { brands, fetchBrands } = useProduct();

  // categories, tags 가져옴, for anyone including not logged user
  useEffect(() => {
    fetchCategoriesPublic();
    fetchTagsPublic();
    fetchBrands();
  }, []);

  const router = useRouter();
  const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill";
  const button = "btn btn-raised mx-1 rounded-pill";

  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };

    // if filterName is string
    // if (typeof filterName === "string") {
    //   delete updatedSearchParams[filterName];
    // }

    // if filterName is array
    // if (Array.isArray(filterName)) {
    //   filterName?.forEach((name) => {
    //     delete updatedSearchParams[name];
    //   });
    // }

    // filterName should be always array
    filterName?.forEach((name) => {
      delete updatedSearchParams[name];
    });

    // reset page to 1 when applying new filtering options
    updatedSearchParams.page = 1;

    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;

    router.push(newUrl);
  };

  return (
    <div className="mb-5">
      <p className="lead">Filter Products</p>

      <Link className="text-danger" href="/shop">
        Clear All Filters
      </Link>

      <p className="mt-4 alert alert-primary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges?.map((range) => {
          const url = {
            pathname,
            query: {
              ...searchParams,
              minPrice: range?.min,
              maxPrice: range?.max,
              page: 1,
            },
          };

          const isActive =
            minPrice === String(range?.min) && maxPrice === String(range?.max);
          //   console.log("isActive = ", isActive);

          return (
            <div key={range?.index}>
              <Link
                href={url}
                className={isActive ? activeButton : button}
                style={{ height: "30px", width: "180px" }}
              >
                {range?.label}
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                  className="pointer"
                >
                  <IoIosCloseCircleOutline />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 alert alert-primary">Ratings</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1].map((ratingValue) => {
          const isActive = String(ratings) === String(ratingValue);
          //  console.log("star isActive = ", isActive);

          const url = {
            pathname,
            query: {
              ...searchParams,
              ratings: ratingValue,
              page: 1,
            },
          };

          return (
            <div key={ratingValue}>
              <Link
                href={url}
                className={isActive ? activeButton : button}
                style={{ height: "30px", width: "180px" }}
              >
                <Stars rating={ratingValue} />
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["ratings"])}
                  className="pointer"
                >
                  <IoIosCloseCircleOutline />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 alert alert-primary">Categories</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {categories?.map((c) => {
          const isActive = category === c._id;

          const url = {
            pathname,
            query: {
              ...searchParams,
              category: c?._id,
              page: 1,
            },
          };

          return (
            <div key={c?._id}>
              <Link
                href={url}
                className={isActive ? activeButton : button}
                style={{ height: "30px", width: "180px" }}
              >
                {c?.name}
              </Link>
              {isActive && (
                <span
                  onClick={() => {
                    handleRemoveFilter(["category", "tag"]);
                  }}
                  className="pointer"
                >
                  <IoIosCloseCircleOutline />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {category && (
        <>
          <p className="mt-4 alert alert-primary">Tags</p>
          <div className="row d-flex align-items-center mx-1 filter-scroll">
            {tags
              ?.filter((t) => t?.parentCategory === category)
              ?.map((t) => {
                const isActive = tag === t._id;

                const url = {
                  pathname,
                  query: {
                    ...searchParams,
                    tag: t?._id,
                    page: 1,
                  },
                };

                return (
                  <div key={t?._id}>
                    <Link
                      href={url}
                      className={isActive ? activeButton : button}
                      style={{ height: "30px", width: "180px" }}
                    >
                      {t?.name}
                    </Link>
                    {isActive && (
                      <span
                        onClick={() => handleRemoveFilter(["tag"])}
                        className="pointer"
                      >
                        <IoIosCloseCircleOutline />
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}

      <p className="mt-4 alert alert-primary">Brands</p>
      <div className="row d-flex align-items-center mx-1">
        {brands?.map((b) => {
          const isActive = brand === b;
          const url = {
            pathname,
            query: {
              ...searchParams,
              brand: b,
              page: 1,
            },
          };

          return (
            <div key={b}>
              <Link
                href={url}
                className={isActive ? activeButton : button}
                style={{ height: "30px", width: "180px" }}
              >
                {b}
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["brand"])}
                  className="pointer"
                >
                  <IoIosCloseCircleOutline />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
