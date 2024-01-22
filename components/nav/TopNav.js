"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function TopNav() {
  const { data, status, loading } = useSession();

  console.log("data : ", data);
  console.log("status : ", status);

  // console.log("loading : ", loading);

  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <Link href="/" className="nav-link">
        🛒NEXTECOM🛒
      </Link>

      {status === "authenticated" ? (
        <div className="d-flex justify-content-end">
          <Link
            href={`/dashboard/${
              data?.user?.role === "admin" ? "admin" : "user"
            }`}
            className="nav-link"
          >
            {data?.user?.name}({data?.user?.role})
          </Link>
          <a
            className="nav-link pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </a>
        </div>
      ) : status === "loading" ? (
        <a className="nav-link text-danger">로딩중</a>
      ) : (
        <div className="d-flex">
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/register" className="nav-link">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
