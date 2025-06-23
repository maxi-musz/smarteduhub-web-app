"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Progress } from "@/components/ui/progress";

const performanceData = [
  { month: "Jan", grade: 85 },
  { month: "Feb", grade: 78 },
  { month: "Mar", grade: 92 },
  { month: "Apr", grade: 88 },
  { month: "May", grade: 95 },
];

const subjectPerformance = [
  { subject: "Mathematics", grade: 85, attendance: 92 },
  { subject: "Physics", grade: 78, attendance: 88 },
  { subject: "Chemistry", grade: 92, attendance: 95 },
  { subject: "Biology", grade: 88, attendance: 90 },
  { subject: "English", grade: 95, attendance: 94 },
];

const StudentPerformancePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Academic Performance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Progression</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-medium">Subject</th>
                  <th className="py-2 px-4 font-medium">Grade</th>
                  <th className="py-2 px-4 font-medium">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {subjectPerformance.map((subject, index) => (
                  <tr
                    key={subject.subject}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-2 px-4 font-medium">{subject.subject}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{subject.grade}%</span>
                        <Progress
                          value={subject.grade}
                          className="h-2 flex-1"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{subject.attendance}%</span>
                        <Progress
                          value={subject.attendance}
                          className="h-2 flex-1"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPerformancePage;
