import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins classes conditionally (clsx) and resolves Tailwind conflicts (twMerge):
 * cn('px-2', isWide && 'px-4') → 'px-4'.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
