import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';

export function EducationalAdvice({
  explanation,
  recommendation,
}: {
  scenarioSlug: string;
  optionId: string;
  explanation: string;
  recommendation: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const text = `Qué implica: ${explanation}. Siguiente hábito: ${recommendation}.`;

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [text]);

  const speak = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-SV';
    utterance.rate = 0.96;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <aside className="phone-narration" aria-label="Consejo educativo">
      <details className="phone-narration__text">
        <summary>Leer el consejo</summary>
        <p><strong>Qué implica:</strong> {explanation}</p>
        <p><strong>Siguiente hábito:</strong> {recommendation}</p>
      </details>
      <div className="phone-narration__controls">
        <p className="phone-narration__status" aria-live="polite">
          {canSpeak ? (speaking ? 'Reproduciendo consejo' : 'Consejo disponible para escuchar') : 'Este navegador no admite lectura en voz alta'}
        </p>
        <div className="phone-narration__actions">
          <Button type="button" variant="secondary" disabled={!canSpeak} onClick={speak}>
            {speaking ? 'Detener voz' : 'Escuchar consejo'}
          </Button>
        </div>
      </div>
    </aside>
  );
}
