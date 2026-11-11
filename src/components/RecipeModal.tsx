import React from 'react';
import { X, Clock, Flame, Dumbbell, Sparkles, ChefHat, Check, Apple, Scale, HeartPulse } from 'lucide-react';
import { MealOption } from '../types/nutrition';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealOption | null;
  dayName: string;
  mealTypeLabel: string;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  meal,
  dayName,
  mealTypeLabel
}) => {
  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                {meal.id}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {dayName} · {mealTypeLabel}
              </span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-white">{meal.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{meal.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nutritional Badges & Escandallo */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-3 bg-slate-50 border-b border-slate-100 text-center text-xs">
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Kcal
            </span>
            <span className="font-extrabold text-slate-800 text-sm">{meal.calories}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Dumbbell className="w-3 h-3 text-emerald-600" /> Proteína
            </span>
            <span className="font-extrabold text-emerald-700 text-sm">{meal.protein}g</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-500">Hidratos</span>
            <span className="font-extrabold text-slate-800 text-sm">{meal.carbs}g</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-500">Fibra</span>
            <span className="font-extrabold text-amber-700 text-sm">{meal.fiber}g</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80 col-span-4 sm:col-span-1">
            <span className="text-[10px] text-slate-500">Grasas</span>
            <span className="font-extrabold text-slate-800 text-sm">{meal.fat}g</span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Description */}
          <div className="text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs">
            <strong>Descripción del plato:</strong> {meal.description}
          </div>

          {/* Ingredients with Escandallo en Crudo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                Escandallo de Ingredientes (Ración en Crudo)
              </h4>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Pesado en báscula
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-800">{ing.name}</span>
                    <span className="font-bold text-emerald-700 shrink-0">
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
                  {ing.rawStateNote && (
                    <span className="text-[10px] text-amber-800 italic mt-0.5">
                      • {ing.rawStateNote}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Instrucciones de Cocina ({meal.prepMinutes} minutos)
              </h4>
              <span className="text-[11px] text-slate-500">Técnicas ligeras</span>
            </div>

            <ol className="space-y-2">
              {meal.instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 leading-normal">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Scientific Rationale */}
          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Fundamentación Científica Rigurosa:
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{meal.scientificRationale}</p>
          </div>

          {/* Batch Prep Note */}
          {meal.batchPrepNote && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <ChefHat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Consejo del Chef / Batch Cooking:</strong> {meal.batchPrepNote}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            0% alcohol · Fibra & proteína equilibradas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
