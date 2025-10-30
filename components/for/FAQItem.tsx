"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className={cn(
          "w-full flex items-center justify-between gap-4 py-5 px-6 text-left transition-colors hover:bg-gray-50",
          isOpen && "bg-gray-50"
        )}
        onClick={toggleItem}
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
          {question}
        </h3>
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-brand-primary text-white">
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="px-6 pb-5 pt-2 bg-gray-50">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
