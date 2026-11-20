import React, { useState, useMemo } from 'react';
import {
  Target,
  Flame,
  Dumbbell,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Activity,
  Apple,
  ShieldCheck,
  HeartPulse,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types/nutrition';
import { evaluateNutritionPlan, getScalingTierInfo } from '../services/nutritionCalculator';

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

  const scaleFactor = profile.scaleFactor || 1;
  const scalingTier = useMemo(() => getScalingTierInfo(scaleFactor), [scaleFactor]);

  const evalInfo = useMemo(() => {
    if (!profile.age || !profile.heightCm || !profile.currentWeightKg) return null;
    return evaluateNutritionPlan({
      sex: profile.sex || 'male',
      age: profile.age,
      heightCm: profile.heightCm,
      weightKg: profile.currentWeightKg,
      activityFactor: profile.activityFactor || 1.4,
      goalType: profile.goalType || 'lose',
      deficitPercent: profile.deficitPercent || 22,
      customTargetCalories: profile.targetCalories,
      weeklyLossTargetKg: profile.weeklyLossTargetKg || 0.6,
      redFlags: profile.redFlags || [],
      medicalConditions: profile.medicalConditions || []
    });
  }, [profile]);

  const sexLabel = profile.sex === 'female' ? 'Mujer' : 'Hombre';
  const heightDisplay = profile.heightCm > 0 ? `${(profile.heightCm / 100).toFixed(2)} m` : '-- m';
  const weightDisplay = profile.currentWeightKg > 0 ? `${profile.currentWeightKg} kg` : '-- kg';
  const bmiDisplay = profile.bmi && profile.bmi > 0 ? profile.bmi : evalInfo?.bmi || '--';
  const safetyFloor = profile.sex === 'female' ? 1250 : 1500;
  const deficitDelta = (profile.tdee || 0) - (profile.targetCalories || 1750);
  const waterLiters = ((profile.targetWaterMl || 2500) / 1000).toFixed(1);

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
                Plan 30 Días · Factor ×{scaleFactor.toFixed(2)}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {profile.name ? `${profile.name} · ` : ''}
                {sexLabel} · {profile.age > 0 ? `${profile.age} años` : '-- años'} · {heightDisplay} · {weightDisplay}{' '}
                (IMC {bmiDisplay})
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {profile.goalType === 'maintain'
                ? 'Objetivo: Mantener peso y rendimiento preservando masa muscular'
                : profile.goalType === 'gain'
                ? 'Objetivo: Ganar masa muscular (+10% superávit controlado) + fuerza'
                : `Objetivo: Perder grasa y cintura (${(profile.weeklyLossTargetKg || 0.6).toFixed(1)} kg/sem) preservando músculo`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Objetivo personalizado de <strong>~{profile.targetCalories || 1750} kcal/día</strong>{' '}
              {profile.tdee > 0 && (
                <>
                  ({deficitDelta >= 0 ? `déficit ~${deficitDelta} kcal` : `superávit +${Math.abs(deficitDelta)} kcal`}{' '}
                  sobre <strong>{profile.tdee} kcal</strong> TDEE, suelo {safetyFloor.toLocaleString('es-ES')} kcal)
                </>
              )}
              , <strong>{profile.targetProteinMin}–{profile.targetProteinMax} g proteína/día</strong>,{' '}
              <strong>≥{profile.targetFiberDailyG || 30} g fibra</strong>,{' '}
              <strong>{waterLiters} L agua</strong> · 2–3× pescado azul · 2–3× legumbres · 0% alcohol.
            </p>
            <p className="text-[11px] text-emerald-300/90 font-medium">
              <strong>Escalado activo ({scalingTier.label}):</strong> {scalingTier.instruction}
            </p>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                Objetivo Kcal
              </div>
              <div className="text-lg font-black text-white">
                ~{profile.targetCalories || 1750} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.tdee > 0 ? `TDEE ${profile.tdee} · ×${scaleFactor.toFixed(2)}` : `Factor ×${scaleFactor.toFixed(2)}`}
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-teal-400 mb-0.5">
                <Dumbbell className="w-3.5 h-3.5" />
                Proteína Diaria
              </div>
              <div className="text-lg font-black text-white">
                {profile.targetProteinMin}-{profile.targetProteinMax}{' '}
                <span className="text-xs font-normal text-slate-400">g</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {evalInfo?.usedAdjustedWeight ? `Peso ajustado ${profile.adjustedWeightKg} kg` : 'Proteína intacta'}
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-400 mb-0.5">
                <Apple className="w-3.5 h-3.5" />
                Fibra & Macros
              </div>
              <div className="text-lg font-black text-white">
                ≥{profile.targetFiberDailyG || 30} <span className="text-xs font-normal text-slate-400">g fibra</span>
              </div>
              <div className="text-[10px] text-emerald-400">
                {profile.targetFatGrams || 58}g G · {profile.targetCarbsGrams || 185}g HC
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 mb-0.5">
                <Droplets className="w-3.5 h-3.5" />
                Agua & Ritmo
              </div>
              <div className="text-lg font-black text-white">
                {waterLiters} <span className="text-xs font-normal text-slate-400">L/día</span>
              </div>
              <div className="text-[10px] text-emerald-400">Pesar 1×/sem · Cintura c/2 sem</div>
            </div>
          </div>
        </div>

        {/* Clinical Referral Alert if Red Flags / Below Floor */}
        {evalInfo?.requiresSpecialistReferral && (
          <div className="mt-3 bg-rose-500/20 border border-rose-400/50 rounded-xl px-3 py-2 text-[11px] text-rose-100 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <div>
              <strong>Derivación / Supervisión clínica recomendada:</strong>{' '}
              {evalInfo.clinicalReferralReasons.join(' · ')}
            </div>
          </div>
        )}

        {/* Clinical Validation Disclaimer */}
        <div className="mt-3 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2 text-[11px] text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <span>
            <strong>Orientación clínica:</strong> Las fórmulas estiman con ~±10% de margen. Pesa en crudo, revisa peso 1×/sem y cintura cada 2 sem; si en 2–3 semanas no hay cambios, ajusta ±100–150 kcal (harinas/grasas antes que proteína). Con patologías o medicación, valida el plan con tu médico o dietista.
          </span>
        </div>

        {/* Expandable details button */}
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              Reglas clave:
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">D↔D · M↔M · C↔C · ME↔ME · N↔N</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">No 2 pescados/día</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Entreno duro +40g pan/+1 fruta</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">Batch Domingo + Miércoles</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToTracking && (
              <button
                onClick={onNavigateToTracking}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-1 px-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>
                  📈 Ficha de Mediciones ({profile.currentWeightKg > 0 ? `${profile.currentWeightKg} kg` : '-- kg'}
                  {profile.waistCm ? ` · ${profile.waistCm} cm` : ''})
                </span>
              </button>
            )}
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="text-emerald-300 hover:text-white underline underline-offset-2 py-1 px-2 text-xs cursor-pointer"
              >
                Editar perfil (5 pasos)
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800 cursor-pointer"
            >
              <span>{isExpanded ? 'Ocultar reglas del plan' : 'Ver reglas y progresión'}</span>
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
                1. Intercambio & Horarios
              </div>
              <p className="text-slate-400 leading-normal">
                Cambia platos dentro de la misma toma (D↔D, M↔M, C↔C, ME↔ME, N↔N) o mueve días enteros. Mantén ~3–4 h entre tomas y si saltas una toma no la compenses.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                2. Escalado & Mesetas
              </div>
              <p className="text-slate-400 leading-normal">
                No bajes del suelo de seguridad ({safetyFloor} kcal). Las calorías se escalan con arroz, pasta, patata, pan, aceite y frutos secos sin bajar proteína. Si te estancas 2–3 semanas, ajusta ±100–150 kcal.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-amber-400" />
                3. Sin Antojos + Domingo LIBRE
              </div>
              <p className="text-slate-400 leading-normal">
                Media mañana y cena ya aportan proteína para evitar dulces a las 11:00 o galletas nocturnas. Domingo mediodía libre para disfrutar sin culpa ni compensación.
              </p>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                4. Batch Doble & Cadena de Frío
              </div>
              <p className="text-slate-400 leading-normal">
                Cocina legumbres, arroz y patatas el domingo y el miércoles. Enfría en recipientes poco profundos en &lt;2 h a ≤4 °C (máx. 3 días en nevera, congela el resto).
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

