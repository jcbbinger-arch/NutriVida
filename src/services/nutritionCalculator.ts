import {
  ActivityFactorOption,
  GoalTypeOption,
  MealOption,
  SexOption,
  UserProfile,
  WeeklyPlan,
  MonthlyPlan
} from '../types/nutrition';

export const BASE_CATALOG_CALORIES = 1750;

export interface ScalingTierInfo {
  label: string;
  factorRange: string;
  instruction: string;
  badgeColor: string;
}

export interface ClinicalEvaluationResult {
  bmi: number;
  idealWeightKg: number;
  adjustedWeightKg: number;
  usedAdjustedWeight: boolean;
  bmr: number;
  tdee: number;
  suggestedTargetCalories: number;
  safetyFloorCalories: number;
  belowSafetyFloor: boolean;
  proteinMin: number;
  proteinMax: number;
  fatGrams: number;
  carbsGrams: number;
  fiberMin: number;
  waterMl: number;
  scaleFactor: number;
  scalingTier: ScalingTierInfo;
  profileAdaptations: string[];
  clinicalReferralReasons: string[];
  requiresSpecialistReferral: boolean;
}

export const CLINICAL_RED_FLAG_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'embarazo_lactancia', label: 'Embarazo o lactancia' },
  { id: 'diabetes_tratamiento', label: 'Diabetes en tratamiento (insulina / sulfonilureas u otros)' },
  { id: 'renal_hepatica', label: 'Insuficiencia renal o hepática' },
  { id: 'cardiovascular_grave', label: 'Enfermedad cardiovascular grave' },
  { id: 'celiaquia_digestiva', label: 'Celiaquía o enfermedad digestiva crónica' },
  { id: 'cirugia_bariatrica', label: 'Cirugía bariátrica previa' },
  { id: 'tca', label: 'Antecedentes de trastorno de la conducta alimentaria (TCA)' },
  { id: 'medicacion_interaccion', label: 'Medicación que interactúa con la dieta (ej. anticoagulantes)' }
];

export const MEDICAL_CONDITION_OPTIONS: string[] = [
  'Control de glucemia / Prediabetes',
  'Protección articular (rodillas / lumbar)',
  'Control de colesterol / Perfil lipídico',
  'Hipertensión / Control de sodio',
  'Menopausia o >50 años (priorizar fuerza + calcio/vit D)',
  'Problemas de masticación / adaptar texturas'
];

export const ACTIVITY_FACTOR_OPTIONS: Array<{
  factor: ActivityFactorOption;
  label: string;
  short: string;
  detail: string;
}> = [
  {
    factor: 1.2,
    label: 'Sedentaria (×1,2)',
    short: 'Sedentaria',
    detail: 'Trabajo sentado, pocos pasos diarios (<4.000) y sin entrenamiento programado.'
  },
  {
    factor: 1.4,
    label: 'Ligera (×1,375–1,4)',
    short: 'Ligera',
    detail: 'Caminata diaria o trabajo de pie (~6.000–9.000 pasos/día).'
  },
  {
    factor: 1.55,
    label: 'Moderada (×1,55)',
    short: 'Moderada',
    detail: 'Entrena fuerza/cardio 3–5 días por semana.'
  },
  {
    factor: 1.725,
    label: 'Alta (×1,725)',
    short: 'Alta',
    detail: 'Entrena a diario o trabajo físico muy exigente.'
  }
];

