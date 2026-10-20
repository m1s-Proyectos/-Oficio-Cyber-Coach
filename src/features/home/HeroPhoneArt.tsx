/**
 * Ilustración decorativa del hero — independiente del PhoneShell de simulaciones.
 * Contenido ficticio de prevención; no es interactivo.
 */
export function HeroPhoneArt() {
  return (
    <div
      className="hero-phone"
      role="img"
      aria-label="Ilustración de un teléfono con alertas ficticias de prevención de fraudes"
    >
      <div className="hero-phone__glow" aria-hidden="true" />
      <div className="hero-phone__float">
        <div className="hero-phone__device" aria-hidden="true">
          <div className="hero-phone__notch" />
          <div className="hero-phone__screen">
            <div className="hero-phone__status">
              <span>9:41</span>
              <span>●● ▰</span>
            </div>
            <div className="hero-phone__app">
              <span className="hero-phone__app-icon">!</span>
              <div>
                <strong>Centro de alertas</strong>
                <small>Protege tu información</small>
              </div>
            </div>
            <div className="hero-phone__card hero-phone__card--alert">
              <span>⚠</span>
              <div>
                <strong>Mensaje sospechoso</strong>
                <small>Te piden pagar de inmediato</small>
              </div>
            </div>
            <div className="hero-phone__card hero-phone__card--warn">
              <span>↗</span>
              <div>
                <strong>Enlace no verificado</strong>
                <small>Comprueba antes de abrir</small>
              </div>
            </div>
            <div className="hero-phone__card hero-phone__card--safe">
              <span>✓</span>
              <div>
                <strong>Verificación segura</strong>
                <small>Confirma por otro canal</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
