"use client";

import React, { useState } from "react";
import { mockSubjects } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, BookOpen, BarChart3, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeacherSubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter subjects based on search
  const filteredSubjects = mockSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-area">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
          <p className="text-gray-500 text-sm">Manage your teaching subjects</p>
        </div>
        <Button className="bg-edu-primary hover:bg-edu-primary/90">
          <Plus className="h-4 w-4 mr-1" />
          Add Subject
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden card-hover">
            <div className="h-2" style={{ backgroundColor: subject.color }} />
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3>{subject.name}</h3>
                  <p className="text-sm font-normal text-gray-500">
                    {subject.code}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  style={{ color: subject.color }}
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Students</span>
                    </div>
                    <span className="font-medium">{subject.students}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Avg. Grade</span>
                    </div>
                    <span className="font-medium">{subject.averageGrade}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Next Class</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {subject.nextClass}
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="performance">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Class Average</span>
                        <span className="text-sm font-medium">
                          {subject.averageGrade}%
                        </span>
                      </div>
                      <Progress
                        value={subject.averageGrade}
                        className={`h-2 ${
                          subject.averageGrade >= 80
                            ? "bg-edu-success"
                            : subject.averageGrade >= 70
                            ? "bg-edu-accent"
                            : "bg-edu-danger"
                        }`}
                      />
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span>Grade Distribution</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {["A", "B", "C", "D"].map((grade) => (
                          <div key={grade} className="text-center">
                            <div className="h-16 bg-gray-100 rounded-t-sm relative">
                              <div
                                className="absolute bottom-0 left-0 right-0 bg-edu-primary rounded-t-sm"
                                style={{
                                  height: `${Math.floor(Math.random() * 100)}%`,
                                  opacity:
                                    grade === "A"
                                      ? 1
                                      : grade === "B"
                                      ? 0.8
                                      : grade === "C"
                                      ? 0.6
                                      : 0.4,
                                }}
                              />
                            </div>
                            <div className="mt-1">{grade}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No subjects found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectsPage;
