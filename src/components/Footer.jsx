// components/Footer.jsx

import Link from "next/link";
import {
  FaYoutube,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="relative mt-5 overflow-hidden text-white"
      style={{
        backgroundImage: "url('/footer.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#071A3D]/50 backdrop-blur-[1px]" />

      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">

        {/* Top Grid */}
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12">

          {/* About */}
          <div>
            <h2 className="text-3xl font-bold">
              RTU <span className="text-orange-500">Solutions</span>
            </h2>

            <p className="mt-5 text-gray-300 leading-7 text-sm">
              Your complete learning platform for RTU students.
              Access Notes, Previous Year Papers, Important Questions,
              Video Lectures, Syllabus and much more in one place.
            </p>

            <div className="flex gap-4 mt-7">

              <a
                href="https://youtube.com/@rtu-solutions?si=vnuaMxKH_-gFP4L5"
                target="_blank"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.instagram.com/rtu_solutions/"
                target="_blank"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 transition"
              >
                <FaTelegram />
              </a>

              <a
                href="https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K"
                target="_blank"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaWhatsapp />
              </a>

            </div>
          </div>

          {/* Payment Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Payment Links
            </h3>

            <ul className="space-y-4 text-gray-300">

              <li>
                <Link href="/privacy-policy" className="hover:text-orange-400 transition">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/refund-policy" className="hover:text-orange-400 transition">
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-orange-400 transition">
                  Terms & Conditions
                </Link>
              </li>
                 <li>
                <Link href="/advertisement" className="hover:text-orange-400 transition">
                  Advertise With Us
                </Link>
              </li>

                <li>
                <Link href="/faq" className="hover:text-orange-400 transition">
                  FAQ
                </Link>
              </li> 
                
              
            </ul>
          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-4 text-gray-300">

              <li>
                <Link href="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/notes" className="hover:text-orange-400 transition">
                  Notes
                </Link>
              </li>

              <li>
                <Link href="/pyq" className="hover:text-orange-400 transition">
                  Previous Year Papers
                </Link>
              </li>

              <li>
                <Link href="/videos" className="hover:text-orange-400 transition">
                  Video Lectures
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-orange-400 transition">
                  Blog
                </Link>
              </li>

            </ul>

          </div>

          {/* Resources */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Resources
            </h3>

            <ul className="space-y-4 text-gray-300">

              <li>
                <Link
                  href="/important-questions"
                  className="hover:text-orange-400 transition"
                >
                  Important Questions
                </Link>
              </li>

              <li>
                <Link
                  href="/syllabus"
                  className="hover:text-orange-400 transition"
                >
                  Syllabus
                </Link>
              </li>

              <li>
                <Link
                  href="/result"
                  className="hover:text-orange-400 transition"
                >
                  RTU Result
                </Link>
              </li>

              <li>
                <Link
                  href="/tools"
                  className="hover:text-orange-400 transition"
                >
                  Calculators
                </Link>
              </li>

            </ul>

          </div>

          {/* Newsletter */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Stay Updated
            </h3>

           

            <form className="space-y-4">

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
              />

              <button
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 transition py-3 font-semibold flex items-center justify-center gap-2"
              >
                Subscribe
                <FaArrowRight />
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="relative border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-gray-400 text-sm">
            © 2026 RTU Solutions. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-400">

            <Link
              href="/privacy-policy"
              className="hover:text-orange-400 transition"
            >
              Privacy
            </Link>

            <Link
              href="/refund-policy"
              className="hover:text-orange-400 transition"
            >
              Refund
            </Link>

            <Link
              href="/terms"
              className="hover:text-orange-400 transition"
            >
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}