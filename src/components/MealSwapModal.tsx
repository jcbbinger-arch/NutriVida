import React from 'react';
import { X, RefreshCw, CheckCircle2, AlertTriangle, Sparkles, Star } from 'lucide-react';
import { MealOption, DayPlan, WeeklyPlan } from '../types/nutrition';
import {
  BREAKFAST_OPTIONS,
  MORNING_OPTIONS,
  LUNCH_OPTIONS,
  LIBRE_LUNCH_OPTION,
  SNACK_OPTIONS,
  DINNER_OPTIONS
} from '../data/database';
import { hasProteinConflict, isOilyFishMeal, isLegumeMeal } from '../services/mealEngine';

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner' | 'full_day';
  weeklyPlan: WeeklyPlan;
  onSelectMeal: (
    dayId: string,
    mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner',
    mealId: string
  ) => void;
  onRegenerateDay: (dayId: string) => void;
}

export const MealSwapModal: React.FC<MealSwapModalProps> = ({
  isOpen,
  onClose,
  dayId,
  mealType,
  weeklyPlan,
  onSelectMeal,
  onRegenerateDay
}) => {
  if (!isOpen) return null;

  const currentDayIndex = weeklyPlan.days.findIndex((d) => d.dayId === dayId);
  const currentDay: DayPlan = weeklyPlan.days[currentDayIndex] || weeklyPlan.days[0];

  const prevDay = currentDayIndex > 0 ? weeklyPlan.days[currentDayIndex - 1] : null;
  const nextDay = currentDayIndex < weeklyPlan.days.length - 1 ? weeklyPlan.days[currentDayIndex + 1] : null;

  const getCurrentMeal = (): MealOption | null => {
    if (mealType === 'breakfast') return currentDay.breakfast;
    if (mealType === 'morning') return currentDay.morning;
    if (mealType === 'lunch') return currentDay.lunch;
    if (mealType === 'snack') return currentDay.snack;
    if (mealType === 'dinner') return currentDay.dinner;
    return null;
  };

  const currentMeal = getCurrentMeal();
  const recommendedAltIds = new Set(currentMeal?.alternatives || []);

  const getOptions = (): { options: MealOption[]; title: string; subtitle: string } => {
    const dayTag = currentDay.dayNumber ? `Día ${currentDay.dayNumber} · ${currentDay.dayName}` : currentDay.dayName;

    if (mealType === 'breakfast') {
      return {
        options: BREAKFAST_OPTIONS,
        title: `Intercambiar Desayuno (${dayTag})`,
        subtitle: 'Catálogo D1–D6 (≈380 kcal · 20–26g P · 1 fruta entera)'
      };
    }
    if (mealType === 'morning') {
      return {
        options: MORNING_OPTIONS,
        title: `Intercambiar Media Mañana (${dayTag})`,
        subtitle: 'Catálogo M1–M6 (11:00 · ≈130–190 kcal · Sin dulce)'
      };
    }
    if (mealType === 'lunch') {
      const lunchList =
        currentDay.dayId === 'domingo' ? [LIBRE_LUNCH_OPTION, ...LUNCH_OPTIONS] : LUNCH_OPTIONS;
      return {
        options: lunchList,
        title: `Intercambiar Comida Principal (${dayTag})`,
        subtitle: 'Catálogo C1–C12 (≈500–570 kcal · escandallo neto en crudo)'
      };
    }
    if (mealType === 'snack') {
      return {
        options: SNACK_OPTIONS,
        title: `Intercambiar Merienda (${dayTag})`,
        subtitle: 'Catálogo ME1–ME6 (18:00 · ≈180–200 kcal · fruta con piel)'
      };
    }
    if (mealType === 'dinner') {
      return {
        options: DINNER_OPTIONS,
        title: `Intercambiar Cena Ligera (${dayTag})`,
        subtitle: `Catálogo N1–N9 (21:00 · sin dos pescados el mismo día; comida: ${currentDay.lunch.id})`
      };
    }
    return {
      options: [],
      title: `Cambiar Día Completo (${dayTag})`,
      subtitle: 'Regeneración inteligente de las 5 tomas del día'
    };
  };

  const { options: rawOptions, title, subtitle } = getOptions();

  // Sort recommended "Si no te gusta" alternatives right after the current meal (or top)
  const options = [...rawOptions].sort((a, b) => {
    const aIsRec = recommendedAltIds.has(a.id) ? 0 : 1;
    const bIsRec = recommendedAltIds.has(b.id) ? 0 : 1;
    return aIsRec - bIsRec;
  });

  // Check compatibility of an option with rules
  const checkCompatibility = (option: MealOption): { compatible: boolean; reason?: string } => {
    if (option.id === 'LIBRE') return { compatible: true };

    if (mealType === 'lunch') {
      if (prevDay && prevDay.lunch.id !== 'LIBRE' && option.category === prevDay.lunch.category) {
        return {
          compatible: false,
          reason: `Rotación: ${prevDay.dayName} ya tiene "${prevDay.lunch.category}".`
        };
      }
      if (nextDay && nextDay.lunch.id !== 'LIBRE' && option.category === nextDay.lunch.category) {
        return {
          compatible: false,
          reason: `Rotación: ${nextDay.dayName} ya tiene "${nextDay.lunch.category}".`
        };
      }
    }

    if (mealType === 'dinner') {
      if (hasProteinConflict(currentDay.lunch, option)) {
        return {
          compatible: false,
          reason: `Regla anti-solapamiento: no juntar dos pescados el mismo día (comida ${currentDay.lunch.id}).`
        };
      }
    }

    return { compatible: true };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {mealType === 'full_day' ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-900">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Regeneración inteligente de las 5 tomas de {currentDay.dayName}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  El motor seleccionará una combinación equilibrada sin juntar dos pescados el mismo día y manteniendo ≈1.700–1.800 kcal.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">Menú Actual de {currentDay.dayName}:</div>
                <div className="text-slate-600">
                  <strong>Desayuno ({currentDay.breakfast.id}):</strong> {currentDay.breakfast.title}
                </div>
                <div className="text-slate-600">
                  <strong>Media Mañana ({currentDay.morning.id}):</strong> {currentDay.morning.title}
                </div>
                <div className="text-slate-600">
                  <strong>Comida ({currentDay.lunch.id}):</strong> {currentDay.lunch.title}
                </div>
                <div className="text-slate-600">
                  <strong>Merienda ({currentDay.snack.id}):</strong> {currentDay.snack.title}
                </div>
                <div className="text-slate-600">
                  <strong>Cena ({currentDay.dinner.id}):</strong> {currentDay.dinner.title}
                </div>
              </div>

              <button
                onClick={() => {
                  onRegenerateDay(dayId);
                  onClose();
                }}
                className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>🎲 Re-sortear Día Completo con Reglas de Balance</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium">
                Cambia dentro de la misma toma sin descuadrar calorías. Las 2 alternativas directas de{' '}
                <strong className="text-slate-800">{currentMeal?.id}</strong> aparecen primero:
              </div>

              <div className="space-y-2.5">
                {options.map((opt) => {
                  const isCurrent = currentMeal?.id === opt.id;
                  const isRecommendedAlt = recommendedAltIds.has(opt.id);
                  const { compatible, reason } = checkCompatibility(opt);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        if (compatible && !isCurrent) {
                          onSelectMeal(dayId, mealType, opt.id);
                          onClose();
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                          : !compatible
                          ? 'border-slate-200 bg-slate-50/60 opacity-60 cursor-not-allowed'
                          : isRecommendedAlt
                          ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50/60 cursor-pointer shadow-2xs'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 cursor-pointer shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                              {opt.id}
                            </span>
                            {isRecommendedAlt && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                                Alternativa directa (Si no te gusta)
                              </span>
                            )}
                            {isOilyFishMeal(opt) && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                🐟 Pescado azul
                              </span>
                            )}
                            {isLegumeMeal(opt) && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                🫘 Legumbre
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-900">{opt.title}</span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">{opt.description}</p>

                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                            {opt.id === 'LIBRE' ? (
                              <span className="font-bold text-amber-800">Comida Libre Semanal (Domingo)</span>
                            ) : (
                              <>
                                <span className="font-bold text-slate-800">{opt.calories} kcal</span>
                                <span>·</span>
                                <span>{opt.protein}g P</span>
                                <span>·</span>
                                <span>{opt.carbs}g HC</span>
                                <span>·</span>
                                <span>{opt.fiber}g fibra</span>
                                {opt.fruitPieces ? <span>· {opt.fruitPieces} fruta</span> : null}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Actual
                            </span>
                          )}

                          {!compatible && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded"
                              title={reason}
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Incompatible
                            </span>
                          )}
                        </div>
                      </div>

                      {reason && !compatible && (
                        <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                          {reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
