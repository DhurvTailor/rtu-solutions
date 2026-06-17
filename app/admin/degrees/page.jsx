import DegreeForm from "@/src/admin/DegreeForm";

export default function DegreesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Degrees Management
      </h1>

      <DegreeForm />
    </div>
  );
}