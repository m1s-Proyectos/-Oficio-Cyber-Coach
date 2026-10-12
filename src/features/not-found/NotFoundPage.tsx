import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { StatusMessage } from '../../components/StatusMessage';

export function NotFoundPage() {
  return (
    <Container size="narrow">
      <StatusMessage
        kind="error"
        title="Esta ruta no existe"
        description="La dirección que buscas no forma parte del prototipo. Vuelve al inicio y elige una simulación."
        action={
          <Button as="link" to="home" variant="secondary">
            Ir al inicio
          </Button>
        }
      />
    </Container>
  );
}
