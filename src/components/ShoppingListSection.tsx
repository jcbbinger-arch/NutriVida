import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Copy,
  Printer,
  Search,
  Check,
  RotateCcw,
  Egg,
  Carrot,
  Apple,
  Wheat,
  Milk,
  Package,
  CalendarRange,
  Layers
} from 'lucide-react';
import { WeeklyPlan, GroceryCategory, GroceryItemConsolidated } from '../types/nutrition';
import { calculateGroceryList } from '../services/mealEngine';

export type NutritionPrintMode =
  | 'standard'
  | 'diet_mini_week'
  | 'diet_mini_4weeks'
  | 'shopping_mini_selected'
  | 'shopping_mini_4weeks'
  | 'shopping_standard';

interface ShoppingListSectionProps {
  currentWeekPlan: WeeklyPlan;
  allWeeks?: WeeklyPlan[];
  activeWeekNumber: 1 | 2 | 3 | 4 | 5;
  nutritionPrintMode?: NutritionPrintMode;
  onTriggerNutritionPrint?: (mode: NutritionPrintMode) => void;
}

type PeriodPreset = '1_week' | '2_weeks' | '3_weeks' | '4_weeks' | 'custom';
type SplitOrderMode = 'unified' | 'by_week' | 'by_period';

interface OrderGroup {
  groupId: string;
  title: string;
  subtitle: string;
  plans: WeeklyPlan[];
  grouped: Record<GroceryCategory, GroceryItemConsolidated[]>;
  items: Array<GroceryItemConsolidated & { category: GroceryCategory }>;
}

const WEEK_LABELS: Record<number, string> = {
  1: 'S1 (D1–7)',
  2: 'S2 (D8–14)',
  3: 'S3 (D15–21)',
  4: 'S4 (D22–28)',
  5: 'D29–30'
};

const WEEK_FULL_LABELS: Record<number, string> = {
  1: 'SEMANA 1 (Días 1–7)',
  2: 'SEMANA 2 (Días 8–14)',
  3: 'SEMANA 3 (Días 15–21)',
  4: 'SEMANA 4 (Días 22–28)',
  5: 'CIERRE DE MES (Días 29–30)'
};

