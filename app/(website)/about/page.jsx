// app/about/page.jsx

import {
  FaYoutube,
  FaBookOpen,
  FaFilePdf,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <main>

      {/* Hero Section */}

      <section className="bg-[#071A3D] text-white py-24">
        <div className="max-w-7xl mx-auto px-5 text-center">

          <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full">
            About RTU Solutions
          </span>

          <h1 className="text-5xl font-bold mt-6">
            Empowering RTU Students
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-gray-300 text-lg leading-8">
            RTU Solutions is a dedicated platform for Rajasthan Technical
            University students. We provide Notes, PYQs, Video Lectures,
            Important Questions and Study Resources in one place.
          </p>

        </div>
      </section>

      {/* Mission Section */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <h2 className="text-4xl font-bold text-[#071A3D]">
                Our Mission
              </h2>

              <p className="text-gray-600 mt-6 leading-8">
                Our goal is to make exam preparation easier for RTU students.
                Instead of searching across multiple websites, students can
                access all important resources from one platform.
              </p>

              <p className="text-gray-600 mt-4 leading-8">
                We focus on quality study material, previous year papers,
                semester notes, important questions and educational videos.
              </p>

            </div>

            <div className="bg-orange-50 rounded-3xl p-10">

              <div className="space-y-6">

                <div className="flex gap-4 items-center">
                  <FaBookOpen
                    size={30}
                    className="text-orange-500"
                  />
                  <h3 className="font-semibold text-lg">
                    Quality Notes
                  </h3>
                </div>

                <div className="flex gap-4 items-center">
                  <FaFilePdf
                    size={30}
                    className="text-orange-500"
                  />
                  <h3 className="font-semibold text-lg">
                    Previous Year Papers
                  </h3>
                </div>

                <div className="flex gap-4 items-center">
                  <FaYoutube
                    size={30}
                    className="text-orange-500"
                  />
                  <h3 className="font-semibold text-lg">
                    Video Lectures
                  </h3>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Stats */}

      <section className="bg-gray-100 py-20">

        <div className="max-w-7xl mx-auto px-5">

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-2xl p-8 text-center">

              <FaGraduationCap
                size={40}
                className="text-orange-500 mx-auto"
              />

              <h3 className="text-4xl font-bold mt-4">
                100+
              </h3>

              <p className="text-gray-600 mt-2">
                Study Resources
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 text-center">

              <FaUsers
                size={40}
                className="text-orange-500 mx-auto"
              />

              <h3 className="text-4xl font-bold mt-4">
                1000+
              </h3>

              <p className="text-gray-600 mt-2">
                Students Helped
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 text-center">

              <FaYoutube
                size={40}
                className="text-orange-500 mx-auto"
              />

              <h3 className="text-4xl font-bold mt-4">
                RTU
              </h3>

              <p className="text-gray-600 mt-2">
                Learning Community
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Founder Section */}

      <section className="py-20">

        <div className="max-w-4xl mx-auto px-5 text-center">

          <h2 className="text-4xl font-bold text-[#071A3D]">
            Founder
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            RTU Solutions is created and managed by
            <strong> Dhruv Tailor </strong>
            with the vision of helping engineering students access
            quality study material quickly and efficiently.
          </p>

        </div>

      </section>

    </main>
  );
}