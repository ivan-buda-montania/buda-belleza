import clsx, { type ClassValue } from 'clsx';

/** Single, project-wide class combiner. Kept thin so it stays swappable for tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
