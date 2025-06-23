"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, Edit } from "lucide-react";
import { NewAssignmentModal } from "@/components/teacher/grading/NewAssignmentModal";
import { ViewDetailsModal } from "@/components/teacher/grading/ViewDetailsModal";
import { EditGradeModal } from "@/components/teacher/grading/EditGradeModal";

const assignmentTypes = [
  "All Types",
  "Exam",
  "Lab Report",
  "Essay",
  "Book Report",
  "Homework",
  "Quiz",
];

const classes = ["All Classes", "JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "History",
  "Physics",
  "Chemistry",
];

const mockGrades = [
  {
    id: 1,
    title: "Mid-term Exam",
    type: "Exam",
    subject: "Mathematics",
    studentName: "Alex Johnson",
    studentInitial: "A",
    class: "SS1",
    score: "85/100",
    date: "2025-10-15",
    status: "Graded",
  },
  {
    id: 2,
    title: "Mid-term Exam",
    type: "Exam",
    subject: "Mathematics",
    studentName: "Maria Garcia",
    studentInitial: "M",
    class: "SS1",
    score: "92/100",
    date: "2025-10-15",
    status: "Graded",
  },
  {
    id: 3,
    title: "Lab Report",
    type: "Lab Report",
    subject: "Science",
    studentName: "John Smith",
    studentInitial: "J",
    class: "SS2",
    score: "78/100",
    date: "2025-10-18",
    status: "Graded",
  },
  {
    id: 4,
    title: "Physics Assignment",
    type: "Homework",
    subject: "Physics",
    studentName: "Sarah Wilson",
    studentInitial: "S",
    class: "SS3",
    score: "-",
    date: "2025-10-20",
    status: "Pending",
  },
  {
    id: 5,
    title: "Chemistry Quiz",
    type: "Quiz",
    subject: "Chemistry",
    studentName: "Mike Brown",
    studentInitial: "M",
    class: "JSS3",
    score: "88/100",
    date: "2025-10-12",
    status: "Graded",
  },
  {
    id: 6,
    title: "History Essay",
    type: "Essay",
    subject: "History",
    studentName: "Emma Davis",
    studentInitial: "E",
    class: "JSS2",
    score: "-",
    date: "2025-10-25",
    status: "Draft",
  },
  {
    id: 7,
    title: "English Book Report",
    type: "Book Report",
    subject: "English",
    studentName: "James Miller",
    studentInitial: "J",
    class: "JSS1",
    score: "75/100",
    date: "2025-10-10",
    status: "Graded",
  },
  {
    id: 8,
    title: "Math Homework",
    type: "Homework",
    subject: "Mathematics",
    studentName: "Lisa Anderson",
    studentInitial: "L",
    class: "SS1",
    score: "-",
    date: "2025-10-22",
    status: "Pending",
  },
  {
    id: 9,
    title: "Science Lab Experiment",
    type: "Lab Report",
    subject: "Science",
    studentName: "David Lee",
    studentInitial: "D",
    class: "SS2",
    score: "95/100",
    date: "2025-10-14",
    status: "Graded",
  },
  {
    id: 10,
    title: "Physics Quiz",
    type: "Quiz",
    subject: "Physics",
    studentName: "Anna Taylor",
    studentInitial: "A",
    class: "SS3",
    score: "-",
    date: "2025-10-28",
    status: "Draft",
  },
];

export default function TeacherGradingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeTab, setActiveTab] = useState("all");
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const filteredGrades = mockGrades.filter((grade) => {
    const matchesSearch =
      grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "All Classes" || grade.class === selectedClass;
    const matchesSubject =
      selectedSubject === "All Subjects" || grade.subject === selectedSubject;
    const matchesType =
      selectedType === "All Types" || grade.type === selectedType;

    let matchesTab = true;
    if (activeTab === "pending") matchesTab = grade.status === "Pending";
    else if (activeTab === "graded") matchesTab = grade.status === "Graded";
    else if (activeTab === "drafts") matchesTab = grade.status === "Draft";

    return (
      matchesSearch &&
      matchesClass &&
      matchesSubject &&
      matchesType &&
      matchesTab
    );
  });

  interface Grade {
    id: number;
    title: string;
    type: string;
    subject: string;
    studentName: string;
    studentInitial: string;
    class: string;
    score: string;
    date: string;
    status: string;
  }

  const handleViewDetails = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsViewDetailsOpen(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditGradeOpen(true);
  };

  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Grading</h1>
            <p className="text-brand-light-accent-1 mt-1">
              Manage assignments and grades
            </p>
          </div>
          <Button
            className="bg-brand-primary hover:bg-brand-primary-hover"
            onClick={() => setIsNewAssignmentOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assignments or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Tabs and Class Filter */}
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Filter by Class
            </span>
            <div className="flex gap-2">
              {classes.map((cls) => (
                <Badge
                  key={cls}
                  variant={selectedClass === cls ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedClass === cls
                      ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedClass(cls)}
                >
                  {cls}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredGrades.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grade.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {grade.subject}
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {grade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {grade.studentInitial}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {grade.studentName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {grade.class}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{grade.class}</TableCell>
                      <TableCell>
                        <span className="font-medium">{grade.score}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            grade.status === "Graded" ? "default" : "secondary"
                          }
                          className={
                            grade.status === "Graded"
                              ? "bg-green-100 text-green-800"
                              : grade.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {grade.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {grade.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(grade)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-brand-primary hover:bg-brand-primary-hover"
                            onClick={() => handleEditGrade(grade)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Grade
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Edit className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No grades found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <NewAssignmentModal
        open={isNewAssignmentOpen}
        onOpenChange={setIsNewAssignmentOpen}
      />
      <ViewDetailsModal
        open={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
        grade={selectedGrade}
      />
      <EditGradeModal
        open={isEditGradeOpen}
        onOpenChange={setIsEditGradeOpen}
        grade={selectedGrade}
      />
    </div>
  );
}
