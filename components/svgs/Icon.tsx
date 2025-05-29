import React from "react";

export interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface SVGIconProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

export const SVGIcon: React.FC<SVGIconProps> = ({
  children,
  size = 24,
  className = "",
  color = "currentColor",
  viewBox = "0 0 24 24",
  strokeWidth = 2,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
      strokeWidth={strokeWidth}
    >
      {children}
    </svg>
  );
};
