// components/Loader.jsx

"use client";

export default function Loader() {
  return (
    <div
      className="
      flex
      items-center
      justify-center
      min-h-screen
      bg-white
      "
    >
      <div className="flex flex-col items-center gap-5">

        {/* Spinner */}

        <div
          className="
          w-16
          h-16
          border-4
          border-orange-200
          border-t-orange-500
          rounded-full
          animate-spin
          "
        />

        {/* Text */}

        <div className="text-center">

          <h2 className="text-xl font-bold text-[#071A3D]">
            RTU Solutions
          </h2>

          <p className="text-gray-500 mt-1">
            Loading Study Materials...
          </p>

        </div>

      </div>
    </div>
  );
}