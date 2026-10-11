import type { ReactNode } from 'react';
import { Container } from '../components/Container';

interface SecurityTip {
  title: string;
  body: string;
  icon: ReactNode;
}

function TipIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const SECURITY_TIPS: readonly SecurityTip[] = [
  {
    title: 'No compartas tus códigos de verificación.',
    body: 'Los códigos que recibes por SMS, correo o aplicaciones pueden permitir el acceso a tus cuentas. No los compartas con personas que te contacten, aunque afirmen ser de un banco o una empresa.',
    icon: (
      <TipIcon>
        <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
        <path d="M9 8h6M9 12h2M13 12h2M9 16h2M13 16h2" {...stroke} />
      </TipIcon>
    ),
  },
  {
    title: 'Desconfía de la urgencia y las amenazas.',
    body: 'Si un mensaje te presiona para pagar, transferir dinero o actuar inmediatamente, detente. Verifica la solicitud mediante un canal oficial que busques por tu cuenta.',
    icon: (
      <TipIcon>
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 8v4.5L15 15" {...stroke} />
      </TipIcon>
    ),
  },
  {
    title: 'Verifica antes de comprar.',
    body: 'Revisa la reputación del vendedor, la dirección del sitio web, las políticas de devolución y los métodos de pago. Un precio extraordinariamente bajo puede ser una señal de alerta.',
    icon: (
      <TipIcon>
        <path d="M6 7h12l-1 11H7L6 7z" {...stroke} />
        <path d="M9 7V6a3 3 0 0 1 6 0v1" {...stroke} />
      </TipIcon>
    ),
  },
  {
    title: 'Nunca pagues por una promesa de empleo sin verificarla.',
    body: 'Investiga la empresa, confirma sus canales oficiales y desconfía de ofertas que exigen dinero por adelantado para contratarte o garantizarte un puesto.',
    icon: (
      <TipIcon>
        <rect x="3" y="8" width="18" height="11" rx="2" {...stroke} />
        <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8M3 13h18" {...stroke} />
      </TipIcon>
    ),
  },
  {
    title: 'Confirma los mensajes de familiares o compañeros.',
    body: 'Si alguien te pide dinero, información confidencial o una acción inusual por mensajería, llama a un número que ya conozcas para confirmar su identidad.',
    icon: (
      <TipIcon>
        <path
          d="M8 5.5h.8a1.5 1.5 0 0 1 1.5 1.3l.3 2a1.5 1.5 0 0 1-.8 1.5l-1.1.6a11 11 0 0 0 4.4 4.4l.6-1.1a1.5 1.5 0 0 1 1.5-.8l2 .3a1.5 1.5 0 0 1 1.3 1.5V16a2 2 0 0 1-2 2A13 13 0 0 1 6 8a2 2 0 0 1 2-2.5z"
          {...stroke}
        />
      </TipIcon>
    ),
  },
  {
    title: 'Protege tus cuentas.',
    body: 'Utiliza contraseñas únicas, activa la autenticación multifactor cuando esté disponible y mantén actualizados tus dispositivos y aplicaciones.',
    icon: (
      <TipIcon>
        <rect x="6" y="11" width="12" height="8" rx="2" {...stroke} />
        <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" {...stroke} />
      </TipIcon>
    ),
  },
];

function SecurityTipCard({ tip }: { tip: SecurityTip }) {
  return (
    <article className="security-tip">
      <span className="security-tip__icon">{tip.icon}</span>
      <div className="security-tip__copy">
        <h3 className="security-tip__title">{tip.title}</h3>
        <p className="security-tip__body">{tip.body}</p>
      </div>
    </article>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <Container size="wide">
        <div className="site-footer__inner">
          <div className="site-footer__intro">
            <p className="site-footer__eyebrow">Consejos para protegerte</p>
            <h2 className="site-footer__heading">Pequeños hábitos, mayor seguridad digital</h2>
            <p className="site-footer__lead">
              Un momento para verificar puede ahorrarte muchos problemas. Aprende a reconocer las
              señales de alerta y a proteger tu información.
            </p>
          </div>
          <div className="security-tips" aria-label="Consejos útiles de ciberseguridad">
            {SECURITY_TIPS.map((tip) => (
              <SecurityTipCard key={tip.title} tip={tip} />
            ))}
          </div>
          <p className="site-footer__mantra">Detente. Verifica. Después decide.</p>
          <hr className="site-footer__divider" />
          <div className="site-footer__legal">
            <span>© {year} OFICIO Cyber Coach</span>
            <span>No se recopilan datos personales.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
