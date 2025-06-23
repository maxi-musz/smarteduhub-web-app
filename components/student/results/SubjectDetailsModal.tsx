import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicResult {
  id: string;
  date: string;
  subject: string;
  ca1: number;
  ca2: number;
  ca3: number;
  exam: number | string;
  total: number | string;
  grade: string;
}

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: AcademicResult | null;
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
              <CardTitle className="text-lg">{subject.subject}</CardTitle>
              <Badge variant="secondary">Date: {subject.date}</Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CA1 (10)</p>
                  <p className="font-semibold">{subject.ca1}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CA2 (10)</p>
                  <p className="font-semibold">{subject.ca2}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CA3 (10)</p>
                  <p className="font-semibold">{subject.ca3}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam (70)</p>
                  <p className="font-semibold">{subject.exam}</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total (100)</p>
                    <p className="font-bold text-lg">{subject.total}</p>
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
