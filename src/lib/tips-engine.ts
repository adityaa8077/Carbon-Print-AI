import {
  CAR_FUEL_FACTOR,
  FLIGHT_FACTOR,
  TRANSIT_FACTOR,
  DIET_FACTOR,
  FOOD_WASTE_MULTIPLIER,
  SHOPPING_FACTOR,
  RECYCLING_MULTIPLIER,
  WEEKS_PER_YEAR,
  type Diet,
  type Shopping,
} from './emission-factors';
import { round } from './number';
import type { CategoryKey, FootprintInput, FootprintResult } from './schemas';

export type Effort = 'low' | 'medium' | 'high';

export interface Tip {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  /** Estimated annual saving from this single action, kg CO₂e. */
  estimatedSavingKg: number;
  effort: Effort;
}

/** Annual car emissions (kg CO₂e) above which a modal-shift tip is worthwhile. */
const MODAL_SHIFT_CAR_THRESHOLD_KG = 500;

/** Fraction of weekly car distance assumed shifted to transit/active travel. */
const MODAL_SHIFT_FRACTION = 0.25;

/** Renewable share that fully decarbonises an electricity tariff, percent. */
const FULL_RENEWABLE_PERCENT = 100;

/** Minimum number of long-haul flights to suggest replacement. */
const MIN_LONGHAUL_FLIGHTS_FOR_TIP = 1;

/** No-emission electric car fuel type constant. */
const ELECTRIC_CAR_FUEL = 'electric';

/** No car fuel type constant. */
const NO_CAR_FUEL = 'none';

/** Minimum emission difference to suggest a tip. */
const MIN_EMISSION_SAVING_KG = 0;

/** The next lower-impact diet for each diet (null for the lowest). */
const LOWER_IMPACT_DIET: Record<Diet, Diet | null> = {
  high_meat: 'medium_meat',
  medium_meat: 'low_meat',
  low_meat: 'pescatarian',
  pescatarian: 'vegetarian',
  vegetarian: 'vegan',
  vegan: null,
};

/** Diet name delimiter for humanization. */
const DIET_NAME_DELIMITER = '_';

/** Diet name replacement for display. */
const DIET_NAME_SPACE = ' ';

function humanizeDiet(diet: Diet): string {
  return diet.replace(DIET_NAME_DELIMITER, DIET_NAME_SPACE);
}

export interface GenerateTipsOptions {
  /** Maximum number of tips to return (highest-impact first). */
  limit?: number;
}

/**
 * Produce a ranked list of personalized reduction tips.
 *
 * Rule-based and deterministic: each tip's estimated saving is derived from the
 * same emission factors used by the calculator, so the numbers are internally
 * consistent. Tips are sorted by estimated saving, descending.
 */
