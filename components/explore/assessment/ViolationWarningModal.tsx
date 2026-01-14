"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";
import { MalpracticeViolation } from "@/hooks/explore/use-anti-malpractice";

interface ViolationWarningModalProps {
  isOpen: boolean;
  violation: MalpracticeViolation | null;
  violationCount: number;
  maxViolations: number;
  onContinue: () => void;
  onExit: () => void;
}

const getViolationMessage = (type: MalpracticeViolation["type"]): string => {
  switch (type) {
    case "tab_switch":
      return "You switched to another tab!";
    case "window_blur":
      return "You minimized or switched the browser window!";
    case "fullscreen_exit":
      return "You exited fullscreen mode!";
    case "copy":
      return "Copying is not allowed during the assessment!";
    case "paste":
      return "Pasting is not allowed during the assessment!";
    case "context_menu":
      return "Right-clicking is not allowed during the assessment!";
    case "print":
      return "Printing is not allowed during the assessment!";
    case "devtools":
      return "Developer Tools are not allowed during the assessment!";
    default:
      return "A violation has been detected!";
  }
};

const getViolationDescription = (type: MalpracticeViolation["type"]): string => {
  switch (type) {
    case "tab_switch":
      return "Switching tabs is considered a violation of assessment rules. Please remain on the assessment page at all times.";
    case "window_blur":
      return "Minimizing or switching windows is not allowed. You must keep the assessment window active and in focus.";
    case "fullscreen_exit":
      return "You must remain in fullscreen mode throughout the assessment. Exiting fullscreen is a violation.";
    case "copy":
      return "Copying content is strictly prohibited. All copying attempts are monitored and recorded.";
    case "paste":
      return "Pasting content is strictly prohibited. All pasting attempts are monitored and recorded.";
    case "context_menu":
      return "Right-clicking and using context menus are not allowed during the assessment.";
    case "print":
      return "Printing or saving the assessment content is strictly prohibited.";
    case "devtools":
      return "Opening Developer Tools or inspecting the page is strictly prohibited.";
    default:
      return "This action violates the assessment rules and regulations.";
  }
};

export function ViolationWarningModal({
  isOpen,
  violation,
  violationCount,
  maxViolations,
  onContinue,
  onExit,
}: ViolationWarningModalProps) {
  if (!violation) return null;

  const isFinalWarning = violationCount >= maxViolations - 1;
  const remainingWarnings = maxViolations - violationCount;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            {isFinalWarning ? "FINAL WARNING" : "Violation Detected"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">
                {getViolationMessage(violation.type)}
              </h3>
              <p className="text-sm text-red-800">
                {getViolationDescription(violation.type)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-900 mb-2">
              {isFinalWarning ? (
                <>
                  ⚠️ <strong>FINAL WARNING!</strong> This is your last chance. Any further violation will result in immediate disqualification.
                </>
              ) : (
                <>
                  Warning {violationCount} of {maxViolations}
                </>
              )}
            </p>
            {!isFinalWarning && (
              <p className="text-xs text-yellow-800">
                You have <strong>{remainingWarnings}</strong> warning{remainingWarnings !== 1 ? "s" : ""} remaining before disqualification.
              </p>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">
              <strong>Remember:</strong> All violations are being recorded and monitored. 
              {isFinalWarning 
                ? " The next violation will automatically disqualify you from this assessment."
                : " Continued violations may result in disqualification."
              }
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex-1"
          >
            Exit Assessment
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            I Understand - Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

