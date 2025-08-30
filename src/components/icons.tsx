import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 7a2 2 0 0 1-2-2" />
      <path d="M10 11a2 2 0 0 1-2-2" />
      <path d="M14 15a2 2 0 0 1-2-2" />
      <path d="M10 19a2 2 0 0 1-2-2" />
      <path d="m14 3 5 5" />
      <path d="M12 21.5V17" />
      <path d="M5.5 17H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.5" />
      <path d="M22 17h-1.5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2H22" />
      <path d="m18 11 2.5-2.5" />
      <path d="m14 15-2.5 2.5" />
      <path d="M7.5 12H12" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
