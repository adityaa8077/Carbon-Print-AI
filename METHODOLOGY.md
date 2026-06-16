# Calculation Methodology & Sourcing

This document outlines the scientific formulas, mathematical assertions, and data references utilized by Carbon Print AI to determine personal greenhouse gas footprints.

## Reference Databases

Calculations are approximate educational values aligned with published figures from the following authorities:
- **DEFRA (UK Department for Environment, Food & Rural Affairs)**: General transport mileage factors, public transit variables, domestic heating fuels, and passenger aviation.
- **US Environmental Protection Agency (EPA)**: Household energy benchmarks and appliance factors.
- **IEA & Ember Data**: Annual electricity grid emission intensities by region (2023).
- **Scarborough et al. (2023)**: Dietary footprints (kg CO₂e per year) based on eating habits.

---

## Calculations & Coefficients

All inputs are annualized (weekly variables are scaled by 52; monthly by 12). 

### 1. Transport & Aviation

- **Vehicles**: `km/week × 52 × factor`. Fuel factors (kg CO₂e/km):
  - Petrol: 0.192
  - Diesel: 0.171
  - Hybrid: 0.111
  - Electric: 0.053
- **Public Transit**: `km/week × 52 × 0.06` (weighted average of passenger rail and bus transit).
- **Flights**: `shortHaul × 250 + longHaul × 1100` kg CO₂e per flight (takes into account radiative forcing index).

### 2. Residential Energy (Attributed per resident)

- **Power Usage**: `(kWh/month × 12 × gridIntensity(region) × (1 − renewable%)) / residents`.
- **Space Heating**: `(quantity/month × 12 × fuelFactor) / residents`. Fuels are evaluated in physical units (liters, m³, kg):
  - Natural Gas: 2.02 per m³
  - Heating Oil: 2.52 per liter
  - LPG: 2.95 per kg
  - Biomass / Firewood: 0.40 per kg (accounts for non-biogenic CH₄ and N₂O; assumes neutral CO₂ biogenic cycling, though unsustainable forestry can increase net footprint).
- **Grid Carbon Coefficients (kg CO₂e/kWh)**: US: 0.37, UK: 0.21, EU: 0.25, IN: 0.71, Global: 0.48.

### 3. Food Consumption

- `dietFactor × wasteFactor`. 
  - Diet coefficients (kg CO₂e/yr): Vegan: 1100, Vegetarian: 1400, Pescatarian: 1700, Low-Meat: 2200, Medium-Meat: 2800, High-Meat: 3600.
  - Food Waste multipliers: Low waste: 1.0, Moderate waste: 1.1, High waste: 1.25.

### 4. Goods & Materials

- `shoppingFactor × recyclingMultiplier`.
  - Shopping habits (kg CO₂e/yr): Minimal: 600, Average: 1500, Frequent: 3000.
  - Recycling behavior reduces consumption impact by a factor of 0.92 (8% reduction) for consistent recycling.

---

## Benchmarks & Goals

- **Per-Capita Average (Tonnes/yr)**: US: 14.0, UK: 5.0, EU: 6.5, IN: 1.9, Global: 4.7.
- **Science-Aligned Target**: **2.3 Tonnes CO₂e/year** (calculated allowance to limit global warming to 1.5°C).
