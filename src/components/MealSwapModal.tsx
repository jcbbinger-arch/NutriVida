import React from 'react';
import { X, RefreshCw, CheckCircle2, AlertTriangle, Sparkles, Scale } from 'lucide-react';
import { MealOption, DayPlan, WeeklyPlan } from '../types/nutrition';
import {
  BREAKFAST_OPTIONS,
  MORNING_OPTIONS,
  LUNCH_OPTIONS,
  SNACK_OPTIONS,
  DINNER_OPTIONS
} from '../data/database';
import { hasProteinConflict } from '../services/mealEngine';

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner' | 'full_day';
  weeklyPlan: WeeklyPlan;
  onSelectMeal: (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner', mealId: string) => void;
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

  const getOptions = (): { options: MealOption[]; title: string; subtitle: string } => {
    if (mealType === 'breakfast') {
      return {
        options: BREAKFAST_OPTIONS,
        title: `Intercambiar Desayuno (${currentDay.dayName})`,
        subtitle: 'Desayunos saciantes con avena, pan 100% integral y fruta entera'
      };
    }
    if (mealType === 'morning') {
      return {
        options: MORNING_OPTIONS,
        title: `Intercambiar Media Mañana (${currentDay.dayName})`,
        subtitle: 'Media mañana saciante sin picos glucémicos (11:00 AM)'
      };
    }
    if (mealType === 'lunch') {
      return {
        options: LUNCH_OPTIONS,
        title: `Intercambiar Comida Principal (${currentDay.dayName})`,
        subtitle: 'Comidas con escandallo en crudo, legumbres o pescado azul'
      };
    }
    if (mealType === 'snack') {
      return {
        options: SNACK_OPTIONS,
        title: `Intercambiar Merienda (${currentDay.dayName})`,
        subtitle: 'Meriendas con fruta fresca entera, kéfir y frutos secos'
      };
    }
    if (mealType === 'dinner') {
      return {
        options: DINNER_OPTIONS,
        title: `Intercambiar Cena Ligera (${currentDay.dayName})`,
        subtitle: `Cenas sin hidratos refinados balanceadas con el almuerzo de ${currentDay.lunch.category}`
      };
    }
    return {
      options: [],
      title: `Cambiar Día Completo (${currentDay.dayName})`,
      subtitle: 'Regeneración inteligente de las 5 tomas del día'
    };
  };

  const { options, title, subtitle } = getOptions();

  // Check compatibility of an option with rules
  const checkCompatibility = (option: MealOption): { compatible: boolean; reason?: string } => {
    if (mealType === 'lunch') {
      if (prevDay && option.category === prevDay.lunch.category) {
        return {
          compatible: false,
          reason: `Violación de rotación: ${prevDay.dayName} ya tiene la categoría "${prevDay.lunch.category}".`
        };
      }
      if (nextDay && option.category === nextDay.lunch.category) {
        return {
          compatible: false,
          reason: `Violación de rotación: ${nextDay.dayName} ya tiene la categoría "${nextDay.lunch.category}".`
        };
      }
    }

    if (mealType === 'dinner') {
      if (hasProteinConflict(currentDay.lunch, option)) {
        return {
          compatible: false,
          reason: `Violación de balance: El almuerzo de este día contiene ${currentDay.lunch.title} (${currentDay.lunch.proteinSource}).`
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
                  El motor seleccionará un nuevo desayuno, media mañana, comida con escandallo, merienda con fruta y cena ligera sin repetir categorías consecutivas y manteniendo el déficit calórico.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">Menú Actual de {currentDay.dayName}:</div>
                <div className="text-slate-600"><strong>Desayuno:</strong> {currentDay.breakfast.title} ({dayId})</div>
                <div className="text-slate-600"><strong>Media Mañana:</strong> {currentDay.morning.title}</div>
                <div className="text-slate-600"><strong>Comida:</strong> {currentDay.lunch.title} ({currentDay.lunch.calories} kcal)</div>
                <div className="text-slate-600"><strong>Merienda:</strong> {currentDay.snack.title}</div>
                <div className="text-slate-600"><strong>Cena:</strong> {currentDay.dinner.title} ({currentDay.dinner.calories} kcal)</div>
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
                Selecciona la alternativa que prefieras. Las opciones compatibles con el algoritmo están marcadas en verde:
              </div>

              <div className="space-y-2.5">
                {options.map((opt) => {
                  const isCurrent =
                    (mealType === 'breakfast' && currentDay.breakfast.id === opt.id) ||
                    (mealType === 'morning' && currentDay.morning.id === opt.id) ||
                    (mealType === 'lunch' && currentDay.lunch.id === opt.id) ||
                    (mealType === 'snack' && currentDay.snack.id === opt.id) ||
                    (mealType === 'dinner' && currentDay.dinner.id === opt.id);

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
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 cursor-pointer shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                              {opt.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-900">{opt.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {opt.category}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">{opt.description}</p>

                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-bold text-slate-800">{opt.calories} kcal</span>
                            <span>·</span>
                            <span>{opt.protein}g proteína</span>
                            <span>·</span>
                            <span>{opt.carbs}g hidratos</span>
                            <span>·</span>
                            <span>{opt.fiber}g fibra</span>
                            {opt.fruitPieces ? <span>· 1 fruta</span> : null}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Plato Actual
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
