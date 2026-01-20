"use client";

import React from "react";

interface DetailFieldProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export const DetailField = ({ label, value, className }: DetailFieldProps) => (
  <div className={`p-4 bg-gray-50 rounded-lg ${className || ""}`}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="font-medium">{value}</div>
  </div>
);

