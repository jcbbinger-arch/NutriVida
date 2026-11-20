import { MealOption, UserProfile } from '../types/nutrition';

// FUSED PROFILE: PLAN DE 30 DÍAS INTERCAMBIABLE (5 TOMAS) + MÉTODO 5 PASOS
export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Juan (Plan 30 Días Intercambiable)',
  sex: 'male',
  age: 53,
  heightCm: 173,
  currentWeightKg: 102,
  targetWeightKg: 85,
  waistCm: 106,
  activityFactor: 1.4,
  activityLevel: 'Ligera (caminata diaria en desnivel + fuerza excéntrica 3 días/sem)',
  dailyStepsTarget: 8500,
  trainingDaysPerWeek: 3,
  jobType: 'pie',
  workSchedule: '08:00 - 17:00',
  cooksAtHome: 'cocina',
  goalType: 'lose',
  deficitPercent: 32,
  weeklyLossTargetKg: 0.65,
  mainGoal:
    'Perder peso (grasa y cintura) con déficit sostenible: ≈1.700–1.800 kcal/día · ≈110–125 g proteína · 2–3 frutas enteras · pescado azul 2–3×/sem · legumbres 2–3×/sem · 1 comida libre/sem (domingo).',
  medicalConditions: [
    'Control de glucemia / Prediabetes',
    'Protección articular (rodillas / lumbar)',
    'Control de colesterol / Perfil lipídico',
    'Menopausia o >50 años (priorizar fuerza + calcio/vit D)'
  ],
  redFlags: [],
  excludedFoods: [
    'Dulces a las 11:00 y galletas por la noche (media mañana y cena ya aportan proteína)',
    'Azúcar refinado, bollería y bebidas azucaradas o alcohólicas',
    'Gulas / surimi procesado',
    'Vino o alcohol en cocinados (sustituido por caldo casero, limón, vinagre de manzana y hierbas)',
    'Nunca bajar de ≈1.500 kcal/día (riesgo de pérdida muscular)'
  ],
  preferencesNotes: 'Prefiere comida real, batch cooking domingo y miércoles, domingo mediodía libre.',
  currentBreakfast: 'Transición a desayunos proteicos de ≈380 kcal (20–26 g P) con fruta entera y grano integral',
  hasFlexibleMeal: true,
  flexibleDay: 'domingo',
  // Mifflin-St Jeor:
  // BMR = 1.841 kcal | TDEE estimado ≈ 2.580 kcal
  // Menú base ≈ 1.750 kcal/día (factor 1,00). Ritmo esperable: 0,5–0,8 kg/sem.
  bmr: 1841,
  tdee: 2577,
  targetCalories: 1750,
  targetProteinMin: 110,
  targetProteinMax: 130,
  targetFatGrams: 58,
  targetCarbsGrams: 185,
  targetFiberDailyG: 30,
  targetWaterMl: 3060,
  adjustedWeightKg: 81.6,
  bmi: 34.1,
  scaleFactor: 1.0,
  onboardingCompleted: true,
  keyRestrictions: [
    'Plan intercambiable 30 días (D por D, M por M, C por C, ME por ME, N por N) con 2 alternativas directas por plato',
    'Mantener ≈3–4 h entre tomas. Si te saltas una toma, no la compenses con otra: sigue con la siguiente',
    'No juntes dos pescados el mismo día (comida y cena). Respeta 2–3 pescados azules y 2–3 legumbres/semana',
    'Entreno duro: suma +40 g de pan integral o +1 fruta. Si en 2–3 semanas no baja el peso, quita 100–150 kcal empezando por harinas/pan de 11:00 y cena antes de bajar proteína',
    'Batch cooking doble (domingo y miércoles): enfriado <2h en recipientes poco profundos a ≤4 °C, máx. 3 días en nevera (Bacillus cereus) y congelar resto',
    'Pesos en crudo y limpio (sin cáscara, espinas ni piel) y AOVE pesado con cuchara o báscula'
  ]
};

