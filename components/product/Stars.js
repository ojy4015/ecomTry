// generate the star rating based on the props rating

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Stars({rating}) {
    const stars = [];

    for(let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<FaStar key={i} />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<FaStarHalfAlt key={i} />);
        } else {
            stars.push(<FaRegStar key={i} />);
        }
    }
    return <>{stars}</>;
}