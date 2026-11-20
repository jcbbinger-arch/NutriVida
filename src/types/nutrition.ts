export type MealCategory =
  | 'Desayuno Saciante'
  | 'Frutos Secos & Café'
  | 'Mini Bocadillo Integral'
  | 'Lácteo Proteico'
  | 'Huevo & Café'
  | 'Carnes Blancas'
  | 'Carnes Magras'
  | 'Pescado Blanco'
  | 'Pescado Azul'
  | 'Legumbres Ligeras'
  | 'Cereales & Proteína'
  | 'Cremas y Sopas'
  | 'Huevos & Marisco'
  | 'Ensaladas Proteicas'
  | 'Pescado Lindo'
  | 'Cena Láctea Proteica'
  | 'Tortillas Veg'
  | 'Merienda & Fruta Fresca'
  | 'Comida Libre';

export type GroceryCategory =
  | 'Proteínas'
  | 'Verduras & Hortalizas'
  | 'Frutas Frescas'
  | 'Tubérculos & Cereales'
  | 'Lácteos & Frutos Secos'
  | 'Despensa & Condimentos';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: GroceryCategory;
  rawStateNote?: string;
  cookingTip?: string;
  excludeFromGrocery?: boolean;
}

export interface MealOption {
  id: string;
  title: string;
  mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner';
  category: MealCategory;
  proteinSource:
    | 'ave'
    | 'ternera'
    | 'pescado_blanco'
    | 'pescado_azul'
    | 'legumbre'
    | 'huevo'
    | 'lacteo'
    | 'marisco'
    | 'vegetal'
    | 'frutos_secos'
    | 'libre';
  description: string;
  ingredients: Ingredient[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  omega3EpaDhaMg?: number;
  omega3AlaMg?: number;
  fruitPieces?: number;
  alternatives?: string[];
  isOilyFish?: boolean;
  isLegume?: boolean;
  prepMinutes: number;
  instructions: string[];
  scientificRationale: string;
  batchPrepNote?: string;
  scaledNote?: string;
}

export interface DayPlan {
  dayNumber?: number;
  dayId: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  dayName: string;
  breakfast: MealOption;
  morning: MealOption;
  lunch: MealOption;
  snack: MealOption;
  dinner: MealOption;
  isFlexibleMealDay?: boolean;
  flexibleMealType?: 'lunch' | 'dinner';
  hardTrainingBonus?: boolean;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalFruitPieces: number;
  omega3EpaDhaTotalMg: number;
  omega3AlaTotalMg: number;
}

export interface RuleValidationReport {
  isValid: boolean;
  consecutiveLunchDuplicates: number;
  lunchDinnerCollisions: number;
  oilyFishCountPerWeek: number;
  legumeCountPerWeek: number;
  eggsCountPerWeek: number;
  cannedTunaCountPerWeek: number;
  fruitPiecesPerDayAverage: number;
  averageCaloriesPerDay: number;
  averageProteinPerDay: number;
  averageFiberPerDay: number;
  daysBelow30gFiber: number;
  noSameWeekRepeats: boolean;
  noSweetMorningSnacks: boolean;
  noRefinedEveningCarbs: boolean;
  zeroAlcoholInRecipes: boolean;
  resistantStarchUtilized: boolean;
  details: string[];
}

export interface WeeklyPlan {
  id: string;
  weekNumber: 1 | 2 | 3 | 4 | 5;
  label?: string;
  generatedAt: string;
  days: DayPlan[];
  validationReport: RuleValidationReport;
}

export interface FortnightPlan {
  id: string;
  createdAt: string;
  week1: WeeklyPlan;
  week2: WeeklyPlan;
}

export interface MonthlyPlan {
  id: string;
  createdAt: string;
  week1: WeeklyPlan;
  week2: WeeklyPlan;
  week3: WeeklyPlan;
  week4: WeeklyPlan;
  week5: WeeklyPlan;
}

export interface GroceryItemConsolidated {
  id: string;
  name: string;
  totalAmount: number;
  unit: string;
  category: GroceryCategory;
  rawStateNote?: string;
  checked: boolean;
  usedInDays: string[];
}

export type SexOption = 'male' | 'female';
export type ActivityFactorOption = 1.2 | 1.375 | 1.4 | 1.55 | 1.725;
export type GoalTypeOption = 'lose' | 'maintain' | 'gain';
export type JobTypeOption = 'sedentario' | 'pie' | 'fisico';
export type CookingHabitOption = 'cocina' | 'mixto' | 'fuera';

export interface UserProfile {
  name: string;
  sex: SexOption;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  waistCm?: number;
  // Paso 1: Actividad & Hábitos
  activityFactor: ActivityFactorOption;
  activityLevel: string;
  dailyStepsTarget?: number;
  trainingDaysPerWeek?: number;
  jobType?: JobTypeOption;
  workSchedule?: string;
  cooksAtHome?: CookingHabitOption;
  // Paso 1 & 3: Objetivo
  goalType: GoalTypeOption;
  deficitPercent: number; // e.g., 20 (for 15-25% deficit), 0 for maintain, -10 for gain
  weeklyLossTargetKg?: number;
  mainGoal: string;
  // Paso 1 & Criterios de derivación médica
  medicalConditions: string[];
  redFlags: string[];
  excludedFoods: string[];
  preferencesNotes?: string;
  currentBreakfast: string;
  hasFlexibleMeal: boolean;
  flexibleDay: 'sabado' | 'domingo';
  // Paso 2-5: Cálculos automáticos & Factor de escalado
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProteinMin: number;
  targetProteinMax: number;
  targetFatGrams: number;
  targetCarbsGrams: number;
  targetFiberDailyG: number;
  targetWaterMl: number;
  adjustedWeightKg?: number;
  bmi?: number;
  scaleFactor: number; // targetCalories / 1750
  keyRestrictions: string[];
  onboardingCompleted?: boolean;
  updatedAt?: string;
}
