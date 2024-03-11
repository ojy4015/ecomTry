// Likes function frontEnd
"use client";

import { useState } from "react";
// The useSession() hook provides access to the current user's Session object, as well as helpers for setting the active session.
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
// usePathname is a Client Component hook that lets you read the current URL's pathname.
import { useRouter, usePathname } from "next/navigation";

export default function ProductLike({ product }) {
  const { data, status } = useSession();

  const [likes, setLikes] = useState(product?.likes); // array

  const router = useRouter();
  const pathname = usePathname(); // save current path

  // if likes array contains user._id
  const isLiked = likes?.includes(data?.user?._id);

  const handleLike = async () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to make like");
      router.push(`/login/?callbackUrl=${pathname}`); // redirect to login page, after log in comeback to this page
      return;
    }

    try {
      // if logged in user already made like click
      if (isLiked) {
        const answer = window.confirm("Are you sure to unlike?");
        if (answer) {
          handleUnlike();
        }
      } else {
        // if logged in user didn't make like click
        const response = await fetch(`${process.env.API}/user/product/like`, {
          method: "PUT",
          body: JSON.stringify({ productID: product?._id }),
        });

        if (!response.ok) {
          throw new Error("Failed to like");
        } else {
          const data = await response.json();
          setLikes(data?.likes);
          toast.success("Product liked");
          router.refresh();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to like");
    }
  };

  const handleUnlike = async () => {
    try {
      // if logged in user already made like click

      const response = await fetch(`${process.env.API}/user/product/unlike`, {
        method: "PUT",
        body: JSON.stringify({ productID: product?._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to unlike");
      } else {
        const data = await response.json();
        setLikes(data?.likes);
        toast.success("Product unliked");
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to unlike");
    }
  };

  return (
    <small className="pointer">
      {!likes?.length ? (
        <>
          <span onClick={handleLike}>💓 Be the first person to like</span>
        </>
      ) : (
        <>
          <span onClick={handleLike}>💓 {likes?.length} people liked</span>
        </>
      )}
    </small>
  );
}
