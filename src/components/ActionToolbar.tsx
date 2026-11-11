import React from 'react';
import { Dices, RefreshCw, ShoppingCart, CalendarRange, LayoutGrid, Table, Calendar } from 'lucide-react';

interface ActionToolbarProps {
  onShuffleAll: () => void;
  onOpenDaySelector: () => void;
  onViewShoppingList: () => void;
  isShuffling: boolean;
  activeView: 'table' | 'cards';
  onChangeView: (view: 'table' | 'cards') => void;
  activeWeek: 1 | 2;
  onChangeWeek: (week: 1 | 2) => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onShuffleAll,
  onOpenDaySelector,
  onViewShoppingList,
  isShuffling,
  activeView,
  onChangeView,
  activeWeek,
  onChangeWeek
}) => {
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
            <span>🎲 Mezclar Semana {activeWeek}</span>
          </button>

          {/* [ 🔄 Cambiar Día Específico ] */}
          <button
            onClick={onOpenDaySelector}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>🔄 Cambiar Día Específico</span>
          </button>

          {/* [ 🛒 Generar Lista de la Compra ] */}
          <button
            onClick={onViewShoppingList}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-slate-950" />
            <span>🛒 Lista de la Compra ({activeWeek === 1 ? 'Semana 1' : 'Semana 2'})</span>
          </button>
        </div>

        {/* Week Switcher & View Layout */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
          {/* Week Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-500 px-2 hidden sm:inline flex items-center gap-1">
              <CalendarRange className="w-3.5 h-3.5 text-emerald-600" />
              Rotación:
            </span>
            <button
              onClick={() => onChangeWeek(1)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeWeek === 1
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana 1
            </button>
            <button
              onClick={() => onChangeWeek(2)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeWeek === 2
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana 2
            </button>
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
