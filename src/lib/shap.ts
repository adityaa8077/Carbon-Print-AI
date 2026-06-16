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

/**
 * Compute SHAP values (game-theoretic contributions) of user inputs relative to
 * regional per-capita averages.
 */
export function calculateShap(input: FootprintInput, result: FootprintResult): ShapExplanationItem[] {
  const region = input.region;
  const avgTotalKg = PER_CAPITA_AVERAGE_TONNES[region] * 1000;

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

  const featuresList: Array<{ key: keyof typeof baselines; name: string }> = [
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
    const direction = diff >= 0 ? 'higher' : 'lower';
    const absDiff = Math.abs(diff);

    // Calculate relative impact percentage against the total average regional footprint
    const impact = Math.max(1, Math.round((absDiff / avgTotalKg) * 100));

    let description = '';
    const dietText = input.food.diet.replace('_', ' ');

    switch (key) {
      case 'car':
        description = direction === 'higher'
          ? `Your car travel adds emissions due to driving ${input.transport.carKmPerWeek} km/week in a ${input.transport.carFuel} vehicle.`
          : `Your low driving distance (${input.transport.carKmPerWeek} km/week) or choice of fuel-efficient vehicle saves emissions.`;
        break;
      case 'transit':
        description = direction === 'higher'
          ? `Your transit usage is above average (${input.transport.publicTransitKmPerWeek} km/week), contributing additional transit-related emissions.`
          : `Your lower transit usage (${input.transport.publicTransitKmPerWeek} km/week) saves carbon compared to the regional baseline.`;
        break;
      case 'flights':
        description = direction === 'higher'
          ? `Your frequent flying (${input.transport.flightsShortHaulPerYear} short, ${input.transport.flightsLongHaulPerYear} long haul per year) generates substantial aviation emissions.`
          : `Your limited flying habits help keep your aviation emissions well below the average citizen.`;
        break;
      case 'electricity':
        description = direction === 'higher'
          ? `Your home electricity usage (${input.home.electricityKwhPerMonth} kWh/mo) or low renewable share (${input.home.renewablePercent}%) increases your footprint.`
          : `Your low energy usage or high renewable tariff (${input.home.renewablePercent}%) successfully offsets electricity emissions.`;
        break;
      case 'heating':
        description = direction === 'higher'
          ? `Your heating consumption (${input.home.heatingAmountPerMonth} units of ${input.home.heatingFuel}) is higher than the average person's footprint.`
          : `Your efficient heating choices or low energy consumption (${input.home.heatingAmountPerMonth} units) keeps heating emissions low.`;
        break;
      case 'food':
        description = direction === 'higher'
          ? `Your diet choice (${dietText}) combined with food waste habits contributes to higher food emissions.`
          : `Your sustainable dietary habits (${dietText}) and minimal waste reduce food emissions.`;
        break;
      case 'consumption':
        description = direction === 'higher'
          ? `Your shopping frequency (${input.consumption.shopping}) is higher than average, increasing manufacturing emissions.`
          : `Your minimal shopping habits and active recycling (${input.consumption.recycles ? 'active recycler' : 'standard'}) save manufacturing carbon.`;
        break;
    }

    return {
      feature: name,
      impact,
      impactKg: round(diff),
      direction,
      description,
    };
  });
}
