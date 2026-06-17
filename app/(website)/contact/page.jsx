// app/contact/page.jsx

import {
  FaPhoneAlt,
  FaEnvelope,
  FaYoutube,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <main>

      {/* Hero Section */}

      <section className="bg-[#071A3D] text-white py-24">
        <div className="max-w-7xl mx-auto px-5 text-center">

          <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full">
            Contact RTU Solutions
          </span>

          <h1 className="text-5xl font-bold mt-6">
            Get In Touch
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg">
            Have questions about notes, PYQs, study material or
            collaborations? Feel free to contact us.
          </p>

        </div>
      </section>

      {/* Contact Section */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5">

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Left Side */}

            <div>

              <h2 className="text-4xl font-bold text-[#071A3D] mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">

                <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-2xl">

                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaPhoneAlt
                      className="text-orange-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Phone
                    </h3>

                    <p className="text-gray-600">
                      +91 XXXXX XXXXX
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-2xl">

                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaEnvelope
                      className="text-orange-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Email
                    </h3>

                    <p className="text-gray-600">
                      contact@rtusolutions.com
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-2xl">

                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaYoutube
                      className="text-orange-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      YouTube Channel
                    </h3>

                    <p className="text-gray-600">
                      RTU Solutions
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-2xl">

                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt
                      className="text-orange-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Location
                    </h3>

                    <p className="text-gray-600">
                      Rajasthan, India
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Right Side */}

            <div className="bg-white shadow-lg rounded-3xl p-8">

              <h2 className="text-3xl font-bold text-[#071A3D] mb-6">
                Send Message
              </h2>

              <form className="space-y-5">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />

                <textarea
                  rows={6}
                  placeholder="Write Your Message..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* WhatsApp CTA */}

      <section className="pb-20">

        <div className="max-w-4xl mx-auto px-5">

          <div className="bg-[#071A3D] rounded-3xl p-10 text-center text-white">

            <FaWhatsapp
              size={50}
              className="mx-auto text-green-500"
            />

            <h2 className="text-3xl font-bold mt-5">
              Need Quick Help?
            </h2>

            <p className="text-gray-300 mt-3">
              Contact us directly on WhatsApp for faster support.
            </p>

            <button className="mt-6 bg-green-500 hover:bg-green-600 px-8 py-3 rounded-xl font-semibold">
              Chat on WhatsApp
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}