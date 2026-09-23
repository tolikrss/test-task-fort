import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format';

interface PointDescriptionProps {
  description: string | undefined;
  className?: string;
}

/** The point's description, or a muted placeholder when it has none. */
export function PointDescription({ description, className }: PointDescriptionProps) {
  return (
    <span className={cn(description ? 'text-slate-600' : 'text-slate-400 italic', className)}>
      {description ?? 'Без опису'}
    </span>
  );
}

export function PointCreatedAt({ createdAt }: { createdAt: string }) {
  return <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>;
}
