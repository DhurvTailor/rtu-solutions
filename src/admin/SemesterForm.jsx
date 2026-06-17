"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function SemesterForm() {
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [branchId, setBranchId] = useState("");
  const [semesterNumber, setSemesterNumber] = useState("");

  const [loading, setLoading] = useState(false);

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

  // ==========================
  // Fetch Semesters
  // ==========================
  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();

      setSemesters(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchSemesters();
  }, []);

  // ==========================
  // Add Semester
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branchId || !semesterNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/semesters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch_id: branchId,
          semester_number: semesterNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      setBranchId("");
      setSemesterNumber("");

      fetchSemesters();
    } catch (error) {
      console.log(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete Semester
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Delete this semester?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/semesters?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchSemesters();
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl font-bold">
          Semester Management
        </CardTitle>

        <p className="text-sm text-gray-300">
          Add and manage semesters
        </p>
      </CardHeader>

      <CardContent className="p-6">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <select
            value={branchId}
            onChange={(e) =>
              setBranchId(e.target.value)
            }
            className="h-12 px-4 border rounded-lg w-full"
          >
            <option value="">
              Select Branch
            </option>

            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
          </select>

          <select
            value={semesterNumber}
            onChange={(e) =>
              setSemesterNumber(e.target.value)
            }
            className="h-12 px-4 border rounded-lg w-full"
          >
            <option value="">
              Select Semester
            </option>

            {[1,2,3,4,5,6,7,8].map((sem) => (
              <option
                key={sem}
                value={sem}
              >
                Semester {sem}
              </option>
            ))}
          </select>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#ff6900] hover:bg-orange-600 text-white h-12 px-8"
          >
            {loading
              ? "Adding..."
              : "Add Semester"}
          </Button>
        </form>

        <div className="rounded-2xl border overflow-hidden">
          <div className="bg-[#142647] px-4 py-3">
            <h3 className="text-white font-semibold">
              Semester List
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {semesters.length > 0 ? (
                semesters.map(
                  (semester, index) => (
                    <TableRow
                      key={semester.id}
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        {semester.branch_name}
                      </TableCell>

                      <TableCell>
                        Semester{" "}
                        {
                          semester.semester_number
                        }
                      </TableCell>

                      <TableCell>
                        {new Date(
                          semester.created_at
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDelete(
                              semester.id
                            )
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8"
                  >
                    No Semesters Found
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