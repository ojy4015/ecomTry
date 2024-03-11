// export { default } from "next-auth/middleware"

// protect admin page

import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server'

// these paths are protected
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*", "/api/admin/:path*"],
};

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.clone();
    const userRole = req?.nextauth?.token?.user?.role;

    // console.log("url: ", url);
    // console.log("userRole : ", userRole);

    if (url?.pathname?.includes("/admin") && userRole !== "admin") {
        url.pathname = '/';
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }
      },
    },
  }
);