export function generateTips(
  input: FootprintInput,
  result: FootprintResult,
  options: GenerateTipsOptions = {},
): Tip[] {
  const tips: Tip[] = [];
  const { transport, home, food, consumption } = input;

  // 1. Switch the car toward electric.
  if (transport.carFuel !== ELECTRIC_CAR_FUEL && transport.carFuel !== NO_CAR_FUEL && result.details.car > MIN_EMISSION_SAVING_KG) {
    const km = transport.carKmPerWeek * WEEKS_PER_YEAR;
    const saving = km * (CAR_FUEL_FACTOR[transport.carFuel] - CAR_FUEL_FACTOR[ELECTRIC_CAR_FUEL]);
    tips.push({
      id: 'switch-ev',
      category: 'transport',
      title: 'Switch to an electric vehicle',
      description:
        'Replacing your current car with an EV removes most of its direct driving emissions.',
      estimatedSavingKg: round(saving),
      effort: 'high',
    });
  }

  // 2. Replace one long-haul flight.
  if (transport.flightsLongHaulPerYear >= MIN_LONGHAUL_FLIGHTS_FOR_TIP) {
    tips.push({
      id: 'cut-longhaul-flight',
      category: 'transport',
      title: 'Replace one long-haul flight',
      description:
        'Swapping a single long-haul return trip for rail, a closer destination, or a virtual meeting.',
      estimatedSavingKg: round(FLIGHT_FACTOR.longHaul),
      effort: 'medium',
    });
  }

  // 3. Shift some car trips to transit / active travel.
  if (
    result.details.car > MODAL_SHIFT_CAR_THRESHOLD_KG &&
    transport.publicTransitKmPerWeek < transport.carKmPerWeek
  ) {
    const shiftedKm = transport.carKmPerWeek * MODAL_SHIFT_FRACTION * WEEKS_PER_YEAR;
    const saving = shiftedKm * (CAR_FUEL_FACTOR[transport.carFuel] - TRANSIT_FACTOR);
    if (saving > MIN_EMISSION_SAVING_KG) {
      tips.push({
        id: 'shift-to-transit',
        category: 'transport',
        title: 'Shift a quarter of car trips to transit or cycling',
        description:
          'Moving short, regular journeys from the car to public transport, walking, or cycling.',
        estimatedSavingKg: round(saving),
        effort: 'medium',
      });
    }
  }

  // 4. Switch to a renewable electricity tariff.
  if (home.renewablePercent < FULL_RENEWABLE_PERCENT && result.details.electricity > MIN_EMISSION_SAVING_KG) {
    const saving =
      result.details.electricity * (1 - home.renewablePercent / FULL_RENEWABLE_PERCENT);
    tips.push({
      id: 'renewable-tariff',
      category: 'home',
      title: 'Switch to a renewable electricity tariff',
      description:
        'A certified green tariff or rooftop solar can cut your electricity emissions toward zero.',
      estimatedSavingKg: round(saving),
      effort: 'low',
    });
  }

  // 5. Shift toward a lower-impact diet.
  const lower = LOWER_IMPACT_DIET[food.diet];
  if (lower) {
    const saving =
      (DIET_FACTOR[food.diet] - DIET_FACTOR[lower]) * FOOD_WASTE_MULTIPLIER[food.foodWaste];
    if (saving > MIN_EMISSION_SAVING_KG) {
      tips.push({
        id: 'diet-shift',
        category: 'food',
        title: 'Shift toward a lower-impact diet',
        description: `Moving from a ${humanizeDiet(food.diet)} to a ${humanizeDiet(lower)} diet meaningfully lowers food emissions.`,
        estimatedSavingKg: round(saving),
        effort: 'medium',
      });
    }
  }

  // 6. Cut food waste.
  const LOW_FOOD_WASTE = 'low';
  if (food.foodWaste !== LOW_FOOD_WASTE) {
    const current = DIET_FACTOR[food.diet] * FOOD_WASTE_MULTIPLIER[food.foodWaste];
    const reduced = DIET_FACTOR[food.diet] * FOOD_WASTE_MULTIPLIER[LOW_FOOD_WASTE];
    tips.push({
      id: 'cut-food-waste',
      category: 'food',
      title: 'Reduce food waste',
      description:
        'Planning meals and storing food well cuts the emissions embedded in food that gets thrown away.',
      estimatedSavingKg: round(current - reduced),
      effort: 'low',
    });
  }

  // 7. Buy less and choose secondhand.
  const FREQUENT_SHOPPING_LEVEL = 'frequent';
  const AVERAGE_SHOPPING_LEVEL = 'average';
  const MINIMAL_SHOPPING_LEVEL = 'minimal';
  const NO_RECYCLING_MULTIPLIER = 1;
  
  if (consumption.shopping !== MINIMAL_SHOPPING_LEVEL) {
    const reducedLevel: Shopping = consumption.shopping === FREQUENT_SHOPPING_LEVEL ? AVERAGE_SHOPPING_LEVEL : MINIMAL_SHOPPING_LEVEL;
    const multiplier = consumption.recycles ? RECYCLING_MULTIPLIER : NO_RECYCLING_MULTIPLIER;
    const saving =
      (SHOPPING_FACTOR[consumption.shopping] - SHOPPING_FACTOR[reducedLevel]) * multiplier;
    tips.push({
      id: 'buy-less',
      category: 'consumption',
      title: 'Buy less and choose secondhand',
      description:
        'Extending the life of what you own and buying used avoids the emissions of new products.',
      estimatedSavingKg: round(saving),
      effort: 'medium',
    });
  }

  // 8. Recycle consistently.
  if (!consumption.recycles) {
    const saving = SHOPPING_FACTOR[consumption.shopping] * (NO_RECYCLING_MULTIPLIER - RECYCLING_MULTIPLIER);
    tips.push({
      id: 'start-recycling',
      category: 'consumption',
      title: 'Recycle consistently',
      description: 'Routine recycling lowers the lifecycle emissions of your household goods.',
      estimatedSavingKg: round(saving),
      effort: 'low',
    });
  }

  tips.sort((a, b) => b.estimatedSavingKg - a.estimatedSavingKg);

  const ZERO_LIMIT = 0;
  const limit = options.limit ?? tips.length;
  return tips.slice(ZERO_LIMIT, Math.max(ZERO_LIMIT, limit));
}
