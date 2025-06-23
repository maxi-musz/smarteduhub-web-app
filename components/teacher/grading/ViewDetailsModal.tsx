import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, GraduationCap, FileText } from "lucide-react";

interface Grade {
  id: number;
  title: string;
  type: string;
  subject: string;
  studentName: string;
  studentInitial: string;
  class: string;
  score: string;
  date: string;
  status: string;
}

interface ViewDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade | null;
}

export function ViewDetailsModal({
  open,
  onOpenChange,
  grade,
}: ViewDetailsModalProps) {
  if (!grade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{grade.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{grade.type}</Badge>
                    <Badge variant="secondary">{grade.subject}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Class: {grade.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date: {grade.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium">{grade.studentInitial}</span>
                </div>
                <div>
                  <h4 className="font-medium">{grade.studentName}</h4>
                  <p className="text-sm text-muted-foreground">{grade.class}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-lg font-semibold">{grade.score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      grade.status === "Graded" ? "default" : "secondary"
                    }
                    className={
                      grade.status === "Graded"
                        ? "bg-green-100 text-green-800"
                        : grade.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {grade.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Assignment Instructions
              </h4>
              <p className="text-sm text-muted-foreground">
                Complete the {grade.type.toLowerCase()} on {grade.subject}.
                Follow the guidelines provided in class and submit before the
                deadline.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary-hover">
            Print Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