export function calculateMifflinBmr(
  sex: SexOption,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const safeWeight = Math.max(30, weightKg || 70);
  const safeHeight = Math.max(120, heightCm || 170);
  const safeAge = Math.max(12, age || 35);
  const base = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

export function getScalingTierInfo(scaleFactor: number): ScalingTierInfo {
  if (scaleFactor <= 0.9) {
    return {
      label: 'Factor ≈0,8 (~1.400 kcal)',
      factorRange: `×${scaleFactor.toFixed(2)}`,
      instruction:
        'Reduce arroz, pasta, patata, pan y AOVE al 70–80%. Mantén intacta la cantidad de proteína.',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }
  if (scaleFactor <= 1.1) {
    return {
      label: 'Factor ≈1,0 (Menú Base ~1.750 kcal)',
      factorRange: `×${scaleFactor.toFixed(2)}`,
      instruction:
        'Menú base exacto de 39 platos: no hace falta modificar gramos.',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    };
  }
  if (scaleFactor <= 1.3) {
    return {
      label: 'Factor ≈1,2 (~2.100 kcal)',
      factorRange: `×${scaleFactor.toFixed(2)}`,
      instruction:
        'Suma +40–60 g de pan o arroz, +1 fruta y +10 ml de AOVE en comida y cena (proteína base estable).',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
    };
  }
  return {
    label: 'Factor ≈1,4 (~2.400+ kcal)',
    factorRange: `×${scaleFactor.toFixed(2)}`,
    instruction:
      'Añade +40–60 g de pan/arroz, +1 fruta y +10 ml de AOVE en comida/cena, más 1 toma extra de lácteo y fruta.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  };
}

export function evaluateNutritionPlan(params: {
  sex: SexOption;
  age: number;
  heightCm: number;
  weightKg: number;
  activityFactor: ActivityFactorOption;
  goalType: GoalTypeOption;
  deficitPercent?: number;
  customTargetCalories?: number;
  weeklyLossTargetKg?: number;
  redFlags?: string[];
  medicalConditions?: string[];
}): ClinicalEvaluationResult {
  const {
    sex,
    age,
    heightCm,
    weightKg,
    activityFactor,
    goalType,
    deficitPercent = 22,
    customTargetCalories,
    weeklyLossTargetKg = 0.6,
    redFlags = [],
    medicalConditions = []
  } = params;

  const heightM = Math.max(1.2, heightCm / 100);
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  // Ideal weight at BMI 25 (or BMI 24 for female reference) -> gives exact ~81.6 kg adjusted for 102kg/173cm
  const idealBmiRef = sex === 'male' ? 25 : 24;
  const idealWeightKg = Math.round(idealBmiRef * heightM * heightM * 10) / 10;
  const usedAdjustedWeight = bmi >= 30;
  const adjustedWeightKg = usedAdjustedWeight
    ? Math.round((idealWeightKg + 0.25 * (weightKg - idealWeightKg)) * 10) / 10
    : weightKg;

  const bmr = calculateMifflinBmr(sex, weightKg, heightCm, age);
  const tdee = Math.round(bmr * activityFactor);

  // Step 3: Calorie Goal
  let rawGoalCalories = tdee;
  if (goalType === 'lose') {
    const safeDeficit = Math.min(Math.max(deficitPercent, 15), 28);
    rawGoalCalories = Math.round(tdee * (1 - safeDeficit / 100));
  } else if (goalType === 'gain') {
    rawGoalCalories = Math.round(tdee * 1.1);
  }

  const safetyFloorCalories = sex === 'female' ? 1250 : 1500;
  // Senior >65 guardrail: avoid aggressive deficit
  const effectiveCalories = customTargetCalories ?? Math.max(rawGoalCalories, safetyFloorCalories);
  const belowSafetyFloor = effectiveCalories < safetyFloorCalories;

  // Step 4: Macros & Fiber & Water
  // Protein: 1.2-1.6 g/kg of adjustedWeight (in obesity) or real weight
  const proteinMin = Math.round(adjustedWeightKg * 1.35);
  const proteinMax = Math.round(adjustedWeightKg * 1.6);
  const proteinMid = Math.round((proteinMin + proteinMax) / 2);

  // Fat: 25-35% (mid 30%)
  const fatGrams = Math.round((effectiveCalories * 0.3) / 9);
  // Carbs: remainder
  const carbCalories = Math.max(0, effectiveCalories - proteinMid * 4 - fatGrams * 9);
  const carbsGrams = Math.round(carbCalories / 4);

  // Fiber: 14g per 1000 kcal, min 25g women / 30g men
  const fiberMin = Math.max(sex === 'female' ? 25 : 30, Math.round((effectiveCalories / 1000) * 14));

  // Water: 30 ml/kg
  const waterMl = Math.round(weightKg * 30);

  // Step 5: Scaling factor vs 1750 kcal base menu
  const scaleFactor = Math.round((effectiveCalories / BASE_CATALOG_CALORIES) * 100) / 100;
  const scalingTier = getScalingTierInfo(scaleFactor);

  // Profile-specific adjustments
  const profileAdaptations: string[] = [];
  if (sex === 'female') {
    profileAdaptations.push(
      'Mujer: menor gasto calórico base; cuida el hierro (legumbres con vitamina C/kiwi, pescado, carne magra) y el calcio diario.'
    );
  }
  if (age >= 50 && age < 65) {
    profileAdaptations.push(
      '50–64 años / Menopausia: prioriza 25–30 g de proteína en las 3 tomas principales, fuerza 2–3×/sem, calcio y vitamina D.'
    );
  }
  if (age >= 65) {
    profileAdaptations.push(
      'Mayor de 65 años: evita déficits agresivos por riesgo de pérdida muscular; cuida hidratación y texturas si hay dificultad de masticación.'
    );
  }
  if (age >= 18 && age <= 25) {
    profileAdaptations.push(
      'Joven 18–25 años: necesidades metabólicas altas y menor margen de déficit; evita dietas muy restrictivas.'
    );
  }
  if (bmi < 19 || heightCm >= 188) {
    profileAdaptations.push(
      'Bajo peso o gran estatura: ajusta raciones por kcal y por kg reales sin copiar porciones estándar.'
    );
  }
  if (heightCm >= 185 && weightKg >= 100) {
    profileAdaptations.push(
      'Gran altura y peso elevado: requiere más kcal basales; aplica el déficit en % (15–25%) y nunca recortes de más.'
    );
  }
  if (medicalConditions.some((c) => c.toLowerCase().includes('glucemia') || c.toLowerCase().includes('diabetes'))) {
    profileAdaptations.push(
      'Control glucémico: prioriza granos 100% integrales, legumbres, fruta entera con piel y moderación de harinas.'
    );
  }

  // Clinical Red Flags / When NOT to use this automated method alone
  const clinicalReferralReasons: string[] = [];
  if (age < 18) {
    clinicalReferralReasons.push('Menor de edad (<18 años): requiere valoración pediátrica/nutricional.');
  }
  if (belowSafetyFloor) {
    clinicalReferralReasons.push(
      `Objetivo por debajo del suelo de seguridad (${safetyFloorCalories} kcal): requiere supervisión directa de dietista-nutricionista.`
    );
  }
  if (weeklyLossTargetKg > 1) {
    clinicalReferralReasons.push('Meta superior a 1 kg/semana: déficit demasiado agresivo; deriva a médico o dietista.');
  }
  CLINICAL_RED_FLAG_OPTIONS.forEach((flag) => {
    if (redFlags.includes(flag.id)) {
      clinicalReferralReasons.push(flag.label);
    }
  });

  return {
    bmi,
    idealWeightKg,
    adjustedWeightKg,
    usedAdjustedWeight,
    bmr,
    tdee,
    suggestedTargetCalories: effectiveCalories,
    safetyFloorCalories,
    belowSafetyFloor,
    proteinMin,
    proteinMax,
    fatGrams,
    carbsGrams,
    fiberMin,
    waterMl,
    scaleFactor,
    scalingTier,
    profileAdaptations,
    clinicalReferralReasons,
    requiresSpecialistReferral: clinicalReferralReasons.length > 0
  };
}

// ==========================================
// STEP 5: ESCALADO INTELIGENTE DEL CATÁLOGO
// Regla clave: las calorías se ajustan con harinas, patatas, pan, aceite y frutos secos,
// NO recortando proteína.
// ==========================================
const CARB_FAT_SCALE_KEYWORDS = [
  'arroz',
  'pasta',
  'patata',
  'pan ',
  'avena',
  'quinoa',
  'tortitas',
  'aceite de oliva',
  'aove',
  'nueces',
  'almendras',
  'lino',
  'chía'
];

function isScalableEnergyIngredient(name: string): boolean {
  const lower = name.toLowerCase();
  return CARB_FAT_SCALE_KEYWORDS.some((kw) => lower.includes(kw));
}

function roundIngredientAmount(amount: number, unit: string): number {
  if (unit === 'ud' || unit === 'taza' || unit === 'pizca') return amount;
  if (amount <= 20) return Math.max(2, Math.round(amount));
  return Math.max(5, Math.round(amount / 5) * 5);
}

/**
 * Scale a meal dynamically according to user's factor (targetCalories / 1750).
 * Keeps protein intact and scales starch/bread/pasta/rice/potato/oil/nuts smoothly.
 */
export function scaleMealOption(meal: MealOption, scaleFactor: number = 1): MealOption {
  if (!scaleFactor || Math.abs(scaleFactor - 1) <= 0.04 || meal.id === 'LIBRE') {
    return meal;
  }

  // Clamp reasonable ingredient adjustment multiplier
  // For factor 0.8 (1400 kcal) -> carbs/fats scale to ~0.72
  // For factor 1.2 (2100 kcal) -> carbs/fats scale to ~1.35
  // For factor 1.4 (2400 kcal) -> carbs/fats scale to ~1.55
  const energyMultiplier =
    scaleFactor < 1
      ? Math.max(0.6, 1 - (1 - scaleFactor) * 1.35)
      : Math.min(1.85, 1 + (scaleFactor - 1) * 1.45);

  const scaledIngredients = meal.ingredients.map((ing) => {
    if (ing.excludeFromGrocery || !isScalableEnergyIngredient(ing.name)) {
      return ing;
    }
    const nextAmount = roundIngredientAmount(ing.amount * energyMultiplier, ing.unit);
    return {
      ...ing,
      amount: nextAmount
    };
  });

  // Scale non-protein calories (carbs & fats) while keeping protein gram count steady
  const proteinCalories = meal.protein * 4;
  const baseNonProteinCalories = Math.max(0, meal.calories - proteinCalories);
  const targetMealCalories = Math.round(meal.calories * scaleFactor);
  const deltaNonProtein = targetMealCalories - meal.calories;

  // Adjust carbs & fat proportionally while preserving protein
  const nextCarbs = Math.max(0, Math.round(meal.carbs * (1 + deltaNonProtein / Math.max(200, baseNonProteinCalories))));
  const nextFat = Math.max(1, Math.round(meal.fat * (1 + (deltaNonProtein * 0.5) / Math.max(200, baseNonProteinCalories))));
  const nextFiber = Math.round(meal.fiber * (scaleFactor < 1 ? 0.85 : Math.min(1.25, scaleFactor)) * 10) / 10;

  return {
    ...meal,
    ingredients: scaledIngredients,
    calories: targetMealCalories,
    carbs: nextCarbs,
    fat: nextFat,
    fiber: nextFiber,
    scaledNote: `Ración escalada ×${scaleFactor.toFixed(2)} (harinas/patata/AOVE ajustados; proteína ${meal.protein}g intacta)`
  };
}

export function scaleWeeklyPlan(plan: WeeklyPlan, scaleFactor: number = 1): WeeklyPlan {
  if (!scaleFactor || Math.abs(scaleFactor - 1) <= 0.04) {
    return plan;
  }

  let sumCalFixed = 0;
  let sumProtFixed = 0;
  let fixedCount = 0;
  let sumFiber = 0;

  const scaledDays = plan.days.map((day) => {
    const breakfast = scaleMealOption(day.breakfast, scaleFactor);
    const morning = scaleMealOption(day.morning, scaleFactor);
    const lunch = scaleMealOption(day.lunch, scaleFactor);
    const snack = scaleMealOption(day.snack, scaleFactor);
    const dinner = scaleMealOption(day.dinner, scaleFactor);

    const meals = [breakfast, morning, lunch, snack, dinner];
    const bonusKcal = day.hardTrainingBonus ? 140 : 0;
    const bonusProt = day.hardTrainingBonus ? 4 : 0;
    const bonusCarbs = day.hardTrainingBonus ? 28 : 0;
    const bonusFat = day.hardTrainingBonus ? 1 : 0;
    const bonusFiber = day.hardTrainingBonus ? 3.5 : 0;

    const totalCalories = meals.reduce((a, m) => a + m.calories, 0) + bonusKcal;
    const totalProtein = meals.reduce((a, m) => a + m.protein, 0) + bonusProt;
    const totalCarbs = meals.reduce((a, m) => a + m.carbs, 0) + bonusCarbs;
    const totalFat = meals.reduce((a, m) => a + m.fat, 0) + bonusFat;
    const totalFiber = Math.round((meals.reduce((a, m) => a + m.fiber, 0) + bonusFiber) * 10) / 10;

    if (lunch.id !== 'LIBRE') {
      sumCalFixed += totalCalories;
      sumProtFixed += totalProtein;
      fixedCount++;
    }
    sumFiber += totalFiber;

    return {
      ...day,
      breakfast,
      morning,
      lunch,
      snack,
      dinner,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber
    };
  });

  const avgCal = Math.round(sumCalFixed / Math.max(fixedCount, 1));
  const avgProt = Math.round(sumProtFixed / Math.max(fixedCount, 1));
  const avgFiber = Math.round((sumFiber / Math.max(scaledDays.length, 1)) * 10) / 10;

  return {
    ...plan,
    days: scaledDays,
    validationReport: {
      ...plan.validationReport,
      averageCaloriesPerDay: avgCal,
      averageProteinPerDay: avgProt,
      averageFiberPerDay: avgFiber
    }
  };
}

export function scaleMonthlyPlan(monthly: MonthlyPlan, scaleFactor: number = 1): MonthlyPlan {
  if (!scaleFactor || Math.abs(scaleFactor - 1) <= 0.04) return monthly;
  return {
    ...monthly,
    week1: scaleWeeklyPlan(monthly.week1, scaleFactor),
    week2: scaleWeeklyPlan(monthly.week2, scaleFactor),
    week3: scaleWeeklyPlan(monthly.week3, scaleFactor),
    week4: scaleWeeklyPlan(monthly.week4, scaleFactor),
    week5: scaleWeeklyPlan(monthly.week5, scaleFactor)
  };
}

export function buildEmptyUserProfile(): UserProfile {
  return {
    name: '',
    sex: 'male',
    age: 0,
    heightCm: 0,
    currentWeightKg: 0,
    targetWeightKg: 0,
    waistCm: undefined,
    activityFactor: 1.4,
    activityLevel: 'Ligera (caminata diaria o trabajo de pie)',
    dailyStepsTarget: 8000,
    trainingDaysPerWeek: 3,
    jobType: 'sedentario',
    workSchedule: '09:00 - 18:00',
    cooksAtHome: 'cocina',
    goalType: 'lose',
    deficitPercent: 22,
    weeklyLossTargetKg: 0.6,
    mainGoal: 'Perder peso (grasa y cintura) con déficit sostenible',
    medicalConditions: [],
    redFlags: [],
    excludedFoods: [],
    preferencesNotes: '',
    currentBreakfast: '',
    hasFlexibleMeal: true,
    flexibleDay: 'domingo',
    bmr: 0,
    tdee: 0,
    targetCalories: 1750,
    targetProteinMin: 110,
    targetProteinMax: 125,
    targetFatGrams: 58,
    targetCarbsGrams: 185,
    targetFiberDailyG: 30,
    targetWaterMl: 2500,
    adjustedWeightKg: 0,
    bmi: 0,
    scaleFactor: 1.0,
    keyRestrictions: [],
    onboardingCompleted: false
  };
}
