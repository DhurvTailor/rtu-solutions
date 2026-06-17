import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </>
  );
}