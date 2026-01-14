"use client";

import { Assessment } from "@/hooks/explore/use-assessment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, FileQuestion, Target, Shield, Monitor, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface AssessmentRulesModalProps {
  isOpen: boolean;
  assessment: Assessment;
  onAccept: () => void;
  onDecline: () => void;
}

export function AssessmentRulesModal({
  isOpen,
  assessment,
  onAccept,
  onDecline,
}: AssessmentRulesModalProps) {
  const [hasReadRules, setHasReadRules] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${mins > 1 ? "s" : ""}` : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  const formatTimeLimit = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const canProceed = hasReadRules && hasAcceptedTerms;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-heading flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Assessment Rules & Regulations
          </DialogTitle>
          <DialogDescription className="text-base">
            Please read and acknowledge all rules before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Assessment Details */}
          <Card className="border-2 border-brand-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-brand-heading mb-3">
                {assessment.title}
              </h3>
              {assessment.description && (
                <p className="text-sm text-brand-light-accent-1 mb-4">
                  {assessment.description}
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-brand-primary" />
                  <div>
                    <p className="text-xs text-brand-light-accent-1">Questions</p>
                    <p className="font-semibold text-brand-heading">{assessment.questionsCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-primary" />
                  <div>
                    <p className="text-xs text-brand-light-accent-1">Duration</p>
                    <p className="font-semibold text-brand-heading">{formatDuration(assessment.duration)}</p>
                  </div>
                </div>
                {assessment.timeLimit > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-brand-light-accent-1">Time Limit</p>
                      <p className="font-semibold text-brand-heading">{formatTimeLimit(assessment.timeLimit)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-brand-primary" />
                  <div>
                    <p className="text-xs text-brand-light-accent-1">Passing Score</p>
                    <p className="font-semibold text-brand-heading">{assessment.passingScore}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Warnings */}
          <Card className="border-2 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-2">STRICT ANTI-MALPRACTICE MEASURES</h4>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> switch tabs or minimize the browser window</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> copy, paste, or use keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> right-click or open context menu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> attempt to print or save the page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> open Developer Tools (F12, Ctrl+Shift+I)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span><strong>DO NOT</strong> exit fullscreen mode</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-sm font-semibold text-red-900">
                    ⚠️ Violations will be tracked and may result in assessment disqualification!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          {assessment.instructions && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-brand-heading mb-2">Instructions</h4>
                <p className="text-sm text-brand-light-accent-1 whitespace-pre-line">
                  {assessment.instructions}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Rules List */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-brand-heading mb-3">Assessment Rules</h4>
              <ol className="space-y-2 text-sm text-brand-light-accent-1 list-decimal list-inside">
                <li>The assessment will be conducted in <strong>fullscreen mode</strong> to prevent distractions</li>
                <li>You must remain in fullscreen for the entire duration of the assessment</li>
                <li>All tab switches, window changes, and suspicious activities will be monitored and recorded</li>
                <li>You have <strong>{formatDuration(assessment.duration)}</strong> to complete the assessment</li>
                {assessment.timeLimit > 0 && (
                  <li>There is a strict time limit of <strong>{formatTimeLimit(assessment.timeLimit)}</strong> per question/section</li>
                )}
                <li>Answer all questions carefully - you cannot go back once submitted</li>
                {assessment.maxAttempts > 1 && (
                  <li>You have <strong>{assessment.maxAttempts} attempt{assessment.maxAttempts > 1 ? "s" : ""}</strong> to complete this assessment</li>
                )}
                <li>Do not refresh the page or close the browser during the assessment</li>
                <li>Ensure you have a stable internet connection before starting</li>
                <li>Any attempt to cheat or violate the rules will result in immediate disqualification</li>
              </ol>
            </CardContent>
          </Card>

          {/* Technical Requirements */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-brand-heading mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Technical Requirements
              </h4>
              <ul className="space-y-2 text-sm text-brand-light-accent-1 list-disc list-inside">
                <li>Stable internet connection required</li>
                <li>Fullscreen mode will be automatically enabled</li>
                <li>Do not disable browser notifications</li>
                <li>Close all other applications and browser tabs</li>
                <li>Ensure your device has sufficient battery or is plugged in</li>
              </ul>
            </CardContent>
          </Card>

          {/* Acknowledgment Checkboxes */}
          <Card className="border-2 border-brand-primary/30">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="read-rules"
                  checked={hasReadRules}
                  onCheckedChange={(checked) => setHasReadRules(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="read-rules"
                  className="text-sm font-medium text-brand-heading cursor-pointer flex-1"
                >
                  I have read and understood all the rules and regulations stated above
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-terms"
                  checked={hasAcceptedTerms}
                  onCheckedChange={(checked) => setHasAcceptedTerms(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="accept-terms"
                  className="text-sm font-medium text-brand-heading cursor-pointer flex-1"
                >
                  I understand that any violation of these rules will result in disqualification and I agree to abide by all anti-malpractice measures
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onAccept}
            disabled={!canProceed}
            className="flex-1"
          >
            I Accept - Start Assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

