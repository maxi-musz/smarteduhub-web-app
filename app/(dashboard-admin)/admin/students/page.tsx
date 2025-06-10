"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  User,
  Users,
  Calendar,
  BarChart2,
  Download,
  Upload,
  MoreVertical,
  Clock,
  Award,
  BookMarked,
  ChevronDown,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  admissionNumber: string;
  guardianName: string;
  guardianPhone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  status: "active" | "inactive" | "suspended";
  image?: string;
  performance: {
    attendance: number;
    averageGrade: number;
    subjects: {
      name: string;
      grade: number;
      teacher: string;
    }[];
  };
  nextClass?: {
    subject: string;
    teacher: string;
    time: string;
    room: string;
  };
}

const availableClasses = ["JS1", "JS2", "JS3", "SS1", "SS2", "SS3"];

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Lateef Saani",
      email: "Sanni.Lateef@student.smartedu.com",
      phone: "+234 801 234 5678",
      class: "SS2",
      admissionNumber: "SMT2023001",
      guardianName: "Mr. Sanni",
      guardianPhone: "+234 802 345 6789",
      dateOfBirth: "2006-05-15",
      gender: "male",
      status: "active",
      image: "/placeholder.svg",
      performance: {
        attendance: 95,
        averageGrade: 85,
        subjects: [
          { name: "Mathematics", grade: 88, teacher: "Mr. Smith" },
          { name: "English", grade: 82, teacher: "Mrs. Johnson" },
          { name: "Science", grade: 87, teacher: "Dr. Brown" },
        ],
      },
      nextClass: {
        subject: "Physics",
        teacher: "Dr. Brown",
        time: "10:00 AM",
        room: "Room 201",
      },
    },
    {
      id: "2",
      name: "Emmanuel Taiwo",
      email: "taiwo.emma@student.smartedu.com",
      phone: "+234 803 456 7890",
      class: "JS3",
      admissionNumber: "SMT2023002",
      guardianName: "Mr. Taiwo",
      guardianPhone: "+234 804 567 8901",
      dateOfBirth: "2007-08-22",
      gender: "female",
      status: "active",
      image: "/placeholder.svg",
      performance: {
        attendance: 90,
        averageGrade: 80,
        subjects: [
          { name: "Mathematics", grade: 78, teacher: "Mr. Smith" },
          { name: "English", grade: 75, teacher: "Mrs. Johnson" },
          { name: "Science", grade: 77, teacher: "Dr. Brown" },
        ],
      },
      nextClass: {
        subject: "Chemistry",
        teacher: "Dr. Brown",
        time: "11:00 AM",
        room: "Room 202",
      },
    },
    {
      id: "3",
      name: "Oladele Segun",
      email: "segunkingsley@student.smartedu.com",
      phone: "+234 805 678 9012",
      class: "SS1",
      admissionNumber: "SMT2023003",
      guardianName: "Mr. Segun",
      guardianPhone: "+234 806 789 0123",
      dateOfBirth: "2006-12-03",
      gender: "male",
      status: "inactive",
      image: "/placeholder.svg",
      performance: {
        attendance: 85,
        averageGrade: 75,
        subjects: [
          { name: "Mathematics", grade: 70, teacher: "Mr. Smith" },
          { name: "English", grade: 65, teacher: "Mrs. Johnson" },
          { name: "Science", grade: 67, teacher: "Dr. Brown" },
        ],
      },
      nextClass: {
        subject: "Biology",
        teacher: "Dr. Brown",
        time: "10:00 AM",
        room: "Room 203",
      },
    },
    {
      id: "4",
      name: "Abubakar Lawal",
      email: "lawal.abbu@student.smartedu.com",
      phone: "+234 807 890 1234",
      class: "JS1",
      admissionNumber: "SMT2023004",
      guardianName: "Mr. Lawal",
      guardianPhone: "+234 808 901 2345",
      dateOfBirth: "2008-04-18",
      gender: "female",
      status: "suspended",
      image: "/placeholder.svg",
      performance: {
        attendance: 75,
        averageGrade: 65,
        subjects: [
          { name: "Mathematics", grade: 60, teacher: "Mr. Smith" },
          { name: "English", grade: 55, teacher: "Mrs. Johnson" },
          { name: "Science", grade: 57, teacher: "Dr. Brown" },
        ],
      },
      nextClass: {
        subject: "History",
        teacher: "Dr. Brown",
        time: "11:00 AM",
        room: "Room 204",
      },
    },
    {
      id: "5",
      name: "David Johnson",
      email: "david.b@student.smartedu.com",
      phone: "+234 809 012 3456",
      class: "SS3",
      admissionNumber: "SMT2023005",
      guardianName: "Mr. David",
      guardianPhone: "+234 810 123 4567",
      dateOfBirth: "2005-09-30",
      gender: "male",
      status: "active",
      image: "/placeholder.svg",
      performance: {
        attendance: 90,
        averageGrade: 80,
        subjects: [
          { name: "Mathematics", grade: 78, teacher: "Mr. Smith" },
          { name: "English", grade: 75, teacher: "Mrs. Johnson" },
          { name: "Science", grade: 77, teacher: "Dr. Brown" },
        ],
      },
      nextClass: {
        subject: "Physics",
        teacher: "Dr. Brown",
        time: "10:00 AM",
        room: "Room 205",
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPerformance, setSelectedPerformance] = useState<string>("all");
  // const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedStudentForPerformance, setSelectedStudentForPerformance] =
    useState<Student | null>(null);

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    email: "",
    phone: "",
    class: "",
    admissionNumber: "",
    guardianName: "",
    guardianPhone: "",
    dateOfBirth: "",
    gender: "male",
    status: "active",
    image: "/placeholder.svg",
  });

  // Add performance data
  const performanceData = {
    attendance: [
      { month: "Jan", value: 95 },
      { month: "Feb", value: 92 },
      { month: "Mar", value: 88 },
      { month: "Apr", value: 90 },
      { month: "May", value: 94 },
      { month: "Jun", value: 91 },
    ],
    grades: [
      { month: "Jan", value: 85 },
      { month: "Feb", value: 82 },
      { month: "Mar", value: 88 },
      { month: "Apr", value: 90 },
      { month: "May", value: 87 },
      { month: "Jun", value: 89 },
    ],
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.admissionNumber) {
      alert("Please fill in all required fields");
      return;
    }

    const { ...studentData } = newStudent as Student;
    const student: Student = {
      ...studentData,
    };
    setStudents([...students, student]);
    setIsAddModalOpen(false);
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      class: "",
      admissionNumber: "",
      guardianName: "",
      guardianPhone: "",
      dateOfBirth: "",
      gender: "male",
      status: "active",
      image: "/placeholder.svg",
    });
  };

  // const handleEditStudent = () => {
  //   if (!editingStudent) return;

  //   const updatedStudents = students.map((s) =>
  //     s.id === editingStudent.id ? editingStudent : s
  //   );
  //   setStudents(updatedStudents);
  //   setEditingStudent(null);
  // };

  // const handleDeleteStudent = (id: string) => {
  //   setStudents(students.filter((student) => student.id !== id));
  // };

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;
    const matchesPerformance =
      selectedPerformance === "all" ||
      (student.performance.averageGrade >= 80
        ? "high"
        : student.performance.averageGrade >= 60
        ? "medium"
        : "low") === selectedPerformance;

    return matchesSearch && matchesClass && matchesStatus && matchesPerformance;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const averageAttendance = Math.round(
    students.reduce((acc, s) => acc + s.performance.attendance, 0) /
      students.length
  );
  const averageGrade = Math.round(
    students.reduce((acc, s) => acc + s.performance.averageGrade, 0) /
      students.length
  );

  // Add bulk actions handlers
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "export":
        console.log("Exporting selected students:", selectedStudents);
        break;
      case "status":
        console.log("Changing status for selected students:", selectedStudents);
        break;
      case "delete":
        setStudents(
          students.filter((student) => !selectedStudents.includes(student.id))
        );
        setSelectedStudents([]);
        break;
    }
    setShowBulkActions(false);
  };

  // Add quick filter handler
  const handleQuickFilter = (filter: string) => {
    setQuickFilter(filter);
    switch (filter) {
      case "excellent":
        setSelectedPerformance("high");
        break;
      case "attendance":
        setStudents(
          [...students].sort(
            (a, b) => b.performance.attendance - a.performance.attendance
          )
        );
        break;
      case "grades":
        setStudents(
          [...students].sort(
            (a, b) => b.performance.averageGrade - a.performance.averageGrade
          )
        );
        break;
    }
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Students Management
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant={quickFilter === "excellent" ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter("excellent")}
        >
          <Award className="h-4 w-4 mr-2" />
          Excellent Students
        </Button>
        <Button
          variant={quickFilter === "attendance" ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter("attendance")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Best Attendance
        </Button>
        <Button
          variant={quickFilter === "grades" ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter("grades")}
        >
          <BookMarked className="h-4 w-4 mr-2" />
          Top Grades
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {activeStudents}
                </h3>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Attendance</p>
                <h3 className="text-2xl font-bold">{averageAttendance}%</h3>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Grade</p>
                <h3 className="text-2xl font-bold">{averageGrade}%</h3>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-10">
        <div className="flex items-center gap-4">
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedStudents.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {showBulkActions && (
                <div className="absolute top-16 left-0 bg-white shadow-lg rounded-md p-2 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleBulkAction("export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleBulkAction("status")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Change Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedPerformance}
              onValueChange={setSelectedPerformance}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High (80% and above)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (below 60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Fill in the student&apos;s information below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name*</Label>
                      <Input
                        id="name"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admissionNumber">Admission Number*</Label>
                      <Input
                        id="admissionNumber"
                        value={newStudent.admissionNumber}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            admissionNumber: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            email: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            phone: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={newStudent.class}
                        onValueChange={(value) =>
                          setNewStudent({ ...newStudent, class: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableClasses.map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={newStudent.dateOfBirth}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input
                        id="guardianName"
                        value={newStudent.guardianName}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            guardianName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardianPhone">Guardian Phone</Label>
                      <Input
                        id="guardianPhone"
                        value={newStudent.guardianPhone}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            guardianPhone: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      <Select
                        value={newStudent.gender}
                        onValueChange={(value: "male" | "female" | "other") =>
                          setNewStudent({ ...newStudent, gender: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={newStudent.status}
                        onValueChange={(
                          value: "active" | "inactive" | "suspended"
                        ) => setNewStudent({ ...newStudent, status: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(students.map((s) => s.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Next Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([
                            ...selectedStudents,
                            student.id,
                          ]);
                        } else {
                          setSelectedStudents(
                            selectedStudents.filter((id) => id !== student.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">
                          {student.admissionNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <span className="w-24">Attendance:</span>
                        <span className="font-medium">
                          {student.performance.attendance}%
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24">Avg. Grade:</span>
                        <span className="font-medium">
                          {student.performance.averageGrade}%
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24">Subjects:</span>
                        <span className="font-medium">
                          {student.performance.subjects.length}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.nextClass && (
                      <div className="text-sm">
                        <div className="font-medium">
                          {student.nextClass.subject}
                        </div>
                        <div className="text-gray-500">
                          {student.nextClass.teacher}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {student.nextClass.time}
                        </div>
                        <div className="text-gray-400">
                          {student.nextClass.room}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {student.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active"
                          ? "default"
                          : student.status === "inactive"
                          ? "destructive"
                          : "destructive"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedStudentForPerformance(student);
                            setShowPerformanceModal(true);
                          }}
                        >
                          <BarChart2 className="h-4 w-4 mr-2" />
                          View Performance
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookMarked className="h-4 w-4 mr-2" />
                          View Grades
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Modal */}
      {showPerformanceModal && selectedStudentForPerformance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Student Performance</h2>
              <button
                onClick={() => setShowPerformanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData.attendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Grade Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData.grades}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Subject Performance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedStudentForPerformance.performance.subjects.map(
                  (subject, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500">
                          {subject.name}
                        </div>
                        <div className="text-2xl font-bold">
                          {subject.grade}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {subject.teacher}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
