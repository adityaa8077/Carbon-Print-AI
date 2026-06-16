import { describe, expect, it } from 'vitest';
import { makeInput } from '@/test/factories';
import { calculateFootprint } from './calculator';
import { calculateShap } from './shap';

describe('calculateShap', () => {
  it('correctly calculates SHAP values relative to GLOBAL baseline', () => {
    const input = makeInput({
      region: 'GLOBAL',
      transport: { carKmPerWeek: 300, carFuel: 'petrol' },
      food: { diet: 'high_meat' },
    });
    const result = calculateFootprint(input);
    const shap = calculateShap(input, result);

    // Should return explanations for all 7 features
    expect(shap).toHaveLength(7);

    // Car Travel should have positive impact (higher) since driving is high
    const carShap = shap.find((s) => s.feature === 'Car Travel');
    expect(carShap).toBeDefined();
    expect(carShap?.direction).toBe('higher');
    expect(carShap?.impact).toBeGreaterThan(0);
    expect(carShap?.description).toContain('adds emissions');

    // Home heating should have negative impact (lower) because input is default 0
    const heatingShap = shap.find((s) => s.feature === 'Home Heating');
    expect(heatingShap).toBeDefined();
    expect(heatingShap?.direction).toBe('lower');
    expect(heatingShap?.description).toContain('keeps heating emissions low');
  });

  it('correctly calculates SHAP values for US region', () => {
    const input = makeInput({
      region: 'US',
      transport: { carKmPerWeek: 0, carFuel: 'none' },
    });
    const result = calculateFootprint(input);
    const shap = calculateShap(input, result);

    // Car Travel should be negative/lower since user doesn't drive
    const carShap = shap.find((s) => s.feature === 'Car Travel');
    expect(carShap?.direction).toBe('lower');
  });

  it('covers "lower" description branches for transit, flights, electricity, food, consumption', () => {
    // Use a profile below the GLOBAL average on every dimension except food:
    // zero transit, zero flights, 100% renewable, minimal+recycles.
    // Note: vegan diet (1100 kg/yr) still exceeds the GLOBAL food baseline
    // (4700 × 0.15 = 705 kg), so food is tested separately with the US region
    // where the baseline is higher (14000 × 0.15 = 2100 kg).
    const input = makeInput({
      region: 'GLOBAL',
      transport: {
        carKmPerWeek: 0,
        carFuel: 'none',
        publicTransitKmPerWeek: 0,
        flightsShortHaulPerYear: 0,
        flightsLongHaulPerYear: 0,
      },
      home: {
        electricityKwhPerMonth: 0,
        renewablePercent: 100,
        heatingFuel: 'none',
        heatingAmountPerMonth: 0,
      },
      food: { diet: 'vegan', foodWaste: 'low' },
      consumption: { shopping: 'minimal', recycles: true },
    });
    const result = calculateFootprint(input);
    const shap = calculateShap(input, result);

    // Transit — lower direction
    const transitShap = shap.find((s) => s.feature === 'Public Transit');
    expect(transitShap?.direction).toBe('lower');
    expect(transitShap?.description).toContain('saves carbon');

    // Flights — lower direction
    const flightShap = shap.find((s) => s.feature === 'Flights / Aviation');
    expect(flightShap?.direction).toBe('lower');
    expect(flightShap?.description).toContain('below the average citizen');

    // Electricity — lower direction
    const electricityShap = shap.find((s) => s.feature === 'Home Electricity');
    expect(electricityShap?.direction).toBe('lower');
    expect(electricityShap?.description).toContain('offsets electricity emissions');

    // Consumption — lower direction
    const consumptionShap = shap.find((s) => s.feature === 'Shopping & Recycling');
    expect(consumptionShap?.direction).toBe('lower');
    expect(consumptionShap?.description).toContain('save manufacturing carbon');

    // Food — lower direction tested against US region (baseline 2100 kg > vegan 1100 kg)
    const usInput = makeInput({
      region: 'US',
      transport: { carKmPerWeek: 0, carFuel: 'none' },
      food: { diet: 'vegan', foodWaste: 'low' },
      consumption: { shopping: 'minimal', recycles: true },
    });
    const usResult = calculateFootprint(usInput);
    const usShap = calculateShap(usInput, usResult);
    const foodShap = usShap.find((s) => s.feature === 'Diet & Food Waste');
    expect(foodShap?.direction).toBe('lower');
    expect(foodShap?.description).toContain('reduce food emissions');
  });

  it('covers "higher" description for transit, flights, electricity, heating, food, and consumption', () => {
    // Use a profile that exceeds the regional average on all dimensions.
    // Gas heating (1000 m³/month) chosen to trigger the heating "higher" branch (line 98 of shap.ts).
    // Household size = 1 so all home usage is attributed to this person alone.
    const input = makeInput({
      region: 'GLOBAL',
      transport: {
        carKmPerWeek: 0,
        carFuel: 'none',
        publicTransitKmPerWeek: 1000, // very high transit
        flightsShortHaulPerYear: 20,
        flightsLongHaulPerYear: 10,
      },
      home: {
        electricityKwhPerMonth: 5000,
        renewablePercent: 0,
        heatingFuel: 'gas',
        heatingAmountPerMonth: 1000,
        householdSize: 1,
      },
      food: { diet: 'high_meat', foodWaste: 'high' },
      consumption: { shopping: 'frequent', recycles: false },
    });
    const result = calculateFootprint(input);
    const shap = calculateShap(input, result);

    const transitShap = shap.find((s) => s.feature === 'Public Transit');
    expect(transitShap?.direction).toBe('higher');
    expect(transitShap?.description).toContain('above average');

    const flightShap = shap.find((s) => s.feature === 'Flights / Aviation');
    expect(flightShap?.direction).toBe('higher');
    expect(flightShap?.description).toContain('substantial aviation emissions');

    const electricityShap = shap.find((s) => s.feature === 'Home Electricity');
    expect(electricityShap?.direction).toBe('higher');
    expect(electricityShap?.description).toContain('increases your footprint');

    // Heating — higher direction (covers shap.ts line 98)
    const heatingShap = shap.find((s) => s.feature === 'Home Heating');
    expect(heatingShap?.direction).toBe('higher');
    expect(heatingShap?.description).toContain('is higher than the average person');

    const consumptionShap = shap.find((s) => s.feature === 'Shopping & Recycling');
    expect(consumptionShap?.direction).toBe('higher');
    expect(consumptionShap?.description).toContain('higher than average');

    const foodShap = shap.find((s) => s.feature === 'Diet & Food Waste');
    expect(foodShap?.direction).toBe('higher');
    expect(foodShap?.description).toContain('higher food emissions');
  });
});
