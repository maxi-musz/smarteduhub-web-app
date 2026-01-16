"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddPeriodButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddPeriodButton = ({ onClick, disabled }: AddPeriodButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Period
      </Button>
    </div>
  );
};

