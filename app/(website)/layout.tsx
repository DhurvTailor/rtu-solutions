// import Navbar from "../../src/components/Navbar";
// import Footer from "../../src/components/Footer";

// export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <Navbar />
//       <main className="grow">{children}</main>
//       <Footer />
//     </>
//   );
// }


import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import WelcomePopup from "../../src/components/WelcomePopup";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* ── Welcome popup — sirf naye users ko, login ke baad automatically ── */}
      <WelcomePopup />
      <main className="grow">{children}</main>
      <Footer />
    </>
  );
}