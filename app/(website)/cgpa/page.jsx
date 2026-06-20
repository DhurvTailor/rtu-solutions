import CgpaCalculator from "@/src/components/CgpaCalculator";

export const metadata = {
  title: "CGPA Calculator | RTU Kota B.Tech",
  description:
    "Calculate your CGPA and SGPA as per RTU Kota official grading system. Supports all branches and all 8 semesters.",
};

export default function CgpaCalculatorPage() {
  return <CgpaCalculator />;
}