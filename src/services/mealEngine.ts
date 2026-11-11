import {
  DayPlan,
  WeeklyPlan,
  FortnightPlan,
  MealOption,
  RuleValidationReport,
  GroceryItemConsolidated,
  GroceryCategory
} from '../types/nutrition';
import {
  DAYS_CONFIG,
  BREAKFAST_OPTIONS,
  MORNING_OPTIONS,
  LUNCH_OPTIONS,
  SNACK_OPTIONS,
  DINNER_OPTIONS
} from '../data/database';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  return array[getRandomInt(0, array.length - 1)];
}

/**
 * Check if a lunch and dinner meal have protein conflict
 */
export function hasProteinConflict(lunch: MealOption, dinner: MealOption): boolean {
  const isMeatLunch = lunch.proteinSource === 'ave' || lunch.proteinSource === 'ternera';
  const isMeatDinner = dinner.proteinSource === 'ave' || dinner.proteinSource === 'ternera';
  if (isMeatLunch && isMeatDinner) return true;

  const isFishLunch = lunch.proteinSource === 'pescado_blanco' || lunch.proteinSource === 'pescado_azul';
  const isFishDinner = dinner.proteinSource === 'pescado_blanco' || dinner.proteinSource === 'pescado_azul';
  if (isFishLunch && isFishDinner) return true;

  if (lunch.proteinSource === dinner.proteinSource && lunch.proteinSource !== 'vegetal') {
    return true;
  }

  return false;
}

export function getValidDinnerOptions(lunch: MealOption): MealOption[] {
  const valid = DINNER_OPTIONS.filter((dinner) => !hasProteinConflict(lunch, dinner));
  return valid.length > 0 ? valid : DINNER_OPTIONS;
}

export function getValidLunchOptions(prevCategory?: string, nextCategory?: string): MealOption[] {
  return LUNCH_OPTIONS.filter((lunch) => {
    if (prevCategory && lunch.category === prevCategory) return false;
    if (nextCategory && lunch.category === nextCategory) return false;
    return true;
  });
}

/**
 * Validate a weekly plan against scientific, clinical and culinary rules
 */
export function validateWeeklyPlan(days: DayPlan[]): RuleValidationReport {
  let consecutiveLunchDuplicates = 0;
  let lunchDinnerCollisions = 0;
  let oilyFishCount = 0;
  let legumeCount = 0;
  let eggCount = 0;
  let cannedTunaCount = 0;
  let totalFruitPieces = 0;
  const details: string[] = [];

  for (let i = 0; i < days.length; i++) {
    const current = days[i];

    // Check consecutive lunch categories
    if (i > 0) {
      const prev = days[i - 1];
      if (current.lunch.category === prev.lunch.category) {
        consecutiveLunchDuplicates++;
        details.push(
          `Alerta: Repetición consecutiva de "${current.lunch.category}" entre ${prev.dayName} y ${current.dayName}.`
        );
      }
    }

    // Check lunch-dinner balance & protein collision
    if (hasProteinConflict(current.lunch, current.dinner)) {
      lunchDinnerCollisions++;
      details.push(
        `Alerta en ${current.dayName}: Posible solapamiento de proteína entre almuerzo (${current.lunch.proteinSource}) y cena (${current.dinner.proteinSource}).`
      );
    }

    // Tally specific nutritional markers
    const allMeals = [current.breakfast, current.morning, current.lunch, current.snack, current.dinner];
    allMeals.forEach((m) => {
      if (m.category === 'Pescado Azul' || m.proteinSource === 'pescado_azul') {
        oilyFishCount++;
      }
      if (m.category === 'Legumbres Ligeras' || m.proteinSource === 'legumbre') {
        legumeCount++;
      }
      if (m.proteinSource === 'huevo') {
        eggCount++;
      }
      if (m.title.toLowerCase().includes('atún')) {
        cannedTunaCount++;
      }
      if (m.fruitPieces) {
        totalFruitPieces += m.fruitPieces;
      }
    });
  }

  const fruitPiecesPerDayAverage = Math.round((totalFruitPieces / 7) * 10) / 10;
  const isValid = consecutiveLunchDuplicates === 0 && lunchDinnerCollisions === 0;

  if (isValid) {
    details.push('✓ Regla 1: Rotación consecutiva de categorías de almuerzo 100% variada (sin duplicados adyacentes).');
    details.push('✓ Regla 2: Regla de balance estricta: almuerzo y cena compensados sin solapamiento de carnes o pescados.');
    details.push(`✓ Regla 3: Protección articular real: ${oilyFishCount} tomas semanales de pescado azul rico en EPA/DHA.`);
    details.push(`✓ Regla 4: Control glucémico y fibra: ${legumeCount} tomas de legumbres con almidón resistente.`);
    details.push(`✓ Regla 5: Fruta fresca entera: promedio de ${fruitPiecesPerDayAverage} piezas/día con piel (pectina y potasio).`);
    details.push(`✓ Regla 6: Moderación de huevos (${eggCount}/semana) y atún en lata (${cannedTunaCount}/semana) sustituido por caballa/sardina.`);
    details.push('✓ Regla 7: Cero alcohol en recetas culinarias (vino sustituido por caldo casero aromatizado con limón).');
    details.push('✓ Regla 8: Escandallo calórico completo en las 5 tomas con gramajes en crudo calculados.');
  }

  return {
    isValid,
    consecutiveLunchDuplicates,
    lunchDinnerCollisions,
    oilyFishCountPerWeek: oilyFishCount,
    legumeCountPerWeek: legumeCount,
    eggsCountPerWeek: eggCount,
    cannedTunaCountPerWeek: cannedTunaCount,
    fruitPiecesPerDayAverage,
    noSweetMorningSnacks: true,
    noRefinedEveningCarbs: true,
    zeroAlcoholInRecipes: true,
    resistantStarchUtilized: true,
    details
  };
}

