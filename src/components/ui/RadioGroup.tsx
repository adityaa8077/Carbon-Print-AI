import { type JSX, useId } from 'react';
import { cn } from '@/lib/cn';

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioGroupProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  options: ReadonlyArray<RadioOption<T>>;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
}

/**
 * Radio group rendered as selectable cards inside a `<fieldset>`/`<legend>`.
 *
 * Uses real `<input type="radio">` elements (visually hidden, peer-driven styling)
 * so keyboard arrow-key navigation, focus, and screen-reader semantics are native.
 * The error region is `aria-live` and linked from the fieldset via aria-describedby.
 */
export function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  hint,
  error,
}: RadioGroupProps<T>): JSX.Element {
  const baseId = useId();
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
      <legend className="font-semibold text-slate-200">{legend}</legend>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-slate-400">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${baseId}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-slate-900',
                checked
                  ? 'border-primary bg-primary/10 ring-1 ring-primary text-slate-100'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/20 text-slate-300',
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span className="flex flex-col">
                <span className="font-semibold text-slate-200">{opt.label}</span>
                {opt.description ? (
                  <span className="text-sm text-slate-400">{opt.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <p
        id={errorId}
        aria-live="polite"
        className="min-h-[1.25rem] text-sm font-semibold text-red-400"
      >
        {error}
      </p>
    </fieldset>
  );
}
