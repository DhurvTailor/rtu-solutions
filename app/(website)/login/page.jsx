// "use client";

// import { signIn } from "next-auth/react";
// import { FcGoogle } from "react-icons/fc";

// export default function LoginPage() {
//   return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5">

//       <div className="w-full max-w-md">

//         <div className="bg-white rounded-3xl shadow-xl p-8">

//           <div className="text-center mb-8">

//             <img
//               src="/logo.jpg"
//               alt="RTU Solutions"
//               className="w-20 h-20 mx-auto rounded-full object-cover"
//             />

//             <h1 className="text-3xl font-bold text-[#142647] mt-5">
//               RTU Solutions
//             </h1>

//             <p className="text-gray-500 mt-2">
//               Login to access Notes, PYQ, Video Lectures and Study Resources
//             </p>

//           </div>

//           <button
//             onClick={() => signIn("google")}
//             className="
//               w-full
//               flex
//               items-center
//               justify-center
//               gap-3
//               bg-white
//               border
//               border-gray-300
//               py-3
//               rounded-xl
//               hover:bg-gray-50
//               transition
//               font-medium
//             "
//           >
//             <FcGoogle size={24} />

//             Continue with Google
//           </button>

//           <div className="mt-8 text-center text-sm text-gray-500">
//             By continuing you agree to RTU Solutions Terms &
//             Privacy Policy.
//           </div>

//         </div>

//       </div>

//     </main>
//   );
// }


"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <main
      className="min-h-[70vh]  flex items-center justify-center"
    
    >
      <div
  className="flex rounded-3xl mt-5 overflow-hidden shadow-none md:shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
  style={{
    width: "820px",
    minHeight: "400px",
  }}
>

        {/* ── LEFT — Logo only, dark bg ── */}
        <div
          className="hidden md:flex flex-col items-center justify-center"
          style={{
            width: "350px",
            minWidth: "350px",
            backgroundColor : "#faf6ee",
          }}
        >
          <img
            src="/logo.webp"
            alt="RTU Solutions"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "40%",
              objectFit: "cover",
              marginBottom: "20px",
            }}
          />
     
         

          {/* Decorative line */}
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "#e5e7eb",
              borderRadius: "2px",
              marginTop: "5px",
            }}
          />
        </div>

        {/* ── RIGHT — Login content ── */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
           
          }}
        >

          {/* Google GIF */}
          <img
            src="/google.gif"
            alt="Google"
            style={{
              width: "400px",
              height: "auto",
              objectFit: "contain",
            
            }}
          />

          {/* Heading */}
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#142647",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: "20px",
              maxWidth: "300px",
            }}
          >
            RTU ke Notes, PYQ aur Solutions access karne ke liye Google se login karo
          </p>

          {/* Google Button */}
          <button
            onClick={() => signIn("google")}
            style={{
              width: "100%",
              maxWidth: "340px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "20px 5px",
              borderRadius: "14px",
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              fontSize: "20px",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease",

            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
            }}
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

        
        

          {/* Footer */}
          <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", lineHeight: 1.5, margin: "20px 5px" }}>
            Continue karne par aap{" "}
            <span style={{ color: "#3b82f6", cursor: "pointer" }}>Terms</span>
            {" "}&amp;{" "}
            <span style={{ color: "#3b82f6", cursor: "pointer" }}>Privacy Policy</span>
            {" "}se agree karte hain
          </p>
        </div>
      </div>
    </main>
  );
}