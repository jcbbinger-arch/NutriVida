import React, { useState } from 'react';
import { Target, Flame, Dumbbell, ShieldAlert, ChevronDown, ChevronUp, Activity, Apple, ShieldCheck, HeartPulse } from 'lucide-react';
import { UserProfile } from '../types/nutrition';

interface UserProfileBannerProps {
  profile: UserProfile;
  onEditProfile?: () => void;
  onNavigateToTracking?: () => void;
}

export const UserProfileBanner: React.FC<UserProfileBannerProps> = ({
  profile,
  onEditProfile,
  onNavigateToTracking
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-700/50 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main User Bio & Scientific Rigor */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Ficha Nutricional Corregida (Plan 2 Semanas)
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Hombre · {profile.age} años · {profile.heightCm / 100} m · {profile.currentWeightKg} kg (IMC ≈ 34)
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Objetivo: Déficit calórico global, control glucémico y protección articular
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Basado en evidencia científica actualizada: la reducción de grasa corporal y visceral se logra mediante
              déficit calórico sostenido (sin mitos de reducción localizada). Estructurado en <strong>5 tomas</strong> con
              escandallo en crudo, 2-3 piezas de fruta fresca entera, legumbres aumentadas y Omega-3 articular.
            </p>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                Déficit Diario
              </div>
              <div className="text-lg font-black text-white">~{profile.targetCalories} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              <div className="text-[10px] text-slate-400">Gasto TDEE: {profile.tdee} kcal</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-teal-400 mb-0.5">
                <Dumbbell className="w-3.5 h-3.5" />
                Proteína Objetivo
              </div>
              <div className="text-lg font-black text-white">{profile.targetProteinMin}-{profile.targetProteinMax} <span className="text-xs font-normal text-slate-400">g</span></div>
              <div className="text-[10px] text-slate-400">1.4 - 1.6 g/kg magro</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-400 mb-0.5">
                <Apple className="w-3.5 h-3.5" />
                Fruta Entera
              </div>
              <div className="text-lg font-black text-white">2 - 3 <span className="text-xs font-normal text-slate-400">piezas</span></div>
              <div className="text-[10px] text-slate-400">&gt;30g fibra/día</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 mb-0.5">
                <Activity className="w-3.5 h-3.5" />
                Articulaciones
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">Omega-3 EPA/DHA</div>
              <div className="text-[10px] text-emerald-400">Pescado azul 2-3x/sem</div>
            </div>
          </div>
        </div>

        {/* Expandable details button */}
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              Criterios Juan integrados:
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">5 Tomas Planificadas</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Almidón Resistente Tipo 3</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Legumbres 3-4x/sem</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Huevos & Atún Moderados</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Cero Alcohol en Cocina</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToTracking && (
              <button
                onClick={onNavigateToTracking}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-1 px-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>📈 Ficha de Mediciones (102 kg · 106 cm)</span>
              </button>
            )}
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="text-emerald-300 hover:text-white underline underline-offset-2 py-1 px-2 text-xs cursor-pointer"
              >
                Ajustar datos
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800 cursor-pointer"
            >
              <span>{isExpanded ? 'Ocultar análisis clínico' : 'Ver fundamentación'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Guidance Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-700/70 grid sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                1. Corrección Científica
              </div>
              <p className="text-slate-400 leading-normal">
                No existe reducción localizada de grasa abdominal. El déficit calórico moderado (~600 kcal) induce la pérdida progresiva y sistémica de tejido adiposo, disminuyendo el perímetro de cintura de forma segura.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                2. Protección Articular Real
              </div>
              <p className="text-slate-400 leading-normal">
                A los 53 años con IMC 34, cada kilo perdido reduce 4 kg de presión en rodillas. Sumamos pescado azul 2-3 veces/semana (EPA/DHA antiinflamatorio) y ejercicio sin impacto (caminata con desnivel y elíptica).
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-amber-400" />
                3. Almidón Resistente & Fibra
              </div>
              <p className="text-slate-400 leading-normal">
                Las patatas cocidas y refrigeradas 24h a 4°C forman almidón resistente tipo 3, reduciendo su pico glucémico. Las 2-3 frutas enteras aportan pectina, potasio y vitamina C sin los inconvenientes del zumo.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                4. Moderación de Procesados
              </div>
              <p className="text-slate-400 leading-normal">
                Atún limitado a 2-3 latas/semana sustituido por caballa del norte (menos metales pesados). Huevos moderados a 1 al día completando con claras. Cero gulas/surimi y sustitución de vino por caldo desgrasado con limón.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
