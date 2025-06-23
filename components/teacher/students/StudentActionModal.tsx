import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  Shield,
  MessageCircle,
  Phone,
  UserX,
  MessageSquare,
} from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  class: string;
  performance: number;
  attendance: number;
}

interface StudentActionModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentActionModal({
  student,
  isOpen,
  onClose,
}: StudentActionModalProps) {
  if (!student) return null;

  const handleAction = (action: string) => {
    console.log(`${action} action for student:`, student.fullName);
    // Implement specific action logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Actions - {student.fullName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information Group */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Student Information
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("View Profile")}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("View Grades")}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                View Grades
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("View Behaviour")}
              >
                <Shield className="h-4 w-4 mr-2" />
                View Behaviour
              </Button>
            </div>
          </div>

          <Separator />

          {/* Communication Group */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Communication
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("Send Message")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("Contact Parent")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Parent
              </Button>
            </div>
          </div>

          <Separator />

          {/* Actions Group */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => handleAction("Suspend")}
              >
                <UserX className="h-4 w-4 mr-2" />
                Suspend
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAction("Give Feedback")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Give Feedback
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
