import type { JSX } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface StepperProps {
  steps: ReadonlyArray<string>;
  /** Zero-based index of the active step. */
  current: number;
}

/**
 * Horizontal step indicator for the multi-step form.
 *
 * Rendered as an ordered list with a visually-hidden status on each step and
 * `aria-current="step"` on the active one, plus a single summary line ("Step n of
 * m") for quick orientation. Past steps show a check; the rest show their number.
 */
export function Stepper({ steps, current }: StepperProps): JSX.Element {
  return (
    <nav aria-label="Progress">
      <p className="sr-only">
        Step {current + 1} of {steps.length}: {steps[current]}
      </p>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                aria-current={status === 'current' ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  status === 'complete' && 'bg-primary text-slate-950 font-bold',
                  status === 'current' &&
                    'bg-primary text-slate-950 font-bold ring-2 ring-primary/30 ring-offset-2 ring-offset-slate-900',
                  status === 'upcoming' && 'bg-slate-950/40 text-slate-500 ring-1 ring-slate-800',
                )}
              >
                {status === 'complete' ? (
                  <Icon name="check" size={16} />
                ) : (
                  <span aria-hidden="true">{i + 1}</span>
                )}
              </span>
              <span
                className={cn(
                  'text-sm',
                  status === 'current' ? 'font-bold text-slate-200' : 'text-slate-500',
                )}
              >
                {label}
                <span className="sr-only">
                  {status === 'complete'
                    ? ' (completed)'
                    : status === 'current'
                      ? ' (current)'
                      : ''}
                </span>
              </span>
              {i < steps.length - 1 ? (
                <span aria-hidden="true" className="hidden h-px w-6 bg-slate-800 sm:block" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
