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

/** ID suffix for hint elements. */
const HINT_ID_SUFFIX = '-hint';

/** ID suffix for error elements. */
const ERROR_ID_SUFFIX = '-error';

/** ID suffix for radio option elements. */
const OPTION_ID_SUFFIX = '-';

/** Minimum height for error message region. */
const ERROR_MIN_HEIGHT = 'min-h-[1.25rem]';

/** Grid spacing between radio options. */
const OPTION_GRID_GAP = 'gap-2';

/** Margin top for hint text. */
const HINT_MARGIN_TOP = 'mt-1';

/** Margin top for options grid. */
const OPTIONS_MARGIN_TOP = 'mt-3';

/** Radio input size. */
const RADIO_SIZE = 'h-4 w-4';

/** Radio input margin top for alignment. */
const RADIO_MARGIN_TOP = 'mt-1';

/** Gap between radio input and label. */
const LABEL_GAP = 'gap-3';

/** Padding inside radio card. */
const CARD_PADDING = 'p-4';

/** Focus ring offset. */
const FOCUS_RING_OFFSET = 'ring-offset-2';

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
  const hintId = `${baseId}${HINT_ID_SUFFIX}`;
  const errorId = `${baseId}${ERROR_ID_SUFFIX}`;
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
      <legend className="font-semibold text-slate-200">{legend}</legend>
      {hint ? (
        <p id={hintId} className={`${HINT_MARGIN_TOP} text-sm text-slate-400`}>
          {hint}
        </p>
      ) : null}
      <div className={`${OPTIONS_MARGIN_TOP} grid ${OPTION_GRID_GAP} sm:grid-cols-2`}>
        {options.map((opt) => {
          const id = `${baseId}${OPTION_ID_SUFFIX}${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                `flex cursor-pointer items-start ${LABEL_GAP} rounded-2xl border ${CARD_PADDING} transition-all`,
                `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40 has-[:focus-visible]:${FOCUS_RING_OFFSET} has-[:focus-visible]:ring-offset-slate-900`,
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
                className={`${RADIO_MARGIN_TOP} ${RADIO_SIZE} shrink-0 accent-primary`}
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
        className={`${ERROR_MIN_HEIGHT} text-sm font-semibold text-red-400`}
      >
        {error}
      </p>
    </fieldset>
  );
}
