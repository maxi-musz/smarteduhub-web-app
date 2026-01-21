"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AIAgentLogo } from "./AIAgentLogo";

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
}

export function AIAgentModal({ isOpen, onClose, subject }: AIAgentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AIAgentLogo size="lg" />
            AI Learning Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-brand-heading">
              Chatting with AI is coming soon
            </p>
            <p className="text-sm text-brand-light-accent-1">
              We&apos;re working on bringing you an amazing AI learning experience for{" "}
              <strong>{subject}</strong>. Stay tuned!
            </p>
          </div>
          <Button
            onClick={onClose}
            className="w-full"
            variant="default"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
