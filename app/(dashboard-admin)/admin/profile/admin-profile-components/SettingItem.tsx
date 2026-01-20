"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface SettingItemProps {
  title: string;
  description: string;
  enabled: boolean;
}

export const SettingItem = ({
  title,
  description,
  enabled,
}: SettingItemProps) => (
  <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    {enabled ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )}
  </div>
);

