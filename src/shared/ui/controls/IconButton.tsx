import { Button } from './Button';

import type { ComponentProps, ReactNode } from 'react';

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'size' | 'children' | 'aria-label'> & {
  /** Accessible name: an icon alone tells a screen reader nothing. */
  label: string;
  icon: ReactNode;
};

export function IconButton({ label, icon, variant = 'ghost', ...props }: IconButtonProps) {
  return (
    <Button variant={variant} size="icon" aria-label={label} {...props}>
      <span aria-hidden="true">{icon}</span>
    </Button>
  );
}
