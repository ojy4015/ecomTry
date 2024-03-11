
import Link from "next/link";

export default function AdminNav() {


  return (
    <nav className="nav justify-content-center mb-3">
      <Link href="/dashboard/admin" className="nav-link">
        Admin
      </Link>
      <Link href="/dashboard/admin/category" className="nav-link">
        Manage Categories
      </Link>
      <Link href="/dashboard/admin/tag" className="nav-link">
        Manage Tags
      </Link>
      <Link href="/dashboard/admin/product" className="nav-link">
        Add Product
      </Link>
      <Link href="/dashboard/admin/products" className="nav-link">
        List All Products
      </Link>

     
    </nav>
  );
}
