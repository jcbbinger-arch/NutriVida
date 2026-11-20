import React from 'react';
import { MealOption, UserProfile, WeeklyPlan } from '../types/nutrition';
import { isLegumeMeal, isOilyFishMeal } from '../services/mealEngine';

interface NutritionMiniPrintSheetProps {
  weeks: WeeklyPlan[];
  userProfile: UserProfile;
}

const WEEK_TITLES: Record<number, string> = {
  1: 'SEMANA 1 (Días 1–7)',
  2: 'SEMANA 2 (Días 8–14)',
  3: 'SEMANA 3 (Días 15–21)',
  4: 'SEMANA 4 (Días 22–28)',
  5: 'CIERRE DE MES (Días 29–30)'
};

function formatCompactIngredients(meal: MealOption): string {
  if (meal.id === 'LIBRE') {
    return 'Comida libre planificada (sin compensar ni saltar tomas)';
  }
  const relevant = meal.ingredients.filter(
    (ing) =>
      !ing.excludeFromGrocery &&
      !ing.name.toLowerCase().includes('agua') &&
      !ing.name.toLowerCase().includes('sal') &&
      !ing.name.toLowerCase().includes('especias')
  );
  const list = (relevant.length > 0 ? relevant : meal.ingredients).slice(0, 4);
  return list
    .map((ing) => {
      const shortName = ing.name.split('(')[0].trim();
      return `${shortName} ${ing.amount}${ing.unit}`;
    })
    .join(' · ');
}

export const NutritionMiniPrintSheet: React.FC<NutritionMiniPrintSheetProps> = ({
  weeks,
  userProfile
}) => {
  const waterLiters = ((userProfile.targetWaterMl || 2500) / 1000).toFixed(1);

  return (
    <div className="hidden print:block text-slate-900">
      {weeks.map((week, wIdx) => {
        const weekTitle = WEEK_TITLES[week.weekNumber] || week.label || `SEMANA ${week.weekNumber}`;
        const isLast = wIdx === weeks.length - 1;

        return (
          <section
            key={`mini-diet-${week.id}-${week.weekNumber}`}
            className={!isLast ? 'print-page-break' : ''}
          >
            {/* Compact A5-Pocket Card (easy to hold in hand or fold in half to A6) */}
            <div className="max-w-[152mm] mx-auto border border-dashed border-slate-500 rounded-xl p-2.5 bg-white">
              {/* Pocket Header */}
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b-2 border-slate-900">
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-wider text-emerald-800">
                    ✂️ NutriVida · Dieta Mini para Llevar en la Mano (Hoja {wIdx + 1}/{weeks.length})
                  </div>
                  <h2 className="text-xs font-black text-slate-950 leading-tight">{weekTitle}</h2>
                </div>
                <div className="text-right text-[8px] leading-tight shrink-0">
                  <div className="font-extrabold text-slate-900">
                    ~{userProfile.targetCalories || 1750} kcal/día · {userProfile.targetProteinMin}–
                    {userProfile.targetProteinMax}g P
                  </div>
                  <div className="text-slate-600">
                    {userProfile.name ? `${userProfile.name} · ` : ''}Pesos en crudo · Factor ×
                    {(userProfile.scaleFactor || 1).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* 2-Column Compact Day Cards */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {week.days.map((day, dIdx) => {
                  const isLibre = day.lunch.id === 'LIBRE';
                  const rows: Array<{
                    time: string;
                    meal: MealOption;
                    tag?: string;
                  }> = [
                    { time: '08h', meal: day.breakfast },
                    { time: '11h', meal: day.morning },
                    {
                      time: '14h',
                      meal: day.lunch,
                      tag: isOilyFishMeal(day.lunch)
                        ? '🐟'
                        : isLegumeMeal(day.lunch)
                        ? '🫘'
                        : isLibre
                        ? '★'
                        : undefined
                    },
                    { time: '18h', meal: day.snack },
                    {
                      time: '21h',
                      meal: day.dinner,
                      tag: isOilyFishMeal(day.dinner) ? '🐟' : undefined
                    }
                  ];

                  return (
                    <div
                      key={`${day.dayId}-${day.dayNumber || dIdx}`}
                      className="border border-slate-300 rounded-lg p-1.5 break-inside-avoid bg-white"
                    >
                      <div className="bg-slate-900 text-white px-1.5 py-0.5 rounded flex items-center justify-between text-[8.5px] font-extrabold">
                        <span>
                          {day.dayNumber ? `D${day.dayNumber} · ` : ''}
                          {day.dayName.toUpperCase()}
                          {day.hardTrainingBonus ? ' ⚡' : ''}
                        </span>
                        <span className="font-mono font-bold text-emerald-300">
                          {isLibre ? 'COMIDA LIBRE' : `${day.totalCalories} kcal · ${day.totalProtein}g P`}
                        </span>
                      </div>

                      <div className="mt-1 space-y-0.5 text-[8px] leading-[1.16]">
                        {rows.map((r) => (
                          <div
                            key={`${r.time}-${r.meal.id}`}
                            className="border-b border-slate-100 last:border-b-0 pb-0.5 last:pb-0"
                          >
                            <div className="flex items-baseline gap-1">
                              <span className="font-mono font-extrabold text-slate-700 shrink-0">
                                {r.time}
                              </span>
                              <span className="font-bold text-slate-950">
                                [{r.meal.id}] {r.meal.title} {r.tag || ''}
                              </span>
                            </div>
                            <div className="text-[7.2px] text-slate-600 pl-4 leading-[1.12]">
                              {formatCompactIngredients(r.meal)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Pocket Quick-Rules Box to fill the 8th slot nicely */}
                {week.days.length <= 7 && (
                  <div className="border border-slate-300 rounded-lg p-1.5 break-inside-avoid bg-slate-50 flex flex-col justify-between text-[7.8px] leading-[1.22]">
                    <div>
                      <div className="bg-emerald-800 text-white px-1.5 py-0.5 rounded font-extrabold text-[8.5px] mb-1">
                        CHULETA RÁPIDA · {weekTitle}
                      </div>
                      <ul className="space-y-0.5 text-slate-800">
                        <li>
                          • <strong>Crudo limpio:</strong> pesa antes de cocinar y mide el AOVE.
                        </li>
                        <li>
                          • <strong>Horarios:</strong> 3–4 h entre tomas. Si saltas una, no compenses.
                        </li>
                        <li>
                          • <strong>Intercambios:</strong> D↔D · M↔M · C↔C · ME↔ME · N↔N (no 2 pescados/día).
                        </li>
                        <li>
                          • <strong>Entreno duro (⚡):</strong> +40 g pan integral o +1 pieza de fruta.
                        </li>
                        <li>
                          • <strong>Batch & Frío:</strong> Domingo y Miércoles (&lt;2 h a ≤4 °C, máx. 3 días).
                        </li>
                        <li>
                          • <strong>Agua & Alcohol:</strong> {waterLiters} L/día · 0% alcohol en cocina.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-200 text-[7px] text-slate-500 text-center font-semibold">
                      Dobla esta hoja por la mitad para formato bolsillo (A6)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
