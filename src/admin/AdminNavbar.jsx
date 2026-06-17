

"use client";

import React from "react";

export default function AdminNavbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      
      <div>
        <h1 className="text-xl font-bold text-[#142647]">
          RTU Solutions Admin
        </h1>
        <p className="text-sm text-gray-500">
          Manage Notes, PYQ, Videos & Users
        </p>
      </div>

      <div className="flex items-center gap-4">
        
        <button className="px-4 py-2 rounded-lg bg-[#ff6900] text-white font-medium hover:bg-orange-600 transition">
          Add New
        </button>

        <div className="w-10 h-10 rounded-full bg-[#142647] text-white flex items-center justify-center font-bold">
          D
        </div>

      </div>
    </header>
  );
}