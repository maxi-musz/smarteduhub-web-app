"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