// ==========================================
// DESAYUNOS (08:00 · ≈380 kcal · 20–26 g P)
// ==========================================
export const BREAKFAST_OPTIONS: MealOption[] = [
  {
    id: 'D1',
    title: 'Porridge: Avena 50g + Leche Semi + Skyr 100g + Frutos Rojos',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description:
      'Copos de avena integral (50g) cocidos con 150ml de leche semidesnatada, mezclados con 100g de Skyr natural 0%, 80g de frutos rojos frescos y canela.',
    ingredients: [
      { name: 'Copos de avena integral 100%', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo' },
      { name: 'Leche semidesnatada', amount: 150, unit: 'ml', category: 'Lácteos & Frutos Secos' },
      { name: 'Skyr natural 0%', amount: 100, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'sin azúcar ni edulcorantes' },
      { name: 'Arándanos o frambuesas frescas', amount: 80, unit: 'g', category: 'Frutas Frescas', rawStateNote: 'frescos o ultracongelados sin azúcar' },
      { name: 'Canela de Ceilán pura', amount: 2, unit: 'g', category: 'Despensa & Condimentos' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 390,
    protein: 24,
    carbs: 52,
    fat: 7,
    fiber: 8.2,
    fruitPieces: 1,
    alternatives: ['D4', 'D5'],
    prepMinutes: 5,
    instructions: [
      'Calentar la leche semidesnatada con la canela y cocer los 50g de avena 3-4 minutos hasta que espese.',
      'Templar 1 minuto e incorporar los 100g de Skyr natural 0% para aportar cremosidad y proteína extra.',
      'Servir con los 80g de frutos rojos lavados.'
    ],
    scientificRationale:
      'Betaglucanos de avena + 24g de proteína láctea que amortiguan la respuesta glucémica matinal.',
    batchPrepNote: 'Conserva la mezcla preparada máx. 2 días en recipiente cerrado a ≤4 °C.'
  },
  {
    id: 'D2',
    title: 'Tostada Integral 60g + Tomate + 1 Huevo + Pavo 40g + Kiwi',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'huevo',
    description:
      'Pan 100% integral (60g) con tomate rallado (80g), 1 huevo a la plancha, 40g de pechuga de pavo (>90%), 5ml de AOVE y 1 kiwi verde entero.',
    ingredients: [
      { name: 'Pan 100% integral de grano entero', amount: 60, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral verificada' },
      { name: 'Tomate de ensalada fresco', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'rallado natural' },
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'a la plancha' },
      { name: 'Pechuga de pavo asada (>90% carne)', amount: 40, unit: 'g', category: 'Proteínas', rawStateNote: 'baja en sal' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'pesado con cuchara o báscula' },
      { name: 'Kiwi verde fresco', amount: 100, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 390,
    protein: 24,
    carbs: 38,
    fat: 14,
    fiber: 7.2,
    fruitPieces: 1,
    alternatives: ['D3', 'D6'],
    prepMinutes: 6,
    instructions: [
      'Tostar el pan 100% integral y untar el tomate rallado con 5ml de AOVE pesado en cuchara.',
      'Hacer 1 huevo a la plancha y servir junto a los 40g de pavo asado y el kiwi entero.'
    ],
    scientificRationale:
      '24g de proteína completa de huevo y ave con grano entero y kiwi rico en vitamina C y actinidina.',
    batchPrepNote: 'Porciona y congela el pan integral en rebanadas de 60g.'
  },
  {
    id: 'D3',
    title: 'Revuelto 1 Huevo + 2 Claras + Espinacas + Pan 40g + Nueces + Kiwi',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'huevo',
    description:
      'Revuelto de 1 huevo entero + 2 claras (~60ml, 1 clara ≈ 30ml) con 80g de espinacas, pan 100% integral (40g), 10g de nueces crudas y 1 kiwi.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'huevo entero' },
      { name: 'Clara de huevo pasteurizada', amount: 60, unit: 'ml', category: 'Proteínas', rawStateNote: '2 claras (1 clara ≈ 30 ml)' },
      { name: 'Espinacas frescas lavadas', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto en crudo' },
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Nueces peladas crudas', amount: 10, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Kiwi verde fresco', amount: 100, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 380,
    protein: 26,
    carbs: 28,
    fat: 16,
    fiber: 8.2,
    omega3AlaMg: 900,
    fruitPieces: 1,
    alternatives: ['D2', 'D6'],
    prepMinutes: 6,
    instructions: [
      'Saltear las espinacas 1-2 minutos en sartén antiadherente.',
      'Batir 1 huevo + 60ml de claras (2 claras) y cuajar suave.',
      'Acompañar con 40g de pan integral, 10g de nueces y el kiwi entero.'
    ],
    scientificRationale:
      '26g de proteína de alto valor biológico moderando las yemas a 1 unidad y sumando ALA vegetal de las nueces.',
    batchPrepNote: 'Una botella de claras abiertas se mantiene segura 48–72h a ≤4 °C.'
  },
  {
    id: 'D4',
    title: 'Yogur Griego 200g + Frutos Rojos 80g + Nueces 20g + Lino 10g',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description:
      '200g de yogur griego natural sin azúcar con 80g de frutos rojos frescos, 20g de nueces peladas crudas y 10g de semillas de lino molidas.',
    ingredients: [
      { name: 'Yogur griego natural sin azúcar', amount: 200, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'sin azúcares añadidos' },
      { name: 'Arándanos o frambuesas frescas', amount: 80, unit: 'g', category: 'Frutas Frescas', rawStateNote: 'frescos o ultracongelados sin azúcar' },
      { name: 'Nueces peladas crudas', amount: 20, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Semillas de lino o chía molidas', amount: 10, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'fuente vegetal de Omega-3 ALA' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 410,
    protein: 24,
    carbs: 19,
    fat: 25,
    fiber: 6.2,
    omega3AlaMg: 4000,
    fruitPieces: 1,
    alternatives: ['D1', 'D5'],
    prepMinutes: 3,
    instructions: [
      'Servir los 200g de yogur griego en un bol.',
      'Añadir los frutos rojos, el lino molido y las nueces troceadas.'
    ],
    scientificRationale:
      'Desayuno bajo en carga glucémica con alta saciedad por grasas saludables, lino rico en ALA y proteína láctea.',
    batchPrepNote: 'Conserva el lino molido en bote opaco dentro del frigorífico.'
  },
  {
    id: 'D5',
    title: 'Requesón 150g + Pan Integral 50g + Pera Entera',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description:
      '150g de requesón desnatado/bajo en grasa sobre tostada de pan 100% integral (50g) + 1 pera entera fresca con piel.',
    ingredients: [
      { name: 'Requesón desnatado 0%', amount: 150, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'bajo en grasa y sal' },
      { name: 'Pan 100% integral de grano entero', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Pera entera con piel', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera lavada' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 350,
    protein: 25,
    carbs: 42,
    fat: 7,
    fiber: 8.8,
    fruitPieces: 1,
    alternatives: ['D1', 'D4'],
    prepMinutes: 4,
    instructions: [
      'Tostar los 50g de pan 100% integral y repartir los 150g de requesón por encima.',
      'Acompañar con la pera entera lavada con su piel.'
    ],
    scientificRationale:
      '25g de caseína láctea de liberación lenta con 8,8g de fibra entre grano entero y pera con piel.',
    batchPrepNote: 'El requesón abierto debe consumirse en máx. 3 días a ≤4 °C.'
  },
  {
    id: 'D6',
    title: 'Tortilla Francesa 2 Huevos + Pan Integral 50g + Tomate + Naranja',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'huevo',
    description:
      'Tortilla francesa de 2 huevos camperos con 5ml de AOVE, 50g de pan 100% integral con tomate natural (80g) y 1 naranja entera.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 2, unit: 'ud', category: 'Proteínas', rawStateNote: 'tortilla francesa' },
      { name: 'Pan 100% integral de grano entero', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Tomate de ensalada fresco', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'rallado o en rodajas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'pesado con cuchara' },
      { name: 'Naranja entera fresca', amount: 180, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera (no zumo)' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 380,
    protein: 20,
    carbs: 38,
    fat: 16,
    fiber: 7.5,
    fruitPieces: 1,
    alternatives: ['D2', 'D3'],
    prepMinutes: 6,
    instructions: [
      'Batir 2 huevos camperos y cuajar la tortilla en sartén con los 5ml de AOVE.',
      'Acompañar con 50g de pan integral con tomate y comer la naranja entera en gajos.'
    ],
    scientificRationale:
      'Desayuno clásico saciante de 20g de proteína sin azúcares libres (fruta siempre entera).',
    batchPrepNote: 'En días que ya comas otro huevo en cena, puedes usar D2 o D3 como alternativa.'
  }
];

// ==========================================
// MEDIA MAÑANA (11:00 · ≈130–190 kcal · Sin dulce)
// ==========================================
export const MORNING_OPTIONS: MealOption[] = [
  {
    id: 'M1',
    title: 'Yogur Griego 125g + 10g Nueces',
    mealType: 'morning',
    category: 'Lácteo Proteico',
    proteinSource: 'lacteo',
    description: '125g de yogur griego natural sin azúcar + 10g de nueces peladas crudas pesadas en báscula.',
    ingredients: [
      { name: 'Yogur griego natural sin azúcar', amount: 125, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Nueces peladas crudas', amount: 10, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo (~2-3 nueces)' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 185,
    protein: 13,
    carbs: 6,
    fat: 12,
    fiber: 0.7,
    omega3AlaMg: 900,
    alternatives: ['M4', 'M5'],
    prepMinutes: 1,
    instructions: [
      'Pesar 10g de nueces crudas y mezclar con el yogur griego sin azúcar.'
    ],
    scientificRationale:
      '13g de proteína con grasa mono/poliinsaturada y cero azúcar añadido para controlar la glucemia de media mañana.',
    batchPrepNote: 'Prepara bolsitas de 10g de nueces pesadas en báscula.'
  },
  {
    id: 'M2',
    title: 'Mini Bocadillo Integral 40g + 50g Pavo + Tomate',
    mealType: 'morning',
    category: 'Mini Bocadillo Integral',
    proteinSource: 'ave',
    description: '40g de pan 100% integral con 50g de pechuga de pavo (>90%) y 40g de tomate natural.',
    ingredients: [
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Pechuga de pavo asada (>90% carne)', amount: 50, unit: 'g', category: 'Proteínas', rawStateNote: 'baja en sal' },
      { name: 'Tomate de ensalada fresco', amount: 40, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 160,
    protein: 12,
    carbs: 20,
    fat: 3,
    fiber: 3.6,
    alternatives: ['M3', 'M6'],
    prepMinutes: 3,
    instructions: [
      'Rellenar el pan 100% integral con el tomate en rodajas o rallado y los 50g de pechuga de pavo.'
    ],
    scientificRationale:
      'Opción salada saciante que evita el dulce de las 11:00; si tras 2-3 semanas el peso no baja, reduce primero este pan.',
    batchPrepNote: 'Porciona el pan en unidades de 40g y congela.'
  },
  {
    id: 'M3',
    title: '1 Huevo Cocido + 2 Mandarinas',
    mealType: 'morning',
    category: 'Huevo & Café',
    proteinSource: 'huevo',
    description: '1 huevo campero cocido + 2 mandarinas frescas enteras (≈180g netos).',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'cocido' },
      { name: 'Mandarina fresca', amount: 180, unit: 'g', category: 'Frutas Frescas', rawStateNote: '2 piezas enteras' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 160,
    protein: 8,
    carbs: 18,
    fat: 5.5,
    fiber: 3.4,
    fruitPieces: 2,
    alternatives: ['M2', 'M5'],
    prepMinutes: 1,
    instructions: [
      'Pelar el huevo cocido preparado en el batch cooking y tomar junto a 2 mandarinas enteras.'
    ],
    scientificRationale:
      'Combina proteína completa de huevo con 2 piezas enteras de fruta cítrica sin picos insulínicos.',
    batchPrepNote: 'Cuece huevos en el batch de domingo y miércoles (duran 3-4 días con cáscara a ≤4 °C).'
  },
  {
    id: 'M4',
    title: 'Requesón 100g + Pepino + 15g Almendras',
    mealType: 'morning',
    category: 'Lácteo Proteico',
    proteinSource: 'lacteo',
    description: '100g de requesón 0% con bastones de pepino fresco (100g) y 15g de almendras crudas con piel.',
    ingredients: [
      { name: 'Requesón desnatado 0%', amount: 100, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Pepino fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en bastones' },
      { name: 'Almendras crudas con piel', amount: 15, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 190,
    protein: 14,
    carbs: 6,
    fat: 11,
    fiber: 2.5,
    alternatives: ['M1', 'M5'],
    prepMinutes: 2,
    instructions: [
      'Servir el requesón con los bastones de pepino fresco y 15g de almendras crudas.'
    ],
    scientificRationale:
      '14g de proteína láctea de absorción lenta con fibra de almendra y alta hidratación.',
    batchPrepNote: 'Conserva el requesón a ≤4 °C.'
  },
  {
    id: 'M5',
    title: 'Queso Fresco Batido 0% 150g + Kiwi + 10g Nueces',
    mealType: 'morning',
    category: 'Lácteo Proteico',
    proteinSource: 'lacteo',
    description: '150g de queso fresco batido 0% con 1 kiwi entero troceado y 10g de nueces crudas.',
    ingredients: [
      { name: 'Queso fresco batido 0%', amount: 150, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Kiwi verde fresco', amount: 100, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' },
      { name: 'Nueces peladas crudas', amount: 10, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 185,
    protein: 14,
    carbs: 16,
    fat: 7,
    fiber: 3.7,
    fruitPieces: 1,
    omega3AlaMg: 900,
    alternatives: ['M1', 'M4'],
    prepMinutes: 2,
    instructions: [
      'Mezclar el queso fresco batido 0% con el kiwi en dados y las nueces troceadas.'
    ],
    scientificRationale:
      '14g de caseína + fruta entera con vitamina C y fibra prebiótica.',
    batchPrepNote: 'Muy rápido de llevar en táper.'
  },
  {
    id: 'M6',
    title: 'Atún al Natural (60g) + 2 Tortitas de Arroz Integral',
    mealType: 'morning',
    category: 'Mini Bocadillo Integral',
    proteinSource: 'pescado_azul',
    description: '1 lata pequeña de atún al natural (60g peso neto escurrido) sobre 2 tortitas de arroz integral.',
    ingredients: [
      { name: 'Atún al natural en conserva', amount: 60, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto escurrido (máx. 1-2 latas/sem)' },
      { name: 'Tortitas de arroz integral', amount: 16, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '2 unidades sin sal añadida' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 130,
    protein: 16,
    carbs: 12,
    fat: 1.5,
    fiber: 0.8,
    alternatives: ['M2', 'M3'],
    prepMinutes: 2,
    instructions: [
      'Escurrir bien la lata de atún al natural y repartir sobre las 2 tortitas de arroz integral.'
    ],
    scientificRationale:
      '16g de proteína en apenas 130 kcal, manteniendo el consumo de atún moderado a 1 toma semanal.',
    batchPrepNote: 'Alternativa práctica de despensa sin necesidad de refrigeración.'
  }
];

// ==========================================
// COMIDAS PRINCIPALES (14:30 · ≈500–570 kcal · 32–45 g P)
// [C1–C12 + LIBRE]
// ==========================================
export const LUNCH_OPTIONS: MealOption[] = [
  {
    id: 'C1',
    title: 'Pollo al Wok: Pechuga 170g + Verduras 250g + Arroz Integral 60g',
    mealType: 'lunch',
    category: 'Carnes Blancas',
    proteinSource: 'ave',
    description:
      'Pechuga de pollo limpia (170g en crudo) salteada al wok con 250g de verduras variadas, 60g de arroz integral en crudo y 10ml de AOVE.',
    ingredients: [
      { name: 'Pechuga de pollo fresca limpia', amount: 170, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto en crudo limpio' },
      { name: 'Calabacín fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Pimiento rojo y verde', amount: 90, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Cebolla dulce', amount: 60, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Arroz integral de grano redondo', amount: 60, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara o báscula' }
    ],
    calories: 570,
    protein: 45,
    carbs: 54,
    fat: 16,
    fiber: 7.5,
    alternatives: ['C3', 'C10'],
    prepMinutes: 20,
    instructions: [
      'Cocer los 60g de arroz integral con laurel (o usar arroz cocido refrigerado máx. 2-3 días a ≤4 °C).',
      'Saltear las verduras en wok con 5ml de AOVE al dente y dorar el pollo con los 5ml restantes y especias.'
    ],
    scientificRationale:
      '45g de proteína magra con arroz integral de liberación sostenida y 250g de verduras.',
    batchPrepNote: 'Enfría el arroz sobrante en recipiente poco profundo <2h y consúmelo en máx. 3 días (Bacillus cereus) o congélalo.'
  },
  {
    id: 'C2',
    title: 'Ternera Magra 150g + Patata Enfriada 200g + Judías Verdes 200g',
    mealType: 'lunch',
    category: 'Carnes Magras',
    proteinSource: 'ternera',
    description:
      'Filete de ternera magra (150g en crudo) a la plancha + patata cocida-enfriada (200g en crudo) + judías verdes (200g) + 10ml de AOVE.',
    ingredients: [
      { name: 'Filete de ternera magra', amount: 150, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio en crudo' },
      { name: 'Patata para cocer', amount: 200, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (cocida y enfriada 24h a ≤4°C)' },
      { name: 'Judías verdes redondas frescas', amount: 200, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto limpio en crudo' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara o báscula' },
      { name: 'Ajo, laurel, pimentón y especias', amount: 1, unit: 'pizca', category: 'Despensa & Condimentos' }
    ],
    calories: 540,
    protein: 40,
    carbs: 48,
    fat: 17,
    fiber: 9.8,
    alternatives: ['C12', 'C3'],
    prepMinutes: 15,
    instructions: [
      'Usar patata cocida con piel y enfriada 24h a ≤4 °C (recalienta sin problema manteniendo su almidón resistente).',
      'Cocinar las judías verdes al vapor y marcar la ternera a la plancha caliente. Aliñar con 10ml de AOVE.'
    ],
    scientificRationale:
      '40g de proteína junto a almidón resistente tipo 3 de la patata enfriada para suavizar el impacto glucémico.',
    batchPrepNote: 'Cuece patatas en los batch cooking de domingo y miércoles.'
  },
  {
    id: 'C3',
    title: 'Pavo 170g + Quinoa 60g + Ensalada + AOVE 10ml',
    mealType: 'lunch',
    category: 'Carnes Blancas',
    proteinSource: 'ave',
    description:
      'Pechuga de pavo fresca (170g neto en crudo) a la plancha con 60g de quinoa en crudo, ensalada de brotes y tomate (180g) y 10ml de AOVE.',
    ingredients: [
      { name: 'Pechuga de pavo fresca', amount: 170, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio en crudo' },
      { name: 'Quinoa real', amount: 60, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Brotes verdes (rúcula, canónigos, lechuga)', amount: 90, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate de ensalada fresco', amount: 90, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara o báscula' }
    ],
    calories: 560,
    protein: 45,
    carbs: 48,
    fat: 16,
    fiber: 7.5,
    alternatives: ['C1', 'C10'],
    prepMinutes: 18,
    instructions: [
      'Lavar la quinoa y cocerla 12-14 minutos.',
      'Asar la pechuga de pavo fresca a la plancha con especias y servir sobre la quinoa y la ensalada aliñada con 10ml de AOVE.'
    ],
    scientificRationale:
      '45g de proteína limpia con quinoa rica en lisina, fibra y minerales.',
    batchPrepNote: 'La quinoa cocida aguanta máx. 3 días refrigerada a ≤4 °C.'
  },
  {
    id: 'C4',
    title: 'Merluza 200g + Patata 200g + Verduras 200g + AOVE 15ml',
    mealType: 'lunch',
    category: 'Pescado Blanco',
    proteinSource: 'pescado_blanco',
    description:
      'Lomo limpio de merluza (200g neto en crudo, ~280g bruto con espina) con patata cocida (200g), verduras al vapor/horno (200g) y 15ml de AOVE.',
    ingredients: [
      { name: 'Lomo de merluza fresca', amount: 200, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio sin espinas (~280g bruto entero)' },
      { name: 'Patata para cocer', amount: 200, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (cocida y enfriada 24h)' },
      { name: 'Calabacín fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto en crudo' },
      { name: 'Pimiento rojo y verde', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto en crudo' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 15, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara o báscula' }
    ],
    calories: 520,
    protein: 40,
    carbs: 45,
    fat: 18,
    fiber: 7.5,
    alternatives: ['C11', 'C6'],
    prepMinutes: 20,
    instructions: [
      'Hornear o cocinar al vapor la merluza limpia con limón y hierbas 10-12 minutos.',
      'Servir con las verduras y la patata enfriada-recalentada aliñada con los 15ml de AOVE.'
    ],
    scientificRationale:
      'Pescado blanco ligero de fácil digestión con 40g de proteína completa.',
    batchPrepNote: 'Pide los lomos limpios sin piel ni espinas.'
  },
  {
    id: 'C5',
    title: 'Salmón 130g + Arroz Integral 50g + Verduras 200g 🐟',
    mealType: 'lunch',
    category: 'Pescado Azul',
    proteinSource: 'pescado_azul',
    isOilyFish: true,
    description:
      'Lomo limpio de salmón fresco (130g neto en crudo, ~170g bruto) a la plancha con 50g de arroz integral en crudo y 200g de verduras salteadas.',
    ingredients: [
      { name: 'Lomo de salmón fresco limpio', amount: 130, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio (~170g bruto con piel/espina)' },
      { name: 'Arroz integral de grano redondo', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Brócoli fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Calabacín fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' }
    ],
    calories: 550,
    protein: 32,
    carbs: 42,
    fat: 26,
    fiber: 7.5,
    omega3EpaDhaMg: 2300,
    alternatives: ['C7', 'C11'],
    prepMinutes: 18,
    instructions: [
      'Cocer los 50g de arroz integral y cocinar al vapor/plancha el brócoli y calabacín.',
      'Marcar el salmón limpio en sartén caliente por el lado de la piel sin añadir aceite extra.'
    ],
    scientificRationale:
      'Aporta ~2.300 mg de Omega-3 marino real (EPA/DHA) con perfil lipídico favorable.',
    batchPrepNote: 'Consume pescado fresco en 48h o congela raciones individuales.'
  },
  {
    id: 'C6',
    title: 'Garbanzos 70g (Crudo) con Espinacas y Bacalao 120g 🫘',
    mealType: 'lunch',
    category: 'Legumbres Ligeras',
    proteinSource: 'legumbre',
    isLegume: true,
    description:
      'Garbanzos (70g en crudo / ≈190g cocidos) estofados con 150g de espinacas frescas, 120g de bacalao desalado limpio y sofrito casero sin alcohol.',
    ingredients: [
      { name: 'Garbanzos secos (o 190g cocidos en tarro)', amount: 70, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco (≈190g cocidos escurridos)' },
      { name: 'Espinacas frescas lavadas', amount: 150, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto en crudo' },
      { name: 'Bacalao desalado limpio', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio sin espinas ni piel' },
      { name: 'Tomate triturado natural', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Caldo vegetal casero desgrasado', amount: 150, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'sin vino ni alcohol, con limón y pimentón' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 8, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 520,
    protein: 40,
    carbs: 54,
    fat: 12,
    fiber: 14.5,
    alternatives: ['C8', 'C9'],
    prepMinutes: 20,
    instructions: [
      'Preparar sofrito suave con ajo, pimentón, tomate natural y 8ml de AOVE; añadir caldo casero con unas gotas de limón (cero alcohol).',
      'Incorporar los garbanzos cocidos (domingo/miércoles), espinacas frescas y tacos de bacalao 6-8 min a fuego suave.'
    ],
    scientificRationale:
      '40g de proteína combinada y 14,5g de fibra soluble e insoluble ideal para control glucémico.',
    batchPrepNote: 'Cocina legumbres domingo y miércoles; guarda ≤3 días a ≤4 °C o congela raciones.'
  },
  {
    id: 'C7',
    title: 'Caballa o Sardinas Limpias 180g + Pisto 250g + Pan 30g 🐟',
    mealType: 'lunch',
    category: 'Pescado Azul',
    proteinSource: 'pescado_azul',
    isOilyFish: true,
    description:
      'Caballa o sardinas limpias (180g neto limpio, ~320g bruto entero) a la plancha con 250g de pisto casero sin azúcar y 30g de pan 100% integral.',
    ingredients: [
      { name: 'Caballa o sardinas frescas (filete limpio)', amount: 180, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio (~320g bruto entero sin limpiar)' },
      { name: 'Calabacín fresco', amount: 90, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'para pisto' },
      { name: 'Berenjena fresca', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'para pisto' },
      { name: 'Tomate triturado natural', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pan 100% integral de grano entero', amount: 30, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 8, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 525,
    protein: 40,
    carbs: 32,
    fat: 24,
    fiber: 7.5,
    omega3EpaDhaMg: 2550,
    alternatives: ['C5', 'C4'],
    prepMinutes: 20,
    instructions: [
      'Preparar el pisto casero con calabacín, berenjena, tomate y 5ml de AOVE.',
      'Asar los filetes limpios de caballa o sardinas 2 min por lado con 3ml de AOVE y acompañar con 30g de pan integral.'
    ],
    scientificRationale:
      'Pescado azul pequeño-mediano con baja acumulación de mercurio y ~2.550 mg de EPA/DHA marino real.',
    batchPrepNote: 'En pescadería pide lomos limpios (180g netos equivalen a ~320g brutos enteros).'
  },
  {
    id: 'C8',
    title: 'Lentejas 70g (Crudo) con Verduras + Pavo 100g 🫘',
    mealType: 'lunch',
    category: 'Legumbres Ligeras',
    proteinSource: 'legumbre',
    isLegume: true,
    description:
      'Lentejas pardinas (70g en crudo) guisadas con 200g de verduras, 100g de pechuga de pavo fresca en tacos y 10ml de AOVE.',
    ingredients: [
      { name: 'Lentejas pardinas secas', amount: 70, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Pechuga de pavo fresca', amount: 100, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio en crudo' },
      { name: 'Zanahoria fresca', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Cebolla dulce', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pimiento rojo y verde', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 500,
    protein: 40,
    carbs: 54,
    fat: 12,
    fiber: 14.5,
    alternatives: ['C6', 'C9'],
    prepMinutes: 28,
    instructions: [
      'Cocer las lentejas con zanahoria, cebolla, pimiento y laurel durante 25 minutos sin grasas ni embutidos.',
      'Saltear los tacos de pavo con 10ml de AOVE e incorporar al guiso 3 minutos antes de servir.'
    ],
    scientificRationale:
      '40g de proteína total sin grasas saturadas y 14,5g de fibra prebiótica.',
    batchPrepNote: 'Enfría rápido (<2h) en recipientes poco profundos; consume en máx. 3 días a ≤4 °C o congela.'
  },
  {
    id: 'C9',
    title: 'Ensalada Completa: Caballa 120g + Garbanzos 120g + Huevo 🐟🫘',
    mealType: 'lunch',
    category: 'Legumbres Ligeras',
    proteinSource: 'pescado_azul',
    isOilyFish: true,
    isLegume: true,
    description:
      'Ensalada completa de caballa/sardina al natural (120g neto escurrido), garbanzos cocidos (120g), 1 huevo duro, 200g de verduras y 15ml de AOVE.',
    ingredients: [
      { name: 'Caballa al natural en conserva', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto escurrido (baja en mercurio)' },
      { name: 'Garbanzos cocidos en tarro', amount: 120, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso neto escurrido y lavado' },
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'duro' },
      { name: 'Tomate de ensalada fresco', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Brotes verdes (rúcula, canónigos, lechuga)', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 15, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 540,
    protein: 40,
    carbs: 32,
    fat: 26,
    fiber: 10.5,
    omega3EpaDhaMg: 1600,
    alternatives: ['C6', 'C8'],
    prepMinutes: 8,
    instructions: [
      'Lavar y escurrir bien los 120g de garbanzos cocidos y mezclar con el tomate y los brotes.',
      'Añadir la caballa al natural desmigada, el huevo duro y aliñar con 15ml de AOVE y vinagre de manzana.'
    ],
    scientificRationale:
      'Plato único sin fogones que aporta legumbre + pescado azul EPA/DHA + proteína completa (40g P).',
    batchPrepNote: 'Ideal cuando no tienes tiempo de cocinar: 8 minutos y lista.'
  },
  {
    id: 'C10',
    title: 'Pasta Integral 70g + Pollo/Pavo Picado 150g + Tomate y Verduras',
    mealType: 'lunch',
    category: 'Cereales & Proteína',
    proteinSource: 'ave',
    description:
      'Pasta 100% integral (70g en crudo) con 150g de pollo/pavo picado magro, 100g de tomate natural triturado, 150g de verduras y 10ml de AOVE.',
    ingredients: [
      { name: 'Pasta 100% integral', amount: 70, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Pechuga de pollo fresca limpia', amount: 150, unit: 'g', category: 'Proteínas', rawStateNote: 'picada magra peso neto en crudo' },
      { name: 'Tomate triturado natural', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Calabacín fresco', amount: 90, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en dados' },
      { name: 'Cebolla dulce', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 560,
    protein: 42,
    carbs: 56,
    fat: 16,
    fiber: 9.5,
    alternatives: ['C1', 'C3'],
    prepMinutes: 18,
    instructions: [
      'Cocer la pasta 100% integral al dente según indicaciones.',
      'Pochar cebolla y calabacín con 10ml de AOVE, dorar el pollo/pavo picado y añadir el tomate natural 8 min con orégano.'
    ],
    scientificRationale:
      'Pasta integral al dente + proteína magra (42g) y fibra vegetal para evitar subidas bruscas de glucosa.',
    batchPrepNote: 'Refrigera por separado o mezclado máx. 3 días a ≤4 °C.'
  },
  {
    id: 'C11',
    title: 'Lubina o Dorada 220g al Horno + Patata 200g + Verduras',
    mealType: 'lunch',
    category: 'Pescado Blanco',
    proteinSource: 'pescado_blanco',
    description:
      'Lomos limpios de lubina o dorada (220g neto en crudo, ~365g bruto entera) al horno con patata enfriada (200g), verduras (200g) y 10ml de AOVE.',
    ingredients: [
      { name: 'Lomo de lubina o dorada limpia', amount: 220, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio (~365g bruto entera)' },
      { name: 'Patata para cocer', amount: 200, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (cocida y enfriada 24h)' },
      { name: 'Cebolla dulce', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pimiento rojo y verde', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 540,
    protein: 38,
    carbs: 44,
    fat: 19,
    fiber: 7.5,
    alternatives: ['C4', 'C5'],
    prepMinutes: 22,
    instructions: [
      'Disponer patata en rodajas, cebolla y pimiento en fuente con 10ml de AOVE y caldo/limón.',
      'Colocar los lomos limpios encima y hornear 14-15 minutos a 180 °C.'
    ],
    scientificRationale:
      '38g de proteína de pescado blanco y grasa monoinsaturada del AOVE con almidón resistente.',
    batchPrepNote: 'Pide al pescadero los lomos limpios sin escamas ni espinas.'
  },
  {
    id: 'C12',
    title: 'Hamburguesa Casera 160g + Pan Integral 50g + Ensalada',
    mealType: 'lunch',
    category: 'Carnes Magras',
    proteinSource: 'ternera',
    description:
      'Hamburguesa casera 100% carne magra de ternera/pavo (160g neto en crudo) a la plancha con 50g de pan 100% integral, ensalada mixta (180g) y 10ml de AOVE.',
    ingredients: [
      { name: 'Hamburguesa casera magra (ternera/pavo)', amount: 160, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio en crudo sin aditivos' },
      { name: 'Pan 100% integral de grano entero', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '100% harina integral' },
      { name: 'Brotes verdes (rúcula, canónigos, lechuga)', amount: 90, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate de ensalada fresco', amount: 90, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 520,
    protein: 38,
    carbs: 36,
    fat: 22,
    fiber: 6.5,
    alternatives: ['C2', 'C3'],
    prepMinutes: 12,
    instructions: [
      'Cocinar la hamburguesa casera (sin pan rallado ni aditivos industriales) a la plancha 3 min por lado.',
      'Servir con 50g de pan 100% integral tostado y ensalada aliñada con 10ml de AOVE.'
    ],
    scientificRationale:
      'Versión limpia de alta adherencia psicológica con 38g de proteína real.',
    batchPrepNote: 'Puedes congelar hamburguesas caseras separadas con papel vegetal.'
  }
];

export const LIBRE_LUNCH_OPTION: MealOption = {
  id: 'LIBRE',
  title: 'LIBRE · Comida Libre Planificada (Domingo)',
  mealType: 'lunch',
  category: 'Comida Libre',
  proteinSource: 'libre',
  description:
    'Comida libre semanal planificada (domingo). Sin culpa y sin compensar: disfruta con moderación y en la cena siguiente (N7 o N6) vuelve al plan.',
  ingredients: [],
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  alternatives: ['C1', 'C6'],
  prepMinutes: 0,
  instructions: [
    'Elige libremente la comida principal del domingo (familia, salida o plato favorito).',
    'No compenses saltándote la merienda ni la cena: continúa normalmente con ME y N.'
  ],
  scientificRationale:
    '1 comida libre planificada por semana maximiza la adherencia a largo plazo sin descarrilar el déficit calórico semanal.',
  batchPrepNote: 'Excluida del cálculo automático de lista de la compra y medias de días fijos.'
};

// ==========================================
// MERIENDAS (18:00 · ≈180–200 kcal · Fruta entera con piel)
// ==========================================
export const SNACK_OPTIONS: MealOption[] = [
  {
    id: 'ME1',
    title: 'Manzana + 20g Almendras',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'frutos_secos',
    description: '1 manzana entera con piel (160g) + 20g de almendras crudas con piel.',
    ingredients: [
      { name: 'Manzana entera con piel', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza mediana lavada' },
      { name: 'Almendras crudas con piel', amount: 20, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 200,
    protein: 6,
    carbs: 20,
    fat: 11,
    fiber: 5.5,
    fruitPieces: 1,
    alternatives: ['ME2', 'ME5'],
    prepMinutes: 2,
    instructions: [
      'Lavar bien la manzana y comer entera con piel junto a los 20g de almendras crudas.'
    ],
    scientificRationale:
      'Pectina natural de la manzana + fibra y vitamina E de la almendra para llegar saciado a la cena.',
    batchPrepNote: 'Fácil de llevar en bolsa o fiambrera.'
  },
  {
    id: 'ME2',
    title: 'Kéfir Natural 200g + Pera',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '200g de kéfir natural sin azúcar + 1 pera entera fresca con piel (160g).',
    ingredients: [
      { name: 'Kéfir natural sin azúcar', amount: 200, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Pera entera con piel', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera lavada' }
    ],
    calories: 190,
    protein: 8,
    carbs: 27,
    fat: 4,
    fiber: 5.0,
    fruitPieces: 1,
    alternatives: ['ME3', 'ME1'],
    prepMinutes: 2,
    instructions: [
      'Verter 200g de kéfir natural en un bol y añadir la pera lavada troceada con su piel.'
    ],
    scientificRationale:
      'Probióticos vivos y fibra fermentable para salud intestinal.',
    batchPrepNote: 'Mantener el kéfir a ≤4 °C.'
  },
  {
    id: 'ME3',
    title: 'Frutos Rojos 120g + Yogur Griego 125g',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '120g de arándanos o frambuesas frescas con 125g de yogur griego natural sin azúcar.',
    ingredients: [
      { name: 'Arándanos o frambuesas frescas', amount: 120, unit: 'g', category: 'Frutas Frescas' },
      { name: 'Yogur griego natural sin azúcar', amount: 125, unit: 'g', category: 'Lácteos & Frutos Secos' }
    ],
    calories: 180,
    protein: 11,
    carbs: 15,
    fat: 7,
    fiber: 4.5,
    fruitPieces: 1,
    alternatives: ['ME2', 'ME4'],
    prepMinutes: 2,
    instructions: [
      'Lavar los frutos rojos y mezclar con el yogur griego natural.'
    ],
    scientificRationale:
      '11g de proteína láctea con polifenoles de baja carga glucémica.',
    batchPrepNote: 'Válido con frutos rojos congelados sin azúcar.'
  },
  {
    id: 'ME4',
    title: 'Mini Tosta Integral 40g + Queso Fresco 0% 60g + 2 Kiwis',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '40g de pan 100% integral con 60g de queso fresco 0% y 2 kiwis verdes enteros (≈180g).',
    ingredients: [
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Queso fresco batido 0%', amount: 60, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'o queso fresco 0%' },
      { name: 'Kiwi verde fresco', amount: 180, unit: 'g', category: 'Frutas Frescas', rawStateNote: '2 piezas enteras' }
    ],
    calories: 200,
    protein: 10,
    carbs: 32,
    fat: 2,
    fiber: 7.5,
    fruitPieces: 2,
    alternatives: ['ME3', 'ME6'],
    prepMinutes: 3,
    instructions: [
      'Tostar el pan 100% integral, untar el queso fresco 0% y comer junto a 2 kiwis.'
    ],
    scientificRationale:
      '7,5g de fibra y aporte extra de vitamina C.',
    batchPrepNote: 'Ideal en tardes de mayor apetito.'
  },
  {
    id: 'ME5',
    title: 'Naranja Entera + 20g Nueces',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'frutos_secos',
    description: '1 naranja entera grande en gajos (180g) + 20g de nueces peladas crudas.',
    ingredients: [
      { name: 'Naranja entera fresca', amount: 180, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera (no zumo)' },
      { name: 'Nueces peladas crudas', amount: 20, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Café solo, té verde o infusión', amount: 1, unit: 'taza', category: 'Despensa & Condimentos', excludeFromGrocery: true }
    ],
    calories: 200,
    protein: 5,
    carbs: 18,
    fat: 13,
    fiber: 5.0,
    fruitPieces: 1,
    omega3AlaMg: 1800,
    alternatives: ['ME1', 'ME6'],
    prepMinutes: 2,
    instructions: [
      'Pelar la naranja en gajos y acompañar con 20g de nueces pesadas en báscula.'
    ],
    scientificRationale:
      'Ácidos grasos ALA vegetales con fibra cítrica entera.',
    batchPrepNote: 'Lleva las nueces ya pesadas en bolsita.'
  },
  {
    id: 'ME6',
    title: 'Pera + 30g Queso Curado',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '1 pera fresca entera con piel (160g) + 30g de queso curado/semicurado medido en báscula.',
    ingredients: [
      { name: 'Pera entera con piel', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera lavada' },
      { name: 'Queso curado', amount: 30, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'pesado exacto en báscula' }
    ],
    calories: 200,
    protein: 9,
    carbs: 21,
    fat: 9,
    fiber: 5.0,
    fruitPieces: 1,
    alternatives: ['ME4', 'ME5'],
    prepMinutes: 2,
    instructions: [
      'Cortar exactamente 30g de queso curado y acompañar con la pera fresca con piel.'
    ],
    scientificRationale:
      'Alta saciedad combinando sabor intenso controlado en báscula (30g) y fruta fibrosa.',
    batchPrepNote: 'Pesa los 30g de queso para no sobrepasar las calorías de la merienda.'
  }
];

// ==========================================
// CENAS (21:00 · ≈400–455 kcal · 20–38 g P)
// ==========================================
export const DINNER_OPTIONS: MealOption[] = [
  {
    id: 'N1',
    title: 'Crema Calabacín y Puerro (con 100g Patata) + 2 Huevos Cocidos + Pan 30g',
    mealType: 'dinner',
    category: 'Cremas y Sopas',
    proteinSource: 'huevo',
    description:
      'Crema casera de calabacín (200g), puerro (70g) y patata (100g) + 2 huevos cocidos + 30g de pan 100% integral y 5ml de AOVE.',
    ingredients: [
      { name: 'Calabacín fresco', amount: 200, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Puerro fresco', amount: 70, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Patata para cocer', amount: 100, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Huevo campero talla L', amount: 2, unit: 'ud', category: 'Proteínas', rawStateNote: 'cocidos' },
      { name: 'Pan 100% integral de grano entero', amount: 30, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 435,
    protein: 20,
    carbs: 38,
    fat: 18,
    fiber: 6.5,
    alternatives: ['N7', 'N6'],
    prepMinutes: 15,
    instructions: [
      'Cocer calabacín, puerro y 100g de patata 12 min, triturar con 5ml de AOVE.',
      'Servir con 2 huevos cocidos partidos y 30g de pan 100% integral.'
    ],
    scientificRationale:
      'Cena templada y digestible con 20g de proteína completa para evitar antojos nocturnos.',
    batchPrepNote: 'Enfría la crema sobrante rápido (<2h) y consume en máx. 3 días a ≤4 °C.'
  },
  {
    id: 'N2',
    title: 'Ensalada con Caballa al Natural 120g + Huevo + Garbanzos 80g 🐟',
    mealType: 'dinner',
    category: 'Ensaladas Proteicas',
    proteinSource: 'pescado_azul',
    isOilyFish: true,
    isLegume: false,
    description:
      'Ensalada de hojas verdes y tomate con 120g de caballa al natural escurrida, 1 huevo cocido, 80g de garbanzos cocidos y 10ml de AOVE.',
    ingredients: [
      { name: 'Caballa al natural en conserva', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto escurrido' },
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'cocido' },
      { name: 'Garbanzos cocidos en tarro', amount: 80, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso neto escurrido y lavado' },
      { name: 'Brotes verdes (rúcula, canónigos, lechuga)', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate de ensalada fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 450,
    protein: 34,
    carbs: 18,
    fat: 24,
    fiber: 6.8,
    omega3EpaDhaMg: 1800,
    alternatives: ['N4', 'N3'],
    prepMinutes: 6,
    instructions: [
      'Mezclar los brotes, tomate y 80g de garbanzos lavados.',
      'Añadir la caballa escurrida, 1 huevo cocido y aliñar con 10ml de AOVE y vinagre.'
    ],
    scientificRationale:
      '34g de proteína + ~1.800 mg de EPA/DHA marino en una cena rápida de 6 minutos.',
    batchPrepNote: 'Nunca la juntes en un día que ya tenga pescado en la comida.'
  },
  {
    id: 'N3',
    title: 'Revuelto Champiñones 200g + 2 Huevos + Gambas 120g + Pan 40g',
    mealType: 'dinner',
    category: 'Huevos & Marisco',
    proteinSource: 'marisco',
    description:
      'Revuelto de champiñones laminados (200g), 2 huevos camperos, gambas peladas crudas (120g neto, ~230g bruto), pan integral (40g) y 5ml de AOVE.',
    ingredients: [
      { name: 'Champiñones frescos laminados', amount: 200, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'peso neto limpio' },
      { name: 'Gambas peladas crudas', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto pelado en crudo (~230g bruto)' },
      { name: 'Huevo campero talla L', amount: 2, unit: 'ud', category: 'Proteínas' },
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 445,
    protein: 38,
    carbs: 22,
    fat: 19,
    fiber: 5.5,
    alternatives: ['N6', 'N8'],
    prepMinutes: 12,
    instructions: [
      'Saltear los 200g de champiñones con ajo y 5ml de AOVE 4 minutos.',
      'Añadir las gambas peladas 1 min, cuajar con los 2 huevos batidos y servir con 40g de pan 100% integral.'
    ],
    scientificRationale:
      '38g de proteína nocturna de altísima saciedad sin ultraprocesados (cero surimi).',
    batchPrepNote: '120g de gambas peladas equivalen a ~230g de gamba entera con cáscara.'
  },
  {
    id: 'N4',
    title: 'Salmón 120g a la Plancha + Verduras 250g + Patata 120g 🐟',
    mealType: 'dinner',
    category: 'Pescado Azul',
    proteinSource: 'pescado_azul',
    isOilyFish: true,
    description:
      'Lomo limpio de salmón (120g neto en crudo, ~155g bruto) a la plancha con 250g de verduras al vapor/plancha y 120g de patata cocida.',
    ingredients: [
      { name: 'Lomo de salmón fresco limpio', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio (~155g bruto)' },
      { name: 'Judías verdes redondas frescas', amount: 130, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Brócoli fresco', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Patata para cocer', amount: 120, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (cocida y enfriada 24h)' }
    ],
    calories: 420,
    protein: 28,
    carbs: 26,
    fat: 20,
    fiber: 7.8,
    omega3EpaDhaMg: 2100,
    alternatives: ['N2', 'N9'],
    prepMinutes: 14,
    instructions: [
      'Cocinar las verduras al vapor y calentar o servir fría la patata cocida de 24h.',
      'Hacer el salmón limpio a la plancha 3 min por piel y 1-2 min del otro lado sin aceite extra.'
    ],
    scientificRationale:
      '28g de proteína con ~2.100 mg de EPA/DHA marino real y almidón resistente.',
    batchPrepNote: 'Solo en días sin pescado en la comida del mediodía.'
  },
  {
    id: 'N5',
    title: 'Requesón 200g + Frutos Rojos 100g + Nueces 20g + Pan 30g',
    mealType: 'dinner',
    category: 'Cena Láctea Proteica',
    proteinSource: 'lacteo',
    description:
      '200g de requesón 0% con 100g de frutos rojos frescos, 20g de nueces peladas crudas y 30g de pan 100% integral.',
    ingredients: [
      { name: 'Requesón desnatado 0%', amount: 200, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Arándanos o frambuesas frescas', amount: 100, unit: 'g', category: 'Frutas Frescas' },
      { name: 'Nueces peladas crudas', amount: 20, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso neto en crudo' },
      { name: 'Pan 100% integral de grano entero', amount: 30, unit: 'g', category: 'Tubérculos & Cereales' }
    ],
    calories: 455,
    protein: 30,
    carbs: 30,
    fat: 20,
    fiber: 6.5,
    omega3AlaMg: 1800,
    alternatives: ['N6', 'N1'],
    prepMinutes: 3,
    instructions: [
      'Servir 200g de requesón en un bol con frutos rojos y 20g de nueces picadas.',
      'Acompañar con 30g de pan integral.'
    ],
    scientificRationale:
      'Cena rápida de 3 minutos con 30g de caseína nocturna antocatabólica.',
    batchPrepNote: 'Perfecta para noches con poco tiempo.'
  },
  {
    id: 'N6',
    title: 'Tortilla 2 Huevos con Verduras + Pavo 40g + Pan 40g',
    mealType: 'dinner',
    category: 'Tortillas Veg',
    proteinSource: 'huevo',
    description:
      'Tortilla de 2 huevos camperos con 180g de calabacín y espinacas, 40g de pechuga de pavo (>90%), 40g de pan 100% integral y 5ml de AOVE.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 2, unit: 'ud', category: 'Proteínas' },
      { name: 'Calabacín fresco', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Espinacas frescas lavadas', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pechuga de pavo asada (>90% carne)', amount: 40, unit: 'g', category: 'Proteínas' },
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 420,
    protein: 25,
    carbs: 24,
    fat: 20,
    fiber: 6.8,
    alternatives: ['N3', 'N5'],
    prepMinutes: 10,
    instructions: [
      'Saltear calabacín y espinacas con 5ml de AOVE, añadir 2 huevos batidos y cuajar.',
      'Acompañar con los 40g de pavo y 40g de pan 100% integral.'
    ],
    scientificRationale:
      '25g de proteína y verduras ricas en magnesio que favorecen el descanso.',
    batchPrepNote: 'Si quieres reducir yemas ese día, sustituye 1 huevo por 60ml de claras.'
  },
  {
    id: 'N7',
    title: 'Sopa de Verduras con Pollo 130g + Arroz o Fideos 30g',
    mealType: 'dinner',
    category: 'Cremas y Sopas',
    proteinSource: 'ave',
    description:
      'Sopa en caldo casero (250ml) con 200g de verduras variadas, 130g de pechuga de pollo limpia en tiras y 30g de arroz o fideos integrales en crudo.',
    ingredients: [
      { name: 'Pechuga de pollo fresca limpia', amount: 130, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto en crudo limpio' },
      { name: 'Caldo vegetal casero desgrasado', amount: 250, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'sin pastillas industriales' },
      { name: 'Arroz integral de grano redondo', amount: 30, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'o fideos integrales en crudo' },
      { name: 'Zanahoria fresca', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Puerro fresco', amount: 70, unit: 'g', category: 'Verduras & Hortalizas' }
    ],
    calories: 400,
    protein: 32,
    carbs: 34,
    fat: 10,
    fiber: 5.5,
    alternatives: ['N1', 'N8'],
    prepMinutes: 15,
    instructions: [
      'Hervir el caldo casero con las verduras picadas y los 30g de arroz o fideos.',
      'Incorporar los 130g de pollo en dados los últimos 6 minutos.'
    ],
    scientificRationale:
      'Cena ligera tras la comida libre del domingo; hidrata y aporta 32g de proteína limpia.',
    batchPrepNote: 'Ideal los domingos por la noche para retomar el plan sin compensar.'
  },
  {
    id: 'N8',
    title: 'Pimientos Rellenos de Pavo 150g y Arroz 30g con Tomate',
    mealType: 'dinner',
    category: 'Carnes Blancas',
    proteinSource: 'ave',
    description:
      'Pimientos rojos (200g) rellenos de pechuga de pavo picada (150g en crudo), 30g de arroz en crudo y 100g de tomate triturado natural.',
    ingredients: [
      { name: 'Pechuga de pavo fresca', amount: 150, unit: 'g', category: 'Proteínas', rawStateNote: 'picada peso neto en crudo' },
      { name: 'Pimiento rojo y verde', amount: 200, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'para rellenar' },
      { name: 'Arroz integral de grano redondo', amount: 30, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo' },
      { name: 'Tomate triturado natural', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' }
    ],
    calories: 420,
    protein: 32,
    carbs: 36,
    fat: 10,
    fiber: 6.5,
    alternatives: ['N7', 'N3'],
    prepMinutes: 25,
    instructions: [
      'Saltear el pavo picado con tomate natural y el arroz semicocido.',
      'Rellenar los pimientos y hornear 18 min a 190 °C (o cocinar tapados en cazuela).'
    ],
    scientificRationale:
      '32g de proteína magra en formato muy saciante con antioxidantes del pimiento y licopeno del tomate.',
    batchPrepNote: 'Puedes hornear 2 raciones y congelar una para otro día de la semana.'
  },
  {
    id: 'N9',
    title: 'Merluza 180g + Patata 150g + Verduras + AOVE 10ml',
    mealType: 'dinner',
    category: 'Pescado Lindo',
    proteinSource: 'pescado_blanco',
    description:
      'Lomo limpio de merluza (180g neto en crudo, ~255g bruto) a la plancha/vapor con patata enfriada (150g), verduras (200g) y 10ml de AOVE.',
    ingredients: [
      { name: 'Lomo de merluza fresca', amount: 180, unit: 'g', category: 'Proteínas', rawStateNote: 'peso neto limpio (~255g bruto con espina)' },
      { name: 'Patata para cocer', amount: 150, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (cocida y enfriada 24h)' },
      { name: 'Espárragos trigueros frescos', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Calabacín fresco', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'medido con cuchara' }
    ],
    calories: 405,
    protein: 30,
    carbs: 34,
    fat: 14,
    fiber: 6.8,
    alternatives: ['N4', 'N8'],
    prepMinutes: 14,
    instructions: [
      'Cocinar los espárragos y calabacín al vapor.',
      'Hacer el lomo limpio de merluza 2 min por lado y servir con la patata enfriada y 10ml de AOVE y limón.'
    ],
    scientificRationale:
      'Cena blanca de fácil digestión con 30g de proteína y almidón resistente.',
    batchPrepNote: 'Nunca combinar con comida de pescado en el mismo día.'
  }
];

export const DAYS_CONFIG: Array<{
  id: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  name: string;
  short: string;
}> = [
  { id: 'lunes', name: 'Lunes', short: 'LUN' },
  { id: 'martes', name: 'Martes', short: 'MAR' },
  { id: 'miercoles', name: 'Miércoles', short: 'MIÉ' },
  { id: 'jueves', name: 'Jueves', short: 'JUE' },
  { id: 'viernes', name: 'Viernes', short: 'VIE' },
  { id: 'sabado', name: 'Sábado', short: 'SÁB' },
  { id: 'domingo', name: 'Domingo', short: 'DOM' }
];

export interface CanonicalDayRow {
  dayNumber: number;
  weekNumber: 1 | 2 | 3 | 4 | 5;
  dayId: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  dayName: string;
  breakfastId: string;
  morningId: string;
  lunchId: string; // 'C1'..'C12' or 'LIBRE'
  snackId: string;
  dinnerId: string;
}

// CALENDARIO OFICIAL DE 30 DÍAS INTERCAMBIABLE
export const CANONICAL_30_DAY_CALENDAR: CanonicalDayRow[] = [
  // Semana 1 (Días 1-7)
  { dayNumber: 1, weekNumber: 1, dayId: 'lunes', dayName: 'Lunes', breakfastId: 'D1', morningId: 'M3', lunchId: 'C1', snackId: 'ME5', dinnerId: 'N2' },
  { dayNumber: 2, weekNumber: 1, dayId: 'martes', dayName: 'Martes', breakfastId: 'D2', morningId: 'M4', lunchId: 'C6', snackId: 'ME6', dinnerId: 'N6' },
  { dayNumber: 3, weekNumber: 1, dayId: 'miercoles', dayName: 'Miércoles', breakfastId: 'D3', morningId: 'M5', lunchId: 'C4', snackId: 'ME1', dinnerId: 'N3' },
  { dayNumber: 4, weekNumber: 1, dayId: 'jueves', dayName: 'Jueves', breakfastId: 'D4', morningId: 'M6', lunchId: 'C2', snackId: 'ME2', dinnerId: 'N4' },
  { dayNumber: 5, weekNumber: 1, dayId: 'viernes', dayName: 'Viernes', breakfastId: 'D5', morningId: 'M1', lunchId: 'C9', snackId: 'ME3', dinnerId: 'N5' },
  { dayNumber: 6, weekNumber: 1, dayId: 'sabado', dayName: 'Sábado', breakfastId: 'D6', morningId: 'M2', lunchId: 'C7', snackId: 'ME4', dinnerId: 'N6' },
  { dayNumber: 7, weekNumber: 1, dayId: 'domingo', dayName: 'Domingo', breakfastId: 'D1', morningId: 'M3', lunchId: 'LIBRE', snackId: 'ME5', dinnerId: 'N7' },
  // Semana 2 (Días 8-14)
  { dayNumber: 8, weekNumber: 2, dayId: 'lunes', dayName: 'Lunes', breakfastId: 'D2', morningId: 'M4', lunchId: 'C2', snackId: 'ME6', dinnerId: 'N4' },
  { dayNumber: 9, weekNumber: 2, dayId: 'martes', dayName: 'Martes', breakfastId: 'D3', morningId: 'M5', lunchId: 'C8', snackId: 'ME1', dinnerId: 'N9' },
  { dayNumber: 10, weekNumber: 2, dayId: 'miercoles', dayName: 'Miércoles', breakfastId: 'D4', morningId: 'M6', lunchId: 'C5', snackId: 'ME2', dinnerId: 'N1' },
  { dayNumber: 11, weekNumber: 2, dayId: 'jueves', dayName: 'Jueves', breakfastId: 'D5', morningId: 'M1', lunchId: 'C3', snackId: 'ME3', dinnerId: 'N3' },
  { dayNumber: 12, weekNumber: 2, dayId: 'viernes', dayName: 'Viernes', breakfastId: 'D6', morningId: 'M2', lunchId: 'C10', snackId: 'ME4', dinnerId: 'N8' },
  { dayNumber: 13, weekNumber: 2, dayId: 'sabado', dayName: 'Sábado', breakfastId: 'D1', morningId: 'M3', lunchId: 'C5', snackId: 'ME5', dinnerId: 'N6' },
  { dayNumber: 14, weekNumber: 2, dayId: 'domingo', dayName: 'Domingo', breakfastId: 'D2', morningId: 'M4', lunchId: 'LIBRE', snackId: 'ME6', dinnerId: 'N7' },
  // Semana 3 (Días 15-21)
  { dayNumber: 15, weekNumber: 3, dayId: 'lunes', dayName: 'Lunes', breakfastId: 'D3', morningId: 'M5', lunchId: 'C3', snackId: 'ME1', dinnerId: 'N2' },
  { dayNumber: 16, weekNumber: 3, dayId: 'martes', dayName: 'Martes', breakfastId: 'D4', morningId: 'M6', lunchId: 'C6', snackId: 'ME2', dinnerId: 'N5' },
  { dayNumber: 17, weekNumber: 3, dayId: 'miercoles', dayName: 'Miércoles', breakfastId: 'D5', morningId: 'M1', lunchId: 'C4', snackId: 'ME3', dinnerId: 'N1' },
  { dayNumber: 18, weekNumber: 3, dayId: 'jueves', dayName: 'Jueves', breakfastId: 'D6', morningId: 'M2', lunchId: 'C1', snackId: 'ME4', dinnerId: 'N4' },
  { dayNumber: 19, weekNumber: 3, dayId: 'viernes', dayName: 'Viernes', breakfastId: 'D1', morningId: 'M3', lunchId: 'C9', snackId: 'ME5', dinnerId: 'N5' },
  { dayNumber: 20, weekNumber: 3, dayId: 'sabado', dayName: 'Sábado', breakfastId: 'D2', morningId: 'M4', lunchId: 'C12', snackId: 'ME6', dinnerId: 'N2' },
  { dayNumber: 21, weekNumber: 3, dayId: 'domingo', dayName: 'Domingo', breakfastId: 'D3', morningId: 'M5', lunchId: 'LIBRE', snackId: 'ME1', dinnerId: 'N7' },
  // Semana 4 (Días 22-28)
  { dayNumber: 22, weekNumber: 4, dayId: 'lunes', dayName: 'Lunes', breakfastId: 'D4', morningId: 'M6', lunchId: 'C1', snackId: 'ME2', dinnerId: 'N4' },
  { dayNumber: 23, weekNumber: 4, dayId: 'martes', dayName: 'Martes', breakfastId: 'D5', morningId: 'M1', lunchId: 'C8', snackId: 'ME3', dinnerId: 'N9' },
  { dayNumber: 24, weekNumber: 4, dayId: 'miercoles', dayName: 'Miércoles', breakfastId: 'D6', morningId: 'M2', lunchId: 'C5', snackId: 'ME4', dinnerId: 'N1' },
  { dayNumber: 25, weekNumber: 4, dayId: 'jueves', dayName: 'Jueves', breakfastId: 'D1', morningId: 'M3', lunchId: 'C2', snackId: 'ME5', dinnerId: 'N2' },
  { dayNumber: 26, weekNumber: 4, dayId: 'viernes', dayName: 'Viernes', breakfastId: 'D2', morningId: 'M4', lunchId: 'C10', snackId: 'ME6', dinnerId: 'N8' },
  { dayNumber: 27, weekNumber: 4, dayId: 'sabado', dayName: 'Sábado', breakfastId: 'D3', morningId: 'M5', lunchId: 'C4', snackId: 'ME1', dinnerId: 'N5' },
  { dayNumber: 28, weekNumber: 4, dayId: 'domingo', dayName: 'Domingo', breakfastId: 'D4', morningId: 'M6', lunchId: 'LIBRE', snackId: 'ME2', dinnerId: 'N6' },
  // Cierre del Mes (Días 29-30)
  { dayNumber: 29, weekNumber: 5, dayId: 'lunes', dayName: 'Lunes', breakfastId: 'D5', morningId: 'M1', lunchId: 'C2', snackId: 'ME3', dinnerId: 'N2' },
  { dayNumber: 30, weekNumber: 5, dayId: 'martes', dayName: 'Martes', breakfastId: 'D6', morningId: 'M2', lunchId: 'C6', snackId: 'ME4', dinnerId: 'N8' }
];
