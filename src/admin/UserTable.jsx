"use client";

import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function UserTable() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (
    id,
    currentRole
  ) => {
    try {
      const newRole =
        currentRole === "admin"
          ? "user"
          : "admin";

      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/users?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(
                    user.created_at
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role
                        )
                      }
                    >
                      {user.role === "admin"
                        ? "Make User"
                        : "Make Admin"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDelete(user.id)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                No Users Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}