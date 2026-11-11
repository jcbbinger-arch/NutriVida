import React from 'react';
import { X, RefreshCw, Calendar, Flame, Dumbbell } from 'lucide-react';
import { WeeklyPlan } from '../types/nutrition';

interface DaySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: WeeklyPlan;
  onSelectDayToSwap: (dayId: string) => void;
  onDirectRegenerateDay: (dayId: string) => void;
}

export const DaySelectorModal: React.FC<DaySelectorModalProps> = ({
  isOpen,
  onClose,
  weeklyPlan,
  onSelectDayToSwap,
  onDirectRegenerateDay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                🔄 Cambiar Día Específico (Semana {weeklyPlan.weekNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona qué día de la semana deseas rotar con el algoritmo modular de 5 tomas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Days List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5">
          {weeklyPlan.days.map((day) => (
            <div
              key={day.dayId}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-sm text-slate-900">{day.dayName}</span>
                  <span className="text-[11px] text-slate-700 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> {day.totalCalories} kcal
                  </span>
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                    <Dumbbell className="w-3 h-3 text-emerald-600" /> {day.totalProtein}g P
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({day.totalFruitPieces} frutas)
                  </span>
                </div>
                <div className="text-xs text-slate-600 truncate">
                  <span className="text-amber-800 font-medium">D: {day.breakfast.title}</span> ·{' '}
                  <span className="text-emerald-800 font-bold">C: {day.lunch.title}</span> ·{' '}
                  <span className="text-indigo-800 font-medium">N: {day.dinner.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => {
                    onDirectRegenerateDay(day.dayId);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                  title="Re-sortear las 5 tomas de este día con balance de reglas"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Mezclar Día</span>
                </button>

                <button
                  onClick={() => {
                    onSelectDayToSwap(day.dayId);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Ver Opciones
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
