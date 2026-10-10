import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
  align?: 'start' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  as: Tag = 'h2',
  align = 'start',
}: SectionHeadingProps) {
  return (
    <header className="section-head" style={{ textAlign: align === 'center' ? 'center' : 'start' }}>
      {eyebrow ? <p className="section-head__eyebrow">{eyebrow}</p> : null}
      <Tag id={id} className="section-head__title">
        {title}
      </Tag>
      {subtitle ? <p className="section-head__subtitle">{subtitle}</p> : null}
    </header>
  );
}
