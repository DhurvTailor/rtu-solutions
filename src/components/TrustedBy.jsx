"use client";

import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaFacebook,
} from "react-icons/fa";

const platforms = [
  {
    name: "YouTube",
    icon: <FaYoutube />,
    url: "https://youtube.com/@RTU-Solutions",
    color: "text-red-600",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    url: "https://instagram.com/rtu_solutions",
    color: "text-pink-500",
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp />,
    url: "https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K",
    color: "text-green-600",
  },
  {
    name: "Telegram",
    icon: <FaTelegramPlane />,
    url: "#",
    color: "text-sky-500",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin />,
    url: "#",
    color: "text-blue-700",
  },
  {
    name: "GitHub",
    icon: <FaGithub />,
    url: "#",
    color: "text-gray-900",
  },
  {
    name: "Facebook",
    icon: <FaFacebook />,
    url: "#",
    color: "text-blue-600",
  },
  {
    name: "Website",
    icon: <FaGlobe />,
    url: "https://www.rtu-solutions.me",
    color: "text-orange-500",
  },
];

const sliderItems = [...platforms, ...platforms];

export default function ConnectPlatforms() {
  return (
    <section className="py-16 bg-linear-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex items-center gap-4 mb-10">
          <span className="flex-1 h-px bg-gray-200"></span>

          <h2 className="text-sm md:text-base font-medium text-gray-500 whitespace-nowrap">
            Connect with RTU Solutions on Every Platform
          </h2>

          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <div className="group relative">

          <div className="flex w-max animate-marquee group-hover:paused">

            {sliderItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mx-4
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white/80
                  backdrop-blur-xl
                  px-6
                  py-4
                  shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-orange-500
                  hover:shadow-xl
                  min-w-55
                "
              >
                <div
                  className={`text-3xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Visit our official profile
                  </p>
                </div>
              </a>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}