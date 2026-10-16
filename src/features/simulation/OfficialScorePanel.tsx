import type { SimulationResult } from '../../engine';

/**
 * Desglose de la nota oficial A–E (rúbrica con hitos).
 * Independiente del XP local de retos rápidos.
 */
export function OfficialScorePanel({ result }: { result: SimulationResult }) {
  return (
    <div className="official-score" aria-label="Nota oficial de la simulación">
      <p className="official-score__total">
        Nota de la simulación: <strong>{result.total}</strong>
        <span> / 100</span>
      </p>
      <ul className="official-score__dims">
        <li>Reconocimiento: {result.breakdown.recognition}/25</li>
        <li>Verificación: {result.breakdown.verification}/25</li>
        <li>Contención: {result.breakdown.containment}/25</li>
        <li>Recuperación: {result.breakdown.recovery}/25</li>
      </ul>
      <p className="official-score__note">
        Esta nota no es el XP de los retos rápidos ni una certificación de inmunidad al fraude.
      </p>
    </div>
  );
}

export function IncompleteExerciseNotice() {
  return (
    <p className="official-score__incomplete">
      Ejercicio incompleto: no hay nota oficial hasta cerrar en un final del escenario.
    </p>
  );
}
