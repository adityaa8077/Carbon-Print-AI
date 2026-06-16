import { type JSX } from 'react';
import { type ShapExplanationItem } from '@/lib';
import { Card, Icon } from '@/components/ui';

export interface ShapExplanationsCardProps {
  explanations: ShapExplanationItem[];
}

/**
 * The SHAP bar is a two-sided percentage bar (left = savings, right = additions).
 * The raw `impact` value is a percentage of the total footprint (0–100); we scale
 * it by this factor so small impacts are still visually legible, then clamp to 100%
 * so the bar never overflows. A factor of 2 means a 50% relative impact fills the
 * full half-bar width.
 */
const SHAP_BAR_SCALE_FACTOR = 2;

/**
 * Card showing game-theoretic (SHAP) attribution for each lifestyle category.
 * Renders a two-sided impact bar: green left for savings, amber right for additions.
 */
export function ShapExplanationsCard({ explanations }: ShapExplanationsCardProps): JSX.Element {
  return (
    <Card className="flex flex-col gap-6 bg-surface/80 border border-white/10 p-6 rounded-3xl ring-1 ring-white/10 backdrop-blur-lg">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Icon name="spark" size={22} className="animate-pulse text-primary" />
          <h3 className="font-display text-lg font-bold text-ink">AI Carbon Attribution (SHAP)</h3>
        </div>
        <p className="mt-1.5 text-sm text-ink/60">
          Game-theoretic attribution showing how your lifestyle choices shift your annual footprint above or below your regional baseline.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {explanations.map((item) => {
          const isHigher = item.direction === 'higher';
          const barWidth = `${Math.min(100, item.impact * SHAP_BAR_SCALE_FACTOR)}%`;
          return (
            <div key={item.feature} className="flex flex-col gap-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-ink/80">{item.feature}</span>
                <span className={isHigher ? 'text-warning' : 'text-primary'}>
                  {isHigher ? '+' : '-'}{item.impact}% impact
                </span>
              </div>

              {/* Two-sided horizontal SHAP bar */}
              <div className="relative flex h-6 w-full items-center bg-surface rounded-lg overflow-hidden px-1">
                {/* Left half — savings (green, growing rightward from center) */}
                <div className="flex h-full w-1/2 items-center justify-end pr-[1px]">
                  {!isHigher && (
                    <div
                      className="h-3.5 rounded-l bg-gradient-to-l from-primary to-primary-dark transition-all duration-500"
                      style={{ width: barWidth }}
                    />
                  )}
                </div>
                {/* Center divider */}
                <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/20 z-10" />
                {/* Right half — additions (amber, growing leftward from center) */}
                <div className="flex h-full w-1/2 items-center justify-start pl-[1px]">
                  {isHigher && (
                    <div
                      className="h-3.5 rounded-r bg-gradient-to-r from-warning to-warning/70 transition-all duration-500"
                      style={{ width: barWidth }}
                    />
                  )}
                </div>
              </div>

              <p className="text-xs text-ink/70 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
