import { round } from './number';
import type { Goal } from './schemas';

export interface GoalProgress {
  /** Tonnes reduced from baseline so far (clamped at 0). */
  reducedTonnes: number;
  /** Total reduction the goal requires (baseline − target, clamped at 0). */
  neededTonnes: number;
  /** Progress toward the target, 0–100. */
  progressPercent: number;
  /** Tonnes still to cut to reach the target (0 once achieved). */
  remainingTonnes: number;
  /** True once the current footprint is at or below the target. */
  achieved: boolean;
}

/** Minimum reduction value (floor). */
const MIN_REDUCTION = 0;

/** Maximum progress percentage (ceiling). */
const MAX_PROGRESS_PERCENT = 100;

/** Minimum progress percentage (floor). */
const MIN_PROGRESS_PERCENT = 0;

/** No reduction needed threshold. */
const NO_REDUCTION_NEEDED = 0;

/** Percentage multiplier for progress calculations. */
const PERCENT_MULTIPLIER = 100;

/** Already achieved progress percentage. */
const FULL_PROGRESS_PERCENT = 100;

/** Minimum remaining tonnes (floor). */
const MIN_REMAINING_TONNES = 0;

/**
 * Compute progress of a current footprint against a reduction goal.
 *
 * Pure and defensive: if the goal's baseline is not above its target (nothing to
 * reduce), progress is reported as already complete. Values are clamped so the UI
 * never shows negative reductions or progress beyond 100%.
 */
export function goalProgress(goal: Goal, currentTonnes: number): GoalProgress {
  const needed = goal.baselineTonnes - goal.targetTonnes;
  const reduced = Math.max(MIN_REDUCTION, goal.baselineTonnes - currentTonnes);
  const achieved = currentTonnes <= goal.targetTonnes;

  const progressPercent =
    needed <= NO_REDUCTION_NEEDED 
      ? FULL_PROGRESS_PERCENT 
      : Math.min(MAX_PROGRESS_PERCENT, Math.max(MIN_PROGRESS_PERCENT, Math.round((reduced / needed) * PERCENT_MULTIPLIER)));
  const remaining = achieved ? MIN_REMAINING_TONNES : Math.max(MIN_REMAINING_TONNES, currentTonnes - goal.targetTonnes);

  return {
    reducedTonnes: round(reduced),
    neededTonnes: round(Math.max(MIN_REDUCTION, needed)),
    progressPercent,
    remainingTonnes: round(remaining),
    achieved,
  };
}
