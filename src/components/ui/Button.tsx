import { type JSX, forwardRef, type ButtonHTMLAttributes } from 'react';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-slate-950 font-bold hover:bg-primary/95 focus-visible:ring-primary shadow-lg shadow-primary/15 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200',
  accent:
    'bg-accent text-white font-bold hover:bg-accent/95 focus-visible:ring-accent shadow-lg shadow-accent/15 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200',
  secondary:
    'bg-slate-800 text-slate-100 border border-slate-700/80 hover:bg-slate-700 focus-visible:ring-slate-600 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-slate-600 transition-colors duration-200',
};

// min-h keeps every target ≥44px tall for WCAG 2.5.5 / pointer ergonomics.
const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[52px] px-7 py-3 text-base',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  );
});

export type ButtonLinkProps = LinkProps &
  BaseProps & {
    className?: string;
    children: React.ReactNode;
  } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

/** A link styled as a button — for navigation (uses next/link). */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps): JSX.Element {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
