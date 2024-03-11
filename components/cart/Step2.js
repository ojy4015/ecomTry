import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
import { useSession } from "next-auth/react";

import Link from "next/link";

import OrderSummary from "@/components/cart/OrderSummary";

export default function Step2({ onPrevStep, onNextStep }) {
  const { data, status, update } = useSession();
  // update({user: {...data.user, address: "123 Main St"}})

  // if you are not logged in
  if (status !== "authenticated") {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <h5 className="text-center">Login to Continue</h5>
            <div className="d-flex justify-content-between my-4">
              <button
                className="btn btn-danger btn-raised col-5"
                onClick={onPrevStep}
              >
                Prev
                <GrCaretPrevious />
              </button>
              <Link
                className="btn btn-danger btn-raised col-5"
                href={`/login?callbackUrl=${window.location.pathname}`}
              >
                Login to Continue
                <GrCaretNext />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // if you are logged in
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary text-center">Contact details</p>
          <div className="d-flex justify-content-between align-items-center my-4">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={data?.user?.name}
              className="form-control text-center mb-2 px-2"
              disabled
            />
          </div>
          <div className="d-flex justify-content-between align-items-center my-4">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={data?.user?.email}
              className="form-control text-center mb-2 px-2"
              disabled
            />
          </div>
          <div className="d-flex justify-content-between align-items-center my-4">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              value={data?.user?.role}
              className="form-control text-center mb-2 px-2"
              disabled
            />
          </div>
          <div className="d-flex justify-content-between my-4">
            <button
              className="btn btn-danger btn-raised col-5"
              onClick={onPrevStep}
            >
              <GrCaretPrevious />
              Prev
            </button>
            <button
              className="btn btn-danger btn-raised col-5"
              onClick={onNextStep}
            >
              Next
              <GrCaretNext />
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <OrderSummary />
        </div>
      </div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}
