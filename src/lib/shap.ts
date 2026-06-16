import { type FootprintInput, type FootprintResult } from './schemas';
import { PER_CAPITA_AVERAGE_TONNES } from './emission-factors';
import { round } from './number';

export interface ShapExplanationItem {
  feature: string;
  impact: number; // relative impact percentage
  impactKg: number; // raw impact in kg CO2e
  direction: 'higher' | 'lower';
  description: string;
}

// Category allocation percentages of the total average regional footprint
const ALLOCATIONS = {
  car: 0.20,
  transit: 0.04,
  flights: 0.06,
  electricity: 0.22,
  heating: 0.18,
  food: 0.15,
  consumption: 0.15,
};

/** Conversion factor from tonnes to kilograms. */
const TONNES_TO_KG_MULTIPLIER = 1000;

/** Minimum impact percentage to display. */
const MIN_IMPACT_PERCENT = 1;

/** Number of decimal places for impact percentage rounding. */
const IMPACT_PERCENT_DECIMALS = 0;

/** Percentage multiplier for impact calculations. */
const PERCENT_MULTIPLIER = 100;

/** Direction constants for emissions comparison. */
const DIRECTION_HIGHER = 'higher';
const DIRECTION_LOWER = 'lower';

/** Threshold for determining emission direction. */
const EMISSION_DIRECTION_THRESHOLD = 0;

/** Diet name delimiter for humanization. */
const DIET_NAME_DELIMITER = '_';

/** Diet name replacement for display. */
const DIET_NAME_SPACE = ' ';

type FeatureKey = keyof typeof ALLOCATIONS;

interface FeatureDescriptionParams {
  input: FootprintInput;
  direction: 'higher' | 'lower';
}

/**
 * Generate description for car travel emissions.
 */
function getCarDescription({ input, direction }: FeatureDescriptionParams): string {
  if (direction === DIRECTION_HIGHER) {
    return `Your car travel adds emissions due to driving ${input.transport.carKmPerWeek} km/week in a ${input.transport.carFuel} vehicle.`;
  }
  return `Your low driving distance (${input.transport.carKmPerWeek} km/week) or choice of fuel-efficient vehicle saves emissions.`;
}

/**
 * Generate description for public transit emissions.
 */
function getTransitDescription({ input, direction }: FeatureDescriptionParams): string {
  if (direction === DIRECTION_HIGHER) {
    return `Your transit usage is above average (${input.transport.publicTransitKmPerWeek} km/week), contributing additional transit-related emissions.`;
  }
  return `Your lower transit usage (${input.transport.publicTransitKmPerWeek} km/week) saves carbon compared to the regional baseline.`;
}

/**
 * Generate description for flight emissions.
 */
function getFlightsDescription({ input, direction }: FeatureDescriptionParams): string {
  if (direction === DIRECTION_HIGHER) {
    return `Your frequent flying (${input.transport.flightsShortHaulPerYear} short, ${input.transport.flightsLongHaulPerYear} long haul per year) generates substantial aviation emissions.`;
  }
  return `Your limited flying habits help keep your aviation emissions well below the average citizen.`;
}

/**
 * Generate description for electricity emissions.
 */
function getElectricityDescription({ input, direction }: FeatureDescriptionParams): string {
  if (direction === DIRECTION_HIGHER) {
    return `Your home electricity usage (${input.home.electricityKwhPerMonth} kWh/mo) or low renewable share (${input.home.renewablePercent}%) increases your footprint.`;
  }
  return `Your low energy usage or high renewable tariff (${input.home.renewablePercent}%) successfully offsets electricity emissions.`;
}

/**
 * Generate description for heating emissions.
 */
function getHeatingDescription({ input, direction }: FeatureDescriptionParams): string {
  if (direction === DIRECTION_HIGHER) {
    return `Your heating consumption (${input.home.heatingAmountPerMonth} units of ${input.home.heatingFuel}) is higher than the average person's footprint.`;
  }
  return `Your efficient heating choices or low energy consumption (${input.home.heatingAmountPerMonth} units) keeps heating emissions low.`;
}

