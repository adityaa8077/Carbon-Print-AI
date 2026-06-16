'use client';

import type { JSX } from 'react';
import { Button, Card, Icon, Stepper } from '@/components/ui';
import { StepPanel } from './StepPanel';
import { LAST_STEP, STEP_LABELS, useCalculatorForm } from './useCalculatorForm';

/**
 * Multi-step questionnaire shell. All state, validation, and persistence live in
 * `useCalculatorForm`; this component only lays out the stepper, the active
 * step's fields (via `StepPanel`), and the navigation controls.
 */

/** Tab index for programmatic focus management. */
const PROGRAMMATIC_FOCUS_TAB_INDEX = -1;

/** First step index for disabling back button. */
const FIRST_STEP_INDEX = 0;

/** Review step label identifier. */
const REVIEW_STEP_LABEL = 'Review';

/** Review step descriptive heading. */
const REVIEW_STEP_HEADING = 'Review your answers';

/** Icon size for navigation buttons. */
const NAVIGATION_ICON_SIZE = 18;

/** One-based step number offset for display. */
const STEP_NUMBER_OFFSET = 1;

/**
 * Returns a display-ready heading for the given step index.
 * The Review step gets a more descriptive title than its short label.
 */
function getStepHeading(step: number): string {
  const label = STEP_LABELS[step] ?? '';
  return label === REVIEW_STEP_LABEL ? REVIEW_STEP_HEADING : label;
}

export function CalculatorForm(): JSX.Element {
  const { input, step, errors, status, headingRef, update, handleNext, handleBack, handleSubmit } =
    useCalculatorForm();

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={STEP_LABELS} current={step} />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === LAST_STEP) handleSubmit();
            else handleNext();
          }}
          noValidate
        >
          <h2
            ref={headingRef}
            tabIndex={PROGRAMMATIC_FOCUS_TAB_INDEX}
            className="font-display text-2xl font-bold text-ink focus:outline-none"
          >
            {getStepHeading(step)}
          </h2>
          <p className="mt-1 text-ink/60">
            Step {step + STEP_NUMBER_OFFSET} of {STEP_LABELS.length}
          </p>

          <div className="mt-6">
            <StepPanel step={step} input={input} errors={errors} onUpdate={update} />
          </div>

          {/* Polite live region announces validation problems / step status. */}
          <p aria-live="polite" className="sr-only">
            {status}
          </p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === FIRST_STEP_INDEX}>
              <Icon name="arrow-left" size={NAVIGATION_ICON_SIZE} />
              Back
            </Button>
            {step === LAST_STEP ? (
              <Button type="submit" size="lg" variant="accent">
                See my results
                <Icon name="arrow-right" size={NAVIGATION_ICON_SIZE} />
              </Button>
            ) : (
              <Button type="submit" size="lg">
                Continue
                <Icon name="arrow-right" size={NAVIGATION_ICON_SIZE} />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
