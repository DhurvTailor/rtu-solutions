// app/not-found.jsx

import Link from "next/link";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#071A3D] flex items-center justify-center px-5">

      <div className="text-center max-w-2xl">

        {/* 404 */}

        <h1 className="text-8xl md:text-9xl font-bold text-orange-500">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-300 mt-6 text-lg leading-8">
          Sorry, the page you are looking for doesn't exist
          or has been moved.
        </p>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

       

        </div>

        {/* Quick Links */}

        <div className="mt-14">

          <h3 className="text-white text-xl font-semibold mb-5">
            Popular Pages
          </h3>

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              href="/notes"
              className="bg-white/10 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition"
            >
              Notes
            </Link>

            <Link
              href="/pyq"
              className="bg-white/10 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition"
            >
              PYQ
            </Link>

            <Link
              href="/videos"
              className="bg-white/10 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition"
            >
              Videos
            </Link>

            <Link
              href="/subjects"
              className="bg-white/10 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition"
            >
              Subjects
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}