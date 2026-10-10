import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type RouteName } from '../app/router';

type ButtonVariant = 'primary' | 'secondary' | 'beacon' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export interface ButtonProps
  extends SharedProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  as?: 'button';
}

export interface ButtonLinkProps extends SharedProps {
  as: 'link';
  to: RouteName;
  params?: Record<string, string> | undefined;
  ariaLabel?: string | undefined;
}

export interface ButtonAnchorProps extends SharedProps {
  as: 'a';
  href: string;
  target?: string | undefined;
  rel?: string | undefined;
  ariaLabel?: string | undefined;
}

export type AnyButtonProps = ButtonProps | ButtonLinkProps | ButtonAnchorProps;

/**
 * Shared button component.
 * - `as="button"` (default): native button element.
 * - `as="link"`: internal route link that uses the local hash router.
 * - `as="a"`: external anchor (opens new tab if `target="_blank"`).
 *
 * No business logic. Styling comes from `.btn` in components.css.
 */
export function Button(props: AnyButtonProps) {
  const variant: ButtonVariant = props.variant ?? 'primary';
  const size: ButtonSize = props.size ?? 'md';
  const className = ['btn', props.className].filter(Boolean).join(' ');

  if (props.as === 'link') {
    const { to, params, children, ariaLabel } = props;
    return (
      <Link
        to={to}
        params={params}
        className={className}
        data-variant={variant}
        data-size={size}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { href, target, rel, ariaLabel, children } = props;
    const safeRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;
    return (
      <a
        href={href}
        target={target}
        rel={safeRel}
        className={className}
        data-variant={variant}
        data-size={size}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children, as: _a, ...rest } = props;
  return (
    <button className={className} data-variant={variant} data-size={size} {...rest}>
      {children}
    </button>
  );
}
