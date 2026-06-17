import UserTable from "@/src/admin/UserTable";

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "Admin",
      email: "admin@rtusolutions.com",
      role: "admin",
      status: "active",
      created_at: "2026-06-13",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#142647]">
        Users Management
      </h1>

      <UserTable users={users} />
    </div>
  );
}