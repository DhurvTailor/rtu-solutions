// app/checkout/page.jsx

"use client";

import {
  FaLock,
  FaCreditCard,
  FaCheckCircle,
  FaFilePdf,
} from "react-icons/fa";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">

      <div className="max-w-6xl mx-auto px-5">

        {/* Heading */}

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-[#071A3D]">
            Secure Checkout
          </h1>

          <p className="text-gray-500 mt-4">
            Complete your purchase and unlock premium study materials.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Section */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-[#071A3D] mb-8">
                Billing Details
              </h2>

              <form className="space-y-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-4
                  outline-none
                  focus:border-orange-500
                  "
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-4
                  outline-none
                  focus:border-orange-500
                  "
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-4
                  outline-none
                  focus:border-orange-500
                  "
                />

              </form>

            </div>

            {/* Payment Method */}

            <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

              <h2 className="text-2xl font-bold text-[#071A3D] mb-6">
                Payment Method
              </h2>

              <div className="border border-orange-200 rounded-2xl p-5 flex items-center gap-4">

                <FaCreditCard
                  size={30}
                  className="text-orange-500"
                />

                <div>
                  <h3 className="font-semibold">
                    Razorpay Payment Gateway
                  </h3>

                  <p className="text-gray-500 text-sm">
                    UPI, Debit Card, Credit Card, Net Banking
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Right Section */}

          <div>

            <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24">

              <h2 className="text-2xl font-bold text-[#071A3D]">
                Order Summary
              </h2>

              <div className="border-t mt-6 pt-6">

                <div className="flex items-center gap-3">

                  <FaFilePdf
                    className="text-red-500"
                    size={25}
                  />

                  <div>

                    <h3 className="font-semibold">
                      RTU Premium Notes Bundle
                    </h3>

                    <p className="text-sm text-gray-500">
                      Full Semester Notes
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 space-y-4">

                <div className="flex justify-between">
                  <span>Price</span>
                  <span>₹299</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    - ₹100
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">

                  <span>Total</span>

                  <span className="text-orange-500">
                    ₹199
                  </span>

                </div>

              </div>

              {/* Benefits */}

              <div className="mt-8 space-y-4">

                <div className="flex gap-3 items-center">

                  <FaCheckCircle
                    className="text-green-500"
                  />

                  <p>Instant Access</p>

                </div>

                <div className="flex gap-3 items-center">

                  <FaCheckCircle
                    className="text-green-500"
                  />

                  <p>Premium Notes</p>

                </div>

                <div className="flex gap-3 items-center">

                  <FaCheckCircle
                    className="text-green-500"
                  />

                  <p>Lifetime Access</p>

                </div>

              </div>

              {/* Pay Button */}

              <button
                className="
                w-full
                mt-8
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-4
                rounded-xl
                font-semibold
                transition
                "
              >
                Pay ₹199
              </button>

              <div className="flex justify-center items-center gap-2 mt-5 text-gray-500 text-sm">

                <FaLock />

                <span>
                  100% Secure Payment
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}