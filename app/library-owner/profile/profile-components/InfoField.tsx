"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoFieldProps {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
}

export const InfoField = ({ icon, label, value }: InfoFieldProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
