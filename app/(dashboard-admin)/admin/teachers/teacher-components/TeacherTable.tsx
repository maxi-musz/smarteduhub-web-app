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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Mail, Phone, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { type ApiTeacher } from "@/hooks/use-teachers-data";
import { TeacherAvatar } from "./TeacherAvatar";

interface TeacherTableProps {
  teachers: ApiTeacher[];
  isLoading: boolean;
  onViewTeacher: (teacherId: string) => void;
  onEditTeacher: (teacherId: string) => void;
  onDeleteTeacher: (teacherId: string) => void;
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
      <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </TableCell>
    <TableCell className="text-right">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
    </TableCell>
  </TableRow>
);

export const TeacherTable = ({
  teachers,
  isLoading,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
}: TeacherTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Classes</TableHead>
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
        ) : teachers.length > 0 ? (
          teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <TeacherAvatar teacher={teacher} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {teacher.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {teacher.phone_number}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    <>
                      {teacher.subjects.slice(0, 2).map((subject) => (
                        <Badge
                          key={subject.id}
                          variant="outline"
                          className="border-gray-300 text-gray-700 text-xs"
                        >
                          {subject.name}
                        </Badge>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.subjects.length - 2}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {teacher.isClassTeacher && teacher.classManagingDetails ? (
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {teacher.classManagingDetails.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-400">None</span>
                )}
              </TableCell>
              <TableCell>
                {teacher.currentClass ? (
                  <div className="text-sm">
                    <div className="font-medium">{teacher.currentClass.subjectName}</div>
                    <div className="text-gray-500 text-xs">
                      {teacher.currentClass.className} • {teacher.currentClass.startTime} - {teacher.currentClass.endTime}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No upcoming class</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    teacher.status === "active"
                      ? "secondary"
                      : teacher.status === "suspended"
                      ? "destructive"
                      : "outline"
                  }
                  className={
                    teacher.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : teacher.status === "suspended"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
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
                    <DropdownMenuItem onClick={() => onViewTeacher(teacher.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditTeacher(teacher.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteTeacher(teacher.id)}
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
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              No teachers found matching your criteria
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

