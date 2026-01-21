import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSubjectResult } from "@/hooks/student/use-student-results";

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: StudentSubjectResult | null;
}

export function SubjectDetailsModal({
  isOpen,
  onClose,
  subject,
}: SubjectDetailsModalProps) {
  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subject Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
              <Badge variant="secondary">
                Total: {subject.total_score}/{subject.total_max_score}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CA Score</p>
                  <p className="font-semibold">{subject.ca_score ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Score</p>
                  <p className="font-semibold">{subject.exam_score ?? "—"}</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total (100)</p>
                    <p className="font-bold text-lg">{subject.total_score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <Badge variant="default" className="mt-1">
                      {subject.grade}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
