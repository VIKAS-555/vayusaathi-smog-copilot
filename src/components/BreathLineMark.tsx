import React from 'react';

interface BreathLineMarkProps {
  className?: string;
}

export const BreathLineMark: React.FC<BreathLineMarkProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 280 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BreathLine continuous-line mark"
    >
      {/* 1. Continuous Wave and Atmospheric Inversion Arch */}
      <path
        d="M 4 84 L 28 84 C 44 84 54 58 68 58 C 82 58 92 68 106 68 C 122 68 134 40 148 20 C 158 8 168 4 179 4 C 204 4 224 23 224 49 C 224 68 214 84 214 84 L 276 84"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 2. Keyhole Silhouette (Unlocking Clean Air Routine) */}
      <path
        d="M 166 84 L 171 56 C 167 53 164 47 164 41 C 164 32 171 25 180 25 C 189 25 196 32 196 41 C 196 47 193 53 189 56 L 194 84"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
