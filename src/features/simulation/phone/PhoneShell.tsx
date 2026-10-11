import type { ReactNode } from 'react';

interface PhoneShellProps {
  time: string;
  appLabel: string;
  subtitle: string;
  children: ReactNode;
  variant?: 'default' | 'chat';
  contactName?: string;
  contactInitials?: string;
  headerStatus?: string;
}

export function PhoneShell({
  time,
  appLabel,
  subtitle,
  children,
  variant = 'default',
  contactName,
  contactInitials,
  headerStatus,
}: PhoneShellProps) {
  const screenClass =
    variant === 'chat' ? 'phone-frame__screen phone-frame__screen--chat' : 'phone-frame__screen';

  return (
    <div className="phone-frame" role="region" aria-label="Teléfono simulado">
      <div className="phone-frame__notch" aria-hidden="true">
        <span />
      </div>
      <div className={screenClass}>
        <div className="phone-status">
          <span>{time}</span>
          <span>Simulado</span>
        </div>
        <header className={contactName ? 'phone-appbar phone-appbar--chat' : 'phone-appbar'}>
          {contactName ? (
            <>
              <span className="phone-avatar" aria-hidden="true">
                {contactInitials}
              </span>
              <div className="phone-appbar__copy">
                <p className="phone-appbar__name">{contactName}</p>
                <p className="phone-appbar__meta">{headerStatus ?? subtitle}</p>
              </div>
            </>
          ) : (
            <>
              <p className="phone-appbar__name">{appLabel}</p>
              <p className="phone-appbar__meta">{subtitle}</p>
            </>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
