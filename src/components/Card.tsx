import type { ReactNode } from 'react';

type CardVariant = 'default' | 'raised' | 'muted';

export interface CardProps {
  variant?: CardVariant;
  as?: 'div' | 'section' | 'article' | 'aside';
  className?: string;
  ariaLabelledBy?: string;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  as: Tag = 'div',
  className,
  ariaLabelledBy,
  children,
}: CardProps) {
  const composed = ['card', className].filter(Boolean).join(' ');
  return (
    <Tag className={composed} data-variant={variant} aria-labelledby={ariaLabelledBy}>
      {children}
    </Tag>
  );
}
