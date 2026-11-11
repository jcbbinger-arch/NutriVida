import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  Filter,
  Sliders,
  Sparkles,
  Printer,
  ChevronRight,
  User,
  Scale,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  EXERCISE_INFOGRAPHICS,
  EXERCISE_BLOCKS_METADATA,
  ExerciseBlock,
  ExerciseInfographicData
} from '../data/exerciseInfographics';
import { ExerciseSvgInfographic } from './ExerciseSvgInfographic';
import { ExerciseInfographicModal } from './ExerciseInfographicModal';

export const ExerciseInfographicsView: React.FC = () => {
  // Dynamic user age & weight controls (Defaulting to Juan's profile)
  const [age, setAge] = useState<number>(53);
  const [weightKg, setWeightKg] = useState<number>(102);

  // Active category filter: 'all' or one of the 4 functional blocks
  const [activeBlock, setActiveBlock] = useState<ExerciseBlock | 'all'>('all');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected exercise for modal
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfographicData | null>(null);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return EXERCISE_INFOGRAPHICS.filter((ex) => {
      const matchesBlock = activeBlock === 'all' || ex.block === activeBlock;
      const matchesQuery =
        searchQuery === '' ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBlock && matchesQuery;
    });
  }, [activeBlock, searchQuery]);

  // Presets
  const setPreset = (presetAge: number, presetWeight: number) => {
    setAge(presetAge);
    setWeightKg(presetWeight);
  };

  const isJuanPreset = age === 53 && weightKg === 102;

  // Dynamic global rationale based on current Age & Weight
  const globalRationale = useMemo(() => {
    if (weightKg >= 100) {
      return {
        badge: 'Protocolo de Alta Descarga Articular',
        summary:
          'Con un peso de ' +
          weightKg +
          ' kg, la prioridad absoluta es sustituir el suelo por superficies elevadas (pared o encimera en flexiones y planchas) para reducir el 40% del vector gravitatorio sobre muñecas y lumbares. En sentadilla a la silla, la bajada en 4 segundos acondiciona el tendón rotuliano sin ningún impacto de choque.',
        safetyAlert: 'Evitar ejercicios en escalón alto o flexiones en suelo horizontal hasta reducir grasa abdominal.'
      };
    } else if (age >= 60) {
      return {
        badge: 'Protocolo de Preservación Articular & Calentamiento Extendido',
        summary:
          'A los ' +
          age +
          ' años, el tejido conectivo requiere 5 minutos de calentamiento articular y descansos de 75 segundos. Énfasis prioritario en Sit-to-Stand para mantener potencia en cuádriceps y Bird-Dog para estabilidad de la columna.',
        safetyAlert: 'Movimientos fluidos sin rebotes ni bloqueos articulares secos.'
      };
    } else {
      return {
        badge: 'Protocolo Estándar de Fuerza y Recomposición',
        summary:
          'Cadencia estándar 3-1-1 con progresión de series de 2 a 3. Elementos caseros (garrafas de 3L-5L, bandas elásticas y silla firme) ofrecen el estímulo neuromuscular óptimo.',
        safetyAlert: 'Mantener la tensión diafragmática y no arquear lumbares.'
      };
    }
  }, [age, weightKg]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner & Scientific Rationale */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
                  Banco Genérico de 12 Ejercicios
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Cero Impacto Articular · Autocarga y Elementos Caseros
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Infografías Biomecánicas de Fuerza en Casa
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                4 bloques funcionales equilibrados (Empujes, Tirones, Tren Inferior y Core) diseñados para entrenar
                todo el cuerpo de forma segura utilizando una silla, garrafas de agua, pared o banda elástica.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
              title="Imprimir compendio de infografías"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Infografías</span>
            </button>
          </div>

          {/* DYNAMIC AGE & WEIGHT PERSONALIZATION CONTROL PANEL */}
          <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Personalización Dinámica por Edad y Peso del Individuo:</span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                <button
                  onClick={() => setPreset(53, 102)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isJuanPreset
                      ? 'bg-teal-500 text-slate-950 shadow-xs ring-2 ring-teal-400/50'
                      : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  👤 Juan (53a · 102 kg)
                </button>
                <button
                  onClick={() => setPreset(35, 75)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    age === 35 && weightKg === 75
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Joven (35a · 75 kg)
                </button>
                <button
                  onClick={() => setPreset(68, 68)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    age === 68 && weightKg === 68
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Senior (68a · 68 kg)
                </button>
                <button
                  onClick={() => setPreset(48, 92)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    age === 48 && weightKg === 92
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Sobrepeso (48a · 92 kg)
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age Slider */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    Edad del Individuo:
                  </span>
                  <span className="font-extrabold text-teal-300 font-mono text-sm">
                    {age} años
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="85"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>20 años</span>
                  <span>53 años (Juan)</span>
                  <span>85 años</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                    Peso Corporal:
                  </span>
                  <span className="font-extrabold text-teal-300 font-mono text-sm">
                    {weightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50 kg</span>
                  <span>102 kg (Juan)</span>
                  <span>140 kg</span>
                </div>
              </div>
            </div>

            {/* Live Diagnosis Banner for current values */}
            <div className="bg-teal-950/40 p-3.5 rounded-xl border border-teal-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-300">{globalRationale.badge}</span>
                  <span className="text-[11px] text-slate-300 font-mono">
                    ({age}a · {weightKg}kg)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {globalRationale.summary}
                </p>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0 self-start sm:self-auto">
                {globalRationale.safetyAlert}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Universal Prescription Banner (Standards from user prompt) */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Pautas Estándar de Prescripción Universal (NutriVida)
              </h3>
              <p className="text-[11px] text-slate-500">
                Criterios de seguridad articular y efectividad neuromuscular
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Frecuencia Semanal</span>
              <span className="font-extrabold text-slate-900 text-xs">3 a 4 días / semana</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Series y Repeticiones</span>
              <span className="font-extrabold text-teal-800 text-xs">2 a 3 series × 10-12 reps</span>
              <span className="text-[9px] text-slate-400 block">(20-30s en isométricos)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Descanso entre Series</span>
              <span className="font-extrabold text-slate-900 text-xs">60 segundos completos</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filters Toolbar: 4 Functional Blocks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Block buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveBlock('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              activeBlock === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            Todos ({EXERCISE_INFOGRAPHICS.length})
          </button>

          {EXERCISE_BLOCKS_METADATA.map((block) => (
            <button
              key={block.id}
              onClick={() => setActiveBlock(block.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeBlock === block.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{block.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({block.count})</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ejercicio o músculo..."
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-600 bg-white"
          />
        </div>
      </div>

      {/* 4. 12 Exercises Infographic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((exercise) => {
          const specificAdvice = exercise.adaptations.getSpecificAdvice(age, weightKg);

          return (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top: Header & Block */}
              <div>
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2 bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900">
                        {exercise.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {exercise.equipment}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                      {exercise.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {exercise.jointSafety.protectedJoint.split('(')[0]}
                  </span>
                </div>

                {/* SVG Visual Biomechanical Infographic Diagram */}
                <div className="p-3 bg-white">
                  <div
                    onClick={() => setSelectedExercise(exercise)}
                    className="cursor-pointer transition-transform hover:scale-[1.01]"
                    title="Haz clic para ampliar la infografía a tamaño completo"
                  >
                    <ExerciseSvgInfographic exerciseId={exercise.id} size="md" />
                  </div>
                </div>

                {/* Card Content: Technique & Target Muscles */}
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Enfoque & Técnica Clave
                    </span>
                    <p className="text-slate-700 leading-snug line-clamp-2">
                      {exercise.focus}
                    </p>
                  </div>

                  {/* Muscles tags */}
                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles.map((m, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* DYNAMIC AGE & WEIGHT ADAPTATION BOX */}
                  <div className="bg-teal-50/80 rounded-xl p-2.5 border border-teal-200/70 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-teal-950">
                      <span>Ajuste a {age}a · {weightKg}kg:</span>
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-teal-200 text-teal-900">
                        {specificAdvice.levelTag}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-teal-900 leading-tight">
                      {specificAdvice.angleRecommendation}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {exercise.standardPrescription.setsAndReps}
                    </span>
                    <span>Descanso: 60s</span>
                  </div>
                </div>
              </div>

              {/* Card Action Button */}
              <div className="p-3 bg-slate-50/60 border-t border-slate-100">
                <button
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Ver Infografía Completa & Ficha Técnica</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Comprehensive Full-Screen Infographic Poster Modal */}
      <ExerciseInfographicModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        userAge={age}
        userWeightKg={weightKg}
      />
    </div>
  );
};
