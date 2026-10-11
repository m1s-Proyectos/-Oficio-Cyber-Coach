import { EducationalAdvice } from './EducationalAdvice';

/** Compatibilidad: las simulaciones C–E pueden seguir importando este nombre. */
export function AdviceVoiceBar({
  scenarioSlug,
  optionId,
  explanation = '',
  recommendation = '',
}: {
  scenarioSlug: string;
  optionId: string;
  explanation?: string;
  recommendation?: string;
}) {
  return (
    <EducationalAdvice
      scenarioSlug={scenarioSlug}
      optionId={optionId}
      explanation={explanation}
      recommendation={recommendation}
    />
  );
}
