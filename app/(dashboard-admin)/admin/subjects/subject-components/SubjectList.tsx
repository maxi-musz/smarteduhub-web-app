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
import { MoreVertical, Eye, Pencil, Trash2, Users } from "lucide-react";
import { type ApiSubject } from "@/hooks/use-subjects-data";

interface SubjectListProps {
  subjects: ApiSubject[];
  isLoading: boolean;
  onViewSubject: (subjectId: string) => void;
  onEditSubject: (subjectId: string) => void;
  onDeleteSubject: (subjectId: string) => void;
}

const TableSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </TableCell>
    <TableCell className="text-right">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
    </TableCell>
  </TableRow>
);

export const SubjectList = ({
  subjects,
  isLoading,
  onViewSubject,
  onEditSubject,
  onDeleteSubject,
}: SubjectListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Teachers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableSkeleton key={index} />
          ))
        ) : subjects.length > 0 ? (
          subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color || "#6B7280" }}
                  />
                  <div>
                    <div className="font-medium capitalize">{subject.name}</div>
                    {subject.description && (
                      <div className="text-sm text-gray-500 capitalize line-clamp-1">
                        {subject.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {subject.code ? (
                  <Badge variant="outline">{subject.code}</Badge>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {subject.class ? (
                  <Badge variant="secondary">{subject.class.name}</Badge>
                ) : (
                  <span className="text-sm text-gray-400">Not assigned</span>
                )}
              </TableCell>
              <TableCell>
                {subject.teachers.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{subject.teachers.length}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No teachers</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
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
                    <DropdownMenuItem onClick={() => onViewSubject(subject.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditSubject(subject.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteSubject(subject.id)}
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
              No subjects found matching your criteria
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

