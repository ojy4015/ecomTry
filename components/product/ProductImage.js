"use client";

import Image from "next/image";
import { useProduct } from "@/context/product";
import Modal from "@/components/Modal";

export default function ProductImage({ product }) {
  const {
    showImagePreviewModal,
    currentImagePreviewUrl,
    openModal,
  } = useProduct();

  const showImage = (src, title) => (
    <Image
      src={src}
      className="card-img-top"
      alt={title}
      width={500}
      height={300}
      style={{
        objectFit: "contain",
        height: "100%",
        width: "100%",
      }}
    />
  );

  return (
    <>
      {showImagePreviewModal && (
        // bootstrap modal(모달 창)
        // {children} : {showImage(currentImagePreviewUrl, product?.title)}
        <Modal>{showImage(currentImagePreviewUrl, product?.title)}</Modal>
      )}
      {/* 모든 이미지 보여줌 */}
      <div className="d-flex justify-content-center align-items-center">
        {product?.images?.length > 0 ? (
          <>
            {product?.images?.map((image) => (
              <div
                key={image?.public_id}
                style={{ height: "350px", overflow: "hidden" }}
                className="pointer"
                // 클릭하면 모달 창 띄움
                onClick={() => openModal(image?.secure_url)}
              >
                {/* to make it modal easier  */}
                {showImage(image?.secure_url, product?.title)}
              </div>
            ))}
          </>
        ) : (
          <>
            <div
              style={{ height: "350px", overflow: "hidden" }}
              className="pointer"
              onClick={() => openModal("/images/default.jpeg")}
            >
              {/* in case of no image, use default image, default image is in the public folder */}
              {showImage("/images/default.jpeg", product?.title)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