/**
 * Generate description for food emissions.
 */
function getFoodDescription({ input, direction }: FeatureDescriptionParams): string {
  const dietText = input.food.diet.replace(DIET_NAME_DELIMITER, DIET_NAME_SPACE);
  if (direction === DIRECTION_HIGHER) {
    return `Your diet choice (${dietText}) combined with food waste habits contributes to higher food emissions.`;
  }
  return `Your sustainable dietary habits (${dietText}) and minimal waste reduce food emissions.`;
}

/**
 * Generate description for consumption emissions.
 */
function getConsumptionDescription({ input, direction }: FeatureDescriptionParams): string {
  const recyclingStatus = input.consumption.recycles ? 'active recycler' : 'standard';
  if (direction === DIRECTION_HIGHER) {
    return `Your shopping frequency (${input.consumption.shopping}) is higher than average, increasing manufacturing emissions.`;
  }
  return `Your minimal shopping habits and active recycling (${recyclingStatus}) save manufacturing carbon.`;
}

/**
 * Get the appropriate description based on feature key.
 */
function getFeatureDescription(
  key: FeatureKey,
  input: FootprintInput,
  direction: 'higher' | 'lower',
): string {
  const params: FeatureDescriptionParams = { input, direction };
  
  const descriptionGenerators: Record<FeatureKey, (params: FeatureDescriptionParams) => string> = {
    car: getCarDescription,
    transit: getTransitDescription,
    flights: getFlightsDescription,
    electricity: getElectricityDescription,
    heating: getHeatingDescription,
    food: getFoodDescription,
    consumption: getConsumptionDescription,
  };

  return descriptionGenerators[key](params);
}

/**
 * Compute SHAP values (game-theoretic contributions) of user inputs relative to
 * regional per-capita averages.
 */
export function calculateShap(input: FootprintInput, result: FootprintResult): ShapExplanationItem[] {
  const region = input.region;
  const avgTotalKg = PER_CAPITA_AVERAGE_TONNES[region] * TONNES_TO_KG_MULTIPLIER;

  const baselines = {
    car: avgTotalKg * ALLOCATIONS.car,
    transit: avgTotalKg * ALLOCATIONS.transit,
    flights: avgTotalKg * ALLOCATIONS.flights,
    electricity: avgTotalKg * ALLOCATIONS.electricity,
    heating: avgTotalKg * ALLOCATIONS.heating,
    food: avgTotalKg * ALLOCATIONS.food,
    consumption: avgTotalKg * ALLOCATIONS.consumption,
  };

  const userValues = {
    car: result.details.car,
    transit: result.details.transit,
    flights: result.details.flights,
    electricity: result.details.electricity,
    heating: result.details.heating,
    food: result.categories.food,
    consumption: result.categories.consumption,
  };

  const featuresList: Array<{ key: FeatureKey; name: string }> = [
    { key: 'car', name: 'Car Travel' },
    { key: 'transit', name: 'Public Transit' },
    { key: 'flights', name: 'Flights / Aviation' },
    { key: 'electricity', name: 'Home Electricity' },
    { key: 'heating', name: 'Home Heating' },
    { key: 'food', name: 'Diet & Food Waste' },
    { key: 'consumption', name: 'Shopping & Recycling' },
  ];

  return featuresList.map(({ key, name }) => {
    const baseline = baselines[key];
    const userVal = userValues[key];
    const diff = userVal - baseline;
    const direction = diff >= EMISSION_DIRECTION_THRESHOLD ? DIRECTION_HIGHER : DIRECTION_LOWER;
    const absDiff = Math.abs(diff);

    // Calculate relative impact percentage against the total average regional footprint
    const impact = Math.max(MIN_IMPACT_PERCENT, round((absDiff / avgTotalKg) * PERCENT_MULTIPLIER, IMPACT_PERCENT_DECIMALS));

    const description = getFeatureDescription(key, input, direction);

    return {
      feature: name,
      impact,
      impactKg: round(diff),
      direction,
      description,
    };
  });
}
