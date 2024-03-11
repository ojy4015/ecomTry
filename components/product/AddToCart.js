"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart";
import Link from "next/link";

// 이 함수는 ProductCard안에 존재함
// 만약 product가 cart에 없으면 button만 보이고, product가 cart에 있으면 - input box + 가 보임
export default function AddToCart({ product, reviewAndCheckout = true }) {
  // access context
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  // 현재 이 product가 cartItems에 있는지
  const existingProduct = cartItems?.find((item) => item?._id === product?._id);

  const initialQuantity = existingProduct ? existingProduct?.quantity : 1; //만약 존재하지 않으면 1(default value)

  console.log("initialQuantity in ...", initialQuantity);
  const [quantity, setQuantity] = useState(initialQuantity); // quantity가 변할 때마다 화면에 보임

  console.log("quantity in state : ", quantity);

  // 각 product가 cartItmes에 있으면 quantity는 각product의 qnantity로 정하고 만약 없으면 1(default value)로
  useEffect(() => {
    setQuantity(existingProduct ? existingProduct?.quantity : 1);
  }, [existingProduct]);

  // 1만큼 증가
  const handleIncrement = () => {
    const newQunatity = quantity + 1;

    setQuantity(newQunatity);
    updateQuantity(product, newQunatity);
  };

  // 1만큼 감소
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQunatity = quantity - 1;
      setQuantity(newQunatity);
      updateQuantity(product, newQunatity);
    } else {
      removeFromCart(product?._id);
      setQuantity(1); // 우리가 보는 화면상의 qnantity는 항상 1이기 때문
    }
  };

  // 처음에 ADD TO CART버튼을 누를 때 실행
  const handleAddToCart = () => {
    addToCart(product, quantity); // ???
    console.log("product in handleAddToCart --> ", product);
    console.log("quantity in handleAddToCart --> ", quantity);
    console.log("cartItems in handleAddToCart --> ", cartItems);
  };

  // const changeQuantity = () => {
  //   if (quantity > 1) {
  //     setQuantity(quantity);
  //     updateQuantity(product, quantity);
  //   } else {
  //     removeFromCart(product?._id);
  //     setQuantity(1); // 우리가 보는 화면상의 qnantity는 항상 1이기 때문
  //   };
  // };

  //   The method Some will return true when at least one of the conditons needs to evaluate to ture.
  console.log("cartItems in return --> ", cartItems);
  return (
    <div>
      {cartItems?.some((item) => item?._id === product?._id) ? (
        <div className="input-group justify-content-center">
          <div className="input-group-prepend">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              type="number"
              className="form-control no-spin-arrows mx-5 text-center"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>

          {reviewAndCheckout && (<Link
            className="btn btn-outline-danger btn-raised btn-block mt-2"
            href="/cart"
          >
            Review & Checkout
          </Link>)}
        </div>
      ) : (
        <button
          className="btn btn-danger btn-raised btn-block"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
