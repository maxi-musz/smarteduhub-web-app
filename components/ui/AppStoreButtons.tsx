"use client";

import React from "react";
import AppStoreButton from "@/components/ui/AppStoreButton";
import GooglePlayButton from "@/components/ui/GooglePlayButton";
import { useDeviceOS } from "@/hooks/use-device-os";

interface AppStoreButtonsProps {
  appStoreHref?: string;
  playStoreHref?: string;
  className?: string;
  buttonClassName?: string;
}

export default function AppStoreButtons({
  appStoreHref = "#",
  playStoreHref = "#",
  className = "",
  buttonClassName = "",
}: AppStoreButtonsProps) {
  const { os, isClient, isMobile } = useDeviceOS();

  // Desktop users see both buttons
  if (isClient && !isMobile) {
    return (
      <div className={`flex flex-row gap-2 md:gap-4 ${className}`}>
        <AppStoreButton href={appStoreHref} className={buttonClassName} />
        <GooglePlayButton href={playStoreHref} className={buttonClassName} />
      </div>
    );
  }

  // Mobile iOS users see only App Store button
  if (isClient && os === "iOS") {
    return (
      <div className={`flex flex-row gap-2 md:gap-4 ${className}`}>
        <AppStoreButton href={appStoreHref} className={buttonClassName} />
      </div>
    );
  }

  // Mobile Android users see only Google Play button
  if (isClient && os === "Android") {
    return (
      <div className={`flex flex-row gap-2 md:gap-4 ${className}`}>
        <GooglePlayButton href={playStoreHref} className={buttonClassName} />
      </div>
    );
  }

  // Fallback during SSR or unknown devices: show both buttons
  return (
    <div className={`flex flex-row gap-2 md:gap-4 ${className}`}>
      <AppStoreButton href={appStoreHref} className={buttonClassName} />
      <GooglePlayButton href={playStoreHref} className={buttonClassName} />
    </div>
  );
}
