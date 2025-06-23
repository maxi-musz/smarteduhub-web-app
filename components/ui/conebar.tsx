import React from "react";

interface ConeBarProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const ConeBar: React.FC<ConeBarProps> = ({ className = "", ...props }) => {
  return (
    <svg
      viewBox="0 0 100 10"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M0 5.98501C0 5.15428 0.653618 4.47059 1.48351 4.43324L94.9551 0.227018C97.7039 0.103325 100 2.29845 100 5.04997C100 7.76355 97.7643 9.94411 95.0515 9.87629L1.51452 7.53786C0.67202 7.5168 0 6.82777 0 5.98501Z" />
    </svg>
  );
};

export default ConeBar;
