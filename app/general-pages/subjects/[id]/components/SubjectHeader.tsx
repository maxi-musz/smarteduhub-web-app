"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SubjectHeaderProps {
  name: string;
  code: string;
  status: string;
  color: string;
}

export const SubjectHeader = ({
  name,
  code,
  status,
  color,
}: SubjectHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-12 rounded"
            style={{ backgroundColor: color }}
          />
          <div>
            <h1 className="text-2xl font-bold text-brand-heading capitalize">
              {name}
            </h1>
            <p className="text-sm text-brand-light-accent-1">
              {code} • {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

