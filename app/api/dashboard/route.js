import { getDegrees } from "@/services/degreeService";
import { getBranches } from "@/services/branchService";
import { getSemesters } from "@/services/semesterService";
import { getSubjects } from "@/services/subjectService";
import { getSolutions } from "@/services/solutionService";
import { getUsers } from "@/services/userService";

export async function GET() {
  try {
    const [degrees, branches, semesters, subjects, solutions, users] =
      await Promise.all([
        getDegrees(),
        getBranches(),
        getSemesters(),
        getSubjects(),
        getSolutions(),
        getUsers(),
      ]);

    return Response.json({
      degrees: degrees.length,
      branches: branches.length,
      semesters: semesters.length,
      subjects: subjects.length,
      solutions: solutions.length,
      users: users.length,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}