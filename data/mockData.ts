export interface Student {
  id: string;
  name: string;
  avatar?: string;
  grade: string;
  attendance: number;
  performance: number;
  lastActive: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  students: number;
  averageGrade: number;
  nextClass: string;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface ScheduleItem {
  id: string;
  subject: string;
  subjectCode: string;
  color: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface GradeItem {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  assignment: string;
  score: number;
  outOf: number;
  date: string;
  status: "graded" | "pending" | "draft";
  type: string; // Added to match the Grade interface
  class: string; // Added to match the Grade interface
}

export interface TeacherProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  specialization: string[];
  joinDate: string;
}

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "st001",
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    grade: "10A",
    attendance: 95,
    performance: 87,
    lastActive: "2 days ago",
  },
  {
    id: "st002",
    name: "Maria Garcia",
    avatar: "/placeholder.svg",
    grade: "10A",
    attendance: 98,
    performance: 92,
    lastActive: "1 day ago",
  },
  {
    id: "st003",
    name: "John Smith",
    avatar: "/placeholder.svg",
    grade: "10B",
    attendance: 85,
    performance: 78,
    lastActive: "3 days ago",
  },
  {
    id: "st004",
    name: "Sarah Williams",
    avatar: "/placeholder.svg",
    grade: "10A",
    attendance: 92,
    performance: 90,
    lastActive: "Today",
  },
  {
    id: "st005",
    name: "David Brown",
    avatar: "/placeholder.svg",
    grade: "10B",
    attendance: 88,
    performance: 82,
    lastActive: "Yesterday",
  },
];

// Mock Subjects
export const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH101",
    color: "#3B82F6",
    students: 28,
    averageGrade: 78,
    nextClass: "Today, 2:00 PM",
    gradeDistribution: { A: 8, B: 12, C: 6, D: 2 },
  },
  {
    id: "2",
    name: "Science",
    code: "SCI102",
    color: "#10B981",
    students: 28,
    averageGrade: 82,
    nextClass: "Tomorrow, 10:00 AM",
    gradeDistribution: { A: 10, B: 11, C: 5, D: 2 },
  },
  {
    id: "3",
    name: "History",
    code: "HIS103",
    color: "#F59E0B",
    students: 25,
    averageGrade: 76,
    nextClass: "Wednesday, 1:00 PM",
    gradeDistribution: { A: 7, B: 10, C: 6, D: 2 },
  },
  {
    id: "4",
    name: "Physics",
    code: "PHY104",
    color: "#EF4444",
    students: 37,
    averageGrade: 71,
    nextClass: "Thursday, 1:00 PM",
    gradeDistribution: { A: 8, B: 16, C: 5, D: 8 },
  },
];

// Mock Schedule
export const mockSchedule: ScheduleItem[] = [
  {
    id: "sch001",
    subject: "Mathematics",
    subjectCode: "MATH101",
    color: "#1E88E5",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room 201",
  },
  {
    id: "sch002",
    subject: "Science",
    subjectCode: "SCI102",
    color: "#43A047",
    day: "Monday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Lab 102",
  },
  {
    id: "sch003",
    subject: "History",
    subjectCode: "HIS103",
    color: "#FB8C00",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room 305",
  },
  {
    id: "sch004",
    subject: "English",
    subjectCode: "ENG104",
    color: "#E53935",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room 203",
  },
  {
    id: "sch005",
    subject: "Mathematics",
    subjectCode: "MATH101",
    color: "#1E88E5",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room 201",
  },
];

// Updated mockGrades to include the new required fields
export const mockGrades: GradeItem[] = [
  {
    id: "g001",
    studentName: "Alex Johnson",
    studentId: "st001",
    subject: "Mathematics",
    assignment: "Mid-term Exam",
    score: 85,
    outOf: 100,
    date: "2025-10-15",
    status: "graded",
    type: "exam",
    class: "SS1A",
  },
  {
    id: "g002",
    studentName: "Maria Garcia",
    studentId: "st002",
    subject: "Mathematics",
    assignment: "Mid-term Exam",
    score: 92,
    outOf: 100,
    date: "2025-10-15",
    status: "graded",
    type: "exam",
    class: "SS1A",
  },
  {
    id: "g003",
    studentName: "John Smith",
    studentId: "st003",
    subject: "Science",
    assignment: "Lab Report",
    score: 78,
    outOf: 100,
    date: "2025-10-18",
    status: "graded",
    type: "lab-report",
    class: "SS1B",
  },
  {
    id: "g004",
    studentName: "Sarah Williams",
    studentId: "st004",
    subject: "History",
    assignment: "Essay",
    score: 0,
    outOf: 100,
    date: "2025-10-20",
    status: "pending",
    type: "essay",
    class: "SS1A",
  },
  {
    id: "g005",
    studentName: "David Brown",
    studentId: "st005",
    subject: "English",
    assignment: "Book Report",
    score: 0,
    outOf: 100,
    date: "2025-10-22",
    status: "draft",
    type: "book-report",
    class: "SS1B",
  },
];

// Teacher Profile
export const teacherProfile: TeacherProfile = {
  id: "teacher001",
  name: "Mr. Adekola O.A.",
  avatar: "/teachers/mr.adekola.o.a.jpg",
  title: "Senior Teacher",
  department: "Mathematics",
  email: "adekola@educate.com",
  phone: "(234) 123-4567",
  bio: "Mr. Adekola has been teaching for over 10 years with a specialization in advanced mathematics. He has published several papers on effective teaching methods in mathematics.",
  specialization: ["Calculus", "Algebra", "Statistics"],
  joinDate: "2017-08-15",
};

export const teacherClasses = ["SS1A", "SS2B", "JSS3C"];
export const teacherSubjects = mockSubjects.map((subject) => subject.name);

// Dashboard Stats
export const dashboardStats = {
  studentCount: 124,
  averageAttendance: 91,
  averagePerformance: 83,
  upcomingTests: 3,
  pendingGrades: 12,
  recentAnnouncements: [
    { id: "ann1", title: "Parent-Teacher Meeting", date: "Nov 15, 2025" },
    { id: "ann2", title: "End of Term Exams", date: "Dec 10, 2025" },
    {
      id: "ann3",
      title: "School Closure - Staff Development",
      date: "Nov 28, 2025",
    },
  ],
};
