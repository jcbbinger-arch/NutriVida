import React from 'react';
import { Dices, RefreshCw, ShoppingCart, CalendarRange, LayoutGrid, Table, RotateCcw } from 'lucide-react';

interface ActionToolbarProps {
  onShuffleAll: () => void;
  onRestoreCanonical: () => void;
  onOpenDaySelector: () => void;
  onViewShoppingList: () => void;
  isShuffling: boolean;
  activeView: 'table' | 'cards';
  onChangeView: (view: 'table' | 'cards') => void;
  activeWeek: 1 | 2 | 3 | 4 | 5;
  onChangeWeek: (week: 1 | 2 | 3 | 4 | 5) => void;
}

const WEEK_PILLS: Array<{ value: 1 | 2 | 3 | 4 | 5; label: string; full: string }> = [
  { value: 1, label: 'S1', full: 'Semana 1 (Días 1–7)' },
  { value: 2, label: 'S2', full: 'Semana 2 (Días 8–14)' },
  { value: 3, label: 'S3', full: 'Semana 3 (Días 15–21)' },
  { value: 4, label: 'S4', full: 'Semana 4 (Días 22–28)' },
  { value: 5, label: 'D29-30', full: 'Cierre de Mes (Días 29–30)' }
];

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onShuffleAll,
  onRestoreCanonical,
  onOpenDaySelector,
  onViewShoppingList,
  isShuffling,
  activeView,
  onChangeView,
  activeWeek,
  onChangeWeek
}) => {
  const activeLabel = activeWeek === 5 ? 'Días 29–30' : `Semana ${activeWeek}`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Core Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* [ 🎲 Mezclar Menú Completo ] */}
          <button
            onClick={onShuffleAll}
            disabled={isShuffling}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Dices className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>🎲 Mezclar {activeLabel}</span>
          </button>

          {/* [ 📅 Restaurar Calendario Oficial 30D ] */}
          <button
            onClick={onRestoreCanonical}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 active:scale-95 transition-all cursor-pointer"
            title="Restaurar el calendario oficial de 30 días intercambiable"
          >
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>📅 Calendario Oficial 30D</span>
          </button>

          {/* [ 🔄 Cambiar Día Específico ] */}
          <button
            onClick={onOpenDaySelector}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>🔄 Cambiar Día</span>
          </button>

          {/* [ 🛒 Generar Lista de la Compra ] */}
          <button
            onClick={onViewShoppingList}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-slate-950" />
            <span>🛒 Lista Compra ({activeLabel})</span>
          </button>
        </div>

        {/* Week Switcher & View Layout */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
          {/* 30-Day Week Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-500 px-1.5 hidden sm:inline flex items-center gap-1">
              <CalendarRange className="w-3.5 h-3.5 text-emerald-600" />
              30 Días:
            </span>
            {WEEK_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => onChangeWeek(pill.value)}
                title={pill.full}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeWeek === pill.value
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Table vs Cards */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => onChangeView('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tabla con 5 Tomas Diarias"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabla</span>
            </button>

            <button
              onClick={() => onChangeView('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'cards'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Vista de Tarjetas por Día"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
