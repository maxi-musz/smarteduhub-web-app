import React from "react";
import { SVGIcon, IconProps } from "./Icon";

export const Payoneer: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon viewBox="0 0 24 24" {...props}>
      {/* Payoneer's distinctive interlocking circles design */}
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="16"
        cy="16"
        r="6"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Optional: Add the overlapping intersection highlight */}
      <path
        d="M10.5 10.5C11.8 11.8 12.2 13.5 11.5 15C10.8 16.5 9.2 17.2 7.7 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="currentColor"
        opacity="0.6"
      />
    </SVGIcon>
  );
};
