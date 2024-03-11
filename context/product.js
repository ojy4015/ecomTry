// frontend for Product (resize images and send back to the backend get result from backend)

"use client";

import { useState, createContext, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // state
  // to create product
  const [product, setProduct] = useState(null); // object

  // for fetching all products coming from db
  const [products, setProducts] = useState([]); // array of objects

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // to update and delete
  const [updatingProduct, setUpdatingProduct] = useState(null); // object
  // const [updatingProduct, setUpdatingProduct] = useState({
  //   title: "Test suit",
  //   category: {
  //     _id: "65af74e179ebc932faa968ef",
  //     name: "Kid's Fashion",
  //   },
  // });
  const [uploading, setUploading] = useState(false);

  // const [updatingTag, setUpdatingTag] = useState({
  //   _id: "kdjkjajslgj",
  //   name: "ties",
  //   parentCategory: "Men's Wear"
  // }); // object

  // for displaying product image in modal window
  // use bootstarp modal
  // when image is clicked, showImagePreviewModal state is changed.
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  // when showImagePreviewModal is true, currentImagePreviewUrl is displayed in modal
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

  // for rating system
  // use bootstarp modal
  // when image is clicked, showImagePreviewModal state is changed.
  // when showRatingModal is true, currentRating and comment is displayed in modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0); // currentRating is a current user's rating about a single product
  const [comment, setComment] = useState(""); // comment is a current user's comment about a single product

  // brands
// for fetching all brands coming from db
const [brands, setBrands] = useState([]); // array of objects

// text based search in frontend
const [productSearchQuery, setProductSearchQuery] = useState("");

// result from backend for text based search
const [productSearchResults, setProductSearchReults] = useState([]);

  useEffect(() => {
    // close modal on clicks on the page(oustide of modal)
    window.addEventListener("click", handleClickOutside);
    return () => {
      // clear EventListener
      window.removeEventListener("click", handleClickOutside);
    };

    function handleClickOutside(event) {
      if (event.target.classList.contains("modal")) {
        closeModal();
      }
    }
  }, []);

  // to display image in modal
  const openModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
  };

  // to close image in modal
  const closeModal = (url) => {
    setShowImagePreviewModal(false);
    setCurrentImagePreviewUrl("");
    setShowRatingModal(false);
  };

  // hooks(resize the image and send to the backend)
  const router = useRouter();

  const uploadImages = (e) => {
    // console.log(e.target.files);

    const files = e.target.files;
    // console.log(files);

    let allUploadedFiles = updatingProduct
      ? updatingProduct?.images || []
      : product
      ? product?.images || []
      : [];

    // console.log("allUploadedFiles : ", allUploadedFiles);

    if (files) {
      // check if the total combined images(allUploadedFiles + files.length) exceed 4
      const totalImages = allUploadedFiles?.length + files?.length;
      if (totalImages > 4) {
        toast.error("You can upload maximum 4 images");
        return;
      }

      setUploading(true);
      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const promise = new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            1280,
            720,
            "JPEG",
            100,
            0,
            // api call to the backend // Is the callBack function of the resized new image URI.
            (uri) => {
              fetch(`${process.env.API}/admin/upload/image`, {
                method: "POST",
                body: JSON.stringify({ image: uri }),
              })
                .then((response) => response.json())
                .then((data) => {
                  allUploadedFiles.unshift(data); // latest image comes first
                  console.log("data => ", data);
                  console.log(
                    "allUploadedFiles.unshift(data) : ",
                    allUploadedFiles
                  );
                  resolve(); // successful
                })
                .catch((err) => {
                  console.log("image upload err => ", err);
                  resolve();
                });
            },
            "base64"
          );
        });
        uploadPromises.push(promise);
        // console.log("uploadPromises : ", uploadPromises);
      }

      Promise.all(uploadPromises)
        .then(() => {
          updatingProduct
            ? setUpdatingProduct({
                ...updatingProduct,
                images: allUploadedFiles,
              })
            : setProduct({ ...product, images: allUploadedFiles });
          setUploading(false);
        })
        .catch((err) => {
          console.log("image upload err => ", err);
          setUploading(false);
        });
    }
  };

  const deleteImage = (public_id) => {
    setUploading(true);
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredImages = updatingProduct
          ? updatingProduct?.images?.filter(
              (image) => image?.public_id !== public_id
            )
          : product?.images?.filter((image) => image?.public_id !== public_id);

        updatingProduct
          ? setUpdatingProduct({ ...updatingProduct, images: filteredImages })
          : setProduct({ ...product, images: filteredImages });
      })
      .catch((err) => {
        console.log("image delete err => ", err);
      })
      .finally(() => setUploading(false));
  };

  // create function out of  crud functions
  const createProduct = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      // console.log("created data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data?.title}" created.`);
        setProducts([data, ...products]); // array of tag object
        setProduct(null);

        // router.push("/dashboard/admin/product"); // to see the list of products
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      toast.error("Create Product failed. Try again.");
    }
  };

  // (list products of certain page) function
  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // array of tag objects

      if (!response.ok) {
        toast.error(data?.err);
      } else {
        setProducts(data.products);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error listing products");
    }
  };

  const fetchBrands = async () => {
    try {

      const response = await fetch(`${process.env.API}/product/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // array of brands objects

      if (!response.ok) {
        toast.error(data);
      } else {
        setBrands(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating brands");
    }  
  };

  // update product function
  const updateProduct = async () => {
    try {
      // can get id from updatingTag in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingProduct),
        }
      );

      const data = await response.json();
      // console.log("deleted data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data?.title}" is updated`);
        // list updated category names
        // fetchCategories();

        // another way of listing updated category names
        setProducts(
          products.map((p) => (p._id === updatingProduct._id ? data : p))
        );
        setUpdatingProduct(null);
        // router.push("/dashboard/admin/products");
        router.back();
      }
    } catch (err) {
      console.log(err);
      toast.error("Update product failed. Try again.");
    }
  };

  // delete product function
  const deleteProduct = async () => {
    try {
      // can get id from updatingProduct in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      // console.log("data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data.title}" deleted`);
        setUpdatingProduct(null);
        // listing updated product names
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== updatingProduct._id)
        );
        router.back();
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete product failed. Try again.");
    }
  };

 // fetchproductResults after search function
 const fetchProductSearchResults = async (e) => {
  //  if (e && e.preventDefault) { e.preventDefault(); }
   e.preventDefault();
   try {
    // GET http://localhost:3000/api/search/products?productSearchQuery=macbook 404 (Not Found)
    const response = await fetch(`${process.env.API}/search/products?productSearchQuery=${productSearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
   
    if (!response.ok) {
      toast.error(data?.err);
      throw new Error("Network response wan not ok for search results");
    } else {
      const data = await response.json(); // array of tag objects
      setProductSearchReults(data);

      // redirect product serarch result page
      // http://localhost:3000/search/products 로 redirect
      router.push(`/search/products?productSearchQuery=${productSearchQuery}`);
    }
  } catch (err) {
    console.log(err);
    toast.error("Error Searching products");
  }
};

// searchParams is a object (getProducts in shop page)
// async function getProducts(searchParams) {
//   const searchQuery = new URLSearchParams({
//     page: searchParams.page || 1,
//     minPrice: searchParams.minPrice || "",
//     maxPrice: searchParams.maxPrice || "",
//     ratings: searchParams.ratings || "",
//     category: searchParams.category || "",
//     tag: searchParams.tag || "",
//     brand: searchParams.brand || "",
//   }).toString();

//   // console.log("searchQuery in shop => ", searchQuery);
//   // searchQuery in shop =>  page=1&minPrice=20&maxPrice=50&ratings=5&category=65af749979ebc932faa968e4&tag=65b64253c13dd08ee2d0fdba&brand=MANGOPOP+Store

//   // make a fetch request (list products of certain page after filtering)
//   try {
//     const response = await fetch(`${process.env.API}/product/filters?${searchQuery}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       toast.error(data?.err);
//       throw new Error("Failed to fetch products after filtering");
//     }

//     const data = await response.json(); // array of filtered objects

//     // console.log("data in shop ==> ", data);
//     if (!data || !Array.isArray(data.products)) {
//       throw new Error("No products returned");
//     }
//     return data;
//   } catch (err) {
//     console.log(err);
//     // toast.error("Error filtering products");
//     return { products: [], currentPage: 1, totalPages: 1 }; // default return value
//   }
// }

  return (
    <ProductContext.Provider
      value={{
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

        showImagePreviewModal,
        setShowImagePreviewModal,
        currentImagePreviewUrl,
        setCurrentImagePreviewUrl,
        openModal,
        closeModal,

        showRatingModal,
        setShowRatingModal,
        currentRating,
        setCurrentRating,
        comment,
        setComment,
        brands,
        fetchBrands,

        productSearchQuery,
        setProductSearchQuery,
        productSearchResults,
        setProductSearchReults,
        fetchProductSearchResults,
        // getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);

// const {
//     product,
//     setProduct,
//     products,
//     setProducts,
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     setTotalPages,
//     updatingProduct,
//     setUpdatingProduct,
//     uploading,
//     setUploading,
//     uploadImages,
//     deleteImage,
//     createProduct,
//     fetchProducts,
//     updateProduct,
//     deleteProduct,
//     showImagePreviewModal,
//     setShowImagePreviewModal,
//     currentImagePreviewUrl,
//     setCurrentImagePreviewUrl,
//     openModal,
//     closeModal,
//     showRatingModal,
//     setShowRatingModal,
//     currentRating,
//     setCurrentRating,
//     comment,
//     setComment,
//     brands,
//     fetchBrands,
//     productSearchQuery,
//     setProductSearchQuery,
//     productSearchResults,
//     setProductSearchReults,
//     fetchProductSearchResults,
// } = useProduct();

// // ---------------------------------------------------------------------------
