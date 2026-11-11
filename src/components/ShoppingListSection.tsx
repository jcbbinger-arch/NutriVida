import React, { useState, useMemo } from 'react';
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
  Package
} from 'lucide-react';
import { WeeklyPlan, GroceryCategory } from '../types/nutrition';
import { calculateGroceryList } from '../services/mealEngine';

interface ShoppingListSectionProps {
  currentWeekPlan: WeeklyPlan;
  otherWeekPlan?: WeeklyPlan;
  activeWeekNumber: 1 | 2;
}

export const ShoppingListSection: React.FC<ShoppingListSectionProps> = ({
  currentWeekPlan,
  otherWeekPlan,
  activeWeekNumber
}) => {
  const [listScope, setListScope] = useState<'current_week' | 'fortnight'>('current_week');

  const activePlans = useMemo(() => {
    if (listScope === 'fortnight' && otherWeekPlan) {
      return [currentWeekPlan, otherWeekPlan];
    }
    return [currentWeekPlan];
  }, [listScope, currentWeekPlan, otherWeekPlan]);

  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`nutrivida_checked_${currentWeekPlan.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Compute calculated dynamic list from selected scope
  const groupedGrocery = useMemo(() => {
    return calculateGroceryList(activePlans);
  }, [activePlans]);

  // Flatten all items for counters and search
  const allItems = useMemo(() => {
    const list = [];
    for (const [category, items] of Object.entries(groupedGrocery)) {
      for (const item of items) {
        list.push({ ...item, category: category as GroceryCategory });
      }
    }
    return list;
  }, [groupedGrocery]);

  const totalCount = allItems.length;
  const completedCount = allItems.filter((i) => checkedIds.has(i.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(`nutrivida_checked_${currentWeekPlan.id}`, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const resetChecked = () => {
    setCheckedIds(new Set());
    localStorage.removeItem(`nutrivida_checked_${currentWeekPlan.id}`);
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

  // Copy structured list to clipboard
  const handleCopyClipboard = () => {
    let text = `🛒 LISTA DE LA COMPRA NUTRIVIDA (${listScope === 'fortnight' ? 'PLAN QUINCENAL (2 SEMANAS)' : `SEMANA ${activeWeekNumber}`})\n`;
    text += `Generada: ${currentWeekPlan.generatedAt}\n`;
    text += `=========================================\n\n`;

    (Object.keys(groupedGrocery) as GroceryCategory[]).forEach((cat) => {
      const items = groupedGrocery[cat];
      if (items.length > 0) {
        text += `🔹 ${cat.toUpperCase()}:\n`;
        items.forEach((item) => {
          const note = item.rawStateNote ? ` [${item.rawStateNote}]` : '';
          text += `  • ${item.name}: ${item.totalAmount} ${item.unit}${note} (${item.usedInDays.join(', ')})\n`;
        });
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categories: GroceryCategory[] = [
    'Proteínas',
    'Verduras & Hortalizas',
    'Frutas Frescas',
    'Tubérculos & Cereales',
    'Lácteos & Frutos Secos',
    'Despensa & Condimentos'
  ];

  return (
    <section id="shopping-list-section" className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Lista de la Compra Dinámica con Escandallo
            </h3>
            <p className="text-xs text-slate-500">
              Cantidades exactas en crudo y piezas de fruta entera requeridas para los platos sorteados.
            </p>
          </div>
        </div>

        {/* Scope Selector & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {otherWeekPlan && (
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setListScope('current_week')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  listScope === 'current_week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semana {activeWeekNumber}
              </button>
              <button
                onClick={() => setListScope('fortnight')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  listScope === 'fortnight' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quincena Completa (2 Sem.)
              </button>
            </div>
          )}

          <button
            onClick={handleCopyClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            title="Copiar lista organizada para WhatsApp"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          {completedCount > 0 && (
            <button
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

      {/* Progress bar */}
      <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Progreso en el Supermercado: {completedCount} de {totalCount} productos en el carrito
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Search */}
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

        {/* Filter Pills */}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat} ({groupedGrocery[cat]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Columns / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories
          .filter((cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat)
          .map((cat) => {
            const items = (groupedGrocery[cat] || []).filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (items.length === 0) return null;

            return (
              <div
                key={cat}
                className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                        {getCategoryIcon(cat)}
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                        {cat}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {items.length} items
                    </span>
                  </div>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {items.map((item) => {
                      const isChecked = checkedIds.has(item.id);
                      return (
                        <li
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
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
                              <div className="text-[10px] text-amber-800/80 italic mt-0.5">
                                • {item.rawStateNote}
                              </div>
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
    </section>
  );
};
