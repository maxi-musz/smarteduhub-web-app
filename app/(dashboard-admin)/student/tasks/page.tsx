import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";

const tasks = [
  {
    id: 1,
    title: "Mathematics Quiz",
    subject: "Mathematics",
    type: "Quiz",
    dueDate: "2024-05-01",
    timeLeft: "2 days",
    status: "pending",
    description: "Chapter 5: Integration and its applications",
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Physics",
    type: "Assignment",
    dueDate: "2024-05-03",
    timeLeft: "4 days",
    status: "in-progress",
    description: "Wave Motion Experiment Analysis",
  },
  {
    id: 3,
    title: "Chemistry Assignment",
    subject: "Chemistry",
    type: "Assignment",
    dueDate: "2024-05-07",
    timeLeft: "1 week",
    status: "not-started",
    description: "Organic Chemistry Reactions",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StudentTasksPage = () => {
  return (
    <div className="p-6">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button>
          <ListTodo className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div> */}
      {/* Header */}
      <StudentHeader
        studentName="Oluwajuwon Kayode"
        studentClass="SS3A"
        // avatarUrl="https://via.placeholder.com/150"
      />

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <Badge
                variant="secondary"
                className={getStatusColor(task.status)}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: {task.dueDate}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Time Left: {task.timeLeft}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Type: {task.type}
                  </div>
                  <Badge variant="outline">{task.subject}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                    <Button className="w-full">Start Task</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentTasksPage;
