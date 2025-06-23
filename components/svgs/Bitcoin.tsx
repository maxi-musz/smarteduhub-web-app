import React from "react";
import { SVGIcon, IconProps } from "./Icon";

export const Bitcoin: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGIcon>
  );
};
