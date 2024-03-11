// when user clicks stars, show modal window for input comment and give rating

"use client";

import Stars from "@/components/product/Stars";
import { calculateAverageRating } from "@/utils/helpers";

import Image from "next/image";
import { useProduct } from "@/context/product";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// usePathname is a Client Component hook that lets you read the current URL's pathname.
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductRating({ product, leaveARating = true }) {
  const {
    showRatingModal,
    setShowRatingModal,
    currentRating,
    setCurrentRating,
    comment,
    setComment,
  } = useProduct();

  // if product has ratings array from multiple users already then assign them,
  //  otherwise it is empty array
  const [productRatings, setProductRatings] = useState(product?.ratings || []);

  // update averageRating using useEffect
  const [averageRating, setAverageRating] = useState(0);

  // get current user
  const { data, status } = useSession();

  const router = useRouter();
  const pathname = usePathname(); // save current path

  // if current user already left rating, then allow him to update the rating
  // and show his existing rating (test in frontEnd)
  const alreadyRated = productRatings?.find(
    (rate) => rate?.postedBy?.toString() === data?.user?._id.toString()
  );

  // console.log("alreadyRated : ", alreadyRated);

  // {rating: 5, comment: 'wonderful', postedBy: '65a8a5a4fc1795ff1d33061c', _id: '65cdad156210e1fc86a8555d', createdAt: '2024-02-15T06:20:05.181Z', …}
  // alreadyRated is a object in ratings array of single product :
  // {
  //     rating: {
  //         type: Number,
  //         min: 1,
  //         max: 5,
  //     },
  //     comment: {
  //         type: String,
  //         maxlength: 200,
  //     },
  //     postedBy: {
  //       type: mongoose.Schema.Types.ObjectId, // string
  //       ref: "User",
  //     },
  //   }

  // if current user already left rating, update current user's currentRating and comment state
  useEffect(() => {
    if (alreadyRated) {
      setCurrentRating(alreadyRated?.rating);
      setComment(alreadyRated?.comment);
    } else {
      // otherwise it is default
      setCurrentRating(0);
      setComment("");
    }
  }, [alreadyRated]);

  // to get average rating
  useEffect(() => {
    if (productRatings) {
      const average = calculateAverageRating(productRatings);
      setAverageRating(average);
    }
  }, [product?.ratings]);

  // currentRating, comment를 backend로 보냄
  const submitRating = async () => {
    // if current user not logged in send him to log in page
    if (status !== "authenticated") {
      toast.error("Please sign in to make rating");
      router.push(`/login/?callbackUrl=${pathname}`); // redirect to login page, after log in comeback to this page
      return;
    }

    try {
      // if logged in user already made rating
      // if (isLiked) {
      //   const answer = window.confirm("Are you sure to unlike?");
      //   if (answer) {
      //     handleUnlike();
      //   }
      // } else {

      // if logged in user didn't make rating yet
      const response = await fetch(`${process.env.API}/user/product/rating`, {
        method: "POST",
        body: JSON.stringify({
          productID: product?._id,
          rating: currentRating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to leave a rating");
      } else {
        const data = await response.json();
        // console.log("data.division : ", data.division);
        setProductRatings(data?.ratings);
        setShowRatingModal(false);
        toast.success("Thanks for leaving a rating");
        router.refresh();
      }
      // }
    } catch (err) {
      console.log(err);
      toast.error("Failed to leave a rating");
    }
  };

  // to convert NaN to 0, 소수점 아래 첫째 자리까지 표시
  let num = Math.round(averageRating * 10) / 10;
  if (isNaN(num)) num = 0;

  return (
    <div className="d-flex justify-content-between">
      <div>
        <Stars rating={averageRating} />
        <small className="text-muted">{`(${num}) from ${productRatings?.length} reviews`}</small>
      </div>
      {/* leaveARating이 true 이고 클릭하면 모달 창 띄움 */}
      {leaveARating && (
        <small onClick={() => setShowRatingModal(true)} className="pointer">
          {alreadyRated ? "update your rating" : "leave a rating"}
        </small>
      )}
      {showRatingModal && (
        // bootstrap modal(모달 창)
        // <Modal>{children}</Modal>
        <Modal>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Write a review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/* display five star */}
          <div className="pointer">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className={
                    ratingValue <= currentRating ? "star-active lead" : "lead"
                  }
                  onClick={() => setCurrentRating(ratingValue)}
                >
                  {ratingValue <= currentRating ? <FaStar /> : <FaRegStar />}
                </span>
              );
            })}
          </div>
          <button
            onClick={submitRating}
            className="btn btn-primary btn-raised my-3"
          >
            Submit
          </button>
        </Modal>
      )}
    </div>
  );
}
