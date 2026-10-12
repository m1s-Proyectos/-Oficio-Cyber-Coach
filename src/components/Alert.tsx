import type { ReactNode } from 'react';

type AlertTone = 'info' | 'warning' | 'success' | 'danger';

interface AlertProps {
  tone?: AlertTone;
  title: string;
  children: ReactNode;
  className?: string;
}

const ICONS: Record<AlertTone, string> = {
  info: 'i',
  warning: '!',
  success: '✓',
  danger: '!',
};

const ARIA_ROLES: Record<AlertTone, 'status' | 'alert'> = {
  info: 'status',
  warning: 'status',
  success: 'status',
  danger: 'alert',
};

/**
 * Inline alert used for educational notices, loading hints and warnings.
 * Keeps text in the body — no auto dismiss, no toast behaviour.
 */
export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const composed = ['alert', className].filter(Boolean).join(' ');
  return (
    <div className={composed} data-tone={tone} role={ARIA_ROLES[tone]}>
      <span className="alert__icon" aria-hidden="true">
        {ICONS[tone]}
      </span>
      <div>
        <p className="alert__title">{title}</p>
        <div className="alert__body">{children}</div>
      </div>
    </div>
  );
}
