// localhost:3000/login
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  // state
  const [email, setEmail] = useState("ryan@gmail.com");
  const [password, setPassword] = useState("rrrrrr");
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // log user in
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result?.error);
        setLoading(false);
      } else {
        // if successfully logged in
        toast.success("Logged in successfully");
        // set some auth state: after logged in, redirect it without losing state
        router.replace(callbackUrl);
      }

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 shadow bg-light p-5">
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !email || !password}
                type="submit"
              >
                {loading ? "Please wait..." : "Submit"}
              </button>
            </form>
            <button
                className="btn btn-danger btn-raised mb-4"
                type="submit"
                onClick={() => signIn("google", {callbackUrl})}
              >
                Sign In with Google
              </button>
          </div>
        </div>
      </div>
    </main>
  );
}
