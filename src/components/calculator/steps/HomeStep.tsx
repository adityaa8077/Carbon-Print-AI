import type { JSX } from 'react';
import { NumberField, SelectField } from '@/components/ui';
import { HEATING_FUELS, HEATING_FUEL_UNIT, type HeatingFuel } from '@/lib';
import { HEATING_FUEL_LABELS, toOptions } from '@/components/labels';
import type { FieldErrors, HomeInput } from '../validation';

export interface HomeStepProps {
  value: HomeInput;
  onChange: (patch: Partial<HomeInput>) => void;
  errors: FieldErrors;
}

/** Maximum percentage value for renewable electricity. */
const MAX_RENEWABLE_PERCENT = 100;

/** Minimum household size. */
const MIN_HOUSEHOLD_SIZE = 1;

/** Maximum household size. */
const MAX_HOUSEHOLD_SIZE = 20;

/** Step increment for household size input. */
const HOUSEHOLD_SIZE_STEP = 1;

/** No heating fuel type constant. */
const NO_HEATING_FUEL = 'none';

/** Default heating amount when not using heating. */
const DEFAULT_HEATING_AMOUNT = 0;

/** How to read each fuel's monthly quantity off a bill or delivery. */
const HEATING_AMOUNT_HINT: Record<Exclude<HeatingFuel, 'none'>, string> = {
  gas: 'Cubic metres on your gas bill.',
  oil: 'Litres delivered, averaged per month.',
  lpg: 'Kilograms used — a standard cylinder is ≈ 14.2 kg.',
  wood: 'Kilograms of firewood or pellets burned.',
  electric: 'Metered electricity used for heating.',
  heatpump: 'Electricity the heat pump draws.',
};

/**
 * Determine if heating amount should be reset when fuel type changes.
 */
function shouldResetHeatingAmount(newFuel: HeatingFuel, currentFuel: HeatingFuel): boolean {
  return HEATING_FUEL_UNIT[newFuel] !== HEATING_FUEL_UNIT[currentFuel];
}

/** Step 3 — household energy. Totals are attributed per person via household size. */
export function HomeStep({ value, onChange, errors }: HomeStepProps): JSX.Element {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <NumberField
        label="Electricity use"
        value={value.electricityKwhPerMonth}
        unit="kWh / month"
        hint="Check a recent bill, or estimate."
        error={errors.electricityKwhPerMonth}
        onChange={(electricityKwhPerMonth) => onChange({ electricityKwhPerMonth })}
      />
      <NumberField
        label="Renewable electricity"
        value={value.renewablePercent}
        unit="%"
        max={MAX_RENEWABLE_PERCENT}
        hint="Share from a green tariff or your own solar."
        error={errors.renewablePercent}
        onChange={(renewablePercent) => onChange({ renewablePercent })}
      />
      <SelectField
        label="How is your home heated?"
        value={value.heatingFuel}
        options={toOptions<HeatingFuel>(HEATING_FUELS, HEATING_FUEL_LABELS)}
        error={errors.heatingFuel}
        onChange={(heatingFuel) =>
          // The amount's unit is tied to the fuel, so reset it when the unit changes
          // (e.g. m³ → kg) to avoid silently reinterpreting the old number. Switching
          // between fuels that share a unit (electric ↔ heat pump, both kWh) keeps it.
          onChange(
            shouldResetHeatingAmount(heatingFuel, value.heatingFuel)
              ? { heatingFuel, heatingAmountPerMonth: DEFAULT_HEATING_AMOUNT }
              : { heatingFuel },
          )
        }
      />
      {value.heatingFuel !== NO_HEATING_FUEL && (
        <NumberField
          label="Heating fuel used"
          value={value.heatingAmountPerMonth}
          unit={`${HEATING_FUEL_UNIT[value.heatingFuel]} / month`}
          hint={HEATING_AMOUNT_HINT[value.heatingFuel]}
          error={errors.heatingAmountPerMonth}
          onChange={(heatingAmountPerMonth) => onChange({ heatingAmountPerMonth })}
        />
      )}
      <NumberField
        label="Household size"
        value={value.householdSize}
        unit="people"
        min={MIN_HOUSEHOLD_SIZE}
        max={MAX_HOUSEHOLD_SIZE}
        step={HOUSEHOLD_SIZE_STEP}
        hint="Home energy is shared across everyone living with you."
        error={errors.householdSize}
        onChange={(householdSize) => onChange({ householdSize })}
      />
    </div>
  );
}
