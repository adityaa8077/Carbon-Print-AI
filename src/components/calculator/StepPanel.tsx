'use client';

import type { JSX } from 'react';
import type { FootprintInput, Region } from '@/lib';
import { RegionStep } from './steps/RegionStep';
import { TransportStep } from './steps/TransportStep';
import { HomeStep } from './steps/HomeStep';
import { FoodStep } from './steps/FoodStep';
import { ConsumptionStep } from './steps/ConsumptionStep';
import { ReviewStep } from './steps/ReviewStep';
import { LAST_STEP } from './useCalculatorForm';
import type { FieldErrors } from './validation';

export interface StepPanelProps {
  /** Zero-based index of the active step. */
  step: number;
  input: FootprintInput;
  errors: FieldErrors;
  /** Shallow-merge a patch into the questionnaire input. */
  onUpdate: (patch: Partial<FootprintInput>) => void;
}

/** Step index constants for better readability. */
const REGION_STEP_INDEX = 0;
const TRANSPORT_STEP_INDEX = 1;
const HOME_STEP_INDEX = 2;
const FOOD_STEP_INDEX = 3;
const CONSUMPTION_STEP_INDEX = 4;

/** Type for step renderer function. */
type StepRenderer = (props: StepPanelProps) => JSX.Element | null;

/**
 * Render the region step.
 */
function renderRegionStep({ input, errors, onUpdate }: StepPanelProps): JSX.Element {
  return (
    <RegionStep
      value={input.region}
      errors={errors}
      onChange={(region: Region) => onUpdate({ region })}
    />
  );
}

/**
 * Render the transport step.
 */
function renderTransportStep({ input, errors, onUpdate }: StepPanelProps): JSX.Element {
  return (
    <TransportStep
      value={input.transport}
      errors={errors}
      onChange={(patch) => onUpdate({ transport: { ...input.transport, ...patch } })}
    />
  );
}

/**
 * Render the home step.
 */
function renderHomeStep({ input, errors, onUpdate }: StepPanelProps): JSX.Element {
  return (
    <HomeStep
      value={input.home}
      errors={errors}
      onChange={(patch) => onUpdate({ home: { ...input.home, ...patch } })}
    />
  );
}

/**
 * Render the food step.
 */
function renderFoodStep({ input, errors, onUpdate }: StepPanelProps): JSX.Element {
  return (
    <FoodStep
      value={input.food}
      errors={errors}
      onChange={(patch) => onUpdate({ food: { ...input.food, ...patch } })}
    />
  );
}

/**
 * Render the consumption step.
 */
function renderConsumptionStep({ input, errors, onUpdate }: StepPanelProps): JSX.Element {
  return (
    <ConsumptionStep
      value={input.consumption}
      errors={errors}
      onChange={(patch) => onUpdate({ consumption: { ...input.consumption, ...patch } })}
    />
  );
}

/**
 * Render the review step.
 */
function renderReviewStep({ input }: StepPanelProps): JSX.Element {
  return <ReviewStep input={input} />;
}

/** Map of step indices to their renderer functions. */
const STEP_RENDERERS: Record<number, StepRenderer> = {
  [REGION_STEP_INDEX]: renderRegionStep,
  [TRANSPORT_STEP_INDEX]: renderTransportStep,
  [HOME_STEP_INDEX]: renderHomeStep,
  [FOOD_STEP_INDEX]: renderFoodStep,
  [CONSUMPTION_STEP_INDEX]: renderConsumptionStep,
  [LAST_STEP]: renderReviewStep,
};

/** Renders the fields for the active questionnaire step. */
export function StepPanel(props: StepPanelProps): JSX.Element | null {
  const renderer = STEP_RENDERERS[props.step];
  return renderer ? renderer(props) : null;
}
