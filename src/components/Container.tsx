import type { ReactNode } from 'react';

type ContainerSize = 'narrow' | 'standard' | 'wide';

export interface ContainerProps {
  size?: ContainerSize;
  as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'nav' | 'article';
  className?: string;
  children: ReactNode;
}

/**
 * Centered page container with a controlled max-width.
 * Keeps horizontal padding consistent across viewports.
 */
export function Container({
  size = 'standard',
  as: Tag = 'div',
  className,
  children,
}: ContainerProps) {
  const composed = ['container', className].filter(Boolean).join(' ');
  return (
    <Tag className={composed} data-size={size}>
      {children}
    </Tag>
  );
}
