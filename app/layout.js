"use client";

import "./globals.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
import TopNav from "@/components/nav/TopNav";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { CatetoryProvider } from "@/context/category";
import { TagProvider } from "@/context/tag";
import { ProductProvider } from "@/context/product";
import { CartProvider } from "@/context/cart";

// export const metadata = {
//   title: "NextEcom",
//   description: "Ecommerce app using NextJs Full Stack",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
        <CatetoryProvider>
          <TagProvider>
            <ProductProvider>
              <CartProvider>
                <body>
                  <TopNav />
                  <Toaster />
                  {children}
                </body>
              </CartProvider>
            </ProductProvider>
          </TagProvider>
        </CatetoryProvider>
      </SessionProvider>
    </html>
  );
}
