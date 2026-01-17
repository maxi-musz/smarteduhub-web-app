"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const ClearCacheButton = () => {
  const queryClient = useQueryClient();

  const handleClearCache = () => {
    // Clear all React Query cache
    queryClient.clear();
    // Invalidate attendance queries specifically
    queryClient.invalidateQueries({
      queryKey: ["teacher", "attendance"],
    });
    // Force refetch
    queryClient.refetchQueries({
      queryKey: ["teacher", "attendance"],
    });
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClearCache}
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Clear Cache & Refresh
    </Button>
  );
};

