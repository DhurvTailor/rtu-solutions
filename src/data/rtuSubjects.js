// RTU Official Subjects & Credits - All Branches, All 8 Semesters
// Source: RTU Kota Syllabus (2018 scheme onwards)

export const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE"];

export const RTU_SUBJECTS = {
  // ─────────────────────────────────────────────
  // CSE - Computer Science Engineering
  // ─────────────────────────────────────────────
  CSE: {
    1: [
      { name: "Mathematics - I (Calculus & Linear Algebra)", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Basic Electrical & Electronics Engineering", credits: 3 },
      { name: "Engineering Graphics & Design", credits: 3 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Physics Lab", credits: 1 },
      { name: "Basic EE Lab", credits: 1 },
      { name: "Workshop / Manufacturing Practices", credits: 2 },
    ],
    2: [
      { name: "Mathematics - II (Differential Equations)", credits: 4 },
      { name: "Engineering Chemistry", credits: 3 },
      { name: "Programming for Problem Solving (C)", credits: 3 },
      { name: "Environment & Ecology", credits: 2 },
      { name: "Engineering Mechanics", credits: 3 },
      { name: "Engineering Chemistry Lab", credits: 1 },
      { name: "Programming Lab (C)", credits: 2 },
      { name: "Engineering Graphics Lab", credits: 1 },
    ],
    3: [
      { name: "Mathematics - III (Transform & Discrete Math)", credits: 4 },
      { name: "Data Structures", credits: 4 },
      { name: "Digital Electronics", credits: 4 },
      { name: "Object Oriented Programming (Java)", credits: 3 },
      { name: "Computer Organization & Architecture", credits: 3 },
      { name: "Data Structures Lab", credits: 2 },
      { name: "OOP Lab (Java)", credits: 2 },
    ],
    4: [
      { name: "Theory of Computation", credits: 4 },
      { name: "Operating Systems", credits: 4 },
      { name: "Database Management Systems", credits: 4 },
      { name: "Computer Networks", credits: 4 },
      { name: "Software Engineering", credits: 3 },
      { name: "OS Lab", credits: 1 },
      { name: "DBMS Lab", credits: 1 },
      { name: "Networks Lab", credits: 1 },
    ],
    5: [
      { name: "Compiler Design", credits: 4 },
      { name: "Microprocessor & Interfacing", credits: 4 },
      { name: "Web Technology", credits: 3 },
      { name: "Elective - I", credits: 3 },
      { name: "Elective - II", credits: 3 },
      { name: "Microprocessor Lab", credits: 2 },
      { name: "Web Technology Lab", credits: 2 },
    ],
    6: [
      { name: "Artificial Intelligence", credits: 4 },
      { name: "Computer Graphics", credits: 3 },
      { name: "Machine Learning", credits: 4 },
      { name: "Elective - III", credits: 3 },
      { name: "Elective - IV", credits: 3 },
      { name: "AI & ML Lab", credits: 2 },
      { name: "Mini Project", credits: 2 },
    ],
    7: [
      { name: "Distributed Systems", credits: 4 },
      { name: "Information Security", credits: 3 },
      { name: "Elective - V", credits: 3 },
      { name: "Elective - VI", credits: 3 },
      { name: "Major Project - Part I", credits: 4 },
      { name: "Industrial Training Seminar", credits: 2 },
    ],
    8: [
      { name: "Cloud Computing", credits: 3 },
      { name: "Elective - VII", credits: 3 },
      { name: "Major Project - Part II", credits: 8 },
      { name: "Seminar & Technical Communication", credits: 2 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  },

  // ─────────────────────────────────────────────
  // ECE - Electronics & Communication Engineering
  // ─────────────────────────────────────────────
  ECE: {
    1: [
      { name: "Mathematics - I (Calculus & Linear Algebra)", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Basic Electrical & Electronics Engineering", credits: 3 },
      { name: "Engineering Graphics & Design", credits: 3 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Physics Lab", credits: 1 },
      { name: "Basic EE Lab", credits: 1 },
      { name: "Workshop / Manufacturing Practices", credits: 2 },
    ],
    2: [
      { name: "Mathematics - II (Differential Equations)", credits: 4 },
      { name: "Engineering Chemistry", credits: 3 },
      { name: "Programming for Problem Solving (C)", credits: 3 },
      { name: "Environment & Ecology", credits: 2 },
      { name: "Engineering Mechanics", credits: 3 },
      { name: "Engineering Chemistry Lab", credits: 1 },
      { name: "Programming Lab (C)", credits: 2 },
      { name: "Engineering Graphics Lab", credits: 1 },
    ],
    3: [
      { name: "Mathematics - III", credits: 4 },
      { name: "Network Analysis & Synthesis", credits: 4 },
      { name: "Electronic Devices & Circuits", credits: 4 },
      { name: "Digital Electronics", credits: 4 },
      { name: "Signals & Systems", credits: 4 },
      { name: "Electronics Devices Lab", credits: 2 },
      { name: "Digital Electronics Lab", credits: 2 },
    ],
    4: [
      { name: "Analog Communication", credits: 4 },
      { name: "Linear Integrated Circuits", credits: 4 },
      { name: "Electromagnetic Field Theory", credits: 4 },
      { name: "Microprocessors & Microcontrollers", credits: 4 },
      { name: "Control Systems", credits: 3 },
      { name: "Analog Communication Lab", credits: 1 },
      { name: "Microprocessor Lab", credits: 2 },
    ],
    5: [
      { name: "Digital Communication", credits: 4 },
      { name: "Antenna & Wave Propagation", credits: 4 },
      { name: "VLSI Design", credits: 4 },
      { name: "Elective - I", credits: 3 },
      { name: "Elective - II", credits: 3 },
      { name: "Digital Communication Lab", credits: 2 },
      { name: "VLSI Lab", credits: 2 },
    ],
    6: [
      { name: "Wireless Communication", credits: 4 },
      { name: "Digital Signal Processing", credits: 4 },
      { name: "Optical Fiber Communication", credits: 3 },
      { name: "Elective - III", credits: 3 },
      { name: "Elective - IV", credits: 3 },
      { name: "DSP Lab", credits: 2 },
      { name: "Mini Project", credits: 2 },
    ],
    7: [
      { name: "Satellite Communication", credits: 3 },
      { name: "Radar & Navigation", credits: 3 },
      { name: "Elective - V", credits: 3 },
      { name: "Elective - VI", credits: 3 },
      { name: "Major Project - Part I", credits: 4 },
      { name: "Industrial Training Seminar", credits: 2 },
    ],
    8: [
      { name: "IoT & Embedded Systems", credits: 3 },
      { name: "Elective - VII", credits: 3 },
      { name: "Major Project - Part II", credits: 8 },
      { name: "Seminar & Technical Communication", credits: 2 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  },

  // ─────────────────────────────────────────────
  // ME - Mechanical Engineering
  // ─────────────────────────────────────────────
  ME: {
    1: [
      { name: "Mathematics - I (Calculus & Linear Algebra)", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Basic Electrical & Electronics Engineering", credits: 3 },
      { name: "Engineering Graphics & Design", credits: 3 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Physics Lab", credits: 1 },
      { name: "Basic EE Lab", credits: 1 },
      { name: "Workshop / Manufacturing Practices", credits: 2 },
    ],
    2: [
      { name: "Mathematics - II (Differential Equations)", credits: 4 },
      { name: "Engineering Chemistry", credits: 3 },
      { name: "Programming for Problem Solving (C)", credits: 3 },
      { name: "Environment & Ecology", credits: 2 },
      { name: "Engineering Mechanics", credits: 3 },
      { name: "Engineering Chemistry Lab", credits: 1 },
      { name: "Programming Lab", credits: 2 },
      { name: "Engineering Graphics Lab", credits: 1 },
    ],
    3: [
      { name: "Mathematics - III", credits: 4 },
      { name: "Strength of Materials", credits: 4 },
      { name: "Thermodynamics", credits: 4 },
      { name: "Material Science & Metallurgy", credits: 3 },
      { name: "Manufacturing Processes - I", credits: 3 },
      { name: "Strength of Materials Lab", credits: 1 },
      { name: "Thermodynamics Lab", credits: 1 },
      { name: "Manufacturing Lab - I", credits: 2 },
    ],
    4: [
      { name: "Theory of Machines", credits: 4 },
      { name: "Fluid Mechanics", credits: 4 },
      { name: "Heat Transfer", credits: 4 },
      { name: "Manufacturing Processes - II", credits: 3 },
      { name: "Machine Drawing", credits: 2 },
      { name: "Fluid Mechanics Lab", credits: 1 },
      { name: "Heat Transfer Lab", credits: 1 },
      { name: "Manufacturing Lab - II", credits: 2 },
    ],
    5: [
      { name: "Machine Design - I", credits: 4 },
      { name: "Power Plant Engineering", credits: 4 },
      { name: "Industrial Engineering", credits: 3 },
      { name: "Elective - I", credits: 3 },
      { name: "Elective - II", credits: 3 },
      { name: "Machine Design Lab", credits: 2 },
      { name: "CAD Lab", credits: 2 },
    ],
    6: [
      { name: "Machine Design - II", credits: 4 },
      { name: "Refrigeration & Air Conditioning", credits: 4 },
      { name: "Automobile Engineering", credits: 3 },
      { name: "Elective - III", credits: 3 },
      { name: "Elective - IV", credits: 3 },
      { name: "RAC Lab", credits: 2 },
      { name: "Mini Project", credits: 2 },
    ],
    7: [
      { name: "Robotics & Automation", credits: 3 },
      { name: "Operations Research", credits: 3 },
      { name: "Elective - V", credits: 3 },
      { name: "Elective - VI", credits: 3 },
      { name: "Major Project - Part I", credits: 4 },
      { name: "Industrial Training Seminar", credits: 2 },
    ],
    8: [
      { name: "Total Quality Management", credits: 3 },
      { name: "Elective - VII", credits: 3 },
      { name: "Major Project - Part II", credits: 8 },
      { name: "Seminar & Technical Communication", credits: 2 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  },

  // ─────────────────────────────────────────────
  // CE - Civil Engineering
  // ─────────────────────────────────────────────
  CE: {
    1: [
      { name: "Mathematics - I (Calculus & Linear Algebra)", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Basic Electrical & Electronics Engineering", credits: 3 },
      { name: "Engineering Graphics & Design", credits: 3 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Physics Lab", credits: 1 },
      { name: "Basic EE Lab", credits: 1 },
      { name: "Workshop / Manufacturing Practices", credits: 2 },
    ],
    2: [
      { name: "Mathematics - II (Differential Equations)", credits: 4 },
      { name: "Engineering Chemistry", credits: 3 },
      { name: "Programming for Problem Solving (C)", credits: 3 },
      { name: "Environment & Ecology", credits: 2 },
      { name: "Engineering Mechanics", credits: 3 },
      { name: "Engineering Chemistry Lab", credits: 1 },
      { name: "Programming Lab", credits: 2 },
      { name: "Surveying Lab", credits: 1 },
    ],
    3: [
      { name: "Mathematics - III", credits: 4 },
      { name: "Fluid Mechanics", credits: 4 },
      { name: "Strength of Materials", credits: 4 },
      { name: "Building Materials & Construction", credits: 3 },
      { name: "Surveying", credits: 3 },
      { name: "Fluid Mechanics Lab", credits: 1 },
      { name: "Strength of Materials Lab", credits: 1 },
      { name: "Surveying Lab - II", credits: 2 },
    ],
    4: [
      { name: "Structural Analysis - I", credits: 4 },
      { name: "Geotechnical Engineering - I", credits: 4 },
      { name: "Hydraulics & Hydraulic Machines", credits: 4 },
      { name: "Concrete Technology", credits: 3 },
      { name: "Transportation Engineering - I", credits: 3 },
      { name: "Hydraulics Lab", credits: 1 },
      { name: "Concrete Lab", credits: 2 },
    ],
    5: [
      { name: "Structural Analysis - II", credits: 4 },
      { name: "Geotechnical Engineering - II", credits: 3 },
      { name: "Design of Steel Structures", credits: 4 },
      { name: "Water Supply Engineering", credits: 3 },
      { name: "Elective - I", credits: 3 },
      { name: "Steel Structures Lab", credits: 2 },
      { name: "Geotechnical Lab", credits: 2 },
    ],
    6: [
      { name: "Design of RCC Structures", credits: 4 },
      { name: "Transportation Engineering - II", credits: 3 },
      { name: "Sewage & Wastewater Treatment", credits: 3 },
      { name: "Elective - II", credits: 3 },
      { name: "Elective - III", credits: 3 },
      { name: "RCC Design Lab", credits: 2 },
      { name: "Mini Project", credits: 2 },
    ],
    7: [
      { name: "Construction Management", credits: 3 },
      { name: "Irrigation Engineering", credits: 3 },
      { name: "Elective - IV", credits: 3 },
      { name: "Elective - V", credits: 3 },
      { name: "Major Project - Part I", credits: 4 },
      { name: "Industrial Training Seminar", credits: 2 },
    ],
    8: [
      { name: "Environmental Engineering", credits: 3 },
      { name: "Elective - VI", credits: 3 },
      { name: "Major Project - Part II", credits: 8 },
      { name: "Seminar & Technical Communication", credits: 2 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  },

  // ─────────────────────────────────────────────
  // EE - Electrical Engineering
  // ─────────────────────────────────────────────
  EE: {
    1: [
      { name: "Mathematics - I (Calculus & Linear Algebra)", credits: 4 },
      { name: "Engineering Physics", credits: 3 },
      { name: "Basic Electrical & Electronics Engineering", credits: 3 },
      { name: "Engineering Graphics & Design", credits: 3 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Physics Lab", credits: 1 },
      { name: "Basic EE Lab", credits: 1 },
      { name: "Workshop / Manufacturing Practices", credits: 2 },
    ],
    2: [
      { name: "Mathematics - II (Differential Equations)", credits: 4 },
      { name: "Engineering Chemistry", credits: 3 },
      { name: "Programming for Problem Solving (C)", credits: 3 },
      { name: "Environment & Ecology", credits: 2 },
      { name: "Engineering Mechanics", credits: 3 },
      { name: "Engineering Chemistry Lab", credits: 1 },
      { name: "Programming Lab", credits: 2 },
      { name: "Engineering Graphics Lab", credits: 1 },
    ],
    3: [
      { name: "Mathematics - III", credits: 4 },
      { name: "Circuit Theory", credits: 4 },
      { name: "Electrical Machines - I", credits: 4 },
      { name: "Electronic Devices & Circuits", credits: 3 },
      { name: "Electromagnetic Field Theory", credits: 3 },
      { name: "Circuit Theory Lab", credits: 2 },
      { name: "Electrical Machines Lab - I", credits: 2 },
    ],
    4: [
      { name: "Electrical Machines - II", credits: 4 },
      { name: "Control Systems", credits: 4 },
      { name: "Signals & Systems", credits: 4 },
      { name: "Power Systems - I", credits: 3 },
      { name: "Analog Electronics", credits: 3 },
      { name: "Electrical Machines Lab - II", credits: 2 },
      { name: "Control Systems Lab", credits: 2 },
    ],
    5: [
      { name: "Power Electronics", credits: 4 },
      { name: "Power Systems - II", credits: 4 },
      { name: "Microprocessors & Microcontrollers", credits: 3 },
      { name: "Elective - I", credits: 3 },
      { name: "Elective - II", credits: 3 },
      { name: "Power Electronics Lab", credits: 2 },
      { name: "Microprocessor Lab", credits: 2 },
    ],
    6: [
      { name: "Drives & Controls", credits: 4 },
      { name: "Power System Protection", credits: 4 },
      { name: "Digital Signal Processing", credits: 3 },
      { name: "Elective - III", credits: 3 },
      { name: "Elective - IV", credits: 3 },
      { name: "Drives Lab", credits: 2 },
      { name: "Mini Project", credits: 2 },
    ],
    7: [
      { name: "High Voltage Engineering", credits: 3 },
      { name: "Renewable Energy Systems", credits: 3 },
      { name: "Elective - V", credits: 3 },
      { name: "Elective - VI", credits: 3 },
      { name: "Major Project - Part I", credits: 4 },
      { name: "Industrial Training Seminar", credits: 2 },
    ],
    8: [
      { name: "Smart Grid Technology", credits: 3 },
      { name: "Elective - VII", credits: 3 },
      { name: "Major Project - Part II", credits: 8 },
      { name: "Seminar & Technical Communication", credits: 2 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  },
};

// RTU Official Grading Scale
export const RTU_GRADING = [
  { minMarks: 91, maxMarks: 100, grade: "O",  gradePoints: 10, label: "Outstanding" },
  { minMarks: 76, maxMarks: 90,  grade: "A+", gradePoints: 9,  label: "Excellent" },
  { minMarks: 61, maxMarks: 75,  grade: "A",  gradePoints: 8,  label: "Very Good" },
  { minMarks: 51, maxMarks: 60,  grade: "B+", gradePoints: 7,  label: "Good" },
  { minMarks: 41, maxMarks: 50,  grade: "B",  gradePoints: 6,  label: "Above Average" },
  { minMarks: 36, maxMarks: 40,  grade: "C",  gradePoints: 5,  label: "Average / Pass" },
  { minMarks: 0,  maxMarks: 35,  grade: "F",  gradePoints: 0,  label: "Fail / Backlog" },
];

// Helper: marks se grade nikalo
export function getGradeFromMarks(marks) {
  if (marks === "" || marks === null || marks === undefined) return null;
  const m = Number(marks);
  if (isNaN(m) || m < 0 || m > 100) return null;
  return RTU_GRADING.find((g) => m >= g.minMarks && m <= g.maxMarks) || null;
}

// Helper: ek semester ki SGPA nikalo
export function calculateSGPA(subjects) {
  let totalWeighted = 0;
  let totalCredits = 0;
  let hasF = false;

  subjects.forEach((sub) => {
    const grade = getGradeFromMarks(sub.marks);
    if (grade) {
      totalWeighted += grade.gradePoints * sub.credits;
      totalCredits += sub.credits;
      if (grade.grade === "F") hasF = true;
    }
  });

  if (totalCredits === 0) return { sgpa: 0, totalCredits: 0, hasBacklog: false };

  return {
    sgpa: parseFloat((totalWeighted / totalCredits).toFixed(2)),
    totalCredits,
    hasBacklog: hasF,
  };
}

// Helper: sabhi semesters ki CGPA nikalo
export function calculateCGPA(semesterResults) {
  // semesterResults = [{ sgpa, totalCredits }, ...]
  let totalWeighted = 0;
  let totalCredits = 0;

  semesterResults.forEach(({ sgpa, totalCredits: credits }) => {
    totalWeighted += sgpa * credits;
    totalCredits += credits;
  });

  if (totalCredits === 0) return 0;
  return parseFloat((totalWeighted / totalCredits).toFixed(2));
}