import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Wind,
  Layers,
  Printer,
  X,
  Sparkles,
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';
import { ExerciseInfographicData } from '../data/exerciseInfographics';
import { ExerciseSvgInfographic } from './ExerciseSvgInfographic';

interface ExerciseInfographicModalProps {
  exercise: ExerciseInfographicData | null;
  onClose: () => void;
  userAge: number;
  userWeightKg: number;
}

export const ExerciseInfographicModal: React.FC<ExerciseInfographicModalProps> = ({
  exercise,
  onClose,
  userAge,
  userWeightKg
}) => {
  if (!exercise) return null;

  const currentAdvice = exercise.adaptations.getSpecificAdvice(userAge, userWeightKg);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Poster Top */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950">
                  {exercise.id}
                </span>
                <span className="text-xs font-semibold text-teal-300">
                  {exercise.blockName}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/15">
                  Material: {exercise.equipment}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {exercise.name}
              </h2>
              <p className="text-xs text-slate-300">
                {exercise.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Imprimir Infografía"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Personalized Pill for Current Age & Weight */}
          <div className="mt-4 pt-3 border-t border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                Adaptación personalizada para tu perfil:
              </span>
              <strong className="text-teal-300 font-bold bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                {userAge} años · {userWeightKg} kg
              </strong>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 self-start sm:self-auto">
              {currentAdvice.levelTag}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* 1. Large Visual Vector SVG Infographic */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Esquema Biomecánico & Ángulos de Seguridad
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {exercise.jointSafety.protectedJoint}
              </span>
            </div>
            <div className="shadow-xs rounded-2xl overflow-hidden border border-slate-200">
              <ExerciseSvgInfographic exerciseId={exercise.id} size="lg" />
            </div>
          </div>

          {/* 2. Personalization Box according to Age & Weight */}
          <div className="bg-teal-50/70 border-2 border-teal-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-teal-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                Prescripción Exacta para {userAge} años y {userWeightKg} kg
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-200 text-teal-900 px-2 py-0.5 rounded">
                Ajuste Biomecánico
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-teal-100 space-y-1">
                <span className="text-slate-500 text-[11px] block font-semibold">Ángulo / Superficie Recomendada:</span>
                <p className="font-bold text-slate-900 leading-snug">{currentAdvice.angleRecommendation}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-teal-100 space-y-1">
                <span className="text-slate-500 text-[11px] block font-semibold">Dosis y Repeticiones:</span>
                <p className="font-bold text-teal-900 leading-snug">{currentAdvice.tempoAndReps}</p>
              </div>
            </div>

            <div className="bg-teal-900/10 p-3 rounded-xl border border-teal-200/60 text-[11px] text-teal-950 space-y-1">
              <p><strong>Criterio de compensación de peso:</strong> {currentAdvice.weightCompensationNote}</p>
              <p className="text-teal-900 font-medium">⚠️ <strong>Advertencia articular:</strong> {currentAdvice.specialWarning}</p>
            </div>
          </div>

          {/* 3. Technique & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-600" />
                Instrucciones Técnicas
              </h4>
              <p className="text-slate-700 leading-relaxed text-xs">
                {exercise.technique}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <strong className="text-slate-900">Enfoque:</strong> {exercise.focus}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-600" />
                Músculos Diana
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Músculos Principales (Agonistas):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.primaryMuscles.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Sinergistas y Estabilizadores:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700 font-medium text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tempo & Breathing Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tempo */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Tempo y Prescripción Universal</span>
              </div>
              <p className="text-xs font-semibold text-teal-800 bg-white p-2.5 rounded-xl border border-slate-200">
                {exercise.tempo}
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                <li>• <strong>Frecuencia:</strong> {exercise.standardPrescription.frequency}</li>
                <li>• <strong>Series y Reps:</strong> {exercise.standardPrescription.setsAndReps}</li>
                <li>• <strong>Descanso:</strong> {exercise.standardPrescription.rest}</li>
              </ul>
            </div>

            {/* Breathing */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-950">
                <Wind className="w-4 h-4 text-sky-600" />
                <span>Patrón Respiratorio Protector</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div className="bg-white p-2 rounded-xl border border-sky-100">
                  <strong className="text-sky-800">🌬️ Inhalar:</strong> {exercise.breathing.inhale}
                </div>
                <div className="bg-white p-2 rounded-xl border border-sky-100">
                  <strong className="text-teal-800">💨 Exhalar:</strong> {exercise.breathing.exhale}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Articular Stoplight (Green vs Red flags) */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 text-xs flex items-center justify-between">
              <span>Semáforo Articular y Sensaciones</span>
              <span className="text-[10px] text-slate-500">¿Qué debes notar?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="p-3.5 bg-emerald-50/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sensación Óptima (Luz Verde):</span>
                </div>
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  Quemazón o fatiga localizada en el vientre muscular activo. Tensión firme y controlada sin ningún pinchazo en tendones.
                </p>
              </div>

              <div className="p-3.5 bg-rose-50/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Señal de Alarma (Luz Roja):</span>
                </div>
                <p className="text-[11px] text-rose-950 leading-relaxed">
                  Dolor punzante, chasquido doloroso o pinchazo en rodilla, espalda baja u hombro. <strong>Parar de inmediato</strong> y aumentar la inclinación o el apoyo de descarga.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Common Errors to Avoid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              Errores Comunes a Evitar:
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-700">
              {exercise.commonErrors.map((err, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            NutriVida · Banco Genérico de Fuerza en Casa
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
