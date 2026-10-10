import type { ReactNode } from 'react';

interface StatusMessageProps {
  kind: 'loading' | 'empty' | 'error';
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

/**
 * Reusable visual state block for loading / empty / error cases.
 * The engine and real data arrive in later phases; this component defines
 * how those states look so the eventual integration is drop-in.
 */
export function StatusMessage({ kind, title, description, action }: StatusMessageProps) {
  return (
    <div className="status-message" role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'loading' ? <span className="status-message__spinner" aria-hidden="true" /> : null}
      <p className="status-message__title">{title}</p>
      {description ? <div>{description}</div> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
