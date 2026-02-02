"use client";

import { useState } from "react";
import { useDirectorClasses } from "@/hooks/director/use-director-classes";
import { useTeachersDashboard } from "@/hooks/teacher/use-teachers-data";
import { useStudentsDashboard, useAvailableClasses } from "@/hooks/student/use-students-data";
import {
  useGrantUserAccess,
  useBulkGrantSchoolUserAccess,
} from "@/hooks/access-control";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  UserCircle,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { LibraryResourceType } from "@/hooks/access-control/types";

interface SchoolResourceAccessManagerProps {
  libraryResourceAccessId: string;
  subjectId: string;
  resourceType: LibraryResourceType;
  subjectName: string;
}

export function SchoolResourceAccessManager({
  libraryResourceAccessId,
  subjectId,
  resourceType,
  subjectName,
}: SchoolResourceAccessManagerProps) {
  const { toast } = useToast();
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const grantMutation = useGrantUserAccess();
  const bulkGrantMutation = useBulkGrantSchoolUserAccess();

  const { data: classesData, isLoading: classesLoading } = useDirectorClasses();
  const { data: teachersData, isLoading: teachersLoading } = useTeachersDashboard({
    page: 1,
    limit: 100,
    search: teacherSearch || undefined,
  });
  const { data: studentsData, isLoading: studentsLoading } = useStudentsDashboard({
    page: 1,
    limit: 200,
    class_id: selectedClassId ?? undefined,
    search: studentSearch || undefined,
  });
  const { data: availableClassesData } = useAvailableClasses();

  const classes = (classesData as { classes?: Array<{ id: string; name: string }> })?.classes ?? [];
  const teachers = (teachersData as { teachers?: Array<{ id: string; first_name: string; last_name: string; email: string }> })?.teachers ?? [];
  const students = (studentsData as { students?: Array<{ id: string; first_name: string; last_name: string; email: string }> })?.students ?? [];
  const availableClasses = (availableClassesData as { classes?: Array<{ id: string; name: string; student_count: number }> })?.classes ?? [];

  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleClass = (id: string) => {
    setSelectedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const grantPayload = {
    libraryResourceAccessId,
    resourceType,
    subjectId: resourceType === "SUBJECT" ? subjectId : undefined,
    accessLevel: "FULL" as const,
  };

  const handleGrantToTeachers = async () => {
    if (selectedTeachers.size === 0) {
      toast({ title: "Select at least one teacher", variant: "destructive" });
      return;
    }
    try {
      await bulkGrantMutation.mutateAsync({
        ...grantPayload,
        userIds: Array.from(selectedTeachers),
      });
      toast({ title: "Access granted", description: `${selectedTeachers.size} teacher(s) now have access.` });
      setSelectedTeachers(new Set());
    } catch (e) {
      toast({
        title: "Failed to grant access",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGrantToAllTeachers = async () => {
    try {
      await grantMutation.mutateAsync({
        ...grantPayload,
        roleType: "teacher",
      });
      toast({ title: "Access granted", description: "All teachers now have access." });
    } catch (e) {
      toast({
        title: "Failed to grant access",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGrantToClasses = async () => {
    if (selectedClasses.size === 0) {
      toast({ title: "Select at least one class", variant: "destructive" });
      return;
    }
    try {
      await bulkGrantMutation.mutateAsync({
        ...grantPayload,
        classIds: Array.from(selectedClasses),
      });
      toast({ title: "Access granted", description: `${selectedClasses.size} class(es) now have access.` });
      setSelectedClasses(new Set());
    } catch (e) {
      toast({
        title: "Failed to grant access",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGrantToStudents = async () => {
    if (selectedStudents.size === 0) {
      toast({ title: "Select at least one student", variant: "destructive" });
      return;
    }
    try {
      await bulkGrantMutation.mutateAsync({
        ...grantPayload,
        userIds: Array.from(selectedStudents),
      });
      toast({ title: "Access granted", description: `${selectedStudents.size} student(s) now have access.` });
      setSelectedStudents(new Set());
    } catch (e) {
      toast({
        title: "Failed to grant access",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGrantToAllStudents = async () => {
    try {
      await grantMutation.mutateAsync({
        ...grantPayload,
        roleType: "student",
      });
      toast({ title: "Access granted", description: "All students now have access." });
    } catch (e) {
      toast({
        title: "Failed to grant access",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const isPending = grantMutation.isPending || bulkGrantMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-brand-heading">Grant access to {subjectName}</h2>
        <p className="text-sm text-muted-foreground">
          Select teachers, classes, or students to grant access. Students in selected classes will receive access to this resource.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teachers
              {selectedTeachers.size > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedTeachers.size}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Classes
              {selectedClasses.size > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedClasses.size}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Students
              {selectedStudents.size > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedStudents.size}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers" className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleGrantToAllTeachers}
                disabled={isPending || teachers.length === 0}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Grant to all teachers
              </Button>
            </div>
            {teachersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            ) : teachers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No teachers found.</p>
            ) : (
              <>
                <div className="rounded-lg border border-brand-border max-h-64 overflow-y-auto divide-y divide-brand-border">
                  {teachers.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedTeachers.has(t.id)}
                        onCheckedChange={() => toggleTeacher(t.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{t.first_name} {t.last_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Button
                  onClick={handleGrantToTeachers}
                  disabled={isPending || selectedTeachers.size === 0}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Grant to {selectedTeachers.size} selected teacher{selectedTeachers.size !== 1 ? "s" : ""}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="classes" className="mt-6 space-y-4">
            {classesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            ) : classes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No classes found.</p>
            ) : (
              <>
                <div className="rounded-lg border border-brand-border max-h-64 overflow-y-auto divide-y divide-brand-border">
                  {classes.map((c) => {
                    const ac = availableClasses.find((a) => a.id === c.id);
                    const count = ac?.student_count ?? 0;
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedClasses.has(c.id)}
                          onCheckedChange={() => toggleClass(c.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{c.name}</p>
                          {count > 0 && (
                            <p className="text-xs text-muted-foreground">{count} student{count !== 1 ? "s" : ""}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <Button
                  onClick={handleGrantToClasses}
                  disabled={isPending || selectedClasses.size === 0}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Grant to {selectedClasses.size} selected class{selectedClasses.size !== 1 ? "es" : ""}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="students" className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedClassId ?? ""}
                onChange={(e) => setSelectedClassId(e.target.value || null)}
              >
                <option value="">All classes</option>
                {availableClasses.map((ac) => (
                  <option key={ac.id} value={ac.id}>
                    {ac.name} ({ac.student_count} students)
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={handleGrantToAllStudents}
                disabled={isPending || students.length === 0}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Grant to all students
              </Button>
            </div>
            {studentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No students found.</p>
            ) : (
              <>
                <div className="rounded-lg border border-brand-border max-h-64 overflow-y-auto divide-y divide-brand-border">
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedStudents.has(s.id)}
                        onCheckedChange={() => toggleStudent(s.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{s.first_name} {s.last_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Button
                  onClick={handleGrantToStudents}
                  disabled={isPending || selectedStudents.size === 0}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Grant to {selectedStudents.size} selected student{selectedStudents.size !== 1 ? "s" : ""}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
