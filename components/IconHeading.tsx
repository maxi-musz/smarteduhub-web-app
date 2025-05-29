import React from "react";
import clsx from "clsx";
import ConeBar from "@/components/ui/conebar";

type IconHeadingProps = {
  className?: string;
};

export const IconHeading: React.FC<IconHeadingProps> = ({ className }) => (
  <div
    className={clsx(
      "w-full flex items-center justify-center gap-x-4 md:gap-x-20 mb-6",
      className
    )}
  >
    <ConeBar className="w-8 md:w-14 h-2 text-brand-primary rotate-180" />
    <h1 className="text-base md:text-xl font-bold text-brand-primary text-nowrap">
      SmartEdu-Hub
    </h1>
    <ConeBar className="w-8 md:w-14 h-2 text-brand-primary" />
  </div>
);
