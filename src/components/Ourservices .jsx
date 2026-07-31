export default function OurServices() {
  const services = [
    {
      title: "PYQ Solutions",
      image: "/images/services/pyq-solutions.png",
      alt: "Previous year question paper solutions",
    },
    {
      title: "Study Notes",
      image: "/images/services/study-notes.png",
      alt: "Handwritten and typed study notes",
    },
    {
      title: "Video Solutions",
      image: "/images/services/video-solutions.png",
      alt: "Step-by-step video explanations on YouTube",
    },
  ];

  return (
    <section className="bg-[#F7F8FA] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#C8863A] uppercase mb-2">
          Our Services
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#12203D] mb-10 max-w-xl">
          Everything you need to clear your RTU exams
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white ring-1 ring-[#E3E6EC] flex items-center justify-center p-4 shadow-sm transition-all duration-300 group-hover:ring-[#C8863A] group-hover:shadow-md group-hover:-translate-y-1">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-3 text-sm font-medium text-[#12203D]">
                {service.title}
              </span>
            </div>
          ))}

          {/* Highlighted tile — combo / bundle offers, no image needed */}
          <div className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#12203D] flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 group-hover:bg-[#1B2A4A]">
              <span className="text-[#E8A94A] text-xs font-bold tracking-wide leading-tight">
                COMBO
                <br />
                OFFERS
              </span>
            </div>
            <span className="mt-3 text-sm font-medium text-[#12203D]">
              Bundles
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}