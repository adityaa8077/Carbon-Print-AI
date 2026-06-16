'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import {
  addHistoryEntry,
  calculateFootprint,
  consumptionInputSchema,
  defaultFootprintInput,
  foodInputSchema,
  footprintInputSchema,
  homeInputSchema,
  loadInput,
  saveInput,
  transportInputSchema,
  type FootprintInput,
} from '@/lib';
import { validateStep, type FieldErrors } from './validation';

export const STEP_LABELS = ['Region', 'Transport', 'Home', 'Food', 'Shopping', 'Review'] as const;
export const LAST_STEP = STEP_LABELS.length - 1;

/** Fallback error copy shown on the Region step when no top-level field path exists in the Zod error. */
const REGION_STEP_FALLBACK_ERROR = 'Please choose an option.';

/** Zero-based step index constants. */
const REGION_STEP_INDEX = 0;
const TRANSPORT_STEP_INDEX = 1;
const HOME_STEP_INDEX = 2;
const FOOD_STEP_INDEX = 3;
const CONSUMPTION_STEP_INDEX = 4;

/** Status messages for validation feedback. */
const FIX_FIELDS_STATUS_MESSAGE = 'Please fix the highlighted fields before continuing.';
const INVALID_ANSWERS_STATUS_MESSAGE = 'Some answers are invalid. Please review the earlier steps.';
const EMPTY_STATUS_MESSAGE = '';

/** Field key for region errors. */
const REGION_FIELD_KEY = 'region';

/** First element index in array. */
const FIRST_INDEX = 0;

export interface UseCalculatorForm {
  /** The full questionnaire state (always a complete, defaulted input). */
  input: FootprintInput;
  /** Zero-based index into STEP_LABELS. */
  step: number;
  /** Field-keyed validation errors for the current step. */
  errors: FieldErrors;
  /** Live-region message announcing validation problems. */
  status: string;
  /** Attach to the step heading; focus moves here on step change. */
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** Shallow-merge a patch into the input. */
  update: (patch: Partial<FootprintInput>) => void;
  /** Validate the current step and advance if it passes. */
  handleNext: () => void;
  /** Go back one step, clearing transient errors. */
  handleBack: () => void;
  /** Validate everything, persist, record history, and route to the dashboard. */
  handleSubmit: () => void;
}

/**
 * State and behaviour for the multi-step questionnaire. Holds the full
 * `FootprintInput`, seeded from `loadInput()` after mount (kept out of the
 * initial render to avoid an SSR hydration mismatch). Each step is validated
 * against its slice of the Zod schema before advancing; the final submit
 * validates the whole thing, persists it, records a history point, and routes
 * to the dashboard.
 */
export function useCalculatorForm(): UseCalculatorForm {
  const router = useRouter();
  const [input, setInput] = useState<FootprintInput>(defaultFootprintInput);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Seed from previously saved answers once, on the client only.
  useEffect(() => {
    const saved = loadInput();
    if (saved) setInput(saved);
  }, []);

  // Move focus to the step heading on each step change for keyboard/SR users.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = (patch: Partial<FootprintInput>): void =>
    setInput((prev) => ({ ...prev, ...patch }));

  /**
   * Map step index to corresponding validation schema and input section.
   */
  function getValidationForStep(stepIndex: number): ReturnType<typeof validateStep> {
    const validationMap: Record<number, ReturnType<typeof validateStep>> = {
      [REGION_STEP_INDEX]: validateStep(footprintInputSchema.shape.region, input.region),
      [TRANSPORT_STEP_INDEX]: validateStep(transportInputSchema, input.transport),
      [HOME_STEP_INDEX]: validateStep(homeInputSchema, input.home),
      [FOOD_STEP_INDEX]: validateStep(foodInputSchema, input.food),
      [CONSUMPTION_STEP_INDEX]: validateStep(consumptionInputSchema, input.consumption),
    };

    return validationMap[stepIndex] ?? { ok: true, data: input };
  }

  function validateCurrent(): boolean {
    const result = getValidationForStep(step);
    
    if (result.ok) {
      setErrors({});
      return true;
    }
    
    // For the region step the path is empty, so map the root error onto `region`.
    setErrors(
      step === REGION_STEP_INDEX
        ? { [REGION_FIELD_KEY]: Object.values(result.errors)[FIRST_INDEX] ?? REGION_STEP_FALLBACK_ERROR }
        : result.errors,
    );
    setStatus(FIX_FIELDS_STATUS_MESSAGE);
    return false;
  }

  function handleNext(): void {
    if (!validateCurrent()) return;
    setStatus(EMPTY_STATUS_MESSAGE);
    setStep((s) => Math.min(s + 1, LAST_STEP));
  }

  function handleBack(): void {
    setErrors({});
    setStatus(EMPTY_STATUS_MESSAGE);
    setStep((s) => Math.max(s - 1, REGION_STEP_INDEX));
  }

  function handleSubmit(): void {
    const result = validateStep(footprintInputSchema, input);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus(INVALID_ANSWERS_STATUS_MESSAGE);
      return;
    }
    const valid = result.data;
    saveInput(valid);
    const footprint = calculateFootprint(valid);
    addHistoryEntry({
      date: new Date().toISOString(),
      totalKg: footprint.totalKg,
      totalTonnes: footprint.totalTonnes,
    });
    router.push('/dashboard');
  }

  return { input, step, errors, status, headingRef, update, handleNext, handleBack, handleSubmit };
}
