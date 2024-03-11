import Stars from "@/components/product/Stars";

export default function UserReviews({ reviews }) {
  return (
    <>
      {reviews?.length > 0 ? (
        <>
          <div class="d-flex justify-content-center">
            <strong>Reviews</strong>
          </div>
          <ul class="list-group mt-4 bg-white">
            {reviews?.map((review) => (
              <li key={review._id} class="list-group-item mb-1">
                <div class="d-flex-row">
                  <div class="d-flex justify-content-between">
                    <div>
                      <strong>{review?.postedBy?.name}</strong>
                    </div>
                    <Stars rating={review?.rating} />
                  </div>
                  <div class="d-flex justify-content-start">
                    {review?.comment && <p class="mt-3">{review.comment}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No reviews yet.</p>
      )}
    </>
  );
}
