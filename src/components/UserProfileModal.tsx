import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  User,
  ShieldAlert,
  Check,
  Scale,
  HeartPulse,
  Sparkles,
  Plus,
  Trash2,
  Calculator,
  Droplets,
  Layers,
  RotateCcw,
  AlertTriangle,
  Activity
} from 'lucide-react';
import {
  ActivityFactorOption,
  CookingHabitOption,
  GoalTypeOption,
  JobTypeOption,
  SexOption,
  UserProfile
} from '../types/nutrition';
import {
  ACTIVITY_FACTOR_OPTIONS,
  CLINICAL_RED_FLAG_OPTIONS,
  MEDICAL_CONDITION_OPTIONS,
  buildEmptyUserProfile,
  evaluateNutritionPlan
} from '../services/nutritionCalculator';
import { DEFAULT_USER_PROFILE } from '../data/database';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  isFirstTimeOnboarding?: boolean;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onResetProfileToZero?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  isFirstTimeOnboarding = false,
  onSaveProfile,
  onResetProfileToZero
}) => {
  const [name, setName] = useState(profile.name || '');
  const [sex, setSex] = useState<SexOption>(profile.sex || 'male');
  const [ageStr, setAgeStr] = useState(profile.age > 0 ? String(profile.age) : '');
  const [heightStr, setHeightStr] = useState(profile.heightCm > 0 ? String(profile.heightCm) : '');
  const [weightStr, setWeightStr] = useState(profile.currentWeightKg > 0 ? String(profile.currentWeightKg) : '');
  const [targetWeightStr, setTargetWeightStr] = useState(
    profile.targetWeightKg > 0 ? String(profile.targetWeightKg) : ''
  );
  const [waistStr, setWaistStr] = useState(profile.waistCm ? String(profile.waistCm) : '');

  const [activityFactor, setActivityFactor] = useState<ActivityFactorOption>(profile.activityFactor || 1.4);
  const [dailyStepsStr, setDailyStepsStr] = useState(
    profile.dailyStepsTarget ? String(profile.dailyStepsTarget) : '8000'
  );
  const [trainingDaysStr, setTrainingDaysStr] = useState(
    profile.trainingDaysPerWeek !== undefined ? String(profile.trainingDaysPerWeek) : '3'
  );
  const [jobType, setJobType] = useState<JobTypeOption>(profile.jobType || 'sedentario');
  const [workSchedule, setWorkSchedule] = useState(profile.workSchedule || '09:00 - 18:00');
  const [cooksAtHome, setCooksAtHome] = useState<CookingHabitOption>(profile.cooksAtHome || 'cocina');

  const [goalType, setGoalType] = useState<GoalTypeOption>(profile.goalType || 'lose');
  const [deficitPercent, setDeficitPercent] = useState<number>(profile.deficitPercent || 22);
  const [weeklyLossTarget, setWeeklyLossTarget] = useState<number>(profile.weeklyLossTargetKg || 0.6);
  const [customCalories, setCustomCalories] = useState<number | null>(
    profile.onboardingCompleted ? profile.targetCalories : null
  );

  const [medicalConditions, setMedicalConditions] = useState<string[]>(profile.medicalConditions || []);
  const [redFlags, setRedFlags] = useState<string[]>(profile.redFlags || []);
  const [excludedFoods, setExcludedFoods] = useState<string[]>(profile.excludedFoods || []);
  const [newExcludedFood, setNewExcludedFood] = useState('');
  const [preferencesNotes, setPreferencesNotes] = useState(profile.preferencesNotes || '');
  const [currentBreakfast, setCurrentBreakfast] = useState(profile.currentBreakfast || '');
  const [hasFlexibleMeal, setHasFlexibleMeal] = useState<boolean>(profile.hasFlexibleMeal ?? true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync local state whenever modal opens or profile prop updates
  useEffect(() => {
    if (!isOpen) return;
    setName(profile.name || '');
    setSex(profile.sex || 'male');
    setAgeStr(profile.age > 0 ? String(profile.age) : '');
    setHeightStr(profile.heightCm > 0 ? String(profile.heightCm) : '');
    setWeightStr(profile.currentWeightKg > 0 ? String(profile.currentWeightKg) : '');
    setTargetWeightStr(profile.targetWeightKg > 0 ? String(profile.targetWeightKg) : '');
    setWaistStr(profile.waistCm ? String(profile.waistCm) : '');
    setActivityFactor(profile.activityFactor || 1.4);
    setDailyStepsStr(profile.dailyStepsTarget ? String(profile.dailyStepsTarget) : '8000');
    setTrainingDaysStr(profile.trainingDaysPerWeek !== undefined ? String(profile.trainingDaysPerWeek) : '3');
    setJobType(profile.jobType || 'sedentario');
    setWorkSchedule(profile.workSchedule || '09:00 - 18:00');
    setCooksAtHome(profile.cooksAtHome || 'cocina');
    setGoalType(profile.goalType || 'lose');
    setDeficitPercent(profile.deficitPercent || 22);
    setWeeklyLossTarget(profile.weeklyLossTargetKg || 0.6);
    setCustomCalories(profile.onboardingCompleted ? profile.targetCalories : null);
    setMedicalConditions(profile.medicalConditions || []);
    setRedFlags(profile.redFlags || []);
    setExcludedFoods(profile.excludedFoods || []);
    setPreferencesNotes(profile.preferencesNotes || '');
    setCurrentBreakfast(profile.currentBreakfast || '');
    setHasFlexibleMeal(profile.hasFlexibleMeal ?? true);
    setFormError(null);
  }, [isOpen, profile]);

  const numericAge = parseFloat(ageStr) || 0;
  const numericHeight = parseFloat(heightStr) || 0;
  const numericWeight = parseFloat(weightStr) || 0;
  const hasBasicNumbers = numericAge >= 10 && numericHeight >= 100 && numericWeight >= 30;

  const evaluation = useMemo(() => {
    return evaluateNutritionPlan({
      sex,
      age: hasBasicNumbers ? numericAge : 40,
      heightCm: hasBasicNumbers ? numericHeight : 170,
      weightKg: hasBasicNumbers ? numericWeight : 70,
      activityFactor,
      goalType,
      deficitPercent,
      customTargetCalories: customCalories ?? undefined,
      weeklyLossTargetKg: weeklyLossTarget,
      redFlags,
      medicalConditions
    });
  }, [
    sex,
    hasBasicNumbers,
    numericAge,
    numericHeight,
    numericWeight,
    activityFactor,
    goalType,
    deficitPercent,
    customCalories,
    weeklyLossTarget,
    redFlags,
    medicalConditions
  ]);

  if (!isOpen) return null;

  const handleLoadPreset = (preset: 'empty' | 'male_demo' | 'female_demo') => {
    setFormError(null);
    if (preset === 'empty') {
      const blank = buildEmptyUserProfile();
      setName('');
      setSex('male');
      setAgeStr('');
      setHeightStr('');
      setWeightStr('');
      setTargetWeightStr('');
      setWaistStr('');
      setActivityFactor(1.4);
      setDailyStepsStr('8000');
      setTrainingDaysStr('3');
      setJobType('sedentario');
      setWorkSchedule('09:00 - 18:00');
      setCooksAtHome('cocina');
      setGoalType('lose');
      setDeficitPercent(22);
      setWeeklyLossTarget(0.6);
      setCustomCalories(null);
      setMedicalConditions([]);
      setRedFlags([]);
      setExcludedFoods([]);
      setPreferencesNotes('');
      setCurrentBreakfast('');
      setHasFlexibleMeal(true);
      if (onResetProfileToZero) {
        onResetProfileToZero();
      }
      return void blank;
    }
    if (preset === 'male_demo') {
      setName('Juan');
      setSex('male');
      setAgeStr('53');
      setHeightStr('173');
      setWeightStr('102');
      setTargetWeightStr('85');
      setWaistStr('106');
      setActivityFactor(1.4);
      setDailyStepsStr('8500');
      setTrainingDaysStr('3');
      setJobType('pie');
      setGoalType('lose');
      setDeficitPercent(25);
      setWeeklyLossTarget(0.65);
      setCustomCalories(1750);
      setMedicalConditions(DEFAULT_USER_PROFILE.medicalConditions);
      setRedFlags([]);
      setExcludedFoods(DEFAULT_USER_PROFILE.excludedFoods);
      setCurrentBreakfast(DEFAULT_USER_PROFILE.currentBreakfast);
      setHasFlexibleMeal(true);
      return;
    }
    // Female example from the 5-step guide (45y, 162cm, 70kg)
    setName('María');
    setSex('female');
    setAgeStr('45');
    setHeightStr('162');
    setWeightStr('70');
    setTargetWeightStr('62');
    setWaistStr('82');
    setActivityFactor(1.4);
    setDailyStepsStr('8000');
    setTrainingDaysStr('3');
    setJobType('pie');
    setGoalType('lose');
    setDeficitPercent(24);
    setWeeklyLossTarget(0.5);
    setCustomCalories(null);
    setMedicalConditions(['Menopausia o >50 años (priorizar fuerza + calcio/vit D)']);
    setRedFlags([]);
    setExcludedFoods(['Bollería y refrescos azucarados']);
    setCurrentBreakfast('Tostada integral con requesón/yogur y fruta entera');
    setHasFlexibleMeal(true);
  };

  const handleAddExcluded = () => {
    if (newExcludedFood.trim() && !excludedFoods.includes(newExcludedFood.trim())) {
      setExcludedFoods([...excludedFoods, newExcludedFood.trim()]);
      setNewExcludedFood('');
    }
  };

  const toggleCondition = (cond: string) => {
    setMedicalConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const toggleRedFlag = (flagId: string) => {
    setRedFlags((prev) =>
      prev.includes(flagId) ? prev.filter((f) => f !== flagId) : [...prev, flagId]
    );
  };

  const handleSave = () => {
    if (!hasBasicNumbers) {
      setFormError('Introduce tu edad, altura (cm) y peso actual (kg) para calcular tu plan.');
      return;
    }

    const cleanName = name.trim() || 'Mi Perfil';
    const actOption = ACTIVITY_FACTOR_OPTIONS.find((a) => a.factor === activityFactor);
    const targetCalories = evaluation.suggestedTargetCalories;

    const updated: UserProfile = {
      ...profile,
      name: cleanName,
      sex,
      age: Math.round(numericAge),
      heightCm: Math.round(numericHeight),
      currentWeightKg: Math.round(numericWeight * 10) / 10,
      targetWeightKg: parseFloat(targetWeightStr) || Math.round(evaluation.idealWeightKg),
      waistCm: waistStr ? parseFloat(waistStr) : undefined,
      activityFactor,
      activityLevel: actOption?.label || 'Ligera',
      dailyStepsTarget: parseInt(dailyStepsStr, 10) || 8000,
      trainingDaysPerWeek: parseInt(trainingDaysStr, 10) || 0,
      jobType,
      workSchedule,
      cooksAtHome,
      goalType,
      deficitPercent,
      weeklyLossTargetKg: weeklyLossTarget,
      mainGoal:
        goalType === 'lose'
          ? `Perder grasa sostenible (~${targetCalories} kcal · factor ×${evaluation.scaleFactor.toFixed(2)})`
          : goalType === 'maintain'
          ? `Mantener peso y rendimiento (~${targetCalories} kcal · factor ×${evaluation.scaleFactor.toFixed(2)})`
          : `Ganar masa muscular (~${targetCalories} kcal · factor ×${evaluation.scaleFactor.toFixed(2)})`,
      medicalConditions,
      redFlags,
      excludedFoods,
      preferencesNotes,
      currentBreakfast: currentBreakfast.trim() || 'Desayuno saciante con proteína y fruta entera',
      hasFlexibleMeal,
      bmr: evaluation.bmr,
      tdee: evaluation.tdee,
      targetCalories,
      targetProteinMin: evaluation.proteinMin,
      targetProteinMax: evaluation.proteinMax,
      targetFatGrams: evaluation.fatGrams,
      targetCarbsGrams: evaluation.carbsGrams,
      targetFiberDailyG: evaluation.fiberMin,
      targetWaterMl: evaluation.waterMl,
      adjustedWeightKg: evaluation.adjustedWeightKg,
      bmi: evaluation.bmi,
      scaleFactor: evaluation.scaleFactor,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                {isFirstTimeOnboarding
                  ? 'Configura tu Perfil desde Cero (Método en 5 Pasos)'
                  : 'Ficha del Usuario & Escalado de Raciones (5 Pasos)'}
              </h3>
              <p className="text-xs text-slate-400">
                Calcula tus necesidades reales (Mifflin-St Jeor) y escala automáticamente los 39 platos sin cambiar el menú
              </p>
            </div>
          </div>
          {!isFirstTimeOnboarding && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Preset Strip (Start from Zero or Load Reference Examples) */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap text-[11px]">
          <span className="font-semibold text-slate-600">
            {isFirstTimeOnboarding
              ? 'Primera vez: introduce tus datos y se guardarán en tu cuenta para próximas sesiones.'
              : 'Puedes editar cualquier dato o empezar de cero para otra persona:'}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleLoadPreset('empty')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-300 font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Empezar desde cero</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('male_demo')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold cursor-pointer transition-colors"
            >
              Ej. Hombre 53a · 102kg
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('female_demo')}
              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold cursor-pointer transition-colors"
            >
              Ej. Mujer 45a · 70kg
            </button>
          </div>
        </div>

        {/* Scrollable 5-Step Form */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* PASO 1: DATOS BÁSICOS & ACTIVIDAD */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                Paso 1 · Datos Básicos y Actividad Diaria
              </span>
              {hasBasicNumbers && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  IMC: {evaluation.bmi} {evaluation.usedAdjustedWeight ? `(Peso ajustado: ${evaluation.adjustedWeightKg} kg)` : ''}
                </span>
              )}
            </div>

            {/* Nombre & Sexo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nombre o alias
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sexo biológico</label>
                <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() => {
                      setSex('male');
                      setCustomCalories(null);
                    }}
                    className={`py-1.5 rounded-md font-bold text-xs cursor-pointer transition-colors ${
                      sex === 'male' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Hombre
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSex('female');
                      setCustomCalories(null);
                    }}
                    className={`py-1.5 rounded-md font-bold text-xs cursor-pointer transition-colors ${
                      sex === 'female' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Mujer
                  </button>
                </div>
              </div>
            </div>

            {/* Antropometría editable */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">Edad (años) *</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={ageStr}
                  onChange={(e) => {
                    setAgeStr(e.target.value);
                    setCustomCalories(null);
                  }}
                  placeholder="Ej. 53"
                  className="w-full font-bold text-slate-900 text-sm focus:outline-hidden"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">Altura (cm) *</label>
                <input
                  type="number"
                  min={120}
                  max={230}
                  value={heightStr}
                  onChange={(e) => {
                    setHeightStr(e.target.value);
                    setCustomCalories(null);
                  }}
                  placeholder="Ej. 173"
                  className="w-full font-bold text-slate-900 text-sm focus:outline-hidden"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                <label className="text-[10px] text-emerald-700 font-semibold block mb-1">Peso actual (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min={30}
                  max={280}
                  value={weightStr}
                  onChange={(e) => {
                    setWeightStr(e.target.value);
                    setCustomCalories(null);
                  }}
                  placeholder="Ej. 102"
                  className="w-full font-bold text-emerald-700 text-sm focus:outline-hidden"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">Peso meta (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeightStr}
                  onChange={(e) => setTargetWeightStr(e.target.value)}
                  placeholder="Opcional"
                  className="w-full font-bold text-slate-800 text-sm focus:outline-hidden"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <label className="text-[10px] text-slate-500 font-semibold block mb-1">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistStr}
                  onChange={(e) => setWaistStr(e.target.value)}
                  placeholder="Opcional"
                  className="w-full font-bold text-slate-800 text-sm focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actividad, pasos, trabajo y cocina */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Pasos diarios habituales</label>
                <input
                  type="number"
                  step="500"
                  value={dailyStepsStr}
                  onChange={(e) => setDailyStepsStr(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Días entreno / semana</label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={trainingDaysStr}
                  onChange={(e) => setTrainingDaysStr(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Tipo de trabajo</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobTypeOption)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                >
                  <option value="sedentario">Sentado / Oficina</option>
                  <option value="pie">De pie / Caminando</option>
                  <option value="fisico">Trabajo físico intenso</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">¿Cocina o come fuera?</label>
                <select
                  value={cooksAtHome}
                  onChange={(e) => setCooksAtHome(e.target.value as CookingHabitOption)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                >
                  <option value="cocina">Cocina en casa (táper/batch)</option>
                  <option value="mixto">Mixto (casa + fuera)</option>
                  <option value="fuera">Come fuera habitualmente</option>
                </select>
              </div>
            </div>
          </div>

          {/* PASO 2 & 3: GASTO ENERGÉTICO & OBJETIVO CALÓRICO */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Pasos 2 y 3 · Gasto Energético (Mifflin-St Jeor) & Objetivo
              </span>
              {hasBasicNumbers && (
                <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                  Basal: <strong>{evaluation.bmr} kcal</strong> · Gasto total (TDEE):{' '}
                  <strong className="text-emerald-700">{evaluation.tdee} kcal</strong>
                </span>
              )}
            </div>

            {/* Activity Factor buttons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Factor de actividad diaria:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {ACTIVITY_FACTOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.factor}
                    type="button"
                    onClick={() => {
                      setActivityFactor(opt.factor);
                      setCustomCalories(null);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      activityFactor === opt.factor
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{opt.detail}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Type + Deficit % */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'lose', label: 'Perder peso (−15% a −25%)', sub: '0,4–0,8 kg/sem sostenible' },
                { id: 'maintain', label: 'Mantener peso (TDEE)', sub: 'Igualar gasto energético total' },
                { id: 'gain', label: 'Ganar músculo (+10%)', sub: 'Superávit controlado + fuerza' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGoalType(g.id as GoalTypeOption);
                    setCustomCalories(null);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    goalType === g.id
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs">{g.label}</div>
                  <div className={`text-[10px] ${goalType === g.id ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {g.sub}
                  </div>
                </button>
              ))}
            </div>

            {goalType === 'lose' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Déficit aplicado sobre TDEE:</span>
                    <span className="text-emerald-700 font-bold">{deficitPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={28}
                    step={1}
                    value={deficitPercent}
                    onChange={(e) => {
                      setDeficitPercent(parseInt(e.target.value, 10));
                      setCustomCalories(null);
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>15% (suave)</span>
                    <span>20–25% (estándar)</span>
                    <span>28% (máx.)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Ritmo semanal buscado (kg/sem):</span>
                    <span className={weeklyLossTarget > 1 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {weeklyLossTarget.toFixed(1)} kg/sem
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={1.2}
                    step={0.1}
                    value={weeklyLossTarget}
                    onChange={(e) => setWeeklyLossTarget(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0,4 kg/sem</span>
                    <span>0,5–0,8 kg (ideal)</span>
                    <span className="text-rose-600">&gt;1 kg (derivar)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fine-tune target calories slider */}
            <div className="pt-2 border-t border-slate-200/70">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1 flex-wrap gap-2">
                <span>Objetivo calórico diario final:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-extrabold text-sm">
                    {evaluation.suggestedTargetCalories} kcal/día
                  </span>
                  {customCalories !== null && (
                    <button
                      type="button"
                      onClick={() => setCustomCalories(null)}
                      className="text-[10px] underline text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Restaurar cálculo fórmula
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={1200}
                max={3200}
                step={25}
                value={evaluation.suggestedTargetCalories}
                onChange={(e) => setCustomCalories(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Suelo seguridad: {evaluation.safetyFloorCalories} kcal ({sex === 'female' ? 'Mujer' : 'Hombre'})</span>
                <span>Base catálogo: 1.750 kcal</span>
                <span>3.200 kcal</span>
              </div>
            </div>
          </div>

          {/* PASOS 4 & 5: MACROS, FIBRA, AGUA Y FACTOR DE ESCALADO */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Pasos 4 y 5 · Macros, Agua y Factor de Escalado del Catálogo
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${evaluation.scalingTier.badgeColor}`}>
                Factor ×{evaluation.scaleFactor.toFixed(2)} ({evaluation.scalingTier.label})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Proteína</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {evaluation.proteinMin}–{evaluation.proteinMax}g
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {evaluation.usedAdjustedWeight ? 'Peso ajustado' : 'Peso real'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Grasas (30%)</span>
                <span className="font-extrabold text-slate-800 text-sm">{evaluation.fatGrams}g</span>
                <span className="text-[9px] text-slate-400 block">AOVE, nueces, azul</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Hidratos</span>
                <span className="font-extrabold text-slate-800 text-sm">{evaluation.carbsGrams}g</span>
                <span className="text-[9px] text-slate-400 block">Integrales y fruta</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Fibra mín.</span>
                <span className="font-extrabold text-amber-700 text-sm">≥{evaluation.fiberMin}g</span>
                <span className="text-[9px] text-slate-400 block">14g / 1000 kcal</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200/80 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" /> Agua
                </span>
                <span className="font-extrabold text-blue-700 text-sm">
                  {(evaluation.waterMl / 1000).toFixed(1)} L
                </span>
                <span className="text-[9px] text-slate-400 block">30 ml/kg/día</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-emerald-900">Cómo se escalan tus platos ({evaluation.scalingTier.factorRange}):</strong>{' '}
              {evaluation.scalingTier.instruction} <em>Regla clave: las calorías se ajustan con harinas, patatas, pan, aceite y frutos secos; la proteína se mantiene intacta.</em>
            </div>

            {evaluation.profileAdaptations.length > 0 && (
              <div className="bg-white/90 p-2.5 rounded-lg border border-teal-200 space-y-1 text-[11px] text-teal-950">
                <div className="font-bold flex items-center gap-1 text-teal-800">
                  <Activity className="w-3.5 h-3.5" />
                  Ajustes recomendados para tu perfil:
                </div>
                {evaluation.profileAdaptations.map((note, idx) => (
                  <div key={idx}>• {note}</div>
                ))}
              </div>
            )}
          </div>

          {/* SALUD, CRITERIOS DE DERIVACIÓN & GUSTOS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Salud, Patologías y Criterios de Derivación Clínica
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MEDICAL_CONDITION_OPTIONS.map((cond) => {
                const isSelected = medicalConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{cond}</span>
                  </button>
                );
              })}
            </div>

            {/* Red flags (When NOT to use this automated method without physician/dietitian) */}
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] font-bold text-rose-800 mb-1.5">
                Situaciones que requieren supervisión directa de médico o dietista:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CLINICAL_RED_FLAG_OPTIONS.map((flag) => {
                  const checked = redFlags.includes(flag.id);
                  return (
                    <label
                      key={flag.id}
                      className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer text-[11px] ${
                        checked
                          ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRedFlag(flag.id)}
                        className="accent-rose-600 rounded shrink-0"
                      />
                      <span>{flag.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {evaluation.requiresSpecialistReferral && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1 text-[11px]">
                <div className="font-extrabold flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Aviso clínico: se recomienda validar este plan con un dietista o médico
                </div>
                {evaluation.clinicalReferralReasons.map((r, i) => (
                  <div key={i}>• {r}</div>
                ))}
              </div>
            )}
          </div>

          {/* GUSTOS, HORARIOS Y EXCLUSIONES */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Gustos, Horarios y Alimentos Excluidos
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Horario laboral / comidas
                </label>
                <input
                  type="text"
                  value={workSchedule}
                  onChange={(e) => setWorkSchedule(e.target.value)}
                  placeholder="Ej. 08:00 - 17:00"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Creencias, alergias o notas de gustos
                </label>
                <input
                  type="text"
                  value={preferencesNotes}
                  onChange={(e) => setPreferencesNotes(e.target.value)}
                  placeholder="Ej. Sin cerdo, no tolera lactosa, prefiere pescado..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block text-xs">
                  1 Comida libre/semana (Domingo mediodía)
                </span>
                <span className="text-[10px] text-slate-500">
                  Mantiene la adherencia a largo plazo sin compensar en merienda/cena.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasFlexibleMeal}
                onChange={(e) => setHasFlexibleMeal(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-700">
                Alimentos que no soporta o excluidos:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExcludedFood}
                  onChange={(e) => setNewExcludedFood(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExcluded())}
                  placeholder="Añadir alimento a excluir..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddExcluded}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {excludedFoods.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setExcludedFoods(excludedFoods.filter((f) => f !== item))}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center flex-wrap gap-2">
          <span className="text-[11px] text-slate-500">
            Fórmulas estiman ±10%: pesa 1×/sem, mide cintura cada 2 sem y reajusta ±100–150 kcal cada 2–3 sem.
          </span>
          <div className="flex gap-2 ml-auto">
            {!isFirstTimeOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Guardar y Escalar Plan (×{evaluation.scaleFactor.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
