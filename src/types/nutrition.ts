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
  | 'Merienda & Fruta Fresca';

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
  rawStateNote?: string; // e.g. "peso en crudo", "escurrido", "entera con piel"
  cookingTip?: string;
}

export interface MealOption {
  id: string; // e.g. 'D1', 'M1', 'C1', 'ME1', 'N1'
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
    | 'frutos_secos';
  description: string;
  ingredients: Ingredient[];
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber: number;   // in grams (vital for glycemic control)
  omega3Mg?: number; // EPA/DHA in mg
  fruitPieces?: number; // Whole fresh fruit pieces included
  prepMinutes: number;
  instructions: string[];
  scientificRationale: string; // Real scientific evidence (no pseudo-science)
  batchPrepNote?: string;      // Chef batch-cooking instructions
}

export interface DayPlan {
  dayId: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  dayName: string;
  breakfast: MealOption; // Desayuno (07:30 - 08:30)
  morning: MealOption;   // Media Mañana (11:00 AM)
  lunch: MealOption;     // Comida Principal (Mediodía)
  snack: MealOption;     // Merienda (17:30 - 18:30)
  dinner: MealOption;    // Cena Ligera (20:30 - 21:30)
  isFlexibleMealDay?: boolean; // Margen de comida libre planificada semanal
  flexibleMealType?: 'lunch' | 'dinner';
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalFruitPieces: number;
  omega3TotalMg: number;
}

export interface RuleValidationReport {
  isValid: boolean;
  consecutiveLunchDuplicates: number; // must be 0
  lunchDinnerCollisions: number;      // must be 0
  oilyFishCountPerWeek: number;       // recommended >= 2-3
  legumeCountPerWeek: number;         // recommended >= 3
  eggsCountPerWeek: number;           // recommended <= 10-12
  cannedTunaCountPerWeek: number;     // recommended <= 3
  fruitPiecesPerDayAverage: number;   // recommended >= 2-3
  noSweetMorningSnacks: boolean;
  noRefinedEveningCarbs: boolean;
  zeroAlcoholInRecipes: boolean;
  resistantStarchUtilized: boolean;   // Boiled & cooled potatoes
  details: string[];
}

export interface WeeklyPlan {
  id: string;
  weekNumber: 1 | 2;
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

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: string;
  mainGoal: string;
  medicalConditions: string[]; // e.g. 'Control Glucemia / Prediabetes', 'Hipertensión', 'Colesterol / Perfil Lipídico'
  excludedFoods: string[];    // e.g. 'atún en exceso', 'surimi'
  currentBreakfast: string;   // Habitual breakfast
  hasFlexibleMeal: boolean;   // Comida libre semanal planificada
  flexibleDay: 'sabado' | 'domingo';
  bmr: number;
  tdee: number;
  targetCalories: number;     // Escandallo calórico
  targetProteinMin: number;
  targetProteinMax: number;
  targetFiberDailyG: number;
  keyRestrictions: string[];
}
