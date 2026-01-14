"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SingleSchoolResponse } from "@/hooks/use-library-owner-school";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchoolDetailsModalProps {
  schoolData: SingleSchoolResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolDetailsModal = ({
  schoolData,
  isOpen,
  onClose,
}: SchoolDetailsModalProps) => {
  if (!schoolData) return null;

  const { school, details } = schoolData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {school.school_icon?.url ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={school.school_icon.url}
                    alt={school.school_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-8 w-8 text-brand-primary" />
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl font-bold text-brand-heading">
                  {school.school_name}
                </DialogTitle>
                <p className="text-sm text-brand-light-accent-1 mt-1">
                  {getTypeLabel(school.school_type)} • {school.school_ownership}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(school.status)}>
              {school.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* School Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-heading">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-brand-light-accent-1">
                  <Mail className="h-4 w-4" />
                  <span>{school.school_email}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-light-accent-1">
                  <Phone className="h-4 w-4" />
                  <span>{school.school_phone}</span>
                </div>
                <div className="flex items-start gap-2 text-brand-light-accent-1 md:col-span-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{school.school_address}</span>
                </div>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-heading">Statistics Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-brand-light-accent-1">Teachers</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.teachers}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-brand-light-accent-1">Students</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.students}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-orange-600" />
                    <span className="text-xs text-brand-light-accent-1">Classes</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.classes}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-brand-light-accent-1">Subjects</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.subjects}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs text-brand-light-accent-1">Parents</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.parents}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-brand-light-accent-1">Users</span>
                  </div>
                  <p className="text-xl font-bold text-brand-heading">
                    {school.statistics.overview.users}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="teachers" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              </TabsList>

              <TabsContent value="teachers" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-brand-light-accent-1 mb-3">
                    Total: {details.teachers.total}
                  </p>
                  {details.teachers.recent.length > 0 ? (
                    <div className="space-y-2">
                      {details.teachers.recent.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-brand-heading">
                              {teacher.first_name} {teacher.last_name}
                            </p>
                            <p className="text-sm text-brand-light-accent-1">
                              {teacher.email} • {teacher.teacher_id}
                            </p>
                          </div>
                          <Badge
                            className={
                              teacher.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {teacher.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-light-accent-1">
                      No teachers found
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="students" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-brand-light-accent-1 mb-3">
                    Total: {details.students.total}
                  </p>
                  {details.students.recent.length > 0 ? (
                    <div className="space-y-2">
                      {details.students.recent.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-brand-heading">
                              {student.user.first_name} {student.user.last_name}
                            </p>
                            <p className="text-sm text-brand-light-accent-1">
                              {student.user.email} • {student.student_id} •{" "}
                              {student.admission_number}
                            </p>
                          </div>
                          <Badge
                            className={
                              student.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {student.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-light-accent-1">
                      No students found
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="classes" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-brand-light-accent-1 mb-3">
                    Total: {details.classes.total}
                  </p>
                  {details.classes.list.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {details.classes.list.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="font-medium text-brand-heading">
                            {classItem.name}
                          </p>
                          <p className="text-xs text-brand-light-accent-1">
                            ID: {classItem.classId}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-light-accent-1">
                      No classes found
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="subjects" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm text-brand-light-accent-1 mb-3">
                    Total: {details.subjects.total}
                  </p>
                  {details.subjects.list.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {details.subjects.list.map((subject) => (
                        <div
                          key={subject.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="font-medium text-brand-heading">
                            {subject.name}
                          </p>
                          <p className="text-xs text-brand-light-accent-1">
                            {subject.code}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-light-accent-1">
                      No subjects found
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-4">
                <div className="space-y-4">
                  {school.statistics.academic.currentSession && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <p className="font-semibold text-brand-heading">
                          Current Session
                        </p>
                      </div>
                      <p className="text-sm text-brand-heading">
                        {school.statistics.academic.currentSession.academic_year} -{" "}
                        {school.statistics.academic.currentSession.term} Term
                      </p>
                      <p className="text-xs text-brand-light-accent-1 mt-1">
                        Status: {school.statistics.academic.currentSession.status}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-brand-light-accent-1 mb-3">
                      Total Sessions: {school.statistics.academic.totalSessions}
                    </p>
                    {details.academicSessions.all.length > 0 ? (
                      <div className="space-y-2">
                        {details.academicSessions.all.map((session) => (
                          <div
                            key={session.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-brand-heading">
                                  {session.academic_year} - {session.term} Term
                                </p>
                                <p className="text-xs text-brand-light-accent-1">
                                  {new Date(session.start_date).toLocaleDateString()} -{" "}
                                  {new Date(session.end_date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                className={
                                  session.is_current
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {session.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-brand-light-accent-1">
                        No sessions found
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Subscription Info */}
            {school.statistics.subscription && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-heading mb-2">
                  Subscription
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-brand-light-accent-1">Plan</p>
                    <p className="font-medium text-brand-heading">
                      {school.statistics.subscription.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-light-accent-1">Status</p>
                    <Badge
                      className={
                        school.statistics.subscription.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {school.statistics.subscription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-brand-light-accent-1">Cost</p>
                    <p className="font-medium text-brand-heading">
                      {school.statistics.subscription.currency}{" "}
                      {school.statistics.subscription.cost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-light-accent-1">Billing Cycle</p>
                    <p className="font-medium text-brand-heading">
                      {school.statistics.subscription.billing_cycle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

