// "use client";

// import { useState, useEffect } from "react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";

// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";

// export default function SubjectForm() {
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [semesterId, setSemesterId] = useState("");
//   const [subjectName, setSubjectName] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ==========================
//   // Fetch Semesters
//   // ==========================
//   const fetchSemesters = async () => {
//     try {
//       const res = await fetch("/api/semesters");
//       const data = await res.json();

//       setSemesters(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ==========================
//   // Fetch Subjects
//   // ==========================
//   const fetchSubjects = async () => {
//     try {
//       const res = await fetch("/api/subjects");
//       const data = await res.json();

//       setSubjects(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchSemesters();
//     fetchSubjects();
//   }, []);

//   // ==========================
//   // Add / Update Subject
//   // ==========================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!semesterId || !subjectName.trim()) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       let res;

//       if (editingId) {
//         res = await fetch("/api/subjects", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             id: editingId,
//             semester_id: semesterId,
//             name: subjectName,
//           }),
//         });
//       } else {
//         res = await fetch("/api/subjects", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             semester_id: semesterId,
//             name: subjectName,
//           }),
//         });
//       }

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message);
//       }

//       alert(data.message);

//       setSemesterId("");
//       setSubjectName("");
//       setEditingId(null);

//       fetchSubjects();
//     } catch (error) {
//       console.log(error);

//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // Edit Subject
//   // ==========================
//   const handleEdit = (subject) => {
//     setEditingId(subject.id);
//     setSemesterId(subject.semester_id);
//     setSubjectName(subject.name);
//   };

//   // ==========================
//   // Delete Subject
//   // ==========================
//   const handleDelete = async (id) => {
//     const confirmDelete = confirm(
//       "Delete this subject?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `/api/subjects?id=${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message);
//       }

//       alert(data.message);

//       fetchSubjects();
//     } catch (error) {
//       console.log(error);

//       alert(error.message);
//     }
//   };

//   return (
//     <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
//       <CardHeader className="bg-[#142647] text-white">
//         <CardTitle className="text-2xl font-bold">
//           Subject Management
//         </CardTitle>

//         <p className="text-sm text-gray-300">
//           Add, Edit and Delete Subjects
//         </p>
//       </CardHeader>

//       <CardContent className="p-6">

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col lg:flex-row gap-4 mb-8"
//         >
//           <select
//             value={semesterId}
//             onChange={(e) =>
//               setSemesterId(e.target.value)
//             }
//             className="h-12 px-4 border rounded-lg w-full"
//           >
//             <option value="">
//               Select Semester
//             </option>

//             {semesters.map((semester) => (
//               <option
//                 key={semester.id}
//                 value={semester.id}
//               >
//                 Semester {semester.semester_number}
//               </option>
//             ))}
//           </select>

//           <Input
//             placeholder="Enter Subject Name"
//             value={subjectName}
//             onChange={(e) =>
//               setSubjectName(e.target.value)
//             }
//           />

//           <Button
//             type="submit"
//             disabled={loading}
//             className="bg-[#ff6900] hover:bg-orange-600 text-white"
//           >
//             {loading
//               ? "Saving..."
//               : editingId
//               ? "Update Subject"
//               : "Add Subject"}
//           </Button>
//         </form>

//         <div className="rounded-2xl border overflow-hidden">
//           <div className="bg-[#142647] px-4 py-3">
//             <h3 className="text-white font-semibold">
//               Subject List
//             </h3>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>S.No</TableHead>
//                 <TableHead>Semester</TableHead>
//                 <TableHead>Subject Name</TableHead>
//                 <TableHead>Created At</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {subjects.length > 0 ? (
//                 subjects.map((subject, index) => (
//                   <TableRow key={subject.id}>
//                     <TableCell>
//                       {index + 1}
//                     </TableCell>

//                     <TableCell>
//                       Semester {subject.semester_number}
//                     </TableCell>

//                     <TableCell>
//                       {subject.name}
//                     </TableCell>

