import { round } from './number';
import { CATEGORY_KEYS, type CategoryKey, type FootprintResult } from './schemas';

export interface CategoryShare {
  key: CategoryKey;
  kg: number;
  /** Share of the total footprint, 0–100 (0 when the total is 0). */
  percent: number;
}

/** Percentage multiplier for share calculations. */
const PERCENT_MULTIPLIER = 100;

/** Decimal places for percentage rounding. */
const PERCENT_DECIMALS = 1;

/** Minimum total to avoid division by zero. */
const MIN_TOTAL_THRESHOLD = 0;

/** Default percentage when total is zero. */
const ZERO_PERCENT = 0;

/**
 * Break a result's category totals into shares of the whole, sorted largest first.
 *
 * Pure and deterministic. Percentages are rounded to one decimal; when the total is
 * zero every share is 0 (avoids divide-by-zero), so the UI can render safely for an
 * all-zero profile.
 */
export function categoryBreakdown(result: FootprintResult): CategoryShare[] {
  const total = result.totalKg;
  return CATEGORY_KEYS.map((key) => {
    const kg = result.categories[key];
    const percent = total > MIN_TOTAL_THRESHOLD ? round((kg / total) * PERCENT_MULTIPLIER, PERCENT_DECIMALS) : ZERO_PERCENT;
    return { key, kg, percent };
  }).sort((a, b) => b.kg - a.kg);
}
