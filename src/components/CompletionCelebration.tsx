import { useEffect, useRef } from 'react';

/**
 * Celebración local y sin dependencias externas.
 * El sonido se crea con Web Audio tras una acción del usuario y respeta movimiento reducido.
 */
export function CompletionCelebration({ active }: { active: boolean }) {
  const previous = useRef(false);

  useEffect(() => {
    if (!active || previous.current) {
      previous.current = active;
      return;
    }
    previous.current = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      const layer = document.createElement('div');
      layer.className = 'celebration-confetti';
      layer.setAttribute('aria-hidden', 'true');

      for (let index = 0; index < 34; index += 1) {
        const piece = document.createElement('span');
        piece.style.setProperty('--x', `${(index * 37) % 100}%`);
        piece.style.setProperty('--delay', `${(index % 9) * 35}ms`);
        piece.style.setProperty('--rotation', `${(index * 47) % 360}deg`);
        piece.className = `celebration-confetti__piece celebration-confetti__piece--${index % 4}`;
        layer.appendChild(piece);
      }

      document.body.appendChild(layer);
      window.setTimeout(() => layer.remove(), 1800);
    }

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextCtor) {
        const context = new AudioContextCtor();
        const now = context.currentTime;

        [659.25, 783.99, 1046.5].forEach((frequency, index) => {
          const startAt = now + index * 0.11;
          const oscillator = context.createOscillator();
          const gain = context.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.11, startAt + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.24);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startAt);
          oscillator.stop(startAt + 0.25);
        });

        window.setTimeout(() => {
          void context.close();
        }, 700);
      }
    } catch {
      // El ejercicio funciona aunque el navegador bloquee el audio.
    }
  }, [active]);

  return (
    <span className="sr-only" aria-live="polite">
      {active ? '¡Reto completado! Buen trabajo.' : ''}
    </span>
  );
}
