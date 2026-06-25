// components/Footer.jsx

import Link from "next/link";
import {
  FaYoutube,
  FaInstagram,
  FaTelegram,
  FaWhatsapp
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#071A3D] text-white mt-20">

      <div className="max-w-7xl mx-auto px-5 py-16">

        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-10">

          {/* About */}
          <div>
            <h2 className="text-2xl font-bold">
              RTU <span className="text-orange-500">Solutions</span>
            </h2>

            <p className="text-gray-300 mt-4 text-sm leading-7">
              One platform for RTU Notes,
              Previous Year Papers,
              Important Questions,
              Video Lectures and Study Resources.
            </p>

            <div className="flex gap-4 mt-5 text-xl">

              <a href="https://youtube.com/@rtu-solutions?si=vnuaMxKH_-gFP4L5">
                <FaYoutube />
              </a>

              <a href="https://www.instagram.com/rtu_solutions/">
                <FaInstagram />
              </a>

              <a href="#">
                <FaTelegram />
              </a>

              <a href="https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K">
                <FaWhatsapp />
              </a>

            </div>
          </div>
<div>
            <h3 className="font-bold text-lg mb-4">
              Payments Links
            </h3>

            <ul className="space-y-3 text-gray-300">

        <li> <Link href="/privacy-policy">Privacy Policy</Link></li> 
        <li>  <Link href="/refund-policy">Refund Policy</Link></li>
         <li>  <Link href="/terms">Terms & Conditions</Link></li>

            </ul>
          </div>
        
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/notes">Notes</Link>
              </li>

              <li>
                <Link href="/pyq">PYQ</Link>
              </li>

              <li>
                <Link href="/videos">Videos</Link>
              </li>

              <li>
                <Link href="/blog">Blog</Link>
              </li>

            </ul>
          </div>

          {/* Subjects */}
          {/* <div>
            <h3 className="font-bold text-lg mb-4">
              Subjects
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>DBMS</li>

              <li>CN</li>

              <li>DCCN</li>

              <li>TOC</li>

              <li>Operating System</li>

            </ul>
          </div> */}

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Resources
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <Link href="/important-questions">
                  Important Questions
                </Link>
              </li>

              <li>
                <Link href="/syllabus">
                  Syllabus
                </Link>
              </li>

              <li>
                <Link href="/result">
                  RTU Result
                </Link>
              </li>

              <li>
                <Link href="/tools">
                  Calculators
                </Link>
              </li>

            </ul>
          </div>

          {/* Newsletter */}
          <div>

            <h3 className="font-bold text-lg mb-4">
              Newsletter
            </h3>

            <p className="text-gray-300 text-sm mb-4">
              Get latest RTU Notes,
              PYQ and Exam Updates.
            </p>

            <form className="space-y-3">

              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
              />

              <button
                className="w-full bg-orange-500 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-white/10 py-5 text-center text-gray-400 text-sm">

        © 2026 RTU Solutions. All Rights Reserved.

      </div>

    </footer>
  );
}