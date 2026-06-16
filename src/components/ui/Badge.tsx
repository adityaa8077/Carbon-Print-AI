import { type JSX, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'primary' | 'accent' | 'warning' | 'neutral' | 'danger';

const tones: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary border border-primary/20',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  neutral: 'bg-slate-850 text-slate-300 border border-slate-800',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

/** Small status/label pill. Carries its own text — never color-only. */
export function Badge({ tone = 'neutral', children, className }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
