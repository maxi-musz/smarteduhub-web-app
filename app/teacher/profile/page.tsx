import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  PenTool,
  Edit,
} from "lucide-react";
import {
  teacherProfile,
  teacherClasses,
  teacherSubjects,
} from "@/data/mockData";
import Image from "next/image";

// Mock data for demonstration (replace with real data as needed)
const isActive = true; // You can set this based on real status

const TeacherProfilePage = () => {
  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-heading">Profile</h1>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Edit className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Main Info */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
              {teacherProfile.avatar ? (
                <Image
                  src={teacherProfile.avatar}
                  alt={teacherProfile.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-brand-primary text-white text-xl">
                  {teacherProfile.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">{teacherProfile.name}</h2>
            <p className="text-gray-500 mb-2">{teacherProfile.title}</p>
            {/* Active/Inactive Badge */}
            <div className="flex justify-center mb-4">
              <Badge
                className={`px-4 py-1 text-sm font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Contact Details */}
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-brand-light-accent-1 mr-3" />
                <span className="text-sm">{teacherProfile.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-brand-light-accent-1 mr-3" />
                <span className="text-sm">{teacherProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-brand-light-accent-1 mr-3" />
                <span className="text-sm">
                  Joined{" "}
                  {new Date(teacherProfile.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Classes & Subjects */}
            <div className="w-full mt-8">
              <div className="mb-2 font-semibold text-brand-heading text-base">
                Classes Taking
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {teacherClasses.map((cls) => (
                  <Badge key={cls} variant="outline" className="px-3 py-1">
                    {cls}
                  </Badge>
                ))}
              </div>
              <div className="mb-2 font-semibold text-brand-heading text-base">
                Subjects Taking
              </div>
              <div className="flex flex-wrap gap-2">
                {teacherSubjects.map((subj) => (
                  <Badge key={subj} variant="outline" className="px-3 py-1">
                    {subj}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio & Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-brand-primary" />
                Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-light-accent-1">{teacherProfile.bio}</p>
              {/* Specializations content */}
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 mr-2 text-brand-primary" />
                  <span className="text-lg font-semibold">Specializations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherProfile.specialization.map((spec, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <PenTool className="h-5 w-5 mr-2 text-brand-primary" />
                Teaching Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">4</p>
                  <p className="text-sm text-gray-500">Active Subjects</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">124</p>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">95%</p>
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">8</p>
                  <p className="text-sm text-gray-500">Years Teaching</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">18</p>
                  <p className="text-sm text-gray-500">Weekly Hours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-brand-primary">4.8</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
