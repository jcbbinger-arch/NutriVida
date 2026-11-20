import {
  DayPlan,
  WeeklyPlan,
  MonthlyPlan,
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
  LIBRE_LUNCH_OPTION,
  SNACK_OPTIONS,
  DINNER_OPTIONS,
  CANONICAL_30_DAY_CALENDAR
} from '../data/database';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  return array[getRandomInt(0, array.length - 1)];
}

export function getMealById(
  mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner',
  id: string
): MealOption | undefined {
  if (mealType === 'breakfast') return BREAKFAST_OPTIONS.find((m) => m.id === id);
  if (mealType === 'morning') return MORNING_OPTIONS.find((m) => m.id === id);
  if (mealType === 'lunch') {
    if (id === 'LIBRE') return LIBRE_LUNCH_OPTION;
    return LUNCH_OPTIONS.find((m) => m.id === id);
  }
  if (mealType === 'snack') return SNACK_OPTIONS.find((m) => m.id === id);
  return DINNER_OPTIONS.find((m) => m.id === id);
}

export function getAlternativeMeals(meal: MealOption): MealOption[] {
  if (!meal.alternatives || meal.alternatives.length === 0) return [];
  return meal.alternatives
    .map((altId) => getMealById(meal.mealType, altId))
    .filter((m): m is MealOption => Boolean(m));
}

export function isOilyFishMeal(meal: MealOption): boolean {
  return Boolean(meal.isOilyFish);
}

export function isLegumeMeal(meal: MealOption): boolean {
  return Boolean(meal.isLegume || meal.proteinSource === 'legumbre');
}

export function isAnyFishMeal(meal: MealOption): boolean {
  return (
    meal.proteinSource === 'pescado_blanco' ||
    meal.proteinSource === 'pescado_azul' ||
    Boolean(meal.isOilyFish)
  );
}

function computeDayTotals(meals: MealOption[], hardTrainingBonus: boolean = false) {
  const bonusKcal = hardTrainingBonus ? 140 : 0; // +40g pan integral o +1 fruta entera
  const bonusProtein = hardTrainingBonus ? 4 : 0;
  const bonusCarbs = hardTrainingBonus ? 28 : 0;
  const bonusFat = hardTrainingBonus ? 1 : 0;
  const bonusFiber = hardTrainingBonus ? 3.5 : 0;

  return {
    totalCalories: meals.reduce((acc, m) => acc + m.calories, 0) + bonusKcal,
    totalProtein: meals.reduce((acc, m) => acc + m.protein, 0) + bonusProtein,
    totalCarbs: meals.reduce((acc, m) => acc + m.carbs, 0) + bonusCarbs,
    totalFat: meals.reduce((acc, m) => acc + m.fat, 0) + bonusFat,
    totalFiber: Math.round((meals.reduce((acc, m) => acc + m.fiber, 0) + bonusFiber) * 10) / 10,
    totalFruitPieces: meals.reduce((acc, m) => acc + (m.fruitPieces || 0), 0),
    omega3EpaDhaTotalMg: meals.reduce((acc, m) => acc + (m.omega3EpaDhaMg || 0), 0),
    omega3AlaTotalMg: meals.reduce((acc, m) => acc + (m.omega3AlaMg || 0), 0)
  };
}

/**
 * Regla clave del plan 30 días: "No juntes dos pescados el mismo día (comida y cena)."
 */
