// import { GrCaretPrevious } from "react-icons/gr";

// export default function Step3({onPrevStep}){
//     return (
//         <div>
//             Payment
//             <button onClick={onPrevStep} ><GrCaretPrevious />Prev </button>
//         </div>
//     );
// }


import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { GrSecure } from "react-icons/gr";

import Link from "next/link";

import OrderSummary from "@/components/cart/OrderSummary";
import toast from 'react-hot-toast';
import { useState } from "react";

export default function Step3({ onPrevStep}) {
  // context
  const { cartItems } = useCart();
  // state
  const [loading, setLoading] = useState(false);

// this function is responsible to make a request to our backend and 
// backend will make a request to stripe to get URL that will create a secure checkout session 
// and new window pop up
  const handleClick = async () => {
    setLoading(true);
    try {
        const cartData = cartItems?.map((item) => (
            {
                _id: item._id,
                quantity: item.quantity,
            }
        ));

        const response = await fetch(`${process.env.API}/user/stripe/session`, {
            method: "POST",
            body: JSON.stringify(cartData),
        });

        const data = await response.json();

        if(response.ok) {
            window.location.href = data.url;

        } else {
            toast.error(data.err);
            setLoading(false);
        }
    } catch (err) {
        {
            console.log(err);
            toast.error("An error occured. please try again.");
            setLoading(false);
          }
    }
  }

  // if you are logged in
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary text-center">Payment Method</p>
          <h2 className="text-center"><GrSecure /> <CiCreditCard1 /> <FaCcMastercard /> <FaCcVisa /></h2>

          <p>
            Flat rate $5 shipping fee will apply for all orders Austrailia wide!
          </p>

          <p className="lead card p-5 bg-secondary text-light">
            Clcking 'Place Order' will sercurly redirect you to our trusted payment partner, Stripe to complete your order.
          </p>

          <div className="d-flex justify-content-between my-4">
            <button
              className="btn btn-danger btn-raised col-5"
              onClick={onPrevStep}
            >
              <GrCaretPrevious />
              Prev
            </button>
            <button
              className="btn btn-success btn-raised col-5"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? "Processing.." : "Place Order"}
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <OrderSummary />
        </div>
      </div>
      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
    </div>
  );
}
