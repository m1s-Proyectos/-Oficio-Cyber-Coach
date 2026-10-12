import { Link, type RouteName } from '../app/router';
import { Badge } from './Badge';

interface ScenarioCardProps {
  kicker: string;
  title: string;
  description: string;
  statusLabel: string;
  statusTone?: 'preview' | 'info' | 'beacon' | 'verify' | undefined;
  to: RouteName;
  params?: Record<string, string> | undefined;
  cta?: string | undefined;
}

/**
 * Clickable card used in the home catalog.
 * Keeps the whole card as a single link so the entire surface is a target.
 */
export function ScenarioCard({
  kicker,
  title,
  description,
  statusLabel,
  statusTone = 'preview',
  to,
  params,
  cta = 'Explorar escenario',
}: ScenarioCardProps) {
  return (
    <Link to={to} params={params} className="scenario-card">
      <header className="scenario-card__header">
        <span className="scenario-card__kicker">{kicker}</span>
        <Badge tone={statusTone}>{statusLabel}</Badge>
      </header>
      <h3 className="scenario-card__title">{title}</h3>
      <p className="scenario-card__body">{description}</p>
      <div className="scenario-card__footer">
        <span>{cta}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
