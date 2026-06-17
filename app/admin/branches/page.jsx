import BranchForm from "@/src/admin/BranchForm";

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Branches Management
      </h1>

      <BranchForm />
    </div>
  );
}