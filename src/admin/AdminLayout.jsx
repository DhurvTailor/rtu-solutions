"use client";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}