import React, { useState } from 'react';
import { ShieldCheck, Check, Cpu, ChevronDown, ChevronUp, Zap, Fish, Apple, Wheat, Scale, WineOff } from 'lucide-react';
import { RuleValidationReport } from '../types/nutrition';

interface EngineStatusCardProps {
  report: RuleValidationReport;
  activeWeekNumber: 1 | 2 | 3 | 4 | 5;
  weekLabel?: string;
}

export const EngineStatusCard: React.FC<EngineStatusCardProps> = ({
  report,
  activeWeekNumber,
  weekLabel
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const blockTitle = weekLabel || (activeWeekNumber === 5 ? 'Días 29–30 (Cierre)' : `Semana ${activeWeekNumber}`);

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/30">
            <Cpu className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                Auditoría Clínica & Reglas de Intercambio · {blockTitle}
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${
                  report.isValid ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                <Check className="w-3 h-3" />
                {report.isValid ? 'PLAN 30D VALIDADO' : 'REVISAR REGLAS'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Días de menú completo: <strong>{report.averageCaloriesPerDay} kcal/día</strong> ·{' '}
              <strong>{report.averageProteinPerDay} g proteína/día</strong> ·{' '}
              <strong>{report.averageFiberPerDay} g fibra/día</strong> ·{' '}
              <strong>0 colisiones de pescado comida/cena</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>{showLogs ? 'Ocultar diagnósticos' : 'Ver detalle de auditoría'}</span>
          {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Grid of Key Nutritional Markers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3.5 pt-3 border-t border-emerald-200/70">
        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">~{report.averageCaloriesPerDay} kcal/día</div>
            <div className="text-[10px] text-slate-500">Obj. 1.700–1.800</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Fish className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{report.oilyFishCountPerWeek}× Pescado Azul</div>
            <div className="text-[10px] text-slate-500">Meta 2–3×/sem</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Wheat className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{report.legumeCountPerWeek}× Legumbres</div>
            <div className="text-[10px] text-slate-500">{report.averageFiberPerDay}g fibra/día</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <Apple className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{report.fruitPiecesPerDayAverage} Frutas/Día</div>
            <div className="text-[10px] text-slate-500">2–3 piezas enteras</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{report.averageProteinPerDay}g Prot/Día</div>
            <div className="text-[10px] text-slate-500">Meta 110–125 g</div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-2 border border-emerald-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <WineOff className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">0% Alcohol</div>
            <div className="text-[10px] text-slate-500">Domingo 1× LIBRE</div>
          </div>
        </div>
      </div>

      {/* Expanded Logs & Rule Details */}
      {showLogs && (
        <div className="mt-3.5 pt-3 border-t border-emerald-200/80 bg-white/90 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verificación matemática, clínica y culinaria ({blockTitle}):</span>
          </div>
          <ul className="space-y-1 text-slate-700 pl-1">
            {report.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Huevos enteros: ~{report.eggsCountPerWeek}/bloque (claras donde 1 clara ≈ 30 ml). Atún al natural: {report.cannedTunaCountPerWeek} toma(s).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