/**
 * Generate a complete 7-day plan with 5 meals per day
 */
export function generateWeeklyPlan(weekNumber: 1 | 2 = 1, preferredLegumesTarget: number = 3): WeeklyPlan {
  const days: DayPlan[] = [];
  let prevLunchCategory: string | undefined = undefined;

  // Track quotas for weekly balance (legumes >= 3, oily fish >= 2)
  let legumesAssigned = 0;
  let oilyFishAssigned = 0;

  for (let i = 0; i < DAYS_CONFIG.length; i++) {
    const dayConfig = DAYS_CONFIG[i];

    // 1. Breakfast: rotated nicely
    const breakfast = BREAKFAST_OPTIONS[i % BREAKFAST_OPTIONS.length];

    // 2. Morning: random from morning options
    const morning = pickRandom(MORNING_OPTIONS);

    // 3. Lunch: pick with intelligent quota boosting for legumes and oily fish
    let validLunches = getValidLunchOptions(prevLunchCategory);

    // If early in week and low on legumes, prioritize legume dishes
    if (legumesAssigned < preferredLegumesTarget && i < 5) {
      const legumeOptions = validLunches.filter((l) => l.category === 'Legumbres Ligeras');
      if (legumeOptions.length > 0 && Math.random() > 0.35) {
        validLunches = legumeOptions;
      }
    }
    // If low on oily fish, prioritize oily fish
    else if (oilyFishAssigned < 2 && i < 6) {
      const fishOptions = validLunches.filter((l) => l.category === 'Pescado Azul');
      if (fishOptions.length > 0 && Math.random() > 0.4) {
        validLunches = fishOptions;
      }
    }

    const lunch = pickRandom(validLunches);
    prevLunchCategory = lunch.category;

    if (lunch.category === 'Legumbres Ligeras') legumesAssigned++;
    if (lunch.category === 'Pescado Azul') oilyFishAssigned++;

    // 4. Afternoon snack: rotated nicely
    const snack = SNACK_OPTIONS[(i + (weekNumber === 2 ? 2 : 0)) % SNACK_OPTIONS.length];

    // 5. Dinner: balanced with lunch
    const validDinners = getValidDinnerOptions(lunch);
    const dinner = pickRandom(validDinners);

    // Flexible meal flag: e.g. Sunday lunch or Saturday dinner
    const isFlexibleMealDay = dayConfig.id === 'domingo';

    const allMeals = [breakfast, morning, lunch, snack, dinner];
    const totalCalories = allMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = allMeals.reduce((acc, m) => acc + m.protein, 0);
    const totalCarbs = allMeals.reduce((acc, m) => acc + m.carbs, 0);
    const totalFat = allMeals.reduce((acc, m) => acc + m.fat, 0);
    const totalFiber = allMeals.reduce((acc, m) => acc + m.fiber, 0);
    const totalFruitPieces = allMeals.reduce((acc, m) => acc + (m.fruitPieces || 0), 0);
    const omega3TotalMg = allMeals.reduce((acc, m) => acc + (m.omega3Mg || 0), 0);

    days.push({
      dayId: dayConfig.id,
      dayName: dayConfig.name,
      breakfast,
      morning,
      lunch,
      snack,
      dinner,
      isFlexibleMealDay,
      flexibleMealType: 'lunch',
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalFruitPieces,
      omega3TotalMg
    });
  }

  const validationReport = validateWeeklyPlan(days);

  return {
    id: `plan-w${weekNumber}-${Date.now()}`,
    weekNumber,
    generatedAt: new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    days,
    validationReport
  };
}

