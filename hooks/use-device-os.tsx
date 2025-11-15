"use client";

import { useState, useEffect } from "react";

export type DeviceOS =
  | "iOS"
  | "Android"
  | "Windows"
  | "macOS"
  | "Linux"
  | "Unknown";

interface UseDeviceOSReturn {
  os: DeviceOS | undefined;
  isClient: boolean;
  isMobile: boolean;
}

export function useDeviceOS(): UseDeviceOSReturn {
  const [os, setOS] = useState<DeviceOS | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;

    // Enhanced iOS detection (including iPads with iOS 13+)
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (platform === "MacIntel" && navigator.maxTouchPoints > 1);

    // Mobile OS Detection
    if (isIOS && !(window as any).MSStream) {
      setOS("iOS");
      setIsMobile(true);
    } else if (/android/i.test(userAgent)) {
      setOS("Android");
      setIsMobile(true);
    }
    // Desktop OS Detection
    else if (/Win/i.test(platform)) {
      setOS("Windows");
      setIsMobile(false);
    } else if (/Mac/i.test(platform)) {
      setOS("macOS");
      setIsMobile(false);
    } else if (/Linux/i.test(platform)) {
      setOS("Linux");
      setIsMobile(false);
    } else {
      setOS("Unknown");
      setIsMobile(/Mobile|Tablet/i.test(userAgent));
    }
  }, []);

  return { os, isClient, isMobile };
}
