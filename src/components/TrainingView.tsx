import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Dumbbell,
  ShieldCheck,
  Mountain,
  ArrowDown,
  ArrowUp,
  Heart,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Footprints,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  AlertTriangle,
  Check,
  Printer
} from 'lucide-react';
import {
  DOWNHILL_TECHNIQUES,
  STRENGTH_EXERCISES
} from '../data/trainingDatabase';
import {
  DayCardioOption,
  DaySlotRole,
  Exercise,
  GeneratedSessionPlan,
  PhysicalProfile,
  TrainingConfiguratorState
} from '../types/training';
import { UserProfile } from '../types/nutrition';
import {
  CARDIO_LABELS,
  DEFAULT_CUSTOM_SCHEDULE,
  ROLE_LABELS,
  autoArrangeOptimalSchedule,
  buildDefaultTrainingConfigurator,
  detectConsecutiveStrengthDays,
  generateFourWeekProgram,
  isStrengthRole
} from '../services/trainingPlanner';
import {
  loadTrainingConfigFromCloud,
  saveTrainingConfigToCloud
} from '../services/firebase';
import { TrainingProgramConfigurator } from './TrainingProgramConfigurator';

interface TrainingViewProps {
  physicalProfile: PhysicalProfile;
  onUpdatePhysicalProfile: (updated: PhysicalProfile) => void;
  activeWeekNumber: 1 | 2;
  onChangeWeek: (w: 1 | 2) => void;
  onNavigateToInfographics?: () => void;
  userProfile?: UserProfile;
  effectiveUid?: string;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  physicalProfile,
  onUpdatePhysicalProfile,
  activeWeekNumber,
  onChangeWeek,
  onNavigateToInfographics,
  userProfile,
  effectiveUid
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedSessionModal, setSelectedSessionModal] = useState<GeneratedSessionPlan | null>(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showScientificRationale, setShowScientificRationale] = useState(true);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [activeCycleWeek, setActiveCycleWeek] = useState<1 | 2 | 3 | 4>(activeWeekNumber);
  const [printRange, setPrintRange] = useState<'2_weeks_1_2' | '2_weeks_3_4' | '4_weeks'>('2_weeks_1_2');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const storageKey = effectiveUid
    ? `nutrivida_training_config_v2_${effectiveUid}`
    : 'nutrivida_training_config_v2';

  const [config, setConfig] = useState<TrainingConfiguratorState>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as TrainingConfiguratorState;
        if (parsed && Array.isArray(parsed.customSchedule) && parsed.customSchedule.length === 7) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return buildDefaultTrainingConfigurator(userProfile);
  });

  // Load from localStorage / Cloud Firestore when UID changes
  useEffect(() => {
    let cancelled = false;
    let loadedLocal = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as TrainingConfiguratorState;
        if (parsed && Array.isArray(parsed.customSchedule) && parsed.customSchedule.length === 7) {
          loadedLocal = true;
          setConfig(parsed);
        }
      }
    } catch {
      // ignore
    }

    if (effectiveUid) {
      loadTrainingConfigFromCloud(effectiveUid).then((cloudCfg) => {
        if (cancelled) return;
        if (cloudCfg && Array.isArray(cloudCfg.customSchedule) && cloudCfg.customSchedule.length === 7) {
          setConfig(cloudCfg);
          try {
            localStorage.setItem(storageKey, JSON.stringify(cloudCfg));
          } catch {
            // ignore
          }
        } else if (!loadedLocal) {
          setConfig(buildDefaultTrainingConfigurator(userProfile));
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [effectiveUid, storageKey]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const persistConfig = useCallback(
    (next: TrainingConfiguratorState, toastText?: string) => {
      setConfig(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (effectiveUid) {
        saveTrainingConfigToCloud(next, effectiveUid);
      }
      if (toastText) showToast(toastText);
    },
    [effectiveUid, showToast, storageKey]
  );

  const generatedProgram = useMemo(() => generateFourWeekProgram(config), [config]);

  const consecutiveWarnings = useMemo(
    () => detectConsecutiveStrengthDays(config.customSchedule),
    [config.customSchedule]
  );

  const scheduleStats = useMemo(() => {
    const totalKm = Math.round(
      config.customSchedule.reduce((acc, d) => acc + (Number(d.distanceKm) || 0), 0) * 10
    ) / 10;
    const strengthCount = config.customSchedule.filter((d) => isStrengthRole(d.role)).length;
    const restCount = config.customSchedule.filter((d) => d.role === 'descanso_activo').length;
    return { totalKm, strengthCount, restCount };
  }, [config.customSchedule]);

  // Move/Swap a day's assigned workout block with adjacent day (keeping weekday labels fixed)
  const handleSwapDayOrder = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= config.customSchedule.length) return;
    const nextSchedule = [...config.customSchedule];
    const currentWork = nextSchedule[index];
    const targetWork = nextSchedule[targetIdx];

    nextSchedule[index] = {
      ...targetWork,
      dayId: currentWork.dayId,
      dayName: currentWork.dayName
    };
    nextSchedule[targetIdx] = {
      ...currentWork,
      dayId: targetWork.dayId,
      dayName: targetWork.dayName
    };

    persistConfig(
      { ...config, customSchedule: nextSchedule },
      `Orden actualizado: intercambiado trabajo entre ${currentWork.dayName} y ${targetWork.dayName}.`
    );
  };

  const handleUpdateDayField = (
    index: number,
    patch: Partial<(typeof config.customSchedule)[number]>
  ) => {
    const nextSchedule = config.customSchedule.map((d, idx) => {
      if (idx !== index) return d;
      const merged = { ...d, ...patch };
      if (patch.role === 'descanso_activo' && !patch.cardioType) {
        merged.cardioType = 'recuperacion_activa';
        merged.cardioDurationMinutes = 35;
      }
      if (patch.cardioType === 'ninguno') {
        merged.cardioDurationMinutes = 0;
        merged.distanceKm = 0;
        merged.elevationGainM = 0;
        merged.elevationLossM = 0;
      }
      return merged;
    });

    persistConfig({ ...config, customSchedule: nextSchedule });
  };

  const handleAutoArrangeOptimal = () => {
    const isUpperLower =
      config.experience === 'intermedio' &&
      config.daysPerWeek === 4 &&
      config.splitPreference === 'upper_lower';
    const nextSchedule = autoArrangeOptimalSchedule(
      config.customSchedule,
      config.daysPerWeek,
      isUpperLower ? 'upper_lower' : 'full_body'
    );
    persistConfig(
      { ...config, customSchedule: nextSchedule },
      `✓ Días organizados con 48 h de descanso entre sesiones de fuerza (${config.daysPerWeek} días/sem).`
    );
  };

  const handleResetSchedule = () => {
    persistConfig(
      { ...config, customSchedule: DEFAULT_CUSTOM_SCHEDULE },
      'Calendario semanal restablecido al orden base.'
    );
  };

  const activeAge = userProfile?.age && userProfile.age > 0 ? userProfile.age : 53;
  const activeWeight =
    userProfile?.currentWeightKg && userProfile.currentWeightKg > 0 ? userProfile.currentWeightKg : 102;
  const currentCycleWeekInfo = generatedProgram.weeks[activeCycleWeek - 1] || generatedProgram.weeks[0];

  const handlePrintProgram = (rangeOverride?: '2_weeks_1_2' | '2_weeks_3_4' | '4_weeks') => {
    if (rangeOverride && rangeOverride !== printRange) {
      setPrintRange(rangeOverride);
    }
    setTimeout(() => {
      window.print();
    }, 90);
  };

  const printWeeks = useMemo(() => {
    if (printRange === '2_weeks_1_2') return generatedProgram.weeks.slice(0, 2);
    if (printRange === '2_weeks_3_4') return generatedProgram.weeks.slice(2, 4);
    return generatedProgram.weeks;
  }, [generatedProgram.weeks, printRange]);

  const printableSessions = useMemo(() => {
    const seen = new Set<string>();
    const list: GeneratedSessionPlan[] = [];
    for (const day of config.customSchedule) {
      if (isStrengthRole(day.role) && !seen.has(day.role)) {
        const sess = generatedProgram.sessions[day.role];
        if (sess) {
          seen.add(day.role);
          list.push(sess);
        }
      }
    }
    if (list.length === 0) {
      list.push(generatedProgram.sessions.fuerza_a, generatedProgram.sessions.fuerza_b);
    }
    return list;
  }, [config.customSchedule, generatedProgram.sessions]);

  const environmentLabel =
    config.environment === 'gym'
      ? 'Gimnasio (6 Patrones)'
      : config.environment === 'home'
      ? 'Casa (Material + Alternativas)'
      : 'Híbrido (Gimnasio + Casa)';

  return (
    <div className="animate-in fade-in duration-200">
      <div className="space-y-6 print:hidden">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-teal-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Banner & Scientific Truth Card */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Plan Físico Personalizable: Gimnasio o Casa + Protección Articular
                </h2>
                <p className="text-xs text-slate-300">
                  Adaptado para {activeAge} años ({activeWeight} kg) ·{' '}
                  {config.environment === 'gym'
                    ? 'Gimnasio por 6 Patrones de Movimiento'
                    : config.environment === 'home'
                    ? 'Casa con Material Marcable & Alternativas Caseras'
                    : 'Híbrido (Gimnasio + Casa)'}
                </p>
              </div>
            </div>

            {/* 4-Week Cycle Switcher & 2-Week Print Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex text-xs">
                {([1, 2, 3, 4] as const).map((wk) => (
                  <button
                    key={wk}
                    onClick={() => {
                      setActiveCycleWeek(wk);
                      onChangeWeek(wk % 2 === 0 ? 2 : 1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeCycleWeek === wk
                        ? wk === 4
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {wk === 4 ? 'S4 Descarga' : `Semana ${wk}`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
                <select
                  value={printRange}
                  onChange={(e) =>
                    setPrintRange(e.target.value as '2_weeks_1_2' | '2_weeks_3_4' | '4_weeks')
                  }
                  className="bg-slate-900 text-slate-100 text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer"
                  aria-label="Periodo a imprimir"
                >
                  <option value="2_weeks_1_2">2 Semanas (S1–S2)</option>
                  <option value="2_weeks_3_4">2 Semanas (S3–S4)</option>
                  <option value="4_weeks">4 Semanas Completas</option>
                </select>
                <button
                  type="button"
                  onClick={() => handlePrintProgram()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition-colors cursor-pointer"
                  title="Imprimir programa de entrenamiento en formato limpio"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>
                    {printRange === '4_weeks' ? 'Imprimir 4 Sem' : 'Imprimir 2 Sem'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Week Focus */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className={currentCycleWeekInfo.isDeload ? 'text-amber-300' : 'text-teal-300'}>
                {currentCycleWeekInfo.label}:
              </strong>{' '}
              {currentCycleWeekInfo.progressionNote}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-900 text-teal-300 border border-slate-700 shrink-0">
              {currentCycleWeekInfo.setsMultiplierLabel} · {currentCycleWeekInfo.rirTarget}
            </span>
          </div>

          {/* Scientific Rationale Card */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between font-bold text-teal-300 mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Criterio Científico Riguroso (Corrección de Mitos & Método por Patrones)
              </span>
              <button
                onClick={() => setShowScientificRationale(!showScientificRationale)}
                className="text-slate-400 hover:text-white text-[11px] flex items-center gap-0.5 cursor-pointer"
              >
                {showScientificRationale ? 'Ocultar' : 'Ver detalle'}
                {showScientificRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showScientificRationale && (
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-300 leading-relaxed border-t border-slate-700/60 mt-1">
                <div>
                  <strong className="text-white block mb-0.5">• El core NO quema la grasa de la cintura:</strong>
                  La grasa baja con déficit calórico sostenido. El core (plancha, Pallof, dead bug) estabiliza la columna lumbar y pelvis.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">• Patrones antes que máquinas (RIR 2–3):</strong>
                  Primero estructuramos los 6 patrones (empujes, tirones, rodilla, cadera, core) y luego asignamos la máquina del gimnasio o material de casa disponible.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CUSTOMIZABLE WEEKLY SCHEDULE (IMAGEN 1 - ORGANIZA TUS DÍAS Y EL ORDEN) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Calendario de Entrenamiento Semanal ({currentCycleWeekInfo.label})
            </h3>
            <p className="text-xs text-slate-500">
              Organiza libremente tus días: usa <strong>← / →</strong> para mover bloques o activa <strong>Organizar Días</strong> para elegir qué trabajo y cardio va en cada día.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
              {scheduleStats.totalKm} km semanales
            </span>
            <span className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
              {scheduleStats.strengthCount} sesiones fuerza
            </span>
            <button
              type="button"
              onClick={() => setIsEditingSchedule(!isEditingSchedule)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                isEditingSchedule
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEditingSchedule ? 'Listo (Modo Vista)' : 'Organizar Días / Editar'}</span>
            </button>
            <button
              type="button"
              onClick={handleAutoArrangeOptimal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              title="Reparte automáticamente los días de fuerza dejando 48h de descanso entre ellos"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reparto óptimo 48h</span>
            </button>
            <button
              type="button"
              onClick={() => handlePrintProgram('2_weeks_1_2')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              title="Imprimir programa completo de 2 semanas (S1–S2)"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Imprimir 2 Semanas</span>
            </button>
            <button
              type="button"
              onClick={handleResetSchedule}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              title="Restablecer calendario por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recovery 48h Alert if consecutive strength days */}
        {consecutiveWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Aviso de recuperación (48 h):</strong> Tienes sesiones de fuerza seguidas en{' '}
              <strong>{consecutiveWarnings.join(', ')}</strong>. Para mayores de 50 o articulaciones sensibles se recomienda alternar un día sin fuerza entre medias (puedes pulsar «Reparto óptimo 48h» o mover un bloque con ← / →).
            </div>
          </div>
        )}

        {/* 7 Day Reorderable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {config.customSchedule.map((day, idx) => {
            const hasStrength = isStrengthRole(day.role);
            const isRest = day.role === 'descanso_activo';
            const linkedSession =
              hasStrength && generatedProgram.sessions[day.role]
                ? generatedProgram.sessions[day.role]
                : generatedProgram.sessions.fuerza_a;

            return (
              <div
                key={day.dayId}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                  isRest
                    ? 'bg-amber-50/70 border-amber-200 ring-1 ring-amber-300'
                    : hasStrength
                    ? 'bg-white border-teal-200 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/80'
                }`}
              >
                <div className="space-y-2">
                  {/* Day Header + Badge + Move Arrows */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 gap-1">
                    <span className="font-extrabold text-sm text-slate-900">{day.dayName}</span>
                    {isRest ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        DESCANSO
                      </span>
                    ) : hasStrength ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                        FUERZA
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        CARDIO
                      </span>
                    )}
                  </div>

                  {/* Quick Left/Right Reorder Controls */}
                  <div className="flex items-center justify-between gap-1 bg-slate-100/80 rounded-lg px-1.5 py-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleSwapDayOrder(idx, -1)}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate-700 cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                      title={`Mover trabajo al ${idx > 0 ? config.customSchedule[idx - 1].dayName : ''}`}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Mover</span>
                    </button>
                    <span className="text-[9px] text-slate-400 font-semibold">Orden #{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === config.customSchedule.length - 1}
                      onClick={() => handleSwapDayOrder(idx, 1)}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 text-slate-700 cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                      title={`Mover trabajo al ${idx < 6 ? config.customSchedule[idx + 1].dayName : ''}`}
                    >
                      <span>Mover</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Editable Mode vs Display Mode */}
                  {isEditingSchedule ? (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Trabajo principal:
                        </label>
                        <select
                          value={day.role}
                          onChange={(e) =>
                            handleUpdateDayField(idx, { role: e.target.value as DaySlotRole })
                          }
                          className="w-full px-1.5 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-semibold"
                        >
                          {Object.entries(ROLE_LABELS).map(([k, lbl]) => (
                            <option key={k} value={k}>
                              {lbl}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Cardio / Ruta:
                        </label>
                        <select
                          value={day.cardioType}
                          onChange={(e) =>
                            handleUpdateDayField(idx, { cardioType: e.target.value as DayCardioOption })
                          }
                          className="w-full px-1.5 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                        >
                          {Object.entries(CARDIO_LABELS).map(([k, lbl]) => (
                            <option key={k} value={k}>
                              {lbl}
                            </option>
                          ))}
                        </select>
                      </div>

                      {day.cardioType !== 'ninguno' && (
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="block text-[9px] text-slate-500">Minutos</label>
                            <input
                              type="number"
                              min={0}
                              max={240}
                              value={day.cardioDurationMinutes}
                              onChange={(e) =>
                                handleUpdateDayField(idx, {
                                  cardioDurationMinutes: parseInt(e.target.value, 10) || 0
                                })
                              }
                              className="w-full px-1.5 py-1 rounded border border-slate-300 text-[11px] font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500">Km</label>
                            <input
                              type="number"
                              step="0.5"
                              min={0}
                              max={80}
                              value={day.distanceKm}
                              onChange={(e) =>
                                handleUpdateDayField(idx, {
                                  distanceKm: parseFloat(e.target.value) || 0
                                })
                              }
                              className="w-full px-1.5 py-1 rounded border border-slate-300 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Cardio summary */}
                      {day.cardioType !== 'ninguno' && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            <Footprints className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{CARDIO_LABELS[day.cardioType]}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            {day.distanceKm} km · {day.cardioDurationMinutes} min
                            {day.elevationGainM > 0 && ` (+${day.elevationGainM}m / -${day.elevationLossM}m)`}
                          </div>
                        </div>
                      )}

                      {/* Clickable Strength Block showing linked 6-pattern session */}
                      {hasStrength && (
                        <button
                          type="button"
                          onClick={() => setSelectedSessionModal(linkedSession)}
                          className="w-full text-left bg-teal-50/90 hover:bg-teal-100 p-2 rounded-lg border border-teal-200 text-[10px] text-teal-950 transition-colors cursor-pointer"
                          title="Pulsa para ver los 6 patrones y ejercicios asignados"
                        >
                          <div className="font-bold flex items-center gap-1">
                            <Dumbbell className="w-3 h-3 text-teal-700 shrink-0" />
                            <span>{ROLE_LABELS[day.role]}</span>
                          </div>
                          <div className="text-teal-800 text-[9px] mt-0.5">
                            {linkedSession.patterns.length} patrones · {currentCycleWeekInfo.setsMultiplierLabel}
                          </div>
                          <div className="text-[9px] text-teal-700 font-bold underline mt-0.5">
                            Ver sesión ({config.environment === 'gym' ? 'Gimnasio' : 'Casa'}) →
                          </div>
                        </button>
                      )}

                      {/* Note */}
                      <div className="text-[10px] text-slate-600 leading-snug pt-0.5">
                        {day.note ||
                          (hasStrength
                            ? `${linkedSession.patterns.slice(0, 2).map((p) => p.exerciseName).join(' + ')}...`
                            : 'Mantener técnica suave y sin dolor articular.')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. NEW: 3-STEP GYM / HOME CONFIGURATOR (PATTERNS + MATERIAL CHECKLIST + 4-WEEK PLAN) */}
      <TrainingProgramConfigurator
        config={config}
        onChangeConfig={(next) => persistConfig(next)}
        onApplyScheduleToCalendar={(next) =>
          persistConfig(
            next,
            '✓ Programa de 4 semanas generado y repartido en tu calendario respetando 48h de descanso.'
          )
        }
      />

      {/* 4. Trail Specs & Downhill Joint Protection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Ruta de Caminata Corregida (GPS)
                </h3>
                <span className="text-[11px] text-slate-500">Datos verificados de ida y vuelta</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-600">Altitud inicial / final:</span>
                <span className="font-bold text-slate-900 font-mono">74 m</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-600">Cota máxima de la ruta:</span>
                <span className="font-bold text-slate-900 font-mono">312 m</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-900 font-semibold flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-600" /> Desnivel subida (+):
                </span>
                <span className="font-bold text-emerald-800 font-mono text-sm">+238 m neto</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="text-amber-900 font-semibold flex items-center gap-1">
                  <ArrowDown className="w-3.5 h-3.5 text-amber-600" /> Desnivel bajada (-):
                </span>
                <span className="font-bold text-amber-800 font-mono text-sm">-238 m (corregido)</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <span className="text-slate-600">Distancia total circuito:</span>
                <span className="font-bold text-slate-900 font-mono">6.9 km (70-80 min)</span>
              </div>
            </div>

            <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-[11px] leading-relaxed">
              <strong>Impacto articular ({activeWeight} kg):</strong> Bajar 238 m sin amortiguación multiplica hasta ~3.5× el peso corporal en la rodilla por zancada. Por eso priorizamos bastones y fuerza excéntrica.
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Estrategia en 3 Claves para Descenso (Protección de Rodillas)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Técnica articular para eliminar sobrecarga rotuliana en bajadas
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Protección Articular
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DOWNHILL_TECHNIQUES.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-slate-50/80 hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between text-xs transition-all"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1.5">{tech.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                      {tech.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{tech.benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3.5 p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-teal-600" />
              <strong>Alternativa cuando llueve o hay fatiga articular:</strong> 40-45 min de elíptica o bici estática (cero impacto vertical).
            </span>
          </div>
        </div>
      </div>

      {/* 5. Home Strength Exercises Bank + Link to 12 Infographics */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-teal-600" />
              Banco de Ejercicios Base con Tempo Excéntrico (6 Movimientos)
            </h3>
            <p className="text-xs text-slate-500">
              Pulsa cualquier ficha para ver técnica detallada paso a paso, tempo excéntrico (3–4 s) y progresión.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {currentCycleWeekInfo.setsMultiplierLabel}
          </span>
        </div>

        {onNavigateToInfographics && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 p-4 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <Dumbbell className="w-4 h-4" />
              </span>
              <div>
                <strong className="text-emerald-950 font-extrabold text-sm block">
                  ¿Quieres ver el Banco Completo de 12 Infografías Biomecánicas?
                </strong>
                <p className="text-slate-600 text-[11px]">
                  4 bloques funcionales (Empujes, Tirones, Tren Inferior y Core) con infografías SVG paso a paso y personalización dinámica por edad y peso.
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToInfographics}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto text-center"
            >
              Abrir Banco de 12 Infografías →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRENGTH_EXERCISES.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="bg-slate-50/70 hover:bg-teal-50/20 rounded-xl p-4 border border-slate-200 hover:border-teal-300 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                    {ex.id}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 capitalize">
                    {ex.primaryMuscle} · {ex.equipment.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1.5">{ex.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ex.jointProtectionNotes}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-800">
                    {activeCycleWeek === 1
                      ? `${ex.targetSetsWeek1} series`
                      : activeCycleWeek === 4
                      ? '1–2 series (Descarga)'
                      : `${ex.targetSetsWeek2} series`}{' '}
                    × {ex.targetReps}
                  </span>
                  <span className="text-slate-500 text-[10px]">Descanso: {ex.restSeconds}s</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] font-semibold text-teal-700 flex items-center justify-end gap-1">
                <span>Ver técnica y tempo</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Physical Profile Medical & Joint Audit */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Control Articular, Molestias EVA y Visto Bueno Médico
            </h3>
            <p className="text-xs text-slate-500">
              Si aparece dolor articular que persiste &gt;48 h, dolor agudo, mareo o falta de aire anormal: parar y ajustar la carga.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">[1] Disponibilidad Configurada:</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sesiones de fuerza:</span>
              <span className="font-bold text-teal-700">{config.daysPerWeek} días/semana</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tiempo por sesión:</span>
              <span className="font-bold text-slate-900">{config.sessionMinutes} minutos</span>
            </div>
            <p className="text-[10px] text-slate-500">Descansos 60–90 s accesorios · 90–120 s grandes.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block">[2] Material Rápido Ruta / Casa:</span>
            <div className="space-y-1 text-[11px] text-slate-700">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={physicalProfile.availableEquipment.nordicPoles}
                  onChange={(e) =>
                    onUpdatePhysicalProfile({
                      ...physicalProfile,
                      availableEquipment: { ...physicalProfile.availableEquipment, nordicPoles: e.target.checked }
                    })
                  }
                  className="accent-teal-600"
                />
                <span>Bastones marcha nórdica (clave bajadas)</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={physicalProfile.availableEquipment.resistanceBands}
                  onChange={(e) =>
                    onUpdatePhysicalProfile({
                      ...physicalProfile,
                      availableEquipment: { ...physicalProfile.availableEquipment, resistanceBands: e.target.checked }
                    })
                  }
                  className="accent-teal-600"
                />
                <span>Bandas elásticas de resistencia</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={physicalProfile.availableEquipment.firmChair}
                  onChange={(e) =>
                    onUpdatePhysicalProfile({
                      ...physicalProfile,
                      availableEquipment: { ...physicalProfile.availableEquipment, firmChair: e.target.checked }
                    })
                  }
                  className="accent-teal-600"
                />
                <span>Silla firme y esterilla</span>
              </label>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">[3] Molestias en Rodillas / Lumbares:</span>
            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Rodilla (Escala EVA):</span>
                <span className="font-bold text-amber-700">{physicalProfile.kneeDiscomfortLevel}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={physicalProfile.kneeDiscomfortLevel}
                onChange={(e) =>
                  onUpdatePhysicalProfile({
                    ...physicalProfile,
                    kneeDiscomfortLevel: parseInt(e.target.value, 10)
                  })
                }
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Lumbar:</span>
                <span className="font-bold text-teal-700">{physicalProfile.lumbarDiscomfortLevel}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={physicalProfile.lumbarDiscomfortLevel}
                onChange={(e) =>
                  onUpdatePhysicalProfile({
                    ...physicalProfile,
                    lumbarDiscomfortLevel: parseInt(e.target.value, 10)
                  })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-900 block">[4] Chequeo Médico Previo:</span>
              <label className="flex items-start gap-2 mt-1.5 text-[11px] text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={physicalProfile.medicalClearanceApproved}
                  onChange={(e) =>
                    onUpdatePhysicalProfile({
                      ...physicalProfile,
                      medicalClearanceApproved: e.target.checked
                    })
                  }
                  className="w-4 h-4 accent-emerald-600 rounded mt-0.5"
                />
                <span>
                  <strong>Chequeo médico aprobado:</strong> Especialista ha validado el plan físico para {activeAge} años ({activeWeight} kg).
                </span>
              </label>
            </div>

            <button
              onClick={() => setShowMedicalModal(true)}
              className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer self-start"
            >
              Ver recomendaciones de control médico
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Session 6-Pattern Breakdown */}
      {selectedSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-900 text-white">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500 text-slate-950">
                  {config.environment === 'gym' ? 'MODO GIMNASIO' : 'MODO CASA'} · {currentCycleWeekInfo.setsMultiplierLabel}
                </span>
                <h3 className="font-bold text-lg text-white mt-1">{selectedSessionModal.title}</h3>
                <p className="text-xs text-slate-300">
                  Estructura por patrones de movimiento · RIR 2–3 (deja 2–3 reps en recámara)
                </p>
              </div>
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-950">
                <strong>Calentamiento:</strong> {selectedSessionModal.warmup}
              </div>

              <div className="space-y-2">
                {selectedSessionModal.patterns.map((p, idx) => (
                  <div
                    key={p.patternId}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900">
                        {idx + 1}. {p.patternLabel} → <span className="text-teal-800">{p.exerciseName}</span>
                      </span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                        {currentCycleWeekInfo.isDeload ? '1–2 × 10 (Descarga)' : p.setsReps}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span><strong>Material:</strong> {p.equipmentUsed}</span>
                      {p.homemadeFallback && <span className="text-emerald-700"><strong>Casero:</strong> {p.homemadeFallback}</span>}
                      <span><strong>Descanso:</strong> {p.restSeconds} s</span>
                    </div>
                    <div className="text-[11px] text-slate-500">• {p.safetyCue}</div>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-teal-950">
                <strong>Final / Vuelta a la calma:</strong> {selectedSessionModal.cooldown}
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Exercise Details & Tempo */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-900 text-white">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500 text-slate-950">
                  {selectedExercise.id} · {selectedExercise.primaryMuscle.toUpperCase()}
                </span>
                <h3 className="font-bold text-lg text-white mt-1">{selectedExercise.name}</h3>
                <p className="text-xs text-slate-300">
                  Material requerido: {selectedExercise.equipment.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200 space-y-1.5">
                <div className="font-bold text-teal-950 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700" />
                  Prescripción de Series y Tempo Excéntrico:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded-lg border border-teal-100">
                    <span className="text-slate-500 block">Semana 1:</span>
                    <strong className="text-slate-900">{selectedExercise.targetSetsWeek1} series × {selectedExercise.targetReps}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-100">
                    <span className="text-slate-500 block">Semana 2–3 (Progresión):</span>
                    <strong className="text-teal-800">{selectedExercise.targetSetsWeek2} series × {selectedExercise.targetReps}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-teal-900 pt-1">
                  <strong>Tempo de ejecución:</strong> {selectedExercise.tempo}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">Instrucciones de Técnica Paso a Paso:</h4>
                <ol className="space-y-1.5">
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 leading-normal">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl space-y-1">
                <div className="font-bold text-teal-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Por qué protege tus rodillas y lumbares:
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedExercise.jointProtectionNotes}
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 text-[11px]">
                <strong>Criterio de Progresión:</strong> {selectedExercise.progressionTip}
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Medical Notes & Protocol */}
      {showMedicalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Control Médico y Límites de Seguridad ({activeAge} años · {activeWeight} kg)
              </h3>
              <button
                onClick={() => setShowMedicalModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Si hay hipertensión, problemas cardíacos o diabetes en tratamiento, conviene el visto bueno médico antes de iniciar o subir la intensidad:
            </p>
            <ul className="space-y-1.5 text-slate-700 pl-2">
              <li>• Electrocardiograma en reposo / prueba de esfuerzo si el médico lo estima.</li>
              <li>• Analítica reciente (Glucemia en ayunas, HbA1c, perfil lipídico y función renal).</li>
              <li>• Dolor agudo, mareo o falta de aire anormal: parar. El dolor articular &gt;48 h obliga a ajustar.</li>
            </ul>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMedicalModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* DEDICATED PRINTABLE SHEET (2-Week or 4-Week Program) */}
      <div className="hidden print:block space-y-5 text-slate-900 text-[11px] leading-snug">
        {/* Print Header */}
        <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              NutriVida · Programa de Entrenamiento Personalizado
            </p>
            <h1 className="text-xl font-extrabold text-slate-950">
              {printRange === '4_weeks'
                ? 'Ciclo Completo de 4 Semanas (Progresión + Descarga)'
                : printRange === '2_weeks_3_4'
                ? 'Programa de Entrenamiento · 2 Semanas (S3 Progresión + S4 Descarga)'
                : 'Programa de Entrenamiento · 2 Semanas (S1 Adaptación + S2 Consolidación)'}
            </h1>
            <p className="text-xs text-slate-700 mt-0.5">
              {userProfile?.name ? `${userProfile.name} · ` : ''}
              {activeAge} años · {activeWeight} kg · {environmentLabel} · {generatedProgram.structureTitle}
            </p>
          </div>
          <div className="text-right text-[10px] bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 shrink-0">
            <div className="font-bold text-slate-900">
              {scheduleStats.strengthCount} sesiones fuerza/sem · {config.sessionMinutes} min
            </div>
            <div className="text-slate-700 font-mono">
              {scheduleStats.totalKm} km cardio/sem · {scheduleStats.restCount} descanso activo
            </div>
            <div className="text-teal-800 font-bold mt-0.5">
              Regla base: RIR 2–3 · Descanso 48 h
            </div>
          </div>
        </div>

        {/* Weeks Schedule Tables (2 weeks side-by-side or stacked cleanly) */}
        <div className="space-y-4">
          {printWeeks.map((wk) => (
            <section key={wk.weekNumber} className="break-inside-avoid border border-slate-300 rounded-xl overflow-hidden">
              <div
                className={`px-3.5 py-2 border-b border-slate-300 flex items-center justify-between gap-2 ${
                  wk.isDeload ? 'bg-amber-50' : 'bg-slate-100'
                }`}
              >
                <div>
                  <h2 className="font-extrabold text-xs text-slate-950">{wk.label}</h2>
                  <p className="text-[10px] text-slate-700">{wk.progressionNote}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block font-bold text-[10px] px-2 py-0.5 rounded border border-slate-400 bg-white">
                    {wk.setsMultiplierLabel} · {wk.rirTarget}
                  </span>
                </div>
              </div>

              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 text-slate-700">
                    <th className="py-1.5 px-2.5 font-bold w-20">Día</th>
                    <th className="py-1.5 px-2.5 font-bold w-44">Bloque Principal</th>
                    <th className="py-1.5 px-2.5 font-bold w-40">Cardio / Ruta</th>
                    <th className="py-1.5 px-2.5 font-bold w-32">Volumen / Desnivel</th>
                    <th className="py-1.5 px-2.5 font-bold">Indicaciones de la Semana</th>
                  </tr>
                </thead>
                <tbody>
                  {config.customSchedule.map((day) => {
                    const hasStrength = isStrengthRole(day.role);
                    const linkedSession =
                      hasStrength && generatedProgram.sessions[day.role]
                        ? generatedProgram.sessions[day.role]
                        : null;
                    const weekPrescription = wk.isDeload
                      ? 'Descarga: 1–2 series (RIR 3–4)'
                      : wk.weekNumber === 1
                      ? 'Semana 1: técnica y rango cómodo'
                      : wk.weekNumber === 2
                      ? 'Semana 2: +1 rep por serie'
                      : 'Semana 3: +2–5% carga si tope reps';

                    return (
                      <tr key={`${wk.weekNumber}-${day.dayId}`} className="border-b border-slate-200 last:border-b-0">
                        <td className="py-1.5 px-2.5 font-extrabold text-slate-900">{day.dayName}</td>
                        <td className="py-1.5 px-2.5">
                          <span className="font-bold text-slate-900">{ROLE_LABELS[day.role]}</span>
                          {linkedSession && (
                            <span className="block text-[9px] text-slate-600">
                              {linkedSession.patterns.length} patrones · {weekPrescription}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2.5 font-medium text-slate-800">
                          {day.cardioType === 'ninguno' ? '—' : CARDIO_LABELS[day.cardioType]}
                        </td>
                        <td className="py-1.5 px-2.5 font-mono text-slate-700">
                          {day.cardioType === 'ninguno'
                            ? '—'
                            : `${day.distanceKm} km · ${day.cardioDurationMinutes} min${
                                day.elevationGainM > 0 ? ` (+${day.elevationGainM}/-${day.elevationLossM}m)` : ''
                              }`}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-700">
                          {day.note ||
                            (linkedSession
                              ? linkedSession.patterns
                                  .slice(0, 3)
                                  .map((p) => p.exerciseName)
                                  .join(' · ')
                              : 'Ritmo conversacional sin impacto articular.')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        {/* Assigned Strength Sessions Breakdown (6 Movement Patterns) */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-950 border-b border-slate-300 pb-1">
            Detalle de Sesiones de Fuerza por Patrones de Movimiento ({environmentLabel})
          </h2>

          {printableSessions.map((session) => (
            <section
              key={session.sessionKey}
              className="break-inside-avoid border border-slate-300 rounded-xl overflow-hidden"
            >
              <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-300 flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-950">{session.title}</h3>
                <span className="text-[10px] font-bold text-slate-700">
                  Duración aprox: {session.estimatedMinutes} min · Tempo excéntrico 3 s · RIR 2–3
                </span>
              </div>

              <div className="px-3.5 py-1.5 bg-emerald-50/70 border-b border-slate-200 text-[10px] text-slate-800">
                <strong>Calentamiento:</strong> {session.warmup}
              </div>

              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 text-slate-700">
                    <th className="py-1.5 px-2.5 font-bold w-36">Orden y Patrón</th>
                    <th className="py-1.5 px-2.5 font-bold w-44">Ejercicio</th>
                    <th className="py-1.5 px-2.5 font-bold w-28">Series × Reps</th>
                    <th className="py-1.5 px-2.5 font-bold w-16">Descanso</th>
                    <th className="py-1.5 px-2.5 font-bold w-44">Material / Alternativa</th>
                    <th className="py-1.5 px-2.5 font-bold">Nota Técnica</th>
                  </tr>
                </thead>
                <tbody>
                  {session.patterns.map((p, idx) => (
                    <tr key={p.patternId} className="border-b border-slate-200 last:border-b-0">
                      <td className="py-1.5 px-2.5 font-bold text-slate-800">
                        {idx + 1}. {p.patternLabel}
                      </td>
                      <td className="py-1.5 px-2.5 font-bold text-teal-900">{p.exerciseName}</td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">
                        {printRange === '2_weeks_3_4'
                          ? `${p.setsReps} (S4: 1–2×10)`
                          : p.setsReps}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-700">{p.restSeconds} s</td>
                      <td className="py-1.5 px-2.5 text-slate-700">
                        {p.equipmentUsed}
                        {p.homemadeFallback ? ` (Casero: ${p.homemadeFallback})` : ''}
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600">{p.safetyCue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-800">
                <strong>Vuelta a la calma:</strong> {session.cooldown}
              </div>
            </section>
          ))}
        </div>

        {/* Trail & Safety Footer */}
        <section className="break-inside-avoid grid grid-cols-2 gap-4 pt-1">
          <div className="border border-slate-300 rounded-xl p-3 space-y-1">
            <h3 className="font-extrabold text-xs text-slate-950">
              Caminata GPS & Protección de Rodillas
            </h3>
            <p className="text-[10px] text-slate-700">
              • Circuito base: <strong>6.9 km</strong> (70–80 min) · Altitud 74–312 m · Desnivel{' '}
              <strong>+238 m / -238 m</strong>.
            </p>
            <p className="text-[10px] text-slate-700">
              • En bajadas: usar bastones de marcha nórdica, pasos cortos y rodilla semiflexionada sin bloquear.
            </p>
            <p className="text-[10px] text-slate-700">
              • Lluvia o fatiga articular: sustituir por 40–45 min de elíptica o bici estática.
            </p>
          </div>

          <div className="border border-slate-300 rounded-xl p-3 space-y-1">
            <h3 className="font-extrabold text-xs text-slate-950">
              Reglas de Seguridad y Progresión
            </h3>
            <p className="text-[10px] text-slate-700">
              • Dejar siempre <strong>2–3 reps en reserva (RIR 2–3)</strong> y al menos 48 h entre sesiones de fuerza.
            </p>
            {generatedProgram.safetyAlerts.slice(0, 3).map((alert, i) => (
              <p key={i} className="text-[10px] text-slate-700">
                • {alert}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
