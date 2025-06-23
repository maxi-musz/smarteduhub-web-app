"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StudentActionModal } from "./StudentActionModal";
import { MoreVertical } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  class: string;
  performance: number;
  attendance: number;
}

interface StudentsTableProps {
  selectedClass: string;
  searchQuery: string;
  sortBy: string;
}

// Mock data - replace with real data
const mockStudents: Student[] = [
  {
    id: "student-1",
    fullName: "Femi Johnson",
    class: "JSS1",
    performance: 78,
    attendance: 92,
  },
  {
    id: "student-2",
    fullName: "Aisha Bello",
    class: "JSS2",
    performance: 85,
    attendance: 88,
  },
  {
    id: "student-3",
    fullName: "Chinedu Okafor",
    class: "JSS3",
    performance: 74,
    attendance: 90,
  },
  {
    id: "student-4",
    fullName: "Maryam Sani",
    class: "SS1",
    performance: 81,
    attendance: 95,
  },
  {
    id: "student-5",
    fullName: "Emeka Obi",
    class: "SS2",
    performance: 69,
    attendance: 87,
  },
  {
    id: "student-6",
    fullName: "Grace Udo",
    class: "SS3",
    performance: 92,
    attendance: 98,
  },
  {
    id: "student-7",
    fullName: "Tunde Bakare",
    class: "JSS1",
    performance: 80,
    attendance: 85,
  },
  {
    id: "student-8",
    fullName: "Ngozi Nwosu",
    class: "JSS2",
    performance: 77,
    attendance: 91,
  },
  {
    id: "student-9",
    fullName: "Ibrahim Musa",
    class: "JSS3",
    performance: 88,
    attendance: 93,
  },
  {
    id: "student-10",
    fullName: "Blessing Eze",
    class: "SS1",
    performance: 90,
    attendance: 97,
  },
  {
    id: "student-11",
    fullName: "Samuel Adeyemi",
    class: "SS2",
    performance: 73,
    attendance: 84,
  },
  {
    id: "student-12",
    fullName: "Fatima Abdullahi",
    class: "SS3",
    performance: 95,
    attendance: 99,
  },
  {
    id: "student-13",
    fullName: "Chika Ike",
    class: "JSS1",
    performance: 82,
    attendance: 89,
  },
  {
    id: "student-14",
    fullName: "Bola Shittu",
    class: "JSS2",
    performance: 76,
    attendance: 86,
  },
  {
    id: "student-15",
    fullName: "Peter Ojo",
    class: "JSS3",
    performance: 84,
    attendance: 92,
  },
  {
    id: "student-16",
    fullName: "Halima Garba",
    class: "SS1",
    performance: 79,
    attendance: 90,
  },
  {
    id: "student-17",
    fullName: "Uche Nnaji",
    class: "SS2",
    performance: 87,
    attendance: 94,
  },
  {
    id: "student-18",
    fullName: "Ruth Akpan",
    class: "SS3",
    performance: 91,
    attendance: 96,
  },
  {
    id: "student-19",
    fullName: "Segun Adebayo",
    class: "JSS1",
    performance: 75,
    attendance: 88,
  },
  {
    id: "student-20",
    fullName: "Zainab Lawal",
    class: "JSS2",
    performance: 83,
    attendance: 90,
  },
  {
    id: "student-21",
    fullName: "Kingsley Eze",
    class: "JSS3",
    performance: 86,
    attendance: 91,
  },
  {
    id: "student-22",
    fullName: "Amina Sule",
    class: "SS1",
    performance: 89,
    attendance: 93,
  },
  {
    id: "student-23",
    fullName: "David Okon",
    class: "SS2",
    performance: 72,
    attendance: 85,
  },
  {
    id: "student-24",
    fullName: "Esther Olamide",
    class: "SS3",
    performance: 94,
    attendance: 97,
  },
  {
    id: "student-25",
    fullName: "Musa Abdullahi",
    class: "JSS1",
    performance: 81,
    attendance: 87,
  },
  {
    id: "student-26",
    fullName: "Chisom Umeh",
    class: "JSS2",
    performance: 79,
    attendance: 89,
  },
  {
    id: "student-27",
    fullName: "Ifeanyi Nwankwo",
    class: "JSS3",
    performance: 85,
    attendance: 92,
  },
  {
    id: "student-28",
    fullName: "Ayo Ogunleye",
    class: "SS1",
    performance: 88,
    attendance: 95,
  },
  {
    id: "student-29",
    fullName: "Patience Danjuma",
    class: "SS2",
    performance: 77,
    attendance: 86,
  },
  {
    id: "student-30",
    fullName: "Chinyere Okoro",
    class: "SS3",
    performance: 93,
    attendance: 98,
  },
  {
    id: "student-31",
    fullName: "Bashir Sani",
    class: "JSS1",
    performance: 80,
    attendance: 84,
  },
  {
    id: "student-32",
    fullName: "Gloria Eze",
    class: "JSS2",
    performance: 78,
    attendance: 90,
  },
  {
    id: "student-33",
    fullName: "Oluwaseun Ajayi",
    class: "JSS3",
    performance: 87,
    attendance: 93,
  },
  {
    id: "student-34",
    fullName: "Salma Bello",
    class: "SS1",
    performance: 91,
    attendance: 96,
  },
  {
    id: "student-35",
    fullName: "Emmanuel Udo",
    class: "SS2",
    performance: 74,
    attendance: 85,
  },
  {
    id: "student-36",
    fullName: "Victoria Akintola",
    class: "SS3",
    performance: 96,
    attendance: 99,
  },
  {
    id: "student-37",
    fullName: "Ahmed Yusuf",
    class: "JSS1",
    performance: 83,
    attendance: 88,
  },
  {
    id: "student-38",
    fullName: "Peace Nwachukwu",
    class: "JSS2",
    performance: 81,
    attendance: 91,
  },
  {
    id: "student-39",
    fullName: "Chukwuemeka Obi",
    class: "JSS3",
    performance: 89,
    attendance: 94,
  },
  {
    id: "student-40",
    fullName: "Blessing Musa",
    class: "SS1",
    performance: 92,
    attendance: 97,
  },
  {
    id: "student-41",
    fullName: "Tosin Afolabi",
    class: "SS2",
    performance: 76,
    attendance: 86,
  },
  {
    id: "student-42",
    fullName: "Janet Okafor",
    class: "SS3",
    performance: 95,
    attendance: 98,
  },
  {
    id: "student-43",
    fullName: "Suleiman Abdullahi",
    class: "JSS1",
    performance: 82,
    attendance: 89,
  },
  {
    id: "student-44",
    fullName: "Adaeze Nwosu",
    class: "JSS2",
    performance: 84,
    attendance: 92,
  },
  {
    id: "student-45",
    fullName: "Michael Eze",
    class: "JSS3",
    performance: 86,
    attendance: 90,
  },
  {
    id: "student-46",
    fullName: "Yetunde Balogun",
    class: "SS1",
    performance: 90,
    attendance: 95,
  },
  {
    id: "student-47",
    fullName: "Ibrahim Adamu",
    class: "SS2",
    performance: 79,
    attendance: 87,
  },
];

export function StudentsTable({
  selectedClass,
  searchQuery,
  sortBy,
}: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const studentsPerPage = 15;

  // Filter and sort students
  const filteredStudents = mockStudents
    .filter((student) => {
      const matchesClass =
        selectedClass === "" || student.class === selectedClass;
      const matchesSearch = student.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Performance") {
        return b.performance - a.performance;
      } else {
        return b.attendance - a.attendance;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const handleActionClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 70) return "text-green-600";
    if (performance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 75) return "text-green-600";
    if (attendance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brand-border">
              <TableRow>
                <TableHead className="w-16">S/N</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.fullName}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {student.class}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getPerformanceColor(
                        student.performance
                      )}`}
                    >
                      {student.performance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getAttendanceColor(
                        student.attendance
                      )}`}
                    >
                      {student.attendance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleActionClick(student)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Student Action Modal */}
      <StudentActionModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
