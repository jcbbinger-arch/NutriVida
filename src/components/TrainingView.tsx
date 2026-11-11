import React, { useState } from 'react';
import {
  Activity,
  Dumbbell,
  ShieldCheck,
  Mountain,
  Compass,
  ArrowDown,
  ArrowUp,
  Heart,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  Footprints,
  RotateCcw
} from 'lucide-react';
import {
  WEEK_1_TRAINING_PLAN,
  WEEK_2_TRAINING_PLAN,
  TRAIL_ROUTE_SPECS,
  DOWNHILL_TECHNIQUES,
  STRENGTH_EXERCISES
} from '../data/trainingDatabase';
import { Exercise, PhysicalProfile } from '../types/training';

interface TrainingViewProps {
  physicalProfile: PhysicalProfile;
  onUpdatePhysicalProfile: (updated: PhysicalProfile) => void;
  activeWeekNumber: 1 | 2;
  onChangeWeek: (w: 1 | 2) => void;
  onNavigateToInfographics?: () => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  physicalProfile,
  onUpdatePhysicalProfile,
  activeWeekNumber,
  onChangeWeek,
  onNavigateToInfographics
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showScientificRationale, setShowScientificRationale] = useState(true);

  const activePlan = activeWeekNumber === 1 ? WEEK_1_TRAINING_PLAN : WEEK_2_TRAINING_PLAN;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
                  Plan Físico: Cardio con Desnivel, Fuerza & Protección Articular
                </h2>
                <p className="text-xs text-slate-300">
                  Adaptado para 53 años (102 kg) · Prioridad absoluta: proteger rodillas y zona lumbar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex text-xs">
                <button
                  onClick={() => onChangeWeek(1)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeWeekNumber === 1 ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semana 1 (Adaptación)
                </button>
                <button
                  onClick={() => onChangeWeek(2)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeWeekNumber === 2 ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semana 2 (Progresión)
                </button>
              </div>
            </div>
          </div>

          {/* Scientific Rationale Card Addressing Juan's Point 1 */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between font-bold text-teal-300 mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Criterio Científico Riguroso (Corrección de Mitos)
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
                  La grasa corporal baja de forma general con el déficit calórico sostenido. El entrenamiento de core fortalece la faja muscular interna (transverso y multífidos) para estabilizar la columna lumbar y pelvis, evitando lumbalgias.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">• Eliminar dulces y picos de glucosa:</strong>
                  Funciona principalmente porque suprime calorías vacías, líquidas y de alta densidad que inducen hambre desmedida, no por un mecanismo mágico de lipólisis selectiva.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Trail Specs & Downhill Joint Protection (Point 2 and Downhill ideas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Trail Specs with Verified Elevation */}
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
              <strong>Impacto articular a 102 kg:</strong> Bajar 238 m sin amortiguación supone hasta ~350 kg de choque en la articulación femororrotuliana por zancada. Por eso las bajadas son el punto crítico a cuidar.
            </div>
          </div>
        </div>

        {/* Right 2 cols: 3 Downhill Key Protection Ideas */}
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
                    Propuestas concretas de Juan para eliminar el dolor rotuliano
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Crucial para 102 kg
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
              <strong>Alternativa cuando llueve o hay fatiga articular:</strong> 40-45 min de elíptica (cero impacto vertical).
            </span>
          </div>
        </div>
      </div>

      {/* 3. Weekly Schedule (7 Days with Rest / Active Recovery Day) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Calendario de Entrenamiento Semanal ({activePlan.title})
            </h3>
            <p className="text-xs text-slate-500">
              Caminatas diarias + 3 sesiones de fuerza adaptada + <strong>1 Día de Descanso Activo</strong> para reparación de tejidos
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
              {activePlan.totalWeeklyKm} km semanales
            </span>
            <span className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
              {activePlan.strengthSessionsCount} sesiones de fuerza
            </span>
          </div>
        </div>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {activePlan.days.map((day) => (
            <div
              key={day.dayId}
              className={`p-3.5 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                day.isRestOrActiveRecovery
                  ? 'bg-amber-50/70 border-amber-200 ring-1 ring-amber-300'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                  <span className="font-extrabold text-sm text-slate-900">{day.dayName}</span>
                  {day.isRestOrActiveRecovery ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                      DESCANSO
                    </span>
                  ) : day.hasStrengthSession ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      FUERZA + CARDIO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      CARDIO
                    </span>
                  )}
                </div>

                {/* Cardio description */}
                <div className="mb-2">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                    {day.cardioType === 'caminata_desnivel'
                      ? 'Caminata Desnivel'
                      : day.cardioType === 'eliptica_suave'
                      ? 'Elíptica Suave'
                      : day.cardioType === 'recuperacion_activa'
                      ? 'Paseo Llano Suave'
                      : 'Paseo Dominical'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {day.distanceKm} km · {day.cardioDurationMinutes} min
                    {day.elevationGainM > 0 && ` (+${day.elevationGainM}m / -${day.elevationLossM}m)`}
                  </div>
                </div>

                {/* Strength session tag if present */}
                {day.hasStrengthSession && (
                  <div className="bg-teal-50/80 p-2 rounded-lg border border-teal-200/70 text-[10px] text-teal-950 mb-2">
                    <div className="font-bold flex items-center gap-1">
                      <Dumbbell className="w-3 h-3 text-teal-700" />
                      {day.strengthSessionName}
                    </div>
                    <div className="text-teal-800 text-[9px] mt-0.5">
                      {activeWeekNumber === 1 ? '2 series x 10-12 reps' : '3 series x 10-12 reps'}
                    </div>
                  </div>
                )}

                {/* Joint note */}
                <div className="text-[10px] text-slate-600 leading-snug pt-1">
                  {day.jointFocusTip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Home Strength Exercises Bank (6 Targeted Exercises with Excentric Tempo) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-teal-600" />
              Banco de Ejercicios de Fuerza en Casa (6 Movimientos Adaptados)
            </h3>
            <p className="text-xs text-slate-500">
              Enfocados en cuádriceps, glúteos, core y espalda con fase excéntrica lenta (3-4 segundos).
            </p>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            Semana {activeWeekNumber}: {activeWeekNumber === 1 ? '2 Series x Ejercicio' : '3 Series x Ejercicio (Progresión)'}
          </span>
        </div>

        {/* Banner linking to full 12 exercises infographics */}
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
                    {activeWeekNumber === 1 ? `${ex.targetSetsWeek1} series` : `${ex.targetSetsWeek2} series`} × {ex.targetReps}
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

      {/* 5. Physical Profile Questionnaire (Juan's 4 Checkboxes) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Datos Clave para la Progresión del Plan Físico (Auditoría Juan)
            </h3>
            <p className="text-xs text-slate-500">
              Verificación de disponibilidad, material, molestias articulares y visto bueno médico.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Días y Tiempo */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">[1] Disponibilidad Fuerza:</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sesiones semanales:</span>
              <span className="font-bold text-teal-700">{physicalProfile.strengthDaysAvailable} días/semana</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tiempo por sesión:</span>
              <span className="font-bold text-slate-900">{physicalProfile.sessionMinutesAvailable} minutos</span>
            </div>
            <p className="text-[10px] text-slate-500">Suficiente para 6 ejercicios con descansos de 60 segundos.</p>
          </div>

          {/* 2. Material Disponible */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block">[2] Material Disponible en Casa:</span>
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

          {/* 3. Molestias Actuales */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">[3] Molestias en Rodillas / Lumbares:</span>
            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Rodilla (Escala EVA):</span>
                <span className="font-bold text-amber-700">{physicalProfile.kneeDiscomfortLevel}/10 (Leve en bajadas)</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={physicalProfile.kneeDiscomfortLevel}
                onChange={(e) =>
                  onUpdatePhysicalProfile({
                    ...physicalProfile,
                    kneeDiscomfortLevel: parseInt(e.target.value)
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
                    lumbarDiscomfortLevel: parseInt(e.target.value)
                  })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Visto Bueno Médico */}
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
                  <strong>Chequeo médico aprobado:</strong> Médico o especialista ha validado el plan de actividad y control de glucemia a los 53 años (102 kg).
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
              {/* Tempo & Prescription */}
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
                    <span className="text-slate-500 block">Semana 2 (Progresión):</span>
                    <strong className="text-teal-800">{selectedExercise.targetSetsWeek2} series × {selectedExercise.targetReps}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-teal-900 pt-1">
                  <strong>Tempo de ejecución:</strong> {selectedExercise.tempo}
                </div>
              </div>

              {/* Instructions */}
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

              {/* Joint Protection Notes */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl space-y-1">
                <div className="font-bold text-teal-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Por qué protege tus rodillas y lumbares:
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedExercise.jointProtectionNotes}
                </p>
              </div>

              {/* Progression criteria */}
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
                Control Médico a los 53 años (102 kg)
              </h3>
              <button
                onClick={() => setShowMedicalModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Como indica Juan con acierto, a los 53 años con 102 kg y control de glucosa, antes de elevar la intensidad de caminatas y fuerza se debe contar con:
            </p>
            <ul className="space-y-1.5 text-slate-700 pl-2">
              <li>• Electrocardiograma en reposo / prueba de esfuerzo si el médico lo estima.</li>
              <li>• Analítica reciente (Glucemia en ayunas, HbA1c, perfil lipídico HDL/LDL/triglicéridos y función renal).</li>
              <li>• Ajuste de medicación si la pérdida de peso mejora la sensibilidad a la insulina o la tensión arterial.</li>
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
  );
};
