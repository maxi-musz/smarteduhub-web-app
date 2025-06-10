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
import { teacherProfile } from "@/data/mockData";
import { Separator } from "@/components/ui/separator";

const TeacherProfilePage = () => {
  return (
    <div className="content-area">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <Button className="bg-edu-primary hover:bg-edu-primary/90">
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
                <img
                  src={teacherProfile.avatar}
                  alt={teacherProfile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-edu-primary text-white text-xl">
                  {teacherProfile.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">{teacherProfile.name}</h2>
            <p className="text-gray-500 mb-2">{teacherProfile.title}</p>
            <Badge className="mb-4">{teacherProfile.department}</Badge>

            <Separator className="my-4 w-full" />

            <div className="w-full space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-sm">{teacherProfile.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-sm">{teacherProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-sm">
                  Joined{" "}
                  {new Date(teacherProfile.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-edu-primary" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{teacherProfile.bio}</p>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-edu-primary" />
                Specializations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {teacherProfile.specialization.map((spec, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teaching Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <PenTool className="h-5 w-5 mr-2 text-edu-primary" />
                Teaching Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">4</p>
                  <p className="text-sm text-gray-500">Active Subjects</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">124</p>
                  <p className="text-sm text-gray-500">Total Students</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">95%</p>
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">8</p>
                  <p className="text-sm text-gray-500">Years Teaching</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">18</p>
                  <p className="text-sm text-gray-500">Weekly Hours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-md">
                  <p className="text-2xl font-bold text-edu-primary">4.8</p>
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
