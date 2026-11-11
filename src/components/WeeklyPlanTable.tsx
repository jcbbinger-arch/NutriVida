import React from 'react';
import {
  DayPlan,
  MealOption
} from '../types/nutrition';
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
  Sparkles
} from 'lucide-react';

interface WeeklyPlanTableProps {
  days: DayPlan[];
  activeWeekNumber: 1 | 2;
  activeView: 'table' | 'cards';
  onSwapDay: (dayId: string) => void;
  onSwapMeal: (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner') => void;
  onOpenMealDetail: (meal: MealOption, dayName: string, mealTypeLabel: string) => void;
}

export const WeeklyPlanTable: React.FC<WeeklyPlanTableProps> = ({
  days,
  activeWeekNumber,
  activeView,
  onSwapDay,
  onSwapMeal,
  onOpenMealDetail
}) => {
  const getCategoryBadgeClass = (category: string) => {
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

  return (
    <div className="space-y-4">
      {/* Table Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Tabla de Menú Semanal (Semana {activeWeekNumber} · 5 Tomas Planificadas)
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Escandallo en Crudo
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Desayuno (08:00) | Media Mañana (11:00) | Comida (14:30) | Merienda (18:00) | Cena (21:00)
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Haz clic en cualquier comida para ver su escandallo o intercambiarla</span>
        </div>
      </div>

      {/* TABLE VIEW (Primary format with 5 meals) */}
      {activeView === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-3 w-28 border-b border-slate-800">Día</th>
                  <th className="py-3.5 px-3 w-[18%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Sunrise className="w-3.5 h-3.5" />
                      <span>Desayuno (08:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[17%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-orange-300">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Media Mañana (11:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[24%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Comida (Mediodía)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[17%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-teal-300">
                      <Cookie className="w-3.5 h-3.5" />
                      <span>Merienda (18:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-[20%] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 text-indigo-300">
                      <Moon className="w-3.5 h-3.5" />
                      <span>Cena Ligera (21:00)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3 w-16 text-right border-b border-slate-800">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {days.map((day, idx) => (
                  <tr
                    key={day.dayId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Day Column */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-extrabold text-slate-900 text-sm">{day.dayName}</div>
                      <div className="mt-1 text-[10px] text-slate-500 font-medium flex flex-col gap-0.5">
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
                        {day.omega3TotalMg > 1500 && (
                          <span className="text-[9px] text-blue-700 font-bold flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5 text-blue-600" />
                            Omega-3: {day.omega3TotalMg}mg
                          </span>
                        )}
                        {day.isFlexibleMealDay && (
                          <span className="mt-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                            Comida libre flexible
                          </span>
                        )}
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
                            {day.breakfast.protein}g P · {day.breakfast.fruitPieces ? '1 fruta' : ''}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenMealDetail(day.breakfast, day.dayName, 'Desayuno')}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors"
                              title="Ver escandallo"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onSwapMeal(day.dayId, 'breakfast')}
                              className="p-1 text-slate-500 hover:text-amber-700 hover:bg-white rounded transition-colors"
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
                            {day.morning.protein}g P · 0% azúcar
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenMealDetail(day.morning, day.dayName, 'Media Mañana')}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors"
                              title="Ver escandallo"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onSwapMeal(day.dayId, 'morning')}
                              className="p-1 text-slate-500 hover:text-orange-700 hover:bg-white rounded transition-colors"
                              title="Cambiar media mañana"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lunch Column (Comida Principal con Escandallo) */}
                    <td className="py-2.5 px-2.5 align-top">
                      <div className="group relative bg-emerald-50/40 hover:bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-100 transition-all">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950 font-mono">
                            {day.lunch.id}
                          </span>
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
                          <span className="text-emerald-800 font-bold">
                            {day.lunch.calories} kcal · {day.lunch.protein}g P · {day.lunch.fiber}g fibra
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenMealDetail(day.lunch, day.dayName, 'Comida (Mediodía)')}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors"
                              title="Ver receta e ingredientes en crudo"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onSwapMeal(day.dayId, 'lunch')}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors"
                              title="Intercambiar comida respetando categorías"
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
                            {day.snack.fruitPieces ? '1 fruta entera' : 'Saciante'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenMealDetail(day.snack, day.dayName, 'Merienda')}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition-colors"
                              title="Ver escandallo"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onSwapMeal(day.dayId, 'snack')}
                              className="p-1 text-slate-500 hover:text-teal-700 hover:bg-white rounded transition-colors"
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
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-950 font-mono">
                            {day.dinner.id}
                          </span>
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
                              className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-white rounded transition-colors"
                              title="Ver escandallo"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onSwapMeal(day.dayId, 'dinner')}
                              className="p-1 text-slate-500 hover:text-indigo-700 hover:bg-white rounded transition-colors"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => (
            <div
              key={day.dayId}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{day.dayName}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {day.totalCalories} kcal · {day.totalProtein}g prot · {day.totalFruitPieces} frutas
                    </span>
                  </div>
                  <button
                    onClick={() => onSwapDay(day.dayId)}
                    className="p-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
                    title={`Regenerar ${day.dayName}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Desayuno */}
                  <div className="bg-amber-50/50 rounded-xl p-2 border border-amber-100">
                    <div className="flex justify-between font-bold text-amber-900 text-[10px] mb-0.5">
                      <span>Desayuno ({day.breakfast.id})</span>
                      <span>{day.breakfast.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.breakfast.title}</div>
                  </div>

                  {/* Media Mañana */}
                  <div className="bg-orange-50/50 rounded-xl p-2 border border-orange-100">
                    <div className="flex justify-between font-bold text-orange-900 text-[10px] mb-0.5">
                      <span>Media Mañana ({day.morning.id})</span>
                      <span>{day.morning.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.morning.title}</div>
                  </div>

                  {/* Comida */}
                  <div className="bg-emerald-50/50 rounded-xl p-2 border border-emerald-100">
                    <div className="flex justify-between font-bold text-emerald-900 text-[10px] mb-0.5">
                      <span>Comida Mediodía ({day.lunch.id})</span>
                      <span>{day.lunch.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.lunch.title}</div>
                  </div>

                  {/* Merienda */}
                  <div className="bg-teal-50/50 rounded-xl p-2 border border-teal-100">
                    <div className="flex justify-between font-bold text-teal-900 text-[10px] mb-0.5">
                      <span>Merienda ({day.snack.id})</span>
                      <span>{day.snack.calories} kcal</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{day.snack.title}</div>
                  </div>

                  {/* Cena */}
                  <div className="bg-indigo-50/50 rounded-xl p-2 border border-indigo-100">
                    <div className="flex justify-between font-bold text-indigo-900 text-[10px] mb-0.5">
                      <span>Cena Ligera ({day.dinner.id})</span>
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