//                     <TableCell>
//                       {new Date(
//                         subject.created_at
//                       ).toLocaleDateString()}
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           onClick={() =>
//                             handleEdit(subject)
//                           }
//                         >
//                           Edit
//                         </Button>

//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           onClick={() =>
//                             handleDelete(subject.id)
//                           }
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className="text-center py-8"
//                   >
//                     No Subjects Found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//       </CardContent>
//     </Card>
//   );
// }




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

export default function SubjectForm() {
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [semesterId, setSemesterId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active semester tab (accordion)
  const [activeSemester, setActiveSemester] = useState(null);

  // ==========================
  // Fetch Semesters
  // ==========================
  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();
      setSemesters(data);

      // By default pehla semester open rakho
      if (data.length > 0) {
        setActiveSemester(data[data.length - 1].id); // last added = first in DESC
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Fetch Subjects
  // ==========================
  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSemesters();
    fetchSubjects();
  }, []);

  // ==========================
  // Add / Update Subject
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!semesterId || !subjectName.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      let res;

      if (editingId) {
        res = await fetch("/api/subjects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            semester_id: semesterId,
            name: subjectName,
          }),
        });
      } else {
        res = await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semester_id: semesterId,
            name: subjectName,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);

      setSemesterId("");
      setSubjectName("");
      setEditingId(null);

      fetchSubjects();
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Edit Subject
  // ==========================
  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setSemesterId(subject.semester_id);
    setSubjectName(subject.name);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================
  // Cancel Edit
  // ==========================
  const handleCancelEdit = () => {
    setEditingId(null);
    setSemesterId("");
    setSubjectName("");
  };

  // ==========================
  // Delete Subject
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this subject?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/subjects?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      fetchSubjects();
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  // ==========================
  // Toggle Semester Tab
  // ==========================
  const handleSemesterClick = (semId) => {
    setActiveSemester(activeSemester === semId ? null : semId);
  };

  // Subjects filter by semester
  const getSubjectsBySemester = (semId) => {
    return subjects.filter((s) => s.semester_id === semId);
  };

  // Unique semesters sorted by semester_number ASC
  const sortedSemesters = [...semesters].sort(
    (a, b) => a.semester_number - b.semester_number
  );

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl font-bold">
          Subject Management
        </CardTitle>
        <p className="text-sm text-gray-300">
          Add, Edit and Delete Subjects
        </p>
      </CardHeader>

      <CardContent className="p-6">

        {/* ==========================
            ADD / EDIT FORM
        ========================== */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            className="h-12 px-4 border rounded-lg w-full"
          >
            <option value="">Select Semester</option>
            {sortedSemesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                Semester {semester.semester_number}
              </option>
            ))}
          </select>

          <Input
            placeholder="Enter Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="h-12"
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#ff6900] hover:bg-orange-600 text-white h-12 px-8 whitespace-nowrap"
          >
            {loading ? "Saving..." : editingId ? "Update Subject" : "Add Subject"}
          </Button>

          {/* Cancel Edit button */}
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              className="h-12 px-6 whitespace-nowrap"
            >
              Cancel
            </Button>
          )}
        </form>

        {/* ==========================
            SEMESTER TABS + SUBJECT LIST
        ========================== */}
        <div className="space-y-3">

          {sortedSemesters.length > 0 ? (
            sortedSemesters.map((semester) => {
              const semSubjects = getSubjectsBySemester(semester.id);
              const isOpen = activeSemester === semester.id;

              return (
                <div
                  key={semester.id}
                  className="rounded-2xl border overflow-hidden"
                >
                  {/* Semester Header / Tab */}
                  <button
                    type="button"
                    onClick={() => handleSemesterClick(semester.id)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#142647] text-white hover:bg-[#1e3a6e] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base">
                        Semester {semester.semester_number}
                      </span>
                      <span className="bg-[#ff6900] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {semSubjects.length} Subjects
                      </span>
                    </div>

                    {/* Arrow icon */}
                    <span
                      className="text-xl transition-transform duration-300"
                      style={{
                        display: "inline-block",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Subject Table - show/hide */}
                  {isOpen && (
                    <div>
                      {semSubjects.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>S.No</TableHead>
                              <TableHead>Subject Name</TableHead>
                              <TableHead>Created At</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {semSubjects.map((subject, index) => (
                              <TableRow key={subject.id}>
                                <TableCell>{index + 1}</TableCell>

                                <TableCell className="font-medium">
                                  {subject.name}
                                </TableCell>

                                <TableCell>
                                  {new Date(subject.created_at).toLocaleDateString()}
                                </TableCell>

                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(subject)}
                                    >
                                      Edit
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(subject.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          No Subjects found for this semester
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              No Semesters Found
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  );
}