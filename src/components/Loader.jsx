// // components/Loader.jsx

// "use client";

// export default function Loader() {
//   return (
//     <div
//       className="
//       flex
//       items-center
//       justify-center
//       min-h-screen
//       bg-white
//       "
//     >
//       <div className="flex flex-col items-center gap-5">

//         {/* Spinner */}

//         <div
//           className="
//           w-16
//           h-16
//           border-4
//           border-orange-200
//           border-t-orange-500
//           rounded-full
//           animate-spin
//           "
//         />

//         {/* Text */}

//         <div className="text-center">

//           <h2 className="text-xl font-bold text-[#071A3D]">
//             RTU Solutions
//           </h2>

//           <p className="text-gray-500 mt-1">
//             Loading Study Materials...
//           </p>

//         </div>

//       </div>
//     </div>
//   );
// }



"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#071A3D]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-orange-300/50 animate-spin animation-duration-[1.5s] direction-[reverse]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            RTU <span className="text-orange-500">Solutions</span>
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Loading study materials...</p>
        </div>
      </div>
    </div>
  );
}