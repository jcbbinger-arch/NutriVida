import React, { useState, useMemo } from 'react';
import {
  Building2,
  Home,
  Layers,
  Check,
  ShieldAlert,
  Sparkles,
  Dumbbell,
  CalendarRange,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ExperienceLevel,
  GymEquipmentId,
  HomeMaterialId,
  SplitPreference,
  TrainingConfiguratorState,
  TrainingEnvironment,
  TrainingGoalOption
} from '../types/training';
import {
  GYM_EQUIPMENT_CATALOG,
  GYM_INTENSITY_PROGRESSION_RULES,
  HOME_MATERIAL_CATALOG,
  autoArrangeOptimalSchedule,
  generateFourWeekProgram
} from '../services/trainingPlanner';

interface TrainingProgramConfiguratorProps {
  config: TrainingConfiguratorState;
  onChangeConfig: (next: TrainingConfiguratorState) => void;
  onApplyScheduleToCalendar: (nextConfig: TrainingConfiguratorState) => void;
}

export const TrainingProgramConfigurator: React.FC<TrainingProgramConfiguratorProps> = ({
  config,
  onChangeConfig,
  onApplyScheduleToCalendar
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [activeSessionTab, setActiveSessionTab] = useState<'fuerza_a' | 'fuerza_b' | 'torso' | 'pierna'>('fuerza_a');
  const [showSafetyRules, setShowSafetyRules] = useState(false);

  const program = useMemo(() => generateFourWeekProgram(config), [config]);

  const updateLimitation = <K extends keyof TrainingConfiguratorState['limitations']>(
    key: K,
    value: TrainingConfiguratorState['limitations'][K]
  ) => {
    onChangeConfig({
      ...config,
      limitations: {
        ...config.limitations,
        [key]: value
      }
    });
  };

  const toggleGymEquip = (id: GymEquipmentId) => {
    onChangeConfig({
      ...config,
      gymEquipment: {
        ...config.gymEquipment,
        [id]: !config.gymEquipment[id]
      }
    });
  };

  const toggleHomeMat = (id: HomeMaterialId) => {
    onChangeConfig({
      ...config,
      homeMaterial: {
        ...config.homeMaterial,
        [id]: !config.homeMaterial[id]
      }
    });
  };

  const isUpperLower = config.experience === 'intermedio' && config.daysPerWeek === 4 && config.splitPreference === 'upper_lower';

  const sessionToDisplay =
    isUpperLower && (activeSessionTab === 'torso' || activeSessionTab === 'pierna')
      ? program.sessions[activeSessionTab]
      : activeSessionTab === 'fuerza_b'
      ? program.sessions.fuerza_b
      : program.sessions.fuerza_a;

  const handleApplyAndOrganize = () => {
    const arranged = autoArrangeOptimalSchedule(
      config.customSchedule,
      config.daysPerWeek,
      isUpperLower ? 'upper_lower' : 'full_body'
    );
    onApplyScheduleToCalendar({
      ...config,
      customSchedule: arranged
    });
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-900 border border-teal-200">
              Diseño en 3 Pasos · Patrones de Movimiento
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {config.environment === 'gym'
                ? 'Modo Gimnasio'
                : config.environment === 'home'
                ? 'Modo Casa + Alternativas Caseras'
                : 'Modo Híbrido (Gimnasio + Casa)'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            Configurador Inteligente: Pregunto → 6 Patrones → Material & Plan 4 Semanas
          </h3>
          <p className="text-xs text-slate-500">
            Primero evaluamos tu experiencia y límites; luego estructuramos los 6 patrones de movimiento; por último asignamos máquinas de gimnasio o tu lista marcable de casa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyAndOrganize}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start lg:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generar y repartir en calendario semanal</span>
        </button>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {[
          { step: 1 as const, title: '1. Qué pregunto antes', sub: 'Entorno, experiencia, tiempo y límites' },
          {
            step: 2 as const,
            title: config.environment === 'gym' ? '2. Material del Gimnasio' : '2. Lista Marcable de Material',
            sub: config.environment === 'gym' ? 'Máquinas, poleas, mancuernas, monitor' : 'Con alternativa casera al lado'
          },
          { step: 3 as const, title: '3. 6 Patrones & Plan 4 Semanas', sub: 'Sesiones A/B, RIR 2–3 y Semana Descarga' }
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => setActiveStep(item.step)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeStep === item.step
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div>
              <div className="font-extrabold text-xs">{item.title}</div>
              <div className={`text-[10px] mt-0.5 ${activeStep === item.step ? 'text-teal-300' : 'text-slate-500'}`}>
                {item.sub}
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ${activeStep === item.step ? 'text-teal-400' : 'text-slate-400'}`} />
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* STEP 1: QUESTIONNAIRE & LIMITATIONS */}
      {/* ======================================================== */}
      {activeStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150 text-xs">
          {/* Environment Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'home' as TrainingEnvironment,
                icon: Home,
                label: 'Entreno en Casa',
                desc: 'Lista marcable con alternativas caseras (silla, gomas, pared, garrafas)'
              },
              {
                id: 'gym' as TrainingEnvironment,
                icon: Building2,
                label: 'Dispongo de Gimnasio',
                desc: '6 patrones asignados a máquinas guiadas, poleas, mancuernas y cardio'
              },
              {
                id: 'hybrid' as TrainingEnvironment,
                icon: Layers,
                label: 'Mixto (Gimnasio + Casa)',
                desc: 'Fuerza en gimnasio y caminatas/alternativas en casa'
              }
            ].map((env) => {
              const Icon = env.icon;
              const selected = config.environment === env.id;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, environment: env.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-teal-50 border-teal-500 text-teal-950 ring-1 ring-teal-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-xs mb-1">
                    <Icon className={`w-4 h-4 ${selected ? 'text-teal-700' : 'text-slate-500'}`} />
                    <span>{env.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{env.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Experience, Goal, Frequency, Duration, Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Experiencia previa</label>
              <select
                value={config.experience}
                onChange={(e) => onChangeConfig({ ...config, experience: e.target.value as ExperienceLevel })}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="principiante">Principiante o vuelta tras parón</option>
                <option value="intermedio">Intermedio (técnica consolidada)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Objetivo principal</label>
              <select
                value={config.goal}
                onChange={(e) => onChangeConfig({ ...config, goal: e.target.value as TrainingGoalOption })}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="perder_grasa">Perder grasa preservando músculo</option>
                <option value="ganar_fuerza">Ganar fuerza y masa muscular</option>
                <option value="salud_general">Salud general, postura y movilidad</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Frecuencia fuerza (días/sem)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([2, 3, 4] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, daysPerWeek: d })}
                    className={`py-1.5 rounded-lg border font-bold cursor-pointer ${
                      config.daysPerWeek === d
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {d} días
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Duración por sesión</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([30, 45, 60] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, sessionMinutes: m })}
                    className={`py-1.5 rounded-lg border font-bold cursor-pointer ${
                      config.sessionMinutes === m
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structure preference for Intermediate 4 days */}
          {config.experience === 'intermedio' && config.daysPerWeek === 4 && (
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-teal-950">Estructura para Intermedio (4 días):</span>
              <div className="flex gap-2">
                {[
                  { id: 'full_body' as SplitPreference, label: 'Cuerpo Completo (A/B)' },
                  { id: 'upper_lower' as SplitPreference, label: 'Torso / Pierna (4 días)' }
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, splitPreference: sp.id })}
                    className={`px-3 py-1 rounded-lg font-bold border cursor-pointer ${
                      config.splitPreference === sp.id
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-teal-900 border-teal-300'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Limitations & Profile Adaptations */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Limitaciones, lesiones y adaptaciones por perfil (se aplican automáticamente a los ejercicios)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { key: 'knees' as const, label: 'Rodillas delicadas (pies altos / sin impacto)' },
                { key: 'lowerBack' as const, label: 'Espalda / lumbar sensible (apoyo pectoral)' },
                { key: 'shoulders' as const, label: 'Hombros delicados (agarre neutro, no tras nuca)' },
                { key: 'overweightHighBmi' as const, label: 'Sobrepeso / IMC alto (sin saltos, guiado)' },
                { key: 'over50' as const, label: 'Mayor de 50 años (48h descanso, más movilidad)' },
                { key: 'over60' as const, label: 'Mayor de 60 años (silla + equilibrio asistido)' },
                { key: 'hypertensionOrCardiacOrDiabetes' as const, label: 'HTA / Cardíaco / Diabetes tratada' },
                { key: 'femaleGluteEmphasis' as const, label: 'Énfasis pierna y glúteo' }
              ].map((item) => {
                const checked = Boolean(config.limitations[item.key]);
                return (
                  <label
                    key={item.key}
                    className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer text-[11px] transition-colors ${
                      checked
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => updateLimitation(item.key, e.target.checked)}
                      className="accent-amber-600 shrink-0"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Cirugías previas, medicación o dolores específicos (opcional):
                </label>
                <input
                  type="text"
                  value={config.limitations.priorSurgeriesOrMeds}
                  onChange={(e) => updateLimitation('priorSurgeriesOrMeds', e.target.value)}
                  placeholder="Ej. Menisco operado hace 4 años, antihipertensivos..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              <div className="flex items-end justify-between gap-2">
                <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={config.includeOptionalPatterns}
                    onChange={(e) => onChangeConfig({ ...config, includeOptionalPatterns: e.target.checked })}
                    className="accent-teal-600"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    Incluir patrones opcionales (empuje vertical, gemelos/extensión) si hay ≥45 min
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Siguiente: Paso 2 (Material Disponible) →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: MATERIAL CHECKLIST (GYM & HOME WITH HOMEMADE FALLBACK) */}
      {/* ======================================================== */}
      {activeStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150 text-xs">
          {(config.environment === 'gym' || config.environment === 'hybrid') && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  Material disponible en tu Gimnasio
                </span>
                <span className="text-[11px] text-slate-500">
                  Principiantes / sobrepeso: priorizamos máquinas guiadas antes que peso libre
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {GYM_EQUIPMENT_CATALOG.map((item) => {
                  const checked = config.gymEquipment[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleGymEquip(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        checked
                          ? 'bg-teal-50 border-teal-400 text-teal-950'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                          checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.detail}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  ¿No sabes el nombre de alguna máquina? Describe la sala o máquinas que ves:
                </label>
                <input
                  type="text"
                  value={config.gymDescriptionNote}
                  onChange={(e) => onChangeConfig({ ...config, gymDescriptionNote: e.target.value })}
                  placeholder="Ej. Hay prensa horizontal, torre de poleas, bicis reclinadas, no hay jaula..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              {!config.gymEquipment.entrenador_sala && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Si entrenas sin monitor de sala y ves máquinas desconocidas, verifica ajustes de asiento y pide revisión técnica de los 2–3 movimientos principales antes de subir carga.
                  </span>
                </div>
              )}
            </div>
          )}

          {(config.environment === 'home' || config.environment === 'hybrid') && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-emerald-700" />
                    Lista Marcable de Material en Casa (con Alternativa Casera)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Marca lo que tienes en casa. Si no lo marcas, el generador usa automáticamente su alternativa casera segura.
                  </p>
                </div>

                <label className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer text-[11px] font-bold text-emerald-900">
                  <input
                    type="checkbox"
                    checked={config.useHomemadeAlternatives}
                    onChange={(e) =>
                      onChangeConfig({ ...config, useHomemadeAlternatives: e.target.checked })
                    }
                    className="accent-emerald-600"
                  />
                  <span>Activar alternativas caseras si falta material</span>
                </label>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold text-[11px] border-b border-slate-200">
                      <th className="py-2.5 px-3">Material (Marca lo que tienes)</th>
                      <th className="py-2.5 px-3">Para qué sirve</th>
                      <th className="py-2.5 px-3">Si no lo tienes (Alternativa casera)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {HOME_MATERIAL_CATALOG.map((item) => {
                      const checked = config.homeMaterial[item.id];
                      return (
                        <tr
                          key={item.id}
                          onClick={() => toggleHomeMat(item.id)}
                          className={`cursor-pointer transition-colors ${
                            checked ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {}}
                                className="accent-emerald-600 w-4 h-4 pointer-events-none"
                              />
                              <span>{item.label}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{item.purpose}</td>
                          <td className="py-2.5 px-3 text-teal-800 font-medium">
                            {item.homemadeAlternative}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Homemade Safety Rules Accordion */}
              <div className="bg-amber-50/80 rounded-xl border border-amber-200 p-3">
                <button
                  type="button"
                  onClick={() => setShowSafetyRules(!showSafetyRules)}
                  className="w-full flex items-center justify-between font-bold text-amber-950 text-xs cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    Reglas obligatorias de seguridad para material casero (6 puntos)
                  </span>
                  {showSafetyRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showSafetyRules && (
                  <ul className="mt-2.5 pt-2 border-t border-amber-200/70 space-y-1 text-[11px] text-amber-950">
                    {program.homemadeSafetyRules.map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs cursor-pointer"
            >
              ← Volver al Paso 1
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Ver Paso 3: 6 Patrones & Plan 4 Semanas →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: 6 MOVEMENT PATTERNS & 4-WEEK PROGRESSION */}
      {/* ======================================================== */}
      {activeStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150 text-xs">
          {/* Rationale & Alerts */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-extrabold text-sm text-teal-300">{program.structureTitle}</div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30 text-[11px] font-bold">
                {config.daysPerWeek} días/sem · {config.sessionMinutes} min/sesión
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{program.structureRationale}</p>
          </div>

          {program.safetyAlerts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1 text-[11px] text-rose-950">
              <div className="font-extrabold flex items-center gap-1.5 text-rose-800">
                <AlertTriangle className="w-4 h-4" />
                Adaptaciones y límites de seguridad aplicados a tu perfil:
              </div>
              {program.safetyAlerts.map((alert, idx) => (
                <div key={idx}>• {alert}</div>
              ))}
            </div>
          )}

          {/* Session Switcher (A / B or Torso / Pierna) */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {isUpperLower ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveSessionTab('torso')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      activeSessionTab === 'torso' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Sesión Torso
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSessionTab('pierna')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      activeSessionTab === 'pierna' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Sesión Pierna
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveSessionTab('fuerza_a')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      activeSessionTab === 'fuerza_a' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Sesión A (Base)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSessionTab('fuerza_b')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      activeSessionTab === 'fuerza_b' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Sesión B (Alterna anti-aburrimiento)
                  </button>
                </>
              )}
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              {sessionToDisplay.patterns.length} patrones cubiertos · RIR 2–3
            </span>
          </div>

          {/* Warmup + Pattern Table + Cooldown */}
          <div className="space-y-2.5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-950">
              <strong>Calentamiento:</strong> {sessionToDisplay.warmup}
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold text-[11px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Orden & Patrón</th>
                    <th className="py-2.5 px-3">Ejercicio Asignado</th>
                    <th className="py-2.5 px-3">Material / Alternativa</th>
                    <th className="py-2.5 px-3">Series × Reps</th>
                    <th className="py-2.5 px-3">Descanso & Nota Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessionToDisplay.patterns.map((p, idx) => (
                    <tr key={p.patternId} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] mr-1.5">
                          {idx + 1}
                        </span>
                        <span>{p.patternLabel}</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-teal-900">{p.exerciseName}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div className="font-semibold">{p.equipmentUsed}</div>
                        {p.homemadeFallback && (
                          <div className="text-[10px] text-emerald-700">Casero: {p.homemadeFallback}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        <div>{p.setsReps}</div>
                        <div className="text-[10px] text-slate-500 font-sans font-normal">{p.rirNote}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800">{p.restSeconds} s</span> · {p.safetyCue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-[11px] text-teal-950">
              <strong>Vuelta a la calma / Final:</strong> {sessionToDisplay.cooldown}
            </div>
          </div>

          {/* 4-Week Plan with Week 4 Deload */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarRange className="w-4 h-4 text-teal-700" />
              Plan de 4 Semanas (Progresión +2–5% y Semana 4 de Descarga −40–50% series)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {program.weeks.map((wk) => (
                <div
                  key={wk.weekNumber}
                  className={`p-3 rounded-xl border space-y-1 ${
                    wk.isDeload
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="font-extrabold text-xs">{wk.label}</div>
                  <div className="text-[11px] font-bold text-teal-800">{wk.setsMultiplierLabel}</div>
                  <div className="text-[10px] font-semibold text-slate-500">{wk.rirTarget}</div>
                  <p className="text-[11px] text-slate-600 leading-snug pt-1">{wk.progressionNote}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Intensity & Progression 5 Rules */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
            <div>
              <strong>• Esfuerzo:</strong> {GYM_INTENSITY_PROGRESSION_RULES.effort}
            </div>
            <div>
              <strong>• Descansos:</strong> {GYM_INTENSITY_PROGRESSION_RULES.rests}
            </div>
            <div>
              <strong>• Cuándo subir carga:</strong> {GYM_INTENSITY_PROGRESSION_RULES.progression}
            </div>
            <div>
              <strong>• Descarga y cuaderno:</strong> {GYM_INTENSITY_PROGRESSION_RULES.deload} {GYM_INTENSITY_PROGRESSION_RULES.tracking}
            </div>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs cursor-pointer"
            >
              ← Volver al Paso 2
            </button>
            <button
              type="button"
              onClick={handleApplyAndOrganize}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Aplicar programa y organizar mis días arriba</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
