"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="text-center mb-8">

            <img
              src="/logo.jpg"
              alt="RTU Solutions"
              className="w-20 h-20 mx-auto rounded-full object-cover"
            />

            <h1 className="text-3xl font-bold text-[#142647] mt-5">
              RTU Solutions
            </h1>

            <p className="text-gray-500 mt-2">
              Login to access Notes, PYQ, Video Lectures and Study Resources
            </p>

          </div>

          <button
            onClick={() => signIn("google")}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-3
              bg-white
              border
              border-gray-300
              py-3
              rounded-xl
              hover:bg-gray-50
              transition
              font-medium
            "
          >
            <FcGoogle size={24} />

            Continue with Google
          </button>

          <div className="mt-8 text-center text-sm text-gray-500">
            By continuing you agree to RTU Solutions Terms &
            Privacy Policy.
          </div>

        </div>

      </div>

    </main>
  );
}