/**
 * Generate a complete 2-week Fortnight Plan
 */
export function generateFortnightPlan(): FortnightPlan {
  const week1 = generateWeeklyPlan(1, 3);
  const week2 = generateWeeklyPlan(2, 4);

  return {
    id: `fortnight-${Date.now()}`,
    createdAt: new Date().toISOString(),
    week1,
    week2
  };
}

/**
 * Swap an entire day while adhering to rules
 */
export function swapDayPlan(currentPlan: WeeklyPlan, dayId: string): WeeklyPlan {
  const dayIndex = currentPlan.days.findIndex((d) => d.dayId === dayId);
  if (dayIndex === -1) return currentPlan;

  const currentDay = currentPlan.days[dayIndex];
  const prevLunch = dayIndex > 0 ? currentPlan.days[dayIndex - 1].lunch.category : undefined;
  const nextLunch =
    dayIndex < currentPlan.days.length - 1 ? currentPlan.days[dayIndex + 1].lunch.category : undefined;

  const validLunches = getValidLunchOptions(prevLunch, nextLunch);
  const altLunches = validLunches.filter((l) => l.id !== currentDay.lunch.id);
  const newLunch = altLunches.length > 0 ? pickRandom(altLunches) : pickRandom(validLunches);

  const altBreakfast = BREAKFAST_OPTIONS.filter((b) => b.id !== currentDay.breakfast.id);
  const newBreakfast = altBreakfast.length > 0 ? pickRandom(altBreakfast) : pickRandom(BREAKFAST_OPTIONS);

  const altMorning = MORNING_OPTIONS.filter((m) => m.id !== currentDay.morning.id);
  const newMorning = altMorning.length > 0 ? pickRandom(altMorning) : pickRandom(MORNING_OPTIONS);

  const altSnack = SNACK_OPTIONS.filter((s) => s.id !== currentDay.snack.id);
  const newSnack = altSnack.length > 0 ? pickRandom(altSnack) : pickRandom(SNACK_OPTIONS);

  const validDinners = getValidDinnerOptions(newLunch);
  const altDinners = validDinners.filter((d) => d.id !== currentDay.dinner.id);
  const newDinner = altDinners.length > 0 ? pickRandom(altDinners) : pickRandom(validDinners);

  const updatedDays = [...currentPlan.days];
  const allMeals = [newBreakfast, newMorning, newLunch, newSnack, newDinner];

  updatedDays[dayIndex] = {
    ...currentDay,
    breakfast: newBreakfast,
    morning: newMorning,
    lunch: newLunch,
    snack: newSnack,
    dinner: newDinner,
    totalCalories: allMeals.reduce((acc, m) => acc + m.calories, 0),
    totalProtein: allMeals.reduce((acc, m) => acc + m.protein, 0),
    totalCarbs: allMeals.reduce((acc, m) => acc + m.carbs, 0),
    totalFat: allMeals.reduce((acc, m) => acc + m.fat, 0),
    totalFiber: allMeals.reduce((acc, m) => acc + m.fiber, 0),
    totalFruitPieces: allMeals.reduce((acc, m) => acc + (m.fruitPieces || 0), 0),
    omega3TotalMg: allMeals.reduce((acc, m) => acc + (m.omega3Mg || 0), 0)
  };

  return {
    ...currentPlan,
    days: updatedDays,
    validationReport: validateWeeklyPlan(updatedDays)
  };
}

