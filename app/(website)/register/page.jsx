// app/register/page.jsx

"use client";

import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-20">

      <div className="w-full max-w-lg">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Header */}

          <div className="text-center mb-8">

            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <FaUserPlus
                size={32}
                className="text-orange-500"
              />
            </div>

            <h1 className="text-3xl font-bold text-[#071A3D] mt-5">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              Join RTU Solutions and access study resources.
            </p>

          </div>

          {/* Form */}

          <form className="space-y-5">

            {/* Name */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">

                <FaUser
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-orange-500
                  "
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-orange-500
                  "
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">

                <FaLock
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "
                />

                <input
                  type="password"
                  placeholder="Create password"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-orange-500
                  "
                />

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">

                <FaLock
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  "
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-orange-500
                  "
                />

              </div>

            </div>

            {/* Terms */}

            <label className="flex items-start gap-3 text-sm text-gray-600">

              <input
                type="checkbox"
                className="mt-1"
              />

              <span>
                I agree to the Terms &
                Conditions and Privacy Policy.
              </span>

            </label>

            {/* Button */}

            <button
              type="submit"
              className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
              "
            >
              Create Account
            </button>

          </form>

          {/* Login Link */}

          <div className="text-center mt-6">

            <p className="text-gray-600">

              Already have an account?

              <Link
                href="/login"
                className="text-orange-500 ml-2 font-semibold"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}