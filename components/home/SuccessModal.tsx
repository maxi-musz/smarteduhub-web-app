import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Hourglass } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal = ({ open, onClose }: SuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md py-12 px-10 bg-white rounded-lg overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Form submission modal</DialogTitle>
          <DialogDescription>
            Your form has been submitted successfully.
          </DialogDescription>
        </VisuallyHidden>

        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
              <Hourglass className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-medium text-brand-heading mb-2">
            Application Submitted Successfully
          </h2>

          {/* Description */}
          <p className="mt-0 text-brand-secondary text-sm leading-relaxed">
            Thank you for registering your school with us. Our team is reviewing
            your application, and we&apos;ll reach out soon with your login
            details via email or phone. Stay tuned — you&apos;re almost set to
            go
          </p>

          {/* Continue Button */}
          <Button
            onClick={onClose}
            className="mt-4 w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 rounded-md font-medium text-sm transition-colors"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
