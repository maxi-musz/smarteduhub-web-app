"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  error: string | null;
}

export const ErrorModal = ({ open, onClose, onRetry, error }: ErrorModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Failed to Load Teachers Data
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-3">
            <Button onClick={onRetry} className="flex-1 gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

