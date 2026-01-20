"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="py-6 space-y-6 bg-brand-bg">
    <Card className="bg-white">
      <CardContent className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
      </CardContent>
    </Card>
  </div>
);

