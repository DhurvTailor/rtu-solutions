import SolutionForm from "@/src/admin/SolutionForm";

export default function SolutionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Solutions Management
      </h1>

      <SolutionForm />
    </div>
  );
}