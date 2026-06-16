/**
 * Display formatting helpers. Pure and locale-stable (fixed 'en-US' locale so the
 * UI and tests are deterministic). Every helper renders non-finite input as '—'
 * rather than throwing or printing 'NaN'.
 */

/** Default locale for consistent formatting. */
const LOCALE = 'en-US';

/** Fallback display for non-finite values. */
const NON_FINITE_DISPLAY = '—';

/** Default decimal places for number formatting. */
const DEFAULT_DECIMALS = 0;

/** Kilograms to tonnes threshold. */
const KG_TO_TONNES_THRESHOLD = 1000;

/** Decimal places for CO2 tonnes display. */
const CO2_TONNES_DECIMALS = 2;

/** Decimal places for tonnes formatting. */
const TONNES_DECIMALS = 2;

/** CO2e unit suffix for kilograms. */
const CO2_KG_UNIT = ' kg CO₂e';

/** CO2e unit suffix for tonnes. */
const CO2_TONNES_UNIT = ' t CO₂e';

/** Percent symbol. */
const PERCENT_SYMBOL = '%';

/** Format a number with thousands separators and a fixed number of decimals. */
export function formatNumber(value: number, decimals: number = DEFAULT_DECIMALS): string {
  if (!Number.isFinite(value)) return NON_FINITE_DISPLAY;
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format kg CO₂e: shown in kg below 1 tonne, otherwise in tonnes. */
export function formatCo2(kg: number): string {
  if (!Number.isFinite(kg)) return NON_FINITE_DISPLAY;
  if (Math.abs(kg) >= KG_TO_TONNES_THRESHOLD) {
    return `${formatNumber(kg / KG_TO_TONNES_THRESHOLD, CO2_TONNES_DECIMALS)}${CO2_TONNES_UNIT}`;
  }
  return `${formatNumber(kg, DEFAULT_DECIMALS)}${CO2_KG_UNIT}`;
}

/** Format a tonnes value as e.g. "4.70 t CO₂e". */
export function formatTonnes(tonnes: number): string {
  if (!Number.isFinite(tonnes)) return NON_FINITE_DISPLAY;
  return `${formatNumber(tonnes, TONNES_DECIMALS)}${CO2_TONNES_UNIT}`;
}

/** Format a percentage value as e.g. "85%" (value is already 0–100). */
export function formatPercent(value: number, decimals: number = DEFAULT_DECIMALS): string {
  if (!Number.isFinite(value)) return NON_FINITE_DISPLAY;
  return `${formatNumber(value, decimals)}${PERCENT_SYMBOL}`;
}
