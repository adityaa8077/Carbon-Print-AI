import { type JSX } from 'react';
    import { type ShapExplanationItem } from '@/lib';
    import { Card, Icon } from '@/components/ui';

    export interface ShapExplanationsCardProps {
      explanations: ShapExplanationItem[];
    }

    export function ShapExplanationsCard({ explanations }: ShapExplanationsCardProps): JSX.Element {
      return (
        <Card className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl ring-1 ring-white/10 backdrop-blur-lg">
          <div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Icon name="spark" size={22} className="animate-pulse text-emerald-400" />
              <h3 className="font-display text-lg font-bold text-slate-100">AI Carbon Attribution (SHAP)</h3>
            </div>
            <p className="mt-1.5 text-sm text-slate-400">
              Game-theoretic attribution showing how your lifestyle choices shift your annual footprint above or below your regional baseline.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {explanations.map((item) => {
              const isHigher = item.direction === 'higher';
              return (
                <div key={item.feature} className="flex flex-col gap-2 border-b border-slate-800/50 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-300">{item.feature}</span>
                    <span className={isHigher ? 'text-amber-400' : 'text-emerald-400'}>
                      {isHigher ? '+' : '-'}{item.impact}% impact
                    </span>
                  </div>

                  {/* Two-sided horizontal SHAP bar */}
                  <div className="relative flex h-6 w-full items-center bg-slate-950/40 rounded-lg overflow-hidden px-1">
                    {/* Left half (Savings) */}
                    <div className="flex h-full w-1/2 items-center justify-end pr-[1px]">
                      {!isHigher && (
                        <div
                          className="h-3.5 rounded-l bg-gradient-to-l from-emerald-400 to-emerald-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, item.impact * 2)}%` }}
                        />
                      )}
                    </div>
                    {/* Center divider line */}
                    <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-slate-700/80 z-10" />
                    {/* Right half (Additions) */}
                    <div className="flex h-full w-1/2 items-center justify-start pl-[1px]">
                      {isHigher && (
                        <div
                          className="h-3.5 rounded-r bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, item.impact * 2)}%` }}
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400/95 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }
