import SubjectForm from "@/src/admin/SubjectForm";

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Subjects Management
      </h1>

      <SubjectForm />
    </div>
  );
}