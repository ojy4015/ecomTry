// to have average rating from mutiple user's rating

// ratings : array of rating object {rating, comment, postedBy} of multiple user
export function calculateAverageRating(ratings) {
    if(ratings.length === 0) return 0;
    
    let totalRating = 0;

    for (const ratingObj of ratings) {
     totalRating += ratingObj.rating;   
    }
    
    const averageRating = totalRating / ratings.length;
    return averageRating;
}