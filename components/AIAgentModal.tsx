"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAgentLogo } from "./AIAgentLogo";

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
}

const subjectPromptsMap: Record<string, string[]> = {
  Mathematics: [
    "Need help solving Algebra problems?",
    "Want to try a fun Arithmetic challenge?",
    "Curious about how geometry applies in real life?",
  ],
  English: [
    "Need help with Literature analysis?",
    "Want to practice essay writing techniques?",
    "Struggling with comprehension or grammar?",
  ],
  Physics: [
    "Want to explore Physics concepts with real-world examples?",
    "Need help understanding Newton's laws?",
    "Curious about electricity and magnetism?",
  ],
  Chemistry: [
    "Curious about chemical reactions and balancing equations?",
    "Want to understand periodic trends better?",
    "Need help with organic chemistry basics?",
  ],
  Biology: [
    "Need assistance with Biology classifications?",
    "Want to explore human body systems?",
    "Confused about cell structures or genetics?",
  ],
  History: [
    "Want to dive deeper into History timelines?",
    "Curious about historical revolutions?",
    "Need help connecting events to causes and effects?",
  ],
  Geography: [
    "Need help understanding Geography concepts?",
    "Want to explore map reading or landforms?",
    "Curious about weather and climate patterns?",
  ],
  "Civic Education": [
    "Want to practice Civic Education scenarios?",
    "Need help with civic responsibilities and rights?",
    "Curious about government structures?",
  ],
  General: [
    "What subject do you want to learn today?",
    "Need help understanding a topic?",
    "Ask me anything about your subjects!",
  ],
};

export function AIAgentModal({ isOpen, onClose, subject }: AIAgentModalProps) {
  const prompts = subjectPromptsMap[subject] || subjectPromptsMap["General"];

  const [currentPrompt, setCurrentPrompt] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const currentFullPrompt = prompts[promptIndex];

    if (isTyping && charIndex < currentFullPrompt.length) {
      const timeout = setTimeout(() => {
        setCurrentPrompt(currentFullPrompt.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (isTyping && charIndex >= currentFullPrompt.length) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (!isTyping && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCurrentPrompt(currentFullPrompt.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (!isTyping && charIndex === 0) {
      const timeout = setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, charIndex, isTyping, promptIndex, prompts]);

  const handleClose = () => {
    setCurrentPrompt("");
    setCharIndex(0);
    setPromptIndex(0);
    setIsTyping(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AIAgentLogo size="lg" />
            AI Learning Assistant Prompt
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-brand-heading">
            Hi! I&apos;m your AI learning assistant for{" "}
            <strong>{subject}</strong>. How can I help you today?
          </div>
          <div className="text-xs text-brand-light-accent-1">
            Type your question or wait for a suggestion below.
          </div>
          <Input
            required
            placeholder={currentPrompt}
            className="w-full"
            autoFocus
          />

          <Button
            onClick={() => {
              alert(`AI Assistant for ${subject} is being developed!`);
            }}
            className="w-full"
            variant="outline"
          >
            Submit Question
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
