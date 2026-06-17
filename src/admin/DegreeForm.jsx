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

export default function DegreeForm() {
  const [degreeName, setDegreeName] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Degrees
  const fetchDegrees = async () => {
    try {
      const res = await fetch("/api/degrees");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setDegrees(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  // Add Degree
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!degreeName.trim()) {
      alert("Please enter degree name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/degrees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: degreeName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      setDegreeName("");

      fetchDegrees();
    } catch (error) {
      console.log(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Degree
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this degree?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/degrees?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message);

      fetchDegrees();
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl font-bold">
          Degree Management
        </CardTitle>

        <p className="text-sm text-gray-300">
          Add and manage all degrees
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <Input
            type="text"
            placeholder="Enter Degree Name"
            value={degreeName}
            onChange={(e) =>
              setDegreeName(e.target.value)
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
              : "Add Degree"}
          </Button>
        </form>

        <div className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>

                <TableHead>
                  Degree Name
                </TableHead>

                <TableHead>
                  Created At
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {degrees.length > 0 ? (
                degrees.map((degree) => (
                  <TableRow
                    key={degree.id}
                  >
                    <TableCell>
                      {degree.id}
                    </TableCell>

                    <TableCell>
                      {degree.name}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        degree.created_at
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            degree.id
                          )
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8"
                  >
                    No Degrees Found
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