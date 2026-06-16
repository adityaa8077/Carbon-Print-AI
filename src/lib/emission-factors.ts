/**
 * Emission factors & benchmark data for Carbon Print AI.
 *
 * All values are APPROXIMATE and intended for awareness and relative comparison —
 * not audit-grade carbon accounting. See METHODOLOGY.md for full sourcing and caveats.
 *
 * Primary sources:
 *  - DEFRA: UK DESNZ / DEFRA Greenhouse Gas Conversion Factors (2023 edition)
 *  - EPA:   US EPA Emission Factors for Greenhouse Gas Inventories
 *  - IEA:   IEA / Ember — electricity grid carbon intensity by region (2023)
 *  - S2023: Scarborough et al. (2023), "Vegans, vegetarians, fish-eaters and meat-eaters
 *           in the UK show discrepant environmental impacts", Nature Food
 *
 * Units are kg CO₂e unless otherwise noted.
 */

export const REGIONS = ['US', 'UK', 'EU', 'IN', 'GLOBAL'] as const;
export type Region = (typeof REGIONS)[number];

export const CAR_FUELS = ['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const;
export type CarFuel = (typeof CAR_FUELS)[number];

export const HEATING_FUELS = ['gas', 'oil', 'lpg', 'wood', 'electric', 'heatpump', 'none'] as const;
export type HeatingFuel = (typeof HEATING_FUELS)[number];

export const DIETS = [
  'vegan',
  'vegetarian',
  'pescatarian',
  'low_meat',
  'medium_meat',
  'high_meat',
] as const;
export type Diet = (typeof DIETS)[number];

export const FOOD_WASTE_LEVELS = ['low', 'medium', 'high'] as const;
export type FoodWaste = (typeof FOOD_WASTE_LEVELS)[number];

export const SHOPPING_LEVELS = ['minimal', 'average', 'frequent'] as const;
export type Shopping = (typeof SHOPPING_LEVELS)[number];

/**
 * Electricity grid carbon intensity, kg CO₂e per kWh, by region (approximate, 2023).
 *
 * Source: IEA / Ember (2023) — "Electricity Grid Emission Factors".
 * Values: US 0.37 · UK 0.21 · EU 0.25 · IN 0.71 · Global 0.48.
 */
export const GRID_INTENSITY: Record<Region, number> = {
  US: 0.37,   // IEA / Ember 2023
  UK: 0.21,   // IEA / Ember 2023
  EU: 0.25,   // IEA / Ember 2023
  IN: 0.71,   // IEA / Ember 2023
  GLOBAL: 0.48, // IEA / Ember 2023 — world average
};

/**
 * Representative car emissions, kg CO₂e per km, by fuel type (tail-pipe + upstream).
 *
 * Source: DEFRA GHG Conversion Factors 2023, passenger cars, average occupancy.
 * Values: Petrol 0.192 · Diesel 0.171 · Hybrid 0.111 · Electric 0.053.
 * Electric value uses the UK grid intensity as a representative mid-range figure.
 */
export const CAR_FUEL_FACTOR: Record<CarFuel, number> = {
  petrol:   0.192, // DEFRA 2023
  diesel:   0.171, // DEFRA 2023
  hybrid:   0.111, // DEFRA 2023
  electric: 0.053, // DEFRA 2023 (grid-charged; local emissions zero, upstream varies)
  none:     0,
};

/**
 * Public transport blended emission factor, kg CO₂e per passenger-km.
 *
 * Source: DEFRA 2023 — weighted average of passenger rail and bus.
 * Value: 0.06 kg CO₂e / passenger-km.
 */
export const TRANSIT_FACTOR = 0.06; // DEFRA 2023

/**
 * Average emissions per ONE-WAY flight, kg CO₂e (includes non-CO₂ radiative forcing uplift).
 *
 * Source: DEFRA 2023 — average seating, economy class, with radiative forcing index (RFI).
 * Values: Short-haul (< ~3 500 km) 250 kg · Long-haul (> ~3 500 km) 1 100 kg.
 */
export const FLIGHT_FACTOR = {
  shortHaul: 250,  // DEFRA 2023, ~<3 500 km one-way, economy, with RFI
  longHaul:  1100, // DEFRA 2023, ~>3 500 km one-way, economy, with RFI
} as const;

/**
 * Heating fuel emission factors, kg CO₂e per NATURAL UNIT of fuel burned.
 * Units: gas → m³ · oil → litre · lpg → kg · wood → kg.
 *
 * Source: DEFRA GHG Conversion Factors 2023, stationary combustion.
 * Values: Natural Gas 2.02/m³ · Heating Oil 2.52/L · LPG 2.95/kg · Biomass/Wood 0.40/kg.
 *
 * 'electric' and 'heatpump' are metered in kWh and resolved against the regional
 * grid intensity in the calculator — they have no entry here.
 *
 * Wood (biomass) combustion CO₂ is biogenic and treated as carbon-neutral under
 * standard GHG convention. The factor (0.40/kg) covers only non-biogenic CH₄/N₂O
 * emissions. Unsustainable harvesting increases the real net impact.
 */
export const HEATING_FUEL_FACTOR: Record<Exclude<HeatingFuel, 'electric' | 'heatpump'>, number> = {
  gas:  2.02, // DEFRA 2023, per m³ natural gas
  oil:  2.52, // DEFRA 2023, per litre heating oil
  lpg:  2.95, // DEFRA 2023, per kg LPG
  wood: 0.40, // DEFRA 2023, per kg biomass/firewood (non-biogenic GHGs only)
  none: 0,
};

/**
 * The natural unit each heating fuel is measured in.
 * Lives next to the factor so the two cannot drift apart; the UI reads it to label inputs.
 */
export const HEATING_FUEL_UNIT: Record<HeatingFuel, string> = {
  gas:      'm³',
  oil:      'L',
  lpg:      'kg',
  wood:     'kg',
  electric: 'kWh',
  heatpump: 'kWh',
  none:     '',
};

/**
 * Heat-pump coefficient of performance (COP) — ratio of delivered heat to electrical input.
 *
 * A COP of 2.8 means 1 kWh of electricity produces 2.8 kWh of heat, making heat pumps
 * substantially cleaner than direct electric resistance heating.
 *
 * Source: DEFRA / industry consensus for air-source heat pumps in temperate climates.
 */
export const HEAT_PUMP_COP = 2.8; // DEFRA / industry consensus, air-source ASHP

/**
 * Annual dietary carbon footprint, kg CO₂e per year.
 *
 * Source: Scarborough et al. (2023), Nature Food — dietary GHG footprints for UK adults.
 * Values (kg CO₂e/yr): Vegan 1 100 · Vegetarian 1 400 · Pescatarian 1 700 ·
 *   Low-meat (<50 g/day) 2 200 · Medium-meat (50–99 g/day) 2 800 · High-meat (≥100 g/day) 3 600.
 */
export const DIET_FACTOR: Record<Diet, number> = {
  vegan:       1100, // Scarborough et al. 2023
  vegetarian:  1400, // Scarborough et al. 2023
  pescatarian: 1700, // Scarborough et al. 2023
  low_meat:    2200, // Scarborough et al. 2023 (<50 g meat/day)
  medium_meat: 2800, // Scarborough et al. 2023 (50–99 g meat/day)
  high_meat:   3600, // Scarborough et al. 2023 (≥100 g meat/day)
};

/**
 * Multiplier applied to dietary footprint based on food-waste level.
 *
 * Source: METHODOLOGY.md (derived from FAO food-loss and waste data).
 * Values: Low waste ×1.0 · Moderate waste ×1.1 · High waste ×1.25.
 */
export const FOOD_WASTE_MULTIPLIER: Record<FoodWaste, number> = {
  low:    1.00, // no uplift
  medium: 1.10, // 10% uplift — moderate household waste
  high:   1.25, // 25% uplift — high household waste
};

/**
 * Annual goods & services (shopping) footprint, kg CO₂e per year.
 *
 * Source: EPA (US) household consumption emission estimates, scaled to broad
 * shopping frequency bands for global applicability.
 * Values: Minimal 600 · Average 1 500 · Frequent 3 000 kg CO₂e/yr.
 */
export const SHOPPING_FACTOR: Record<Shopping, number> = {
  minimal:  600,  // EPA consumer goods lifecycle estimates
  average:  1500, // EPA consumer goods lifecycle estimates
  frequent: 3000, // EPA consumer goods lifecycle estimates
};

/**
 * Multiplier applied to goods & services footprint for consistent recyclers.
 *
 * Source: DEFRA material-flow analysis — recycling reduces embedded lifecycle emissions
 * by approximately 8% at the household level.
 * Value: 0.92 (8% reduction).
 */
export const RECYCLING_MULTIPLIER = 0.92; // DEFRA — ~8% lifecycle reduction for consistent recycling

/**
 * Average annual per-capita carbon footprint, tonnes CO₂e (approximate, 2023).
 *
 * Source: Our World in Data / IEA national GHG inventories (2023 estimates).
 * Values: US 14.0 · UK 5.0 · EU 6.5 · IN 1.9 · Global 4.7 t CO₂e/yr.
 */
export const PER_CAPITA_AVERAGE_TONNES: Record<Region, number> = {
  US:     14.0, // Our World in Data / IEA 2023
  UK:      5.0, // Our World in Data / IEA 2023
  EU:      6.5, // Our World in Data / IEA 2023
  IN:      1.9, // Our World in Data / IEA 2023
  GLOBAL:  4.7, // Our World in Data / IEA 2023 — world average
};

/**
 * Personal annual carbon budget aligned with limiting global warming to 1.5 °C, tonnes CO₂e.
 *
 * Source: IPCC AR6 (2021) / C40 Cities carbon budget framework.
 * Value: 2.3 t CO₂e/person/year.
 */
export const TARGET_TONNES = 2.3; // IPCC AR6 / C40 — 1.5 °C-aligned personal budget

/** Calendar constants used when annualising weekly or monthly inputs. */
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
