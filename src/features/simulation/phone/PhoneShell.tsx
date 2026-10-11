import type { ReactNode } from 'react';

interface PhoneShellProps {
  time: string;
  appLabel: string;
  subtitle: string;
  children: ReactNode;
}

export function PhoneShell({ time, appLabel, subtitle, children }: PhoneShellProps) {
  return (
    <div className="phone-frame" role="region" aria-label="Teléfono simulado">
      <div className="phone-frame__notch" aria-hidden="true">
        <span />
      </div>
      <div className="phone-frame__screen">
        <div className="phone-status">
          <span>{time}</span>
          <span>Simulado</span>
        </div>
        <header className="phone-appbar">
          <p className="phone-appbar__name">{appLabel}</p>
          <p className="phone-appbar__meta">{subtitle}</p>
        </header>
        {children}
      </div>
    </div>
  );
}
