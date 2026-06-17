import SemesterForm from "@/src/admin/SemesterForm";

export default function SemestersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Semesters Management
      </h1>

      <SemesterForm />
    </div>
  );
}