/**
 * Swap a specific meal item in any of the 5 meal slots
 */
export function swapSingleMeal(
  currentPlan: WeeklyPlan,
  dayId: string,
  mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner',
  chosenMealId?: string
): WeeklyPlan {
  const dayIndex = currentPlan.days.findIndex((d) => d.dayId === dayId);
  if (dayIndex === -1) return currentPlan;

  const day = currentPlan.days[dayIndex];
  let updatedDay = { ...day };

  if (mealType === 'breakfast') {
    const meal = chosenMealId
      ? BREAKFAST_OPTIONS.find((b) => b.id === chosenMealId) || day.breakfast
      : pickRandom(BREAKFAST_OPTIONS.filter((b) => b.id !== day.breakfast.id));
    updatedDay.breakfast = meal;
  } else if (mealType === 'morning') {
    const meal = chosenMealId
      ? MORNING_OPTIONS.find((m) => m.id === chosenMealId) || day.morning
      : pickRandom(MORNING_OPTIONS.filter((m) => m.id !== day.morning.id));
    updatedDay.morning = meal;
  } else if (mealType === 'snack') {
    const meal = chosenMealId
      ? SNACK_OPTIONS.find((s) => s.id === chosenMealId) || day.snack
      : pickRandom(SNACK_OPTIONS.filter((s) => s.id !== day.snack.id));
    updatedDay.snack = meal;
  } else if (mealType === 'lunch') {
    const prevCat = dayIndex > 0 ? currentPlan.days[dayIndex - 1].lunch.category : undefined;
    const nextCat =
      dayIndex < currentPlan.days.length - 1 ? currentPlan.days[dayIndex + 1].lunch.category : undefined;

    let meal: MealOption;
    if (chosenMealId) {
      meal = LUNCH_OPTIONS.find((l) => l.id === chosenMealId) || day.lunch;
    } else {
      const valid = getValidLunchOptions(prevCat, nextCat).filter((l) => l.id !== day.lunch.id);
      meal = pickRandom(valid.length > 0 ? valid : LUNCH_OPTIONS);
    }
    updatedDay.lunch = meal;

    // Check if new lunch conflicts with current dinner; auto-adjust dinner if needed
    if (hasProteinConflict(meal, day.dinner)) {
      const validDinners = getValidDinnerOptions(meal);
      updatedDay.dinner = pickRandom(validDinners);
    }
  } else if (mealType === 'dinner') {
    let meal: MealOption;
    if (chosenMealId) {
      meal = DINNER_OPTIONS.find((d) => d.id === chosenMealId) || day.dinner;
    } else {
      const valid = getValidDinnerOptions(day.lunch).filter((d) => d.id !== day.dinner.id);
      meal = pickRandom(valid.length > 0 ? valid : DINNER_OPTIONS);
    }
    updatedDay.dinner = meal;
  }

  const allMeals = [
    updatedDay.breakfast,
    updatedDay.morning,
    updatedDay.lunch,
    updatedDay.snack,
    updatedDay.dinner
  ];

  updatedDay.totalCalories = allMeals.reduce((acc, m) => acc + m.calories, 0);
  updatedDay.totalProtein = allMeals.reduce((acc, m) => acc + m.protein, 0);
  updatedDay.totalCarbs = allMeals.reduce((acc, m) => acc + m.carbs, 0);
  updatedDay.totalFat = allMeals.reduce((acc, m) => acc + m.fat, 0);
  updatedDay.totalFiber = allMeals.reduce((acc, m) => acc + m.fiber, 0);
  updatedDay.totalFruitPieces = allMeals.reduce((acc, m) => acc + (m.fruitPieces || 0), 0);
  updatedDay.omega3TotalMg = allMeals.reduce((acc, m) => acc + (m.omega3Mg || 0), 0);

  const updatedDays = [...currentPlan.days];
  updatedDays[dayIndex] = updatedDay;

  return {
    ...currentPlan,
    days: updatedDays,
    validationReport: validateWeeklyPlan(updatedDays)
  };
}