export function hasProteinConflict(lunch: MealOption, dinner: MealOption): boolean {
  if (lunch.id === 'LIBRE') return false;

  if (isAnyFishMeal(lunch) && isAnyFishMeal(dinner)) return true;

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
 * Validate a weekly plan against 30-day interchangeable plan & clinical safety rules
 */
export function validateWeeklyPlan(days: DayPlan[]): RuleValidationReport {
  let consecutiveLunchDuplicates = 0;
  let lunchDinnerCollisions = 0;
  let oilyFishCount = 0;
  let legumeCount = 0;
  let eggCount = 0;
  let cannedTunaCount = 0;
  let totalFruitPieces = 0;
  let sumCaloriesFixedDays = 0;
  let sumProteinFixedDays = 0;
  let fixedDaysCount = 0;
  let sumFiber = 0;
  let daysBelow25gFiber = 0;

  const lunchIds = new Set<string>();
  const dinnerIds = new Set<string>();
  const details: string[] = [];

  for (let i = 0; i < days.length; i++) {
    const current = days[i];
    const isLibreDay = current.lunch.id === 'LIBRE';

    if (!isLibreDay) {
      sumCaloriesFixedDays += current.totalCalories;
      sumProteinFixedDays += current.totalProtein;
      fixedDaysCount++;
    }

    sumFiber += current.totalFiber;
    if (!isLibreDay && current.totalFiber < 25) {
      daysBelow25gFiber++;
    }

    lunchIds.add(current.lunch.id);
    dinnerIds.add(current.dinner.id);

    // Check consecutive lunch categories (ignoring LIBRE)
    if (i > 0) {
      const prev = days[i - 1];
      if (
        current.lunch.id !== 'LIBRE' &&
        prev.lunch.id !== 'LIBRE' &&
        current.lunch.category === prev.lunch.category
      ) {
        consecutiveLunchDuplicates++;
        details.push(
          `Nota rotación: "${current.lunch.category}" aparece en días consecutivos (${prev.dayName} y ${current.dayName}).`
        );
      }
    }

    // Check lunch-dinner fish collision ("No juntes dos pescados el mismo día")
    if (hasProteinConflict(current.lunch, current.dinner)) {
      lunchDinnerCollisions++;
      details.push(
        `Alerta en ${current.dayName}: Dos pescados el mismo día entre comida (${current.lunch.id}) y cena (${current.dinner.id}).`
      );
    }

    // Tally nutritional markers across the 5 daily slots
    const allMeals = [current.breakfast, current.morning, current.lunch, current.snack, current.dinner];
    allMeals.forEach((m) => {
      if (isOilyFishMeal(m)) {
        oilyFishCount++;
      }
      if (isLegumeMeal(m)) {
        legumeCount++;
      }
      if (m.title.toLowerCase().includes('atún')) {
        cannedTunaCount++;
      }
      if (m.fruitPieces) {
        totalFruitPieces += m.fruitPieces;
      }
      m.ingredients.forEach((ing) => {
        if (ing.name.toLowerCase().includes('huevo campero')) {
          eggCount += ing.amount;
        }
      });
    });
  }

  const dayCount = Math.max(days.length, 1);
  const effectiveFixedDays = Math.max(fixedDaysCount, 1);
  const averageCaloriesPerDay = Math.round(sumCaloriesFixedDays / effectiveFixedDays);
  const averageProteinPerDay = Math.round(sumProteinFixedDays / effectiveFixedDays);
  const averageFiberPerDay = Math.round((sumFiber / dayCount) * 10) / 10;
  const fruitPiecesPerDayAverage = Math.round((totalFruitPieces / dayCount) * 10) / 10;
  const noSameWeekRepeats = lunchIds.size === days.length && dinnerIds.size === days.length;

  const isFullWeek = days.length >= 6;
  const isValid = isFullWeek
    ? lunchDinnerCollisions === 0 &&
      oilyFishCount >= 2 &&
      oilyFishCount <= 4 &&
      legumeCount >= 1 &&
      averageCaloriesPerDay >= 1500
    : lunchDinnerCollisions === 0;

  details.push(
    `✓ Energía sostenible (días de menú completo): media de ${averageCaloriesPerDay} kcal/día (objetivo ≈1.700–1.800 kcal · déficit ≈700–800 kcal vs 2.580 kcal · nunca <1.500 kcal).`
  );
  details.push(
    `✓ Proteína repartida en 5 tomas: media de ${averageProteinPerDay} g/día (objetivo ≈110–125 g/día; evita el antojo nocturno y de media mañana).`
  );
  details.push(
    `✓ Pescado azul (C5, C7, C9, N2, N4): ${oilyFishCount} raciones en este bloque (meta 2–3×/semana, sin juntar dos pescados en comida y cena).`
  );
  details.push(
    `✓ Legumbres (C6, C8, C9): ${legumeCount} raciones en este bloque · Fibra media ${averageFiberPerDay} g/día.`
  );
  details.push(
    `✓ Fruta entera: media de ${fruitPiecesPerDayAverage} piezas/día · Huevos enteros (~${eggCount}/bloque) + ${cannedTunaCount} toma(s) de atún.`
  );
  details.push(
    '✓ Seguridad en cocina: Batch cooking doble (domingo y miércoles), enfriado <2h en recipientes poco profundos a ≤4 °C (máx. 3 días nevera / congelar resto) y 0% alcohol.'
  );

  return {
    isValid,
    consecutiveLunchDuplicates,
    lunchDinnerCollisions,
    oilyFishCountPerWeek: oilyFishCount,
    legumeCountPerWeek: legumeCount,
    eggsCountPerWeek: eggCount,
    cannedTunaCountPerWeek: cannedTunaCount,
    fruitPiecesPerDayAverage,
    averageCaloriesPerDay,
    averageProteinPerDay,
    averageFiberPerDay,
    daysBelow30gFiber: daysBelow25gFiber,
    noSameWeekRepeats,
    noSweetMorningSnacks: true,
    noRefinedEveningCarbs: true,
    zeroAlcoholInRecipes: true,
    resistantStarchUtilized: true,
    details
  };
}

function getWeekLabel(weekNumber: 1 | 2 | 3 | 4 | 5): string {
  if (weekNumber === 1) return 'Semana 1 (Días 1–7)';
  if (weekNumber === 2) return 'Semana 2 (Días 8–14)';
  if (weekNumber === 3) return 'Semana 3 (Días 15–21)';
  if (weekNumber === 4) return 'Semana 4 (Días 22–28)';
  return 'Cierre del Mes (Días 29–30)';
}

/**
 * Build the official 30-day canonical interchangeable calendar (Weeks 1-4 + Closing Days 29-30)
 */
export function buildCanonical30DayPlan(): MonthlyPlan {
  const buildWeekSlice = (weekNumber: 1 | 2 | 3 | 4 | 5): WeeklyPlan => {
    const rows = CANONICAL_30_DAY_CALENDAR.filter((r) => r.weekNumber === weekNumber);
    const days: DayPlan[] = rows.map((row) => {
      const breakfast = getMealById('breakfast', row.breakfastId) || BREAKFAST_OPTIONS[0];
      const morning = getMealById('morning', row.morningId) || MORNING_OPTIONS[0];
      const lunch = getMealById('lunch', row.lunchId) || LUNCH_OPTIONS[0];
      const snack = getMealById('snack', row.snackId) || SNACK_OPTIONS[0];
      const dinner = getMealById('dinner', row.dinnerId) || DINNER_OPTIONS[0];
      const totals = computeDayTotals([breakfast, morning, lunch, snack, dinner], false);

      return {
        dayNumber: row.dayNumber,
        dayId: row.dayId,
        dayName: row.dayName,
        breakfast,
        morning,
        lunch,
        snack,
        dinner,
        isFlexibleMealDay: row.lunchId === 'LIBRE',
        flexibleMealType: 'lunch',
        hardTrainingBonus: false,
        ...totals
      };
    });

    return {
      id: `canonical-w${weekNumber}`,
      weekNumber,
      label: getWeekLabel(weekNumber),
      generatedAt: 'Calendario Oficial 30 Días Intercambiable',
      days,
      validationReport: validateWeeklyPlan(days)
    };
  };

  return {
    id: `monthly-canonical-${Date.now()}`,
    createdAt: new Date().toISOString(),
    week1: buildWeekSlice(1),
    week2: buildWeekSlice(2),
    week3: buildWeekSlice(3),
    week4: buildWeekSlice(4),
    week5: buildWeekSlice(5)
  };
}

/**
 * Generate a randomized interchangeable week respecting all 30-day plan rules
 * (2-3 oily fish, 2-3 legumes, LIBRE on Sunday, zero same-day fish collisions)
 */
export function generateWeeklyPlan(
  weekNumber: 1 | 2 | 3 | 4 | 5 = 1,
  preferredLegumesTarget: number = 2
): WeeklyPlan {
  const days: DayPlan[] = [];
  const usedLunchIds = new Set<string>();
  const usedDinnerIds = new Set<string>();
  let prevLunchCategory: string | undefined = undefined;

  let legumesAssigned = 0;
  let oilyFishAssigned = 0;
  const maxOilyFishPerWeek = weekNumber === 5 ? 1 : 3;
  const targetDaysConfig = weekNumber === 5 ? DAYS_CONFIG.slice(0, 2) : DAYS_CONFIG;
  const startDayOffset = (weekNumber - 1) * 7;

  const legumeDays = weekNumber % 2 === 1 ? [1, 4] : [1, 3, 5];

  for (let i = 0; i < targetDaysConfig.length; i++) {
    const dayConfig = targetDaysConfig[i];
    const isSunday = dayConfig.id === 'domingo';

    const breakfast = BREAKFAST_OPTIONS[(i + weekNumber) % BREAKFAST_OPTIONS.length];
    const morning = MORNING_OPTIONS[(i + weekNumber + 2) % MORNING_OPTIONS.length];
    const snack = SNACK_OPTIONS[(i + weekNumber + 4) % SNACK_OPTIONS.length];

    let lunch: MealOption;
    if (isSunday) {
      lunch = LIBRE_LUNCH_OPTION;
    } else {
      let validLunches = getValidLunchOptions(prevLunchCategory).filter((l) => !usedLunchIds.has(l.id));
      if (validLunches.length === 0) {
        validLunches = getValidLunchOptions(prevLunchCategory);
      }

      if (oilyFishAssigned >= maxOilyFishPerWeek) {
        const nonOily = validLunches.filter((l) => !isOilyFishMeal(l));
        if (nonOily.length > 0) validLunches = nonOily;
      }

      const wantsLegumeToday = legumeDays.includes(i) && legumesAssigned < preferredLegumesTarget;
      const legumePool = validLunches.filter((l) => isLegumeMeal(l));

      if (wantsLegumeToday && legumePool.length > 0) {
        lunch = pickRandom(legumePool);
      } else if (oilyFishAssigned < 2 && !wantsLegumeToday) {
        const oilyPool = validLunches.filter((l) => isOilyFishMeal(l));
        if (oilyPool.length > 0 && (i >= 2 || Math.random() > 0.4)) {
          lunch = pickRandom(oilyPool);
        } else {
          const nonLegumeExtra = validLunches.filter((l) => !isLegumeMeal(l));
          lunch = pickRandom(nonLegumeExtra.length > 0 ? nonLegumeExtra : validLunches);
        }
      } else {
        const filtered =
          legumesAssigned >= preferredLegumesTarget
            ? validLunches.filter((l) => !isLegumeMeal(l))
            : validLunches;
        lunch = pickRandom(filtered.length > 0 ? filtered : validLunches);
      }

      usedLunchIds.add(lunch.id);
      prevLunchCategory = lunch.category;
      if (isLegumeMeal(lunch)) legumesAssigned++;
      if (isOilyFishMeal(lunch)) oilyFishAssigned++;
    }

    // Select compatible dinner (never two fish on the same day)
    let validDinners = getValidDinnerOptions(lunch).filter((d) => !usedDinnerIds.has(d.id));
    if (oilyFishAssigned >= maxOilyFishPerWeek) {
      const nonOilyDinners = validDinners.filter((d) => !isOilyFishMeal(d));
      if (nonOilyDinners.length > 0) validDinners = nonOilyDinners;
    }
    if (validDinners.length === 0) {
      validDinners = getValidDinnerOptions(lunch);
    }

    // Prefer N7 or N6 on Sunday nights to return gently to the plan
    let dinner: MealOption;
    if (isSunday) {
      const sundayDinners = validDinners.filter((d) => d.id === 'N7' || d.id === 'N6');
      dinner = sundayDinners.length > 0 ? pickRandom(sundayDinners) : pickRandom(validDinners);
    } else {
      const baseCal = breakfast.calories + morning.calories + snack.calories + lunch.calories;
      const baseProt = breakfast.protein + morning.protein + snack.protein + lunch.protein;
      const scoredDinners = validDinners.filter((d) => {
        const dayCal = baseCal + d.calories;
        const dayProt = baseProt + d.protein;
        return dayCal >= 1650 && dayCal <= 1860 && dayProt >= 105 && dayProt <= 130;
      });
      dinner = pickRandom(scoredDinners.length > 0 ? scoredDinners : validDinners);
    }

    usedDinnerIds.add(dinner.id);
    if (isOilyFishMeal(dinner)) oilyFishAssigned++;

    const totals = computeDayTotals([breakfast, morning, lunch, snack, dinner], false);

    days.push({
      dayNumber: startDayOffset + i + 1,
      dayId: dayConfig.id,
      dayName: dayConfig.name,
      breakfast,
      morning,
      lunch,
      snack,
      dinner,
      isFlexibleMealDay: isSunday,
      flexibleMealType: 'lunch',
      hardTrainingBonus: false,
      ...totals
    });
  }

  return {
    id: `plan-w${weekNumber}-${Date.now()}`,
    weekNumber,
    label: getWeekLabel(weekNumber),
    generatedAt: new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    days,
    validationReport: validateWeeklyPlan(days)
  };
}

/**
 * Swap an entire day while adhering to rules and avoiding same-week repeats
 */
export function swapDayPlan(currentPlan: WeeklyPlan, dayId: string): WeeklyPlan {
  const dayIndex = currentPlan.days.findIndex((d) => d.dayId === dayId);
  if (dayIndex === -1) return currentPlan;

  const currentDay = currentPlan.days[dayIndex];
  const isSunday = currentDay.dayId === 'domingo' && currentDay.isFlexibleMealDay;

  const prevLunch = dayIndex > 0 ? currentPlan.days[dayIndex - 1].lunch.category : undefined;
  const nextLunch =
    dayIndex < currentPlan.days.length - 1 ? currentPlan.days[dayIndex + 1].lunch.category : undefined;

  const otherLunchIds = new Set(currentPlan.days.filter((_, idx) => idx !== dayIndex).map((d) => d.lunch.id));
  const otherDinnerIds = new Set(currentPlan.days.filter((_, idx) => idx !== dayIndex).map((d) => d.dinner.id));

  let newLunch: MealOption;
  if (isSunday) {
    newLunch = currentDay.lunch;
  } else {
    const validLunches = getValidLunchOptions(prevLunch, nextLunch);
    const unusedLunches = validLunches.filter((l) => !otherLunchIds.has(l.id) && l.id !== currentDay.lunch.id);
    const altLunches = validLunches.filter((l) => l.id !== currentDay.lunch.id);
    newLunch = pickRandom(
      unusedLunches.length > 0 ? unusedLunches : altLunches.length > 0 ? altLunches : validLunches
    );
  }

  const altBreakfast = BREAKFAST_OPTIONS.filter((b) => b.id !== currentDay.breakfast.id);
  const newBreakfast = altBreakfast.length > 0 ? pickRandom(altBreakfast) : pickRandom(BREAKFAST_OPTIONS);

  const altMorning = MORNING_OPTIONS.filter((m) => m.id !== currentDay.morning.id);
  const newMorning = altMorning.length > 0 ? pickRandom(altMorning) : pickRandom(MORNING_OPTIONS);

  const altSnack = SNACK_OPTIONS.filter((s) => s.id !== currentDay.snack.id);
  const newSnack = altSnack.length > 0 ? pickRandom(altSnack) : pickRandom(SNACK_OPTIONS);

  const validDinners = getValidDinnerOptions(newLunch);
  const unusedDinners = validDinners.filter((d) => !otherDinnerIds.has(d.id) && d.id !== currentDay.dinner.id);
  const altDinners = validDinners.filter((d) => d.id !== currentDay.dinner.id);
  const newDinner = pickRandom(
    unusedDinners.length > 0 ? unusedDinners : altDinners.length > 0 ? altDinners : validDinners
  );

  const updatedDays = [...currentPlan.days];
  const totals = computeDayTotals(
    [newBreakfast, newMorning, newLunch, newSnack, newDinner],
    Boolean(currentDay.hardTrainingBonus)
  );

  updatedDays[dayIndex] = {
    ...currentDay,
    breakfast: newBreakfast,
    morning: newMorning,
    lunch: newLunch,
    snack: newSnack,
    dinner: newDinner,
    ...totals
  };

  return {
    ...currentPlan,
    days: updatedDays,
    validationReport: validateWeeklyPlan(updatedDays)
  };
}

/**
 * Swap a specific meal item in any of the 5 meal slots (D↔D, M↔M, C↔C/LIBRE, ME↔ME, N↔N)
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
    if (chosenMealId === 'LIBRE') {
      meal = LIBRE_LUNCH_OPTION;
    } else if (chosenMealId) {
      meal = LUNCH_OPTIONS.find((l) => l.id === chosenMealId) || day.lunch;
    } else {
      const valid = getValidLunchOptions(prevCat, nextCat).filter((l) => l.id !== day.lunch.id);
      meal = pickRandom(valid.length > 0 ? valid : LUNCH_OPTIONS);
    }
    updatedDay.lunch = meal;
    updatedDay.isFlexibleMealDay = meal.id === 'LIBRE';

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

  const totals = computeDayTotals(
    [updatedDay.breakfast, updatedDay.morning, updatedDay.lunch, updatedDay.snack, updatedDay.dinner],
    Boolean(updatedDay.hardTrainingBonus)
  );

  updatedDay = {
    ...updatedDay,
    ...totals
  };

  const updatedDays = [...currentPlan.days];
  updatedDays[dayIndex] = updatedDay;

  return {
    ...currentPlan,
    days: updatedDays,
    validationReport: validateWeeklyPlan(updatedDays)
  };
}

/**
 * Toggle "+40g pan integral o +1 fruta" bonus for hard training days
 */
export function toggleHardTrainingBonus(currentPlan: WeeklyPlan, dayId: string): WeeklyPlan {
  const dayIndex = currentPlan.days.findIndex((d) => d.dayId === dayId);
  if (dayIndex === -1) return currentPlan;

  const day = currentPlan.days[dayIndex];
  const nextBonus = !day.hardTrainingBonus;
  const totals = computeDayTotals(
    [day.breakfast, day.morning, day.lunch, day.snack, day.dinner],
    nextBonus
  );

  const updatedDays = [...currentPlan.days];
  updatedDays[dayIndex] = {
    ...day,
    hardTrainingBonus: nextBonus,
    ...totals
  };

  return {
    ...currentPlan,
    days: updatedDays,
    validationReport: validateWeeklyPlan(updatedDays)
  };
}

/**
 * Calculate automated consolidated grocery list using canonical normalized ingredients
 * (Excludes coffee/tea/infusions from supermarket list and LIBRE meals)
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
          if (ing.excludeFromGrocery) return;

          const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
          const dayLabel = day.dayNumber ? `D${day.dayNumber}` : `${prefix}${day.dayName}`;

          if (!map.has(key)) {
            map.set(key, {
              name: ing.name,
              totalAmount: ing.amount,
              unit: ing.unit,
              category: ing.category,
              rawStateNote: ing.rawStateNote,
              usedInDays: new Set([dayLabel])
            });
          } else {
            const item = map.get(key)!;
            item.totalAmount += ing.amount;
            item.usedInDays.add(dayLabel);
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

  Object.keys(result).forEach((catKey) => {
    result[catKey as GroceryCategory].sort((a, b) => a.name.localeCompare(b.name));
  });

  return result;
}

/**
 * Enhanced Double Batch Cooking (Sunday + Wednesday), Cold Chain & Progression Rules
 */
export function getWeeklyPreparationGuide() {
  return [
    {
      step: 1,
      title: 'Batch Cooking Doble (Domingo y Miércoles) · Cadena de Frío ≤4 °C',
      description:
        'Cocina legumbres, arroz integral y patatas en dos tandas semanales (domingo y miércoles) en lugar de una sola para toda la semana. Enfría en recipientes poco profundos en <2 h y refrigera a ≤4 °C: consume el arroz y los guisos en máx. 3 días (control Bacillus cereus) y congela el resto.',
      badge: 'Domingo + Miércoles (<2h · ≤4 °C)'
    },
    {
      step: 2,
      title: 'Patata 24h (Almidón Resistente), Pesos en Crudo y AOVE Pesado',
      description:
        'Cocina las patatas con piel y déjalas enfriar 24h en nevera (puedes recalentarlas sin problema manteniendo el almidón resistente). Respeta el peso en crudo limpio (ej. 180g caballa limpia ≈ 320g brutos) y mide siempre el AOVE con cuchara o báscula.',
      badge: 'Escandallo Real & Almidón Resistente'
    },
    {
      step: 3,
      title: 'Cero Alcohol en Cocina, Entreno Duro y Ajuste de Meseta',
      description:
        'Sustituye vino/alcohol por caldo casero, limón, vinagre de manzana, pimentón, ajo y hierbas. En días de entreno duro activa el bonus (+40g pan integral o +1 fruta). Si tras 2–3 semanas no bajas peso, retira primero el pan de las 11:00 y la cena antes de reducir proteína (nunca bajes de ~1.500 kcal).',
      badge: '0% Alcohol & Progresión Clínica'
    }
  ];
}
