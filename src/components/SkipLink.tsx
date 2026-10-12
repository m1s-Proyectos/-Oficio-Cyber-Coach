interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * Keyboard-only accessibility helper that jumps focus to the main content
 * area, skipping the site header.
 */
export function SkipLink({ targetId, label = 'Saltar al contenido principal' }: SkipLinkProps) {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      {label}
    </a>
  );
}
