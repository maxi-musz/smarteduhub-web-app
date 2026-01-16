"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Phone, MoreVertical, Pencil, Trash2, TrendingUp, FileText, Calendar, Copy } from "lucide-react";
import { type ApiStudent } from "@/hooks/use-students-data";
import { StudentAvatar } from "./StudentAvatar";
import { useToast } from "@/hooks/use-toast";

interface StudentTableProps {
  students: ApiStudent[];
  isLoading: boolean;
  onViewPerformance: (student: ApiStudent) => void;
  onEditStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
}

const TableSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="space-y-1">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </TableCell>
    <TableCell className="text-right">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
    </TableCell>
  </TableRow>
);

export const StudentTable = ({
  students,
  isLoading,
  onViewPerformance,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${type} copied successfully`,
        duration: 2000,
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Next Class</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableSkeleton key={index} />
          ))
        ) : students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <StudentAvatar student={student} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => copyToClipboard(student.email, "Email")}
                    >
                      {student.email}
                    </span>
                    <Copy
                      className="h-3 w-3 ml-1 text-gray-400 cursor-pointer hover:text-blue-600"
                      onClick={() => copyToClipboard(student.email, "Email")}
                    />
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => copyToClipboard(student.phone_number, "Phone")}
                    >
                      {student.phone_number}
                    </span>
                    <Copy
                      className="h-3 w-3 ml-1 text-gray-400 cursor-pointer hover:text-blue-600"
                      onClick={() => copyToClipboard(student.phone_number, "Phone")}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {student.current_class.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {student.next_class && student.next_class !== "No classes" ? (
                  <div className="text-sm">
                    <div className="font-medium">{student.next_class}</div>
                    {student.next_class_teacher && (
                      <div className="text-gray-500">{student.next_class_teacher}</div>
                    )}
                    {student.next_class_time && (
                      <div className="text-gray-400">{student.next_class_time}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No upcoming class</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={student.status === "active" ? "secondary" : "outline"}
                  className={
                    student.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : student.status === "suspended"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
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
                    <DropdownMenuItem onClick={() => onEditStudent(student.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewPerformance(student)}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Performance
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      View Grade
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteStudent(student.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No students found matching your criteria
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

