// modal component

"use client";

import { useProduct } from "@/context/product";

// {children} : {showImage(currentImagePreviewUrl, product?.title)}
export default function Modal({ children }) {
  const {product, closeModal } = useProduct();
  return (
    <>
      {/* bootstrap modal */}
      <div className="modal fade show" style={{ display: "block" }}>
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          style={{ height: "calc(100% - 60px)" }}
        >
          <div
            className="modal-content"
            style={{ height: "calc(100% - 60px)" }}
          >
            <div className="modal-header text-center">
              <h5 className="modal-title w-100"> {product?.title} </h5>
            </div>
            <div className="modal-body overflow-auto">
              {/* {showImage(currentImagePreviewUrl, product?.title)} */}
              {children}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