export const ShoppingListSection: React.FC<ShoppingListSectionProps> = ({
  currentWeekPlan,
  allWeeks,
  activeWeekNumber,
  nutritionPrintMode = 'standard',
  onTriggerNutritionPrint
}) => {
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('1_week');
  const [selectedWeekNumbers, setSelectedWeekNumbers] = useState<number[]>([activeWeekNumber]);
  const [splitMode, setSplitMode] = useState<SplitOrderMode>('unified');

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const availableWeeks = useMemo(() => {
    if (allWeeks && allWeeks.length > 0) return allWeeks;
    return [currentWeekPlan];
  }, [allWeeks, currentWeekPlan]);

  // Apply quick period presets (1, 2, 3, 4 weeks or custom selection)
  const handleSelectPreset = (preset: PeriodPreset) => {
    setPeriodPreset(preset);
    if (preset === '1_week') {
      setSelectedWeekNumbers([activeWeekNumber]);
      setSplitMode('unified');
    } else if (preset === '2_weeks') {
      setSelectedWeekNumbers(activeWeekNumber >= 3 ? [3, 4] : [1, 2]);
    } else if (preset === '3_weeks') {
      setSelectedWeekNumbers([1, 2, 3]);
    } else if (preset === '4_weeks') {
      setSelectedWeekNumbers(availableWeeks.map((w) => w.weekNumber));
    }
  };

  const toggleCustomWeek = (weekNum: number) => {
    setPeriodPreset('custom');
    setSelectedWeekNumbers((prev) => {
      const exists = prev.includes(weekNum);
      if (exists && prev.length === 1) return prev; // Keep at least 1 week selected
      const next = exists ? prev.filter((w) => w !== weekNum) : [...prev, weekNum];
      return next.sort((a, b) => a - b);
    });
  };

  // Resolve active plans in chronological order
  const activePlans = useMemo(() => {
    const nums = periodPreset === '1_week' ? [activeWeekNumber] : selectedWeekNumbers;
    const filtered = availableWeeks.filter((w) => nums.includes(w.weekNumber));
    return filtered.length > 0 ? filtered : [currentWeekPlan];
  }, [availableWeeks, currentWeekPlan, periodPreset, activeWeekNumber, selectedWeekNumbers]);

  // Build Order Groups depending on splitMode: Unified | By Week | By Fortnight/Period
  const orderGroups = useMemo<OrderGroup[]>(() => {
    const buildGroup = (
      groupId: string,
      title: string,
      subtitle: string,
      plans: WeeklyPlan[]
    ): OrderGroup => {
      const grouped = calculateGroceryList(plans);
      const items: Array<GroceryItemConsolidated & { category: GroceryCategory }> = [];
      for (const [category, list] of Object.entries(grouped)) {
        for (const item of list) {
          items.push({ ...item, category: category as GroceryCategory });
        }
      }
      return { groupId, title, subtitle, plans, grouped, items };
    };

    if (splitMode === 'by_week' && activePlans.length > 1) {
      return activePlans.map((plan) =>
        buildGroup(
          `week-${plan.weekNumber}`,
          `Pedido ${plan.weekNumber === 5 ? 'Cierre (Días 29–30)' : `Semana ${plan.weekNumber}`}`,
          plan.label || WEEK_LABELS[plan.weekNumber] || `Semana ${plan.weekNumber}`,
          [plan]
        )
      );
    }

    if (splitMode === 'by_period' && activePlans.length >= 2) {
      const groups: OrderGroup[] = [];
      for (let i = 0; i < activePlans.length; i += 2) {
        const chunk = activePlans.slice(i, i + 2);
        const periodNum = Math.floor(i / 2) + 1;
        const labels = chunk.map((p) => WEEK_LABELS[p.weekNumber] || `S${p.weekNumber}`).join(' + ');
        groups.push(
          buildGroup(
            `period-${periodNum}`,
            `Pedido Periodo ${periodNum} (${labels})`,
            `${chunk.reduce((acc, p) => acc + p.days.length, 0)} días · Ideal compra quincenal / tandas`,
            chunk
          )
        );
      }
      return groups;
    }

    const combinedLabel = activePlans.map((p) => WEEK_LABELS[p.weekNumber] || `S${p.weekNumber}`).join(' + ');
    const totalDays = activePlans.reduce((acc, p) => acc + p.days.length, 0);
    return [
      buildGroup(
        'unified',
        `Lista Unificada (${combinedLabel})`,
        `${totalDays} días consolidados en un solo pedido`,
        activePlans
      )
    ];
  }, [activePlans, splitMode]);

  const storageKey = `nutrivida_checked_multi_${activePlans.map((p) => p.weekNumber).join('_')}_${splitMode}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCheckedIds(saved ? new Set(JSON.parse(saved)) : new Set());
    } catch {
      setCheckedIds(new Set());
    }
  }, [storageKey]);

  const totalCount = useMemo(
    () => orderGroups.reduce((acc, g) => acc + g.items.length, 0),
    [orderGroups]
  );

  const getScopedItemKey = (groupId: string, itemId: string) => `${groupId}::${itemId}`;

  const completedCount = useMemo(
    () =>
      orderGroups.reduce(
        (acc, g) => acc + g.items.filter((i) => checkedIds.has(getScopedItemKey(g.groupId, i.id))).length,
        0
      ),
    [orderGroups, checkedIds]
  );

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleCheck = (groupId: string, itemId: string) => {
    const key = getScopedItemKey(groupId, itemId);
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const resetChecked = () => {
    setCheckedIds(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Proteínas':
        return <Egg className="w-4 h-4 text-rose-600" />;
      case 'Verduras & Hortalizas':
        return <Carrot className="w-4 h-4 text-emerald-600" />;
      case 'Frutas Frescas':
        return <Apple className="w-4 h-4 text-red-500" />;
      case 'Tubérculos & Cereales':
        return <Wheat className="w-4 h-4 text-amber-600" />;
      case 'Lácteos & Frutos Secos':
        return <Milk className="w-4 h-4 text-blue-600" />;
      case 'Despensa & Condimentos':
        return <Package className="w-4 h-4 text-purple-600" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-slate-600" />;
    }
  };

  const categories: GroceryCategory[] = [
    'Proteínas',
    'Verduras & Hortalizas',
    'Frutas Frescas',
    'Tubérculos & Cereales',
    'Lácteos & Frutos Secos',
    'Despensa & Condimentos'
  ];

  const formatGroupTextForWhatsApp = (group: OrderGroup): string => {
    let text = `🛒 ${group.title.toUpperCase()}\n`;
    text += `${group.subtitle} · Pesos netos en crudo\n`;
    text += `=========================================\n`;
    categories.forEach((cat) => {
      const items = group.grouped[cat];
      if (items && items.length > 0) {
        text += `\n🔹 ${cat.toUpperCase()}:\n`;
        items.forEach((item) => {
          const note = item.rawStateNote ? ` [${item.rawStateNote}]` : '';
          text += `  • ${item.name}: ${item.totalAmount} ${item.unit}${note} (${item.usedInDays.join(', ')})\n`;
        });
      }
    });
    return text;
  };

  const handleCopyAll = () => {
    const fullText = orderGroups.map(formatGroupTextForWhatsApp).join('\n\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
    }
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopySingleGroup = (group: OrderGroup) => {
    const text = formatGroupTextForWhatsApp(group);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(group.groupId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const scopeTitle = activePlans.map((p) => WEEK_LABELS[p.weekNumber] || `S${p.weekNumber}`).join(' + ');

  const miniPrintWeeklyGroups = useMemo(() => {
    const targetPlans =
      nutritionPrintMode === 'shopping_mini_4weeks'
        ? availableWeeks.filter((w) => w.weekNumber <= 4)
        : activePlans;

    return targetPlans.map((plan) => {
      const grouped = calculateGroceryList([plan]);
      const count = Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0);
      return {
        plan,
        grouped,
        count,
        title: WEEK_FULL_LABELS[plan.weekNumber] || plan.label || `SEMANA ${plan.weekNumber}`
      };
    });
  }, [activePlans, availableWeeks, nutritionPrintMode]);

  const isMiniShoppingPrint =
    nutritionPrintMode === 'shopping_mini_selected' ||
    nutritionPrintMode === 'shopping_mini_4weeks';
  const hideSectionForOtherPrint =
    nutritionPrintMode === 'diet_mini_week' || nutritionPrintMode === 'diet_mini_4weeks';

  const triggerPrint = (mode: NutritionPrintMode) => {
    if (onTriggerNutritionPrint) {
      onTriggerNutritionPrint(mode);
    } else {
      window.print();
    }
  };

  return (
    <div className={hideSectionForOtherPrint ? 'print:hidden' : ''}>
      <section
        id="shopping-list-section"
        className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-5 ${
          isMiniShoppingPrint ? 'print:hidden' : ''
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Lista de la Compra Dinámica ({scopeTitle})
              </h3>
              <p className="text-xs text-slate-500">
                Elige 1, 2, 3 o 4 semanas, separa pedidos o imprime en <strong>formato mini de bolsillo</strong> (siempre 1 hoja por semana).
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap print:hidden">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
              title="Copiar pedidos seleccionados para WhatsApp"
            >
              {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all' ? '¡Copiado!' : orderGroups.length > 1 ? `Copiar ${orderGroups.length} pedidos` : 'Copiar WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={() => triggerPrint('shopping_mini_selected')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              title="Imprimir en formato mini de mano, separado 1 hoja por semana según tu selección"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Mini Mano ({activePlans.length} {activePlans.length === 1 ? 'hoja' : 'hojas'})
              </span>
            </button>

            {availableWeeks.length >= 4 && (
              <button
                type="button"
                onClick={() => triggerPrint('shopping_mini_4weeks')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                title="Imprimir las 4 semanas en formato mini de bolsillo: 4 hojas distintas (1 por semana)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Mini 4 Semanas (4 Hojas)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => triggerPrint('shopping_standard')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Imprimir vista completa actual"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Normal</span>
            </button>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetChecked}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Desmarcar todos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>

      {/* Period Picker + Order Grouping Controls */}
      {availableWeeks.length > 1 && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Presets: 1 sem, 2 sem, 3 sem, 4 sem / 30D, Elegir periodos */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
                <CalendarRange className="w-3.5 h-3.5 text-emerald-600" />
                Periodo:
              </span>
              {[
                { id: '1_week' as PeriodPreset, label: '1 Semana' },
                { id: '2_weeks' as PeriodPreset, label: '2 Semanas' },
                { id: '3_weeks' as PeriodPreset, label: '3 Semanas' },
                { id: '4_weeks' as PeriodPreset, label: '4 Semanas / Mes (30D)' },
                { id: 'custom' as PeriodPreset, label: 'Elegir semanas...' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectPreset(opt.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    periodPreset === opt.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Grouping Mode: Unificado | Separar por Semanas | Separar por Periodos/Quincenas */}
            {activePlans.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  Pedidos:
                </span>
                {[
                  { id: 'unified' as SplitOrderMode, label: 'Unificado (1 pedido)' },
                  { id: 'by_week' as SplitOrderMode, label: `Separar por Semanas (${activePlans.length})` },
                  ...(activePlans.length >= 2
                    ? [{ id: 'by_period' as SplitOrderMode, label: 'Separar por Periodos (2 sem)' }]
                    : [])
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSplitMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      splitMode === mode.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Individual Week Checkboxes to choose exact weeks/periods */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200/80 text-xs">
            <span className="text-[11px] font-semibold text-slate-500">Semanas incluidas:</span>
            {availableWeeks.map((wk) => {
              const activeNums = periodPreset === '1_week' ? [activeWeekNumber] : selectedWeekNumbers;
              const isSelected = activeNums.includes(wk.weekNumber);
              return (
                <button
                  key={wk.weekNumber}
                  type="button"
                  onClick={() => toggleCustomWeek(wk.weekNumber)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-400 text-teal-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{WEEK_LABELS[wk.weekNumber] || `Semana ${wk.weekNumber}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Progress bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 print:hidden">
        <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Progreso Total en el Supermercado: {completedCount} de {totalCount} productos ({orderGroups.length}{' '}
            {orderGroups.length === 1 ? 'pedido' : 'pedidos'})
          </span>
          <span className="text-emerald-700 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 print:hidden">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ingrediente (ej. salmón, manzana, avena, nueces)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todos ({totalCount})
          </button>
          {categories.map((cat) => {
            const catCount = orderGroups.reduce((acc, g) => acc + (g.grouped[cat]?.length || 0), 0);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat} ({catCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Each Order Group (1 unified block OR separate weekly/period orders) */}
      <div className="space-y-6">
        {orderGroups.map((group) => {
          const groupCompleted = group.items.filter((i) =>
            checkedIds.has(getScopedItemKey(group.groupId, i.id))
          ).length;

          return (
            <div
              key={group.groupId}
              className={`${
                orderGroups.length > 1
                  ? 'p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/40 space-y-4 break-inside-avoid'
                  : 'space-y-4'
              }`}
            >
              {orderGroups.length > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-xs">
                        {group.title}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {groupCompleted}/{group.items.length} productos
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{group.subtitle}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingleGroup(group)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer self-start sm:self-auto print:hidden"
                  >
                    {copiedId === group.groupId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === group.groupId ? '¡Pedido copiado!' : 'Copiar este pedido'}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories
                  .filter((cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat)
                  .map((cat) => {
                    const items = (group.grouped[cat] || []).filter((item) =>
                      item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (items.length === 0) return null;

                    return (
                      <div
                        key={`${group.groupId}-${cat}`}
                        className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-white shadow-2xs">{getCategoryIcon(cat)}</div>
                              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">{cat}</h4>
                            </div>
                            <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {items.length} items
                            </span>
                          </div>

                          <ul className="space-y-2">
                            {items.map((item) => {
                              const scopedKey = getScopedItemKey(group.groupId, item.id);
                              const isChecked = checkedIds.has(scopedKey);
                              return (
                                <li
                                  key={scopedKey}
                                  onClick={() => toggleCheck(group.groupId, item.id)}
                                  className={`p-2 rounded-lg cursor-pointer select-none transition-all flex items-start gap-2.5 border ${
                                    isChecked
                                      ? 'bg-slate-100/80 border-slate-200 text-slate-400 line-through'
                                      : 'bg-white hover:bg-emerald-50/40 border-slate-200/90 text-slate-800 shadow-2xs'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                                      isChecked
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-1">
                                      <span className="text-xs font-semibold truncate">{item.name}</span>
                                      <span
                                        className={`text-xs font-bold shrink-0 ${
                                          isChecked ? 'text-slate-400' : 'text-emerald-700'
                                        }`}
                                      >
                                        {item.totalAmount} {item.unit}
                                      </span>
                                    </div>
                                    {item.rawStateNote && (
                                      <div className="text-[10px] text-amber-800/80 italic mt-0.5">• {item.rawStateNote}</div>
                                    )}
                                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                      Días: {item.usedInDays.join(', ')}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </section>

      {/* DEDICATED MINI POCKET PRINT SHEET (Always 1 distinct weekly sheet per week) */}
      {isMiniShoppingPrint && (
        <div className="hidden print:block text-slate-900">
          {miniPrintWeeklyGroups.map((wkGroup, wIdx) => {
            const isLast = wIdx === miniPrintWeeklyGroups.length - 1;
            return (
              <section
                key={`mini-shop-${wkGroup.plan.id}-${wkGroup.plan.weekNumber}`}
                className={!isLast ? 'print-page-break' : ''}
              >
                <div className="max-w-[146mm] mx-auto border border-dashed border-slate-500 rounded-xl p-2.5 bg-white">
                  {/* Mini Header */}
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b-2 border-slate-900">
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-wider text-amber-800">
                        ✂️ NutriVida · Lista Compra Mini de Mano (Hoja {wIdx + 1}/{miniPrintWeeklyGroups.length})
                      </div>
                      <h3 className="text-xs font-black text-slate-950 leading-tight">
                        🛒 {wkGroup.title}
                      </h3>
                    </div>
                    <div className="text-right text-[8px] leading-tight shrink-0">
                      <div className="font-extrabold text-slate-900">
                        {wkGroup.count} productos · {wkGroup.plan.days.length} días
                      </div>
                      <div className="text-slate-600">Pesos netos en crudo</div>
                    </div>
                  </div>

                  {/* 2-Column Compact Categories */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {categories.map((cat) => {
                      const items = wkGroup.grouped[cat] || [];
                      if (items.length === 0) return null;
                      return (
                        <div
                          key={`${wkGroup.plan.weekNumber}-${cat}`}
                          className="border border-slate-300 rounded-lg p-1.5 break-inside-avoid bg-white"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5 mb-1">
                            <span className="text-[8px] font-black uppercase tracking-wide text-slate-900">
                              {cat}
                            </span>
                            <span className="text-[7.5px] font-bold text-slate-500">
                              {items.length}
                            </span>
                          </div>
                          <ul className="space-y-0.5 text-[8.2px] leading-[1.18]">
                            {items.map((item) => (
                              <li
                                key={item.id}
                                className="flex items-baseline justify-between gap-1 border-b border-slate-100 last:border-b-0 pb-0.5 last:pb-0"
                              >
                                <span className="flex items-center gap-1 min-w-0">
                                  <span className="inline-block w-2 h-2 border border-slate-600 rounded-[2px] shrink-0" />
                                  <span className="truncate font-medium text-slate-900">
                                    {item.name}
                                  </span>
                                </span>
                                <span className="font-mono font-extrabold text-emerald-900 shrink-0 whitespace-nowrap">
                                  {item.totalAmount} {item.unit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between text-[7.5px] text-slate-500">
                    <span>Semana diferenciada · {wkGroup.title}</span>
                    <span>Dobla la hoja para llevar cómodamente en la mano</span>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
