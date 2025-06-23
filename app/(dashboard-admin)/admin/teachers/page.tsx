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
  Mail,
  Phone,
  Users,
  BookOpen,
  Calendar,
  BarChart2,
  Download,
  Upload,
  Clock,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  joinDate: string;
  status: "active" | "inactive";
  performance: {
    attendance: number;
    studentSatisfaction: number;
    classCompletion: number;
  };
  nextClass?: {
    subject: string;
    class: string;
    time: string;
  };
}

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      email: "john.smith@smartedu.com",
      phone: "+234 801 234 5678",
      subjects: ["Mathematics", "Physics"],
      classes: ["SS1", "SS2", "SS3"],
      qualification: "Ph.D. in Mathematics",
      joinDate: "2022-09-01",
      status: "active",
      performance: {
        attendance: 95,
        studentSatisfaction: 92,
        classCompletion: 98,
      },
      nextClass: {
        subject: "Physics",
        class: "SS2A",
        time: "10:00 AM",
      },
    },
    {
      id: "2",
      name: "Mrs. Sarah Johnson",
      email: "sarah.j@smartedu.com",
      phone: "+234 802 345 6789",
      subjects: ["English", "Literature"],
      classes: ["JS1", "JS2", "JS3"],
      qualification: "M.A. in English Literature",
      joinDate: "2021-03-15",
      status: "active",
      performance: {
        attendance: 88,
        studentSatisfaction: 95,
        classCompletion: 90,
      },
      nextClass: {
        subject: "English",
        class: "JS3B",
        time: "11:30 AM",
      },
    },
    // Add more teachers...
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    classes: [],
    qualification: "",
    status: "active",
  });

  // Calculate statistics
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === "active").length;
  const averageAttendance = Math.round(
    teachers.reduce((acc, t) => acc + t.performance.attendance, 0) /
      teachers.length
  );
  const averageSatisfaction = Math.round(
    teachers.reduce((acc, t) => acc + t.performance.studentSatisfaction, 0) /
      teachers.length
  );

  const handleAddTeacher = () => {
    const { ...restNewTeacher } = newTeacher as Teacher;
    const teacher: Teacher = {
      ...restNewTeacher,
      joinDate: new Date().toISOString().split("T")[0],
      performance: {
        attendance: 100,
        studentSatisfaction: 100,
        classCompletion: 100,
      },
    };
    setTeachers([...teachers, teacher]);
    setIsAddModalOpen(false);
    setNewTeacher({
      name: "",
      email: "",
      phone: "",
      subjects: [],
      classes: [],
      qualification: "",
      status: "active",
    });
  };

  // const handleEditTeacher = (teacher: Teacher) => {
  //   const updatedTeachers = teachers.map((t) =>
  //     t.id === teacher.id ? teacher : t
  //   );
  //   setTeachers(updatedTeachers);
  //   setEditingTeacher(null);
  // };

  // const handleDeleteTeacher = (id: string) => {
  //   setTeachers(teachers.filter((teacher) => teacher.id !== id));
  // };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || teacher.status === filterStatus;
    const matchesSubject =
      filterSubject === "all" || teacher.subjects.includes(filterSubject);
    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Teachers Management
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Teachers</p>
                <h3 className="text-2xl font-bold">{totalTeachers}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Teachers</p>
                <h3 className="text-2xl font-bold">{activeTeachers}</h3>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
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
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Student Satisfaction</p>
                <h3 className="text-2xl font-bold">{averageSatisfaction}%</h3>
              </div>
              <BarChart2 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-12">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Literature">Literature</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
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
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Fill in the teacher&apos;s information below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="qualification" className="text-right">
                      Qualification
                    </Label>
                    <Input
                      id="qualification"
                      value={newTeacher.qualification}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          qualification: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddTeacher}>
                    Add Teacher
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Next Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-gray-500">
                        {teacher.qualification}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {teacher.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((class_) => (
                        <Badge key={class_} variant="outline">
                          {class_}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <span className="w-24">Attendance:</span>
                        <span className="font-medium">
                          {teacher.performance.attendance}%
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24">Satisfaction:</span>
                        <span className="font-medium">
                          {teacher.performance.studentSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {teacher.nextClass && (
                      <div className="text-sm">
                        <div className="font-medium">
                          {teacher.nextClass.subject}
                        </div>
                        <div className="text-gray-500">
                          {teacher.nextClass.class}
                        </div>
                        <div className="text-gray-400">
                          {teacher.nextClass.time}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        teacher.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {teacher.status}
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
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart2 className="h-4 w-4 mr-2" />
                          View Performance
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
    </div>
  );
};

export default AdminTeachers;
