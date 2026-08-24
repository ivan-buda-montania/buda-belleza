import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';

export type ButtonVariant =
  'primary' | 'ink' | 'gold' | 'outline' | 'outlineOnDark' | 'subtle' | 'ghost' | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,border-color,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] active:translate-y-px disabled:pointer-events-none disabled:opacity-45';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[var(--shadow-brand)] hover:bg-brand-700 hover:shadow-[0_18px_40px_-14px_rgb(145_22_89/0.6)]',
  ink: 'bg-ink-900 text-white shadow-[var(--shadow-e2)] hover:bg-ink-800',
  gold: 'bg-gold-400 text-ink-900 shadow-[var(--shadow-gold)] hover:bg-gold-300',
  outline:
    'border border-ink-300 bg-transparent text-ink-800 hover:border-ink-900 hover:bg-ink-900 hover:text-white',
  outlineOnDark:
    'border border-white/30 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink-900',
  subtle: 'bg-ink-100 text-ink-800 hover:bg-ink-200',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  glass:
    'border border-white/25 bg-white/12 text-white backdrop-blur-md hover:bg-white/22 supports-[not(backdrop-filter:blur(0))]:bg-ink-900/60',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-7 text-[0.9375rem]',
};

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(base, variantStyles[variant], sizeStyles[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & LinkProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonStyles(variant, size, className)} {...props}>
      {children}
    </a>
  );
}
