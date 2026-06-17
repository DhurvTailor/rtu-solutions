import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminSidebar from "@/src/admin/AdminSidebar";
import AdminNavbar from "@/src/admin/AdminNavbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Not logged in → login page
  if (!session) {
    redirect("/login");
  }

  // Logged in but not admin → home page
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}