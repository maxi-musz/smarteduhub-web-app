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
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  instructor: string;
  credits: number;
  duration: string;
  capacity: number;
  enrolled: number;
  status: "active" | "inactive" | "archived";
}

const departments = ["Science", "Arts", "Commercial"];

const AdminSubjects = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Mathematics",
      code: "MTH101",
      department: "Science",
      instructor: "Dr. Smith",
      credits: 3,
      duration: "3 months",
      capacity: 40,
      enrolled: 35,
      status: "active",
    },
    {
      id: "2",
      name: "English Language",
      code: "ENG101",
      department: "Arts",
      instructor: "Mrs. Johnson",
      credits: 3,
      duration: "3 months",
      capacity: 45,
      enrolled: 40,
      status: "active",
    },
    {
      id: "3",
      name: "Physics",
      code: "PHY101",
      department: "Science",
      instructor: "Dr. Brown",
      credits: 4,
      duration: "4 months",
      capacity: 35,
      enrolled: 30,
      status: "active",
    },
    {
      id: "4",
      name: "Economics",
      code: "ECO101",
      department: "Commercial",
      instructor: "Mr. Wilson",
      credits: 3,
      duration: "3 months",
      capacity: 50,
      enrolled: 45,
      status: "inactive",
    },
    {
      id: "5",
      name: "Chemistry",
      code: "CHM101",
      department: "Science",
      instructor: "Dr. Davis",
      credits: 4,
      duration: "4 months",
      capacity: 35,
      enrolled: 0,
      status: "archived",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: "",
    code: "",
    department: "",
    instructor: "",
    credits: 3,
    duration: "",
    capacity: 40,
    enrolled: 0,
    status: "active",
  });

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.code) {
      alert("Please fill in all required fields");
      return;
    }

    const { ...courseData } = newCourse as Course;
    const course: Course = {
      ...courseData,
    };
    setCourses([...courses, course]);
    setIsAddModalOpen(false);
    setNewCourse({
      name: "",
      code: "",
      department: "",
      instructor: "",
      credits: 3,
      duration: "",
      capacity: 40,
      enrolled: 0,
      status: "active",
    });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || course.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Count courses by status
  const activeCourses = courses.filter((c) => c.status === "active").length;
  // const inactiveCourses = courses.filter((c) => c.status === "inactive").length;
  const archivedCourses = courses.filter((c) => c.status === "archived").length;
  const totalEnrollments = courses.reduce(
    (sum, course) => sum + course.enrolled,
    0
  );

  // Add this state to control which dialog is open for delete
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-2xl font-bold">Subject Management</h2> */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Students Management
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          >
            <Search className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Fill in the course information below
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Course Name*</Label>
                    <Input
                      id="name"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Course Code*</Label>
                    <Input
                      id="code"
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Select
                      value={newCourse.department}
                      onValueChange={(value) =>
                        setNewCourse({ ...newCourse, department: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={newCourse.instructor}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          instructor: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={newCourse.credits}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          credits: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, duration: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newCourse.capacity}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          capacity: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={newCourse.status}
                      onValueChange={(
                        value: "active" | "inactive" | "archived"
                      ) => setNewCourse({ ...newCourse, status: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCourse}>Add Course</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <h3 className="text-2xl font-bold">{courses.length}</h3>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Courses</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {activeCourses}
                </h3>
              </div>
              <GraduationCap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {totalEnrollments}
                </h3>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Archived Courses</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {archivedCourses}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Menu */}
      {isFilterMenuOpen && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-gray-500">{course.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.department}</Badge>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {course.enrolled} / {course.capacity}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (course.enrolled / course.capacity) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "active"
                          ? "default"
                          : course.status === "inactive"
                          ? "destructive"
                          : "destructive"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Subject</DialogTitle>
                          </DialogHeader>
                          {/* Add edit form fields similar to add form */}
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={openDeleteId === course.id}
                        onOpenChange={(open) =>
                          setOpenDeleteId(open ? course.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setOpenDeleteId(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Course</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this course? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setOpenDeleteId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleDeleteCourse(course.id);
                                setOpenDeleteId(null);
                              }}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubjects;
