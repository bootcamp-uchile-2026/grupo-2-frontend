import type { ReactNode } from 'react';

const shapes: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </>
  ),
  cart: (
    <>
      <path d="M2 3h3l3 12h11l3-9H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 3C9 2 3 6 4 13c1 8 15 7 16-10Z" />
      <path d="M3 21 15 9" />
    </>
  ),
};

export function HeaderIcon({ name }: { name: string }) {

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}
