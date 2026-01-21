"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SubjectDescriptionProps {
  description: string;
}

export const SubjectDescription = ({ description }: SubjectDescriptionProps) => {
  if (!description) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-gray-700 capitalize">{description}</p>
      </CardContent>
    </Card>
  );
};

