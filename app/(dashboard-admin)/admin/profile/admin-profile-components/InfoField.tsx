"use client";

import React from "react";

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoField = ({ icon, label, value }: InfoFieldProps) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="text-gray-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

