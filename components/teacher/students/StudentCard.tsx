import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  User,
  FileText,
  MessageCircle,
  Phone,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    grade: string;
    performance: number;
    attendance: number;
    avatar?: string;
    class?: string;
  };
  onView: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView }) => {
  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "bg-edu-success";
    if (performance >= 70) return "bg-edu-accent";
    return "bg-edu-danger";
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 rounded-full flex-shrink-0">
            {student.avatar ? (
              <AvatarImage
                src={student.avatar}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-edu-primary text-white text-xl">
                {student.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{student.grade}</Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    {student.class || "SS1A"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Performance</span>
                <span className="text-xs font-medium">
                  {student.performance}%
                </span>
              </div>
              <Progress
                value={student.performance}
                className={`h-1.5 ${getPerformanceColor(student.performance)}`}
              />
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Attendance</span>
                <span className="text-xs font-medium">
                  {student.attendance}%
                </span>
              </div>
              <Progress
                value={student.attendance}
                className={`h-1.5 ${
                  student.attendance >= 90
                    ? "bg-edu-success"
                    : student.attendance >= 75
                    ? "bg-edu-accent"
                    : "bg-edu-danger"
                }`}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 hover:bg-gray-100"
            onClick={() => onView(student.id)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Manage</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                {/* <DialogTitle>Student Options</DialogTitle> */}
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Student Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <Button
                        variant="ghost"
                        onClick={() => onView(student.id)}
                      >
                        View Profile
                      </Button>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <Button variant="ghost">View Grades</Button>
                    </li>
                    <li className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-yellow-500" />
                      <Button variant="ghost">View Behaviour</Button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Communication</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <Button variant="ghost">Send Message</Button>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-green-500" />
                      <Button variant="ghost">Contact Parent</Button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Actions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-yellow-500" />
                      <Button variant="ghost">Mark Attendance</Button>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Edit3 className="w-5 h-5 text-blue-500" />
                      <Button variant="ghost">Give Feedback</Button>
                    </li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