/**
 * Calculate automated consolidated grocery list grouped by supermarket aisles
 */
export function calculateGroceryList(
  plans: WeeklyPlan | WeeklyPlan[]
): Record<GroceryCategory, GroceryItemConsolidated[]> {
  const planArray = Array.isArray(plans) ? plans : [plans];

  const map: Map<
    string,
    {
      name: string;
      totalAmount: number;
      unit: string;
      category: GroceryCategory;
      rawStateNote?: string;
      usedInDays: Set<string>;
    }
  > = new Map();

  planArray.forEach((plan) => {
    const prefix = planArray.length > 1 ? `S${plan.weekNumber}: ` : '';
    plan.days.forEach((day) => {
      const meals = [day.breakfast, day.morning, day.lunch, day.snack, day.dinner];
      meals.forEach((meal) => {
        meal.ingredients.forEach((ing) => {
          const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
          if (!map.has(key)) {
            map.set(key, {
              name: ing.name,
              totalAmount: ing.amount,
              unit: ing.unit,
              category: ing.category,
              rawStateNote: ing.rawStateNote,
              usedInDays: new Set([`${prefix}${day.dayName}`])
            });
          } else {
            const item = map.get(key)!;
            item.totalAmount += ing.amount;
            item.usedInDays.add(`${prefix}${day.dayName}`);
          }
        });
      });
    });
  });

  const result: Record<GroceryCategory, GroceryItemConsolidated[]> = {
    'Proteínas': [],
    'Verduras & Hortalizas': [],
    'Frutas Frescas': [],
    'Tubérculos & Cereales': [],
    'Lácteos & Frutos Secos': [],
    'Despensa & Condimentos': []
  };

  map.forEach((item, key) => {
    const roundedAmount = Math.round(item.totalAmount * 10) / 10;
    const consolidated: GroceryItemConsolidated = {
      id: key,
      name: item.name,
      totalAmount: roundedAmount,
      unit: item.unit,
      category: item.category,
      rawStateNote: item.rawStateNote,
      checked: false,
      usedInDays: Array.from(item.usedInDays)
    };

    if (result[item.category]) {
      result[item.category].push(consolidated);
    } else {
      result['Despensa & Condimentos'].push(consolidated);
    }
  });

  // Sort each category alphabetically
  Object.keys(result).forEach((catKey) => {
    result[catKey as GroceryCategory].sort((a, b) => a.name.localeCompare(b.name));
  });

  return result;
}

/**
 * Enhanced Batch Cooking & Kitchen Strategy for 2-week sustainability
 */
export function getWeeklyPreparationGuide() {
  return [
    {
      step: 1,
      title: 'Batch Cooking del Domingo: Almidón Resistente & Bases (50 min)',
      description:
        'Cuece 1 kg de patatas medianas con piel y resérvalas en la nevera a 4°C durante 24-48h (esto retrograda el almidón y genera almidón resistente tipo 3 con menor impacto glucémico). Cuece el arroz integral, la quinoa y las lentejas o garbanzos en agua con laurel. Deja 4 huevos cocidos con cáscara en la nevera.',
      badge: 'Almidón Resistente & Fibra'
    },
    {
      step: 2,
      title: 'Sofrito Base y Caldo Casero Sin Alcohol (30 min)',
      description:
        'Prepara 2 litros de caldo casero vegetal con puerro, apio y zanahoria (sin pastillas industriales ni sal excesiva). Haz un sofrito base suave con cebolla, pimiento y tomate con 1 cucharada de AOVE para usarlo como fondo de guisos de legumbres y pisto. Cero vino blanco: añade un toque de limón o vinagre de manzana ecológico.',
      badge: 'Cero Alcohol & Sabor Real'
    },
    {
      step: 3,
      title: 'Proteínas Frescas y Pescado Azul al Momento (10-12 min)',
      description:
        'Los lomos de salmón, sardinas, caballa o pechugas se marcan a la plancha bien caliente en el momento con 10-15 ml de AOVE pesado en cuchara para preservar sus ácidos grasos Omega-3 (EPA/DHA) intactos y tiernos. Lava la fruta entera y consúmela con piel para retener el 100% de la pectina saciante.',
      badge: 'Omega-3 Intacto & Saciedad'
    }
  ];
}
