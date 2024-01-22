// all the admin pages will have this navigation
import AdminNav from "@/components/nav/AdminNav";

export default function AdminLayout({children}) {
    return (
        <>
            <AdminNav />
            {children}

        </>
    );
}