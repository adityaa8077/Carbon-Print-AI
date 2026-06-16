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
});
