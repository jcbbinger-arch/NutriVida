import React from 'react';
import { DayPlan, MealOption } from '../types/nutrition';
import {
  RefreshCw,
  Eye,
  Coffee,
  UtensilsCrossed,
  Moon,
  Flame,
  Dumbbell,
  Apple,
  Sunrise,
  Cookie,
  Heart,
  Zap,
  Printer
} from 'lucide-react';
import { isOilyFishMeal, isLegumeMeal } from '../services/mealEngine';

interface WeeklyPlanTableProps {
  days: DayPlan[];
  activeWeekNumber: 1 | 2 | 3 | 4 | 5;
  weekLabel?: string;
  activeView: 'table' | 'cards';
  onSwapDay: (dayId: string) => void;
  onSwapMeal: (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner') => void;
  onOpenMealDetail: (meal: MealOption, dayName: string, mealTypeLabel: string) => void;
  onToggleHardTraining: (dayId: string) => void;
  onPrintDietMiniWeek?: () => void;
  onPrintDietMini4Weeks?: () => void;
}

export const WeeklyPlanTable: React.FC<WeeklyPlanTableProps> = ({
  days,
  activeWeekNumber,
  weekLabel,
  activeView,
  onSwapDay,
  onSwapMeal,
  onOpenMealDetail,
  onToggleHardTraining,
  onPrintDietMiniWeek,
  onPrintDietMini4Weeks
}) => {
  const getCategoryBadgeClass = (category: string) => {
    if (category.includes('Comida Libre')) {
      return 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold';
    }
    if (category.includes('Desayuno')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (category.includes('Frutos') || category.includes('Café')) {
      return 'bg-orange-50 text-orange-800 border-orange-200';
    }
    if (category.includes('Carnes Blancas') || category.includes('Carnes Magras')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (category.includes('Pescado Azul')) {
      return 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
    }
    if (category.includes('Pescado Blanco') || category.includes('Pescado Lindo')) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    if (category.includes('Legumbres')) {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    }
    if (category.includes('Cereales') || category.includes('Bocadillo')) {
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
    if (category.includes('Cremas') || category.includes('Veg')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (category.includes('Huevos') || category.includes('Marisco')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
    if (category.includes('Merienda')) {
      return 'bg-teal-50 text-teal-800 border-teal-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const titleLabel = weekLabel || (activeWeekNumber === 5 ? 'Días 29–30' : `Semana ${activeWeekNumber}`);

  return (
    <div className="space-y-4">
      {/* Table Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Menú Intercambiable · {titleLabel} (5 Tomas)
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pesos en Crudo · 🐟 Azul · 🫘 Legumbre
            </span>
          </div>
          <p className="text-xs text-slate-500">
            08:00 Desayuno · 11:00 Media Mañana · 14:30 Comida · 18:00 Merienda · 21:00 Cena (≈3–4 h entre tomas)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap print:hidden">
          {onPrintDietMiniWeek && (
            <button
              type="button"
              onClick={onPrintDietMiniWeek}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              title="Imprimir la dieta de esta semana en formato mini de bolsillo para llevar en la mano"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dieta Mini ({activeWeekNumber === 5 ? 'D29–30' : `S${activeWeekNumber}`})</span>
            </button>
          )}
          {onPrintDietMini4Weeks && (
            <button
              type="button"
              onClick={onPrintDietMini4Weeks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              title="Imprimir las 4 semanas en formato mini de bolsillo: 4 hojas distintas (1 semana por hoja)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Dieta Mini 4 Semanas (4 Hojas)</span>
            </button>
          )}
        </div>
      </div>

      {/* TABLE VIEW */}
      {activeView === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1080px]">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-3 w-36 border-b border-slate-800">Día</th>
                  <th className="py-3.5 px-3 w-[18%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Sunrise className="w-3.5 h-3.5" />
                      <span>Desayuno (08:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[16%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-orange-300">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>M. Mañana (11:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[23%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Comida (Mediodía)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[16%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Cookie className="w-3.5 h-3.5" />
                      <span>Merienda (18:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[19%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-indigo-300">
                      <Moon className="w-3.5 h-3.5" />
                      <span>Cena Ligera (21:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-16 text-right border-b border-slate-800">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {days.map((day, idx) => {
                  const isLibre = day.lunch.id === 'LIBRE';
                  return (
                    <tr
                      key={`${day.dayId}-${day.dayNumber || idx}`}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      {/* Day Column */}
                      <td className="py-3 px-3 align-top">
                        <div className="flex items-center gap-1.5">
                          {day.dayNumber && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                              D{day.dayNumber}
                            </span>
                          )}
                          <span className="font-extrabold text-slate-900 text-sm">{day.dayName}</span>
                        </div>
                        <div className="mt-1.5 text-[10px] text-slate-500 font-medium flex flex-col gap-0.5">
                          {isLibre ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold w-fit">
                              Domingo · Comida LIBRE
                            </span>
                          ) : (
                            <>
                              <span className="flex items-center gap-1 text-slate-700 font-bold">
                                <Flame className="w-3 h-3 text-amber-500" />
                                {day.totalCalories} kcal
                              </span>
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <Dumbbell className="w-3 h-3 text-emerald-600" />
                                {day.totalProtein}g prot
                              </span>
                              <span className="flex items-center gap-1 text-amber-700 font-semibold">
                                <Apple className="w-3 h-3 text-amber-500" />
                                {day.totalFruitPieces} frutas · {day.totalFiber}g fibra
                              </span>
                            </>
                          )}
                          {day.omega3EpaDhaTotalMg > 0 && (
                            <span className="text-[9px] text-blue-700 font-bold flex items-center gap-0.5">
                              <Heart className="w-2.5 h-2.5 text-blue-600" />
                              EPA/DHA: {day.omega3EpaDhaTotalMg}mg
                            </span>
                          )}

                          {/* Hard Training Day Bonus Toggle (+40g pan / +1 fruta) */}
                          <button
                            onClick={() => onToggleHardTraining(day.dayId)}
                            className={`mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer w-fit ${
                              day.hardTrainingBonus
                                ? 'bg-teal-600 text-white border-teal-700'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-800'
                            }`}
                            title="Solo en días de entrenamiento duro: suma +40 g de pan integral o +1 fruta (+140 kcal)"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            <span>{day.hardTrainingBonus ? 'Entreno duro +140 kcal' : '+ Entreno duro'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Breakfast Column */}
                      <td className="py-2.5 px-2.5 align-top">
                        <div className="group relative bg-amber-50/40 hover:bg-amber-50/80 rounded-xl p-2 border border-amber-100 transition-all">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-mono">
                              {day.breakfast.id}
                            </span>
                            <span className="text-[9px] text-amber-900 font-bold">
                              {day.breakfast.calories} kcal
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {day.breakfast.title}
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-amber-100/70 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">
                              {day.breakfast.protein}g P · alt: {day.breakfast.alternatives?.join(', ')}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onOpenMealDetail(day.breakfast, day.dayName, 'Desayuno')}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Ver escandallo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onSwapMeal(day.dayId, 'breakfast')}
                                className="p-1 text-slate-500 hover:text-amber-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Cambiar desayuno"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Morning Column */}
                      <td className="py-2.5 px-2.5 align-top">
                        <div className="group relative bg-orange-50/40 hover:bg-orange-50/80 rounded-xl p-2 border border-orange-100 transition-all">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-orange-200 text-orange-950 font-mono">
                              {day.morning.id}
                            </span>
                            <span className="text-[9px] text-orange-900 font-bold">
                              {day.morning.calories} kcal
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {day.morning.title}
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-orange-100/70 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">
                              {day.morning.protein}g P · alt: {day.morning.alternatives?.join(', ')}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onOpenMealDetail(day.morning, day.dayName, 'Media Mañana')}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Ver escandallo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onSwapMeal(day.dayId, 'morning')}
                                className="p-1 text-slate-500 hover:text-orange-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Cambiar media mañana"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Lunch Column */}
                      <td className="py-2.5 px-2.5 align-top">
                        <div
                          className={`group relative rounded-xl p-2.5 border transition-all ${
                            isLibre
                              ? 'bg-amber-50 hover:bg-amber-100/70 border-amber-300'
                              : 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                                  isLibre
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-emerald-200 text-emerald-950'
                                }`}
                              >
                                {day.lunch.id}
                              </span>
                              {isOilyFishMeal(day.lunch) && <span title="Pescado azul">🐟</span>}
                              {isLegumeMeal(day.lunch) && <span title="Legumbre">🫘</span>}
                            </div>
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                                day.lunch.category
                              )}`}
                            >
                              {day.lunch.category}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs line-clamp-2">
                            {day.lunch.title}
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                            {day.lunch.description}
                          </p>
                          <div className="mt-2 pt-1.5 border-t border-emerald-100/70 flex items-center justify-between text-[10px]">
                            <span className={isLibre ? 'text-amber-900 font-bold' : 'text-emerald-800 font-bold'}>
                              {isLibre
                                ? 'Sin culpa ni compensación'
                                : `${day.lunch.calories} kcal · ${day.lunch.protein}g P`}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onOpenMealDetail(day.lunch, day.dayName, 'Comida (Mediodía)')}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Ver receta e ingredientes"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onSwapMeal(day.dayId, 'lunch')}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Intercambiar comida"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Snack Column */}
                      <td className="py-2.5 px-2.5 align-top">
                        <div className="group relative bg-teal-50/40 hover:bg-teal-50/80 rounded-xl p-2 border border-teal-100 transition-all">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-teal-200 text-teal-950 font-mono">
                              {day.snack.id}
                            </span>
                            <span className="text-[9px] text-teal-900 font-bold">
                              {day.snack.calories} kcal
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {day.snack.title}
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-teal-100/70 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">
                              {day.snack.protein}g P · alt: {day.snack.alternatives?.join(', ')}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onOpenMealDetail(day.snack, day.dayName, 'Merienda')}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Ver escandallo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onSwapMeal(day.dayId, 'snack')}
                                className="p-1 text-slate-500 hover:text-teal-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Cambiar merienda"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dinner Column */}
                      <td className="py-2.5 px-2.5 align-top">
                        <div className="group relative bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-2 border border-indigo-100 transition-all">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-950 font-mono">
                                {day.dinner.id}
                              </span>
                              {isOilyFishMeal(day.dinner) && <span title="Pescado azul">🐟</span>}
                            </div>
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                                day.dinner.category
                              )}`}
                            >
                              {day.dinner.category}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {day.dinner.title}
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-indigo-100/70 flex items-center justify-between text-[10px]">
                            <span className="text-indigo-900 font-bold">
                              {day.dinner.calories} kcal · {day.dinner.protein}g P
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onOpenMealDetail(day.dinner, day.dayName, 'Cena Ligera')}
                                className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Ver escandallo"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onSwapMeal(day.dayId, 'dinner')}
                                className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-white rounded transition-colors cursor-pointer"
                                title="Cambiar cena"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-2 align-middle text-right">
                        <button
                          onClick={() => onSwapDay(day.dayId)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
                          title={`Regenerar todo el ${day.dayName}`}
                        >
                          <RefreshCw className="w-3 h-3 text-emerald-600" />
                          <span>Día</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day, idx) => (
            <div
              key={`${day.dayId}-${day.dayNumber || idx}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {day.dayNumber && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                          D{day.dayNumber}
                        </span>
                      )}
                      <h4 className="font-extrabold text-slate-900 text-base">{day.dayName}</h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {day.lunch.id === 'LIBRE'
                        ? 'Comida libre planificada (Domingo)'
                        : `${day.totalCalories} kcal · ${day.totalProtein}g prot · ${day.totalFruitPieces} frutas`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleHardTraining(day.dayId)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                        day.hardTrainingBonus
                          ? 'bg-teal-600 text-white border-teal-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-teal-50'
                      }`}
                      title="Bonus entreno duro (+40g pan o +1 fruta)"
                    >
                      {day.hardTrainingBonus ? '⚡ +140 kcal' : '⚡ Entreno'}
                    </button>
                    <button
                      onClick={() => onSwapDay(day.dayId)}
                      className="p-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      title={`Regenerar ${day.dayName}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div
                    onClick={() => onSwapMeal(day.dayId, 'breakfast')}
                    className="bg-amber-50/50 hover:bg-amber-50 rounded-xl p-2 border border-amber-100 cursor-pointer"
                  >
                    <div className="flex justify-between font-bold text-amber-900 text-[10px] mb-0.5">
                      <span>Desayuno ({day.breakfast.id})</span>
                      <span>{day.breakfast.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.breakfast.title}</div>
                  </div>

                  <div
                    onClick={() => onSwapMeal(day.dayId, 'morning')}
                    className="bg-orange-50/50 hover:bg-orange-50 rounded-xl p-2 border border-orange-100 cursor-pointer"
                  >
                    <div className="flex justify-between font-bold text-orange-900 text-[10px] mb-0.5">
                      <span>Media Mañana ({day.morning.id})</span>
                      <span>{day.morning.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.morning.title}</div>
                  </div>

                  <div
                    onClick={() => onSwapMeal(day.dayId, 'lunch')}
                    className={`rounded-xl p-2 border cursor-pointer ${
                      day.lunch.id === 'LIBRE'
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300'
                        : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-emerald-900 text-[10px] mb-0.5">
                      <span>
                        Comida ({day.lunch.id}) {isOilyFishMeal(day.lunch) ? '🐟' : ''}
                        {isLegumeMeal(day.lunch) ? '🫘' : ''}
                      </span>
                      <span>{day.lunch.id === 'LIBRE' ? 'LIBRE' : `${day.lunch.calories} kcal`}</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.lunch.title}</div>
                  </div>

                  <div
                    onClick={() => onSwapMeal(day.dayId, 'snack')}
                    className="bg-teal-50/50 hover:bg-teal-50 rounded-xl p-2 border border-teal-100 cursor-pointer"
                  >
                    <div className="flex justify-between font-bold text-teal-900 text-[10px] mb-0.5">
                      <span>Merienda ({day.snack.id})</span>
                      <span>{day.snack.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.snack.title}</div>
                  </div>

                  <div
                    onClick={() => onSwapMeal(day.dayId, 'dinner')}
                    className="bg-indigo-50/50 hover:bg-indigo-50 rounded-xl p-2 border border-indigo-100 cursor-pointer"
                  >
                    <div className="flex justify-between font-bold text-indigo-900 text-[10px] mb-0.5">
                      <span>
                        Cena Ligera ({day.dinner.id}) {isOilyFishMeal(day.dinner) ? '🐟' : ''}
                      </span>
                      <span>{day.dinner.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.dinner.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
