import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'beacon' | 'info' | 'verify' | 'alert' | 'preview';

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

/**
 * Compact label used for status indicators and metadata.
 * Default tone is neutral; `preview` is used throughout Phase 02 to flag
 * placeholder content that will be replaced in later phases.
 */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  const composed = ['badge', className].filter(Boolean).join(' ');
  return (
    <span className={composed} data-tone={tone === 'neutral' ? undefined : tone}>
      {children}
    </span>
  );
}
