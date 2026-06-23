"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function BranchForm() {
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);

  const [degreeId, setDegreeId] = useState("");
  const [branchName, setBranchName] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // Fetch Degrees
  // ==========================
  const fetchDegrees = async () => {
    try {
      const res = await fetch("/api/degrees");
      const data = await res.json();

      setDegrees(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Fetch Branches
  // ==========================
  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branch");
      const data = await res.json();

      setBranches(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDegrees();
    fetchBranches();
  }, []);

  // ==========================
  // Add Branch
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!degreeId || !branchName.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          degree_id: degreeId,
          name: branchName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      setDegreeId("");
      setBranchName("");

      fetchBranches();
    } catch (error) {
      console.log(error);

      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  // ==========================
  // Edit Branch
  // ==========================
  const handleEdit = async (id) => {
    const newBranchName = prompt(
      "Enter new branch name:"
    );

    if (!newBranchName) return;

    try {
      const res = await fetch(
        `/api/branch?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newBranchName,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchBranches();
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  // ==========================
  // Delete Branch
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this branch?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/branch?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchBranches();
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl font-bold">
          Branch Management
        </CardTitle>

        <p className="text-sm text-gray-300">
          Add and manage branches
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {/* ==========================
            FORM
        ========================== */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <select
            value={degreeId}
            onChange={(e) =>
              setDegreeId(e.target.value)
            }
            className="h-12 px-4 border rounded-lg w-full"
          >
            <option value="">
              Select Degree
            </option>

            {degrees.map((degree) => (
              <option
                key={degree.id}
                value={degree.id}
              >
                {degree.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Enter Branch Name"
            value={branchName}
            onChange={(e) =>
              setBranchName(e.target.value)
            }
            className="h-12"
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#ff6900] hover:bg-orange-600 text-white h-12 px-8"
          >
            {loading
              ? "Adding..."
              : "Add Branch"}
          </Button>
        </form>

        {/* ==========================
            TABLE
        ========================== */}
        <div className="rounded-2xl border overflow-hidden">
          <div className="bg-[#142647] px-4 py-3">
            <h3 className="text-white font-semibold">
              Branch List
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {branches.length > 0 ? (
                branches.map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      {branch.degree_name}
                    </TableCell>

                    <TableCell>
                      {branch.name}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        branch.created_at
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEdit(branch.id)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(branch.id)
                        }
                        className="ml-2"
                      >
                        Delete
                      </Button>   
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8"
                  >
                    No Branches Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}