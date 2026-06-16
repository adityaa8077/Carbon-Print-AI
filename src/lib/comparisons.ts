import { PER_CAPITA_AVERAGE_TONNES, TARGET_TONNES, type Region } from './emission-factors';
import { round } from './number';

export type ComparisonStatus = 'below' | 'near' | 'above';

/** Footprint-to-target ratio up to which a result still counts as "near" target. */
const NEAR_TARGET_RATIO_MAX = 1.1;

/** Exact target ratio (footprint equals target). */
const EXACT_TARGET_RATIO = 1;

/** Band (as % of the regional average) treated as "near" average. */
const NEAR_AVERAGE_PERCENT_MIN = 95;
const NEAR_AVERAGE_PERCENT_MAX = 105;

/** Percentage multiplier for average calculations. */
const PERCENT_MULTIPLIER = 100;

/** Rounding precision for percentage calculations. */
const PERCENT_DECIMALS = 0;

export interface TargetComparison {
  /** The 1.5 °C-aligned personal target, tonnes CO₂e. */
  target: number;
  /** Difference from target, tonnes (positive means over target). */
  deltaTonnes: number;
  /** Ratio of footprint to target (1 = exactly on target). */
  ratio: number;
  status: ComparisonStatus;
}

/** Compare an annual footprint (tonnes) against the 1.5 °C personal target. */
export function compareToTarget(totalTonnes: number): TargetComparison {
  const deltaTonnes = totalTonnes - TARGET_TONNES;
  const ratio = totalTonnes / TARGET_TONNES;
  let status: ComparisonStatus;
  if (ratio <= EXACT_TARGET_RATIO) status = 'below';
  else if (ratio <= NEAR_TARGET_RATIO_MAX) status = 'near';
  else status = 'above';
  return {
    target: TARGET_TONNES,
    deltaTonnes: round(deltaTonnes),
    ratio: round(ratio),
    status,
  };
}

export interface AverageComparison {
  /** Regional per-capita average, tonnes CO₂e. */
  average: number;
  /** Footprint as a percentage of the regional average (100 = exactly average). */
  percentOfAverage: number;
  status: ComparisonStatus;
}

/** Compare an annual footprint (tonnes) against the regional per-capita average. */
export function compareToAverage(totalTonnes: number, region: Region): AverageComparison {
  const average = PER_CAPITA_AVERAGE_TONNES[region];
  const percentOfAverage = round((totalTonnes / average) * PERCENT_MULTIPLIER, PERCENT_DECIMALS);
  let status: ComparisonStatus;
  if (percentOfAverage < NEAR_AVERAGE_PERCENT_MIN) status = 'below';
  else if (percentOfAverage <= NEAR_AVERAGE_PERCENT_MAX) status = 'near';
  else status = 'above';
  return { average, percentOfAverage, status };
}
