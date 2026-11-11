import { MealOption, UserProfile } from '../types/nutrition';

// DEFAULT USER PROFILE ADJUSTED FOR SCIENTIFIC AND MEDICAL ACCURACY
export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Juan (Perfil Nutricional 2 Semanas)',
  age: 53,
  heightCm: 173,
  currentWeightKg: 102,
  targetWeightKg: 85,
  activityLevel: 'Activo (caminata diaria en desnivel/elíptica + fuerza adaptada en casa)',
  mainGoal:
    'Reducción de grasa visceral y corporal global mediante déficit calórico sostenible, control glucémico, protección articular con Omega-3 y preservación de masa muscular.',
  medicalConditions: [
    'Control de glucemia / Prevención de picos de insulina (IMC ≈ 34)',
    'Protección articular de rodillas y cadera (bajo impacto + ácidos grasos EPA/DHA)',
    'Perfil lipídico: control de colesterol (moderación de yemas de huevo a 1/día y reducción de grasas saturadas)',
    'Revisar siempre con su médico o dietista-nutricionista si toma medicación habitual'
  ],
  excludedFoods: [
    'Ultraprocesados, bollería y galletas nocturnas',
    'Azúcar refinado y bebidas azucaradas o alcohólicas',
    'Gulas / surimi procesado (alto en sal y almidón modificado)',
    'Exceso de atún en lata (reducido a máx. 2 latas/semana para evitar exceso de mercurio)',
    'Vino o alcohol en cocinados (sustituido por caldo vegetal aromático con limón)'
  ],
  currentBreakfast: 'Café cortado con tostada o bollería industrial (en transición a desayuno saciante con fruta)',
  hasFlexibleMeal: true,
  flexibleDay: 'domingo',
  // Harris-Benedict & Mifflin-St Jeor:
  // BMR = 10 * 102 + 6.25 * 173 - 5 * 53 + 5 = 1.841 kcal
  // TDEE (factor activo x 1.40) ≈ 2.580 kcal
  // Déficit calórico moderado y seguro (-550 a -650 kcal) = ~1.950 - 2.050 kcal/día
  bmr: 1841,
  tdee: 2580,
  targetCalories: 1980,
  targetProteinMin: 135,
  targetProteinMax: 155,
  targetFiberDailyG: 32,
  keyRestrictions: [
    'Estructura de 5 tomas completas: Desayuno, Media Mañana, Comida, Merienda y Cena',
    '2 a 3 piezas de fruta fresca entera al día (con piel siempre que sea posible)',
    'Protección articular real: Pescado azul 2-3 veces por semana (salmón, caballa, sardina) rico en Omega-3',
    'Legumbres aumentadas a 3-4 tomas semanales para microbioma y fibra prebiótica',
    'Patata cocida y enfriada en nevera (almidón resistente tipo 3 con menor impacto glucémico)',
    'Pan 100% integral real de grano entero verificado',
    'Huevos moderados (1 entero al día máximo o combinación de clara + huevo)',
    'Atún moderado y sin surimi ni embutidos altos en sodio',
    'Cocina sin alcohol: Cero vino en guisos (sustituido por caldo vegetal desgrasado con vinagre o cítricos)'
  ]
};

// ==========================================
// DESAYUNOS SACIANTES (07:30 - 08:30)
// [Con fruta entera, fibra soluble y proteína]
// ==========================================
export const BREAKFAST_OPTIONS: MealOption[] = [
  {
    id: 'D1',
    title: 'Porridge de Avena Integral con Canela y Manzana',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description: 'Copos de avena integral (40g en crudo) cocidos en agua o bebida vegetal sin azúcar, con 1 manzana mediana con piel troceada y canela de Ceilán + café solo.',
    ingredients: [
      { name: 'Copos de avena integral 100%', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo' },
      { name: 'Manzana entera con piel (lavada)', amount: 150, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza mediana' },
      { name: 'Bebida de almendras/soja sin azúcar o agua', amount: 180, unit: 'ml', category: 'Lácteos & Frutos Secos' },
      { name: 'Canela de Ceilán pura en polvo', amount: 2, unit: 'g', category: 'Despensa & Condimentos' },
      { name: 'Café solo o infusión digestiva', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 255,
    protein: 8,
    carbs: 45,
    fat: 4,
    fiber: 8,
    fruitPieces: 1,
    prepMinutes: 5,
    instructions: [
      'Calentar la bebida vegetal o agua con la canela en un cazo pequeño.',
      'Añadir los copos de avena integral y remover a fuego medio durante 3-4 minutos hasta que espese.',
      'Servir en un bol con la manzana troceada en dados pequeños (con su piel para maximizar pectina y fibra) y disfrutar caliente.'
    ],
    scientificRationale:
      'Los betaglucanos de la avena y la pectina de la manzana forman un gel viscoso en el intestino que retrasa el vaciamiento gástrico, estabiliza la curva de glucosa y reduce el colesterol LDL.',
    batchPrepNote: 'Puedes dejar la avena en remojo en la nevera la noche anterior (overnight oats) y ahorrar tiempo por la mañana.'
  },
  {
    id: 'D2',
    title: 'Tostada 100% Integral con Tomate, AOVE y Queso Fresco + Naranja',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description: 'Rebanada de pan 100% integral de grano entero (50g) con tomate rallado natural, 5ml de AOVE virgen extra, 40g de queso fresco desnatado + 1 naranja entera en gajos.',
    ingredients: [
      { name: 'Pan 100% integral de grano entero', amount: 50, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: '1 rebanada gruesa' },
      { name: 'Tomate maduro rallado', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'fresco sin piel' },
      { name: 'Aceite de oliva virgen extra (AOVE)', amount: 5, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'pesado con cuchara' },
      { name: 'Queso fresco desnatado bajo en sal o requesón', amount: 40, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Naranja entera en gajos', amount: 180, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza grande (no en zumo)' },
      { name: 'Café cortado con una lágrima de leche', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 285,
    protein: 12,
    carbs: 42,
    fat: 7,
    fiber: 7,
    fruitPieces: 1,
    prepMinutes: 5,
    instructions: [
      'Tostar ligeramente la rebanada de pan 100% integral.',
      'Untar el tomate rallado natural y regar con los 5ml de AOVE.',
      'Colocar las láminas de queso fresco encima.',
      'Pelar y comer la naranja entera en gajos (nunca exprimida en zumo, para retener su fibra y evitar el pico de fructosa rápida).'
    ],
    scientificRationale:
      'La fruta entera mantiene intacta su matriz celular fibrosa, a diferencia del zumo que libera azúcares libres. El pan 100% integral ofrece liberación lenta de almidones complejos.',
    batchPrepNote: 'Ralla 3 tomates en un frasco de vidrio hermético el domingo para tenerlo listo toda la semana.'
  },
  {
    id: 'D3',
    title: 'Revuelto de Clara y Huevo con Espinacas + Pera Entera',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'huevo',
    description: '1 huevo campero entero + 1 clara pasteurizada con brotes de espinacas tiernas, 1 rebanada de pan 100% integral (40g) y 1 pera fresca con piel.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas' },
      { name: 'Clara de huevo pasteurizada', amount: 40, unit: 'ml', category: 'Proteínas', rawStateNote: 'equivalente a 1 clara' },
      { name: 'Espinacas tiernas frescas', amount: 50, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pan 100% integral de centeno o espelta', amount: 40, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Pera mediana fresca con piel', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' },
      { name: 'Café solo o té verde', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 270,
    protein: 16,
    carbs: 35,
    fat: 6,
    fiber: 6.5,
    fruitPieces: 1,
    prepMinutes: 6,
    instructions: [
      'Saltear las espinacas 1 minuto en sartén antiadherente con una gota de aceite.',
      'Batir el huevo con la clara y verter en la sartén a fuego medio hasta que cuaje suave.',
      'Acompañar con la rebanada de pan integral tostada y degustar la pera entera con su piel bien lavada.'
    ],
    scientificRationale:
      'Utilizar 1 huevo + 1 clara aporta 14g de proteína de valor biológico óptimo manteniendo el colesterol dietético bajo control, ideal para hombres de 53 años con IMC superior a 30.',
    batchPrepNote: 'Guarda la clara pasteurizada en botella para dosificarla limpiamente.'
  },
  {
    id: 'D4',
    title: 'Yogur Griego Natural con Frutos Rojos, Semillas y Tostada',
    mealType: 'breakfast',
    category: 'Desayuno Saciante',
    proteinSource: 'lacteo',
    description: '125g de yogur griego natural sin azúcar ni edulcorantes con 80g de arándanos o moras frescas, 10g de semillas de lino o chía y 1 tosta integral con aceite.',
    ingredients: [
      { name: 'Yogur griego natural sin azúcar 0-2%', amount: 125, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Arándanos o frambuesas frescas', amount: 80, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 taza pequeña' },
      { name: 'Semillas de lino o chía molidas', amount: 10, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'ricas en ALA Omega-3' },
      { name: 'Pan 100% integral', amount: 35, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Aceite de oliva virgen extra', amount: 3, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 275,
    protein: 13,
    carbs: 29,
    fat: 9,
    fiber: 7,
    omega3Mg: 800,
    fruitPieces: 1,
    prepMinutes: 3,
    instructions: [
      'Servir el yogur griego en un cuenco hondo.',
      'Lavar los frutos rojos frescos y agregarlos por encima junto con las semillas molidas.',
      'Acompañar con la pequeña tosta integral con unas gotas de aceite de oliva.'
    ],
    scientificRationale:
      'Los frutos rojos aportan antocianinas y polifenoles antiinflamatorios que mejoran la función endotelial. Las semillas aportan ácido alfa-linolénico (ALA) precursor de Omega-3.',
    batchPrepNote: 'Puedes comprar frutos rojos congelados al natural si no están en temporada local.'
  }
];

// ==========================================
// MEDIA MAÑANA (11:00 AM)
// [Regla: Sin azúcares simples, saciedad sostenida]
// ==========================================
export const MORNING_OPTIONS: MealOption[] = [
  {
    id: 'M1',
    title: '30g de Nueces y Almendras Crudas + Café Cortado',
    mealType: 'morning',
    category: 'Frutos Secos & Café',
    proteinSource: 'frutos_secos',
    description: '30g de frutos secos naturales (nueces peladas y almendras crudas sin salar ni tostar) + café cortado con leche semidesnatada sin azúcar.',
    ingredients: [
      { name: 'Nueces y almendras crudas sin sal', amount: 30, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso exacto en báscula (aprox. 5 nueces y 10 almendras)' },
      { name: 'Café solo o cortado sin azúcar', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' },
      { name: 'Leche entera o semi para cortado', amount: 25, unit: 'ml', category: 'Lácteos & Frutos Secos' }
    ],
    calories: 195,
    protein: 6,
    carbs: 4,
    fat: 17,
    fiber: 3,
    omega3Mg: 1200,
    prepMinutes: 1,
    instructions: [
      'Pesar exactamente 30g de frutos secos crudos en una báscula de cocina (evitar servir a ojo para controlar las calorías).',
      'Degustar tranquilamente masticando despacio junto a un café cortado sin azúcar refinado ni edulcorantes calóricos.'
    ],
    scientificRationale:
      'Las nueces aportan ácido graso poliinsaturado omega-3 vegetal y magnesio. La grasa saludable y la fibra retrasan el vaciamiento estomacal manteniendo estables los niveles de leptina.',
    batchPrepNote: 'Prepara 5 botecitos de cristal con 30g de frutos secos el domingo para llevarlos directamente al trabajo o tu rutina.'
  },
  {
    id: 'M2',
    title: 'Mini Bocadillo 100% Integral con Pavo o Jamón Magro + Cortado',
    mealType: 'morning',
    category: 'Mini Bocadillo Integral',
    proteinSource: 'ave',
    description: 'Mini bocadillo (40g de pan 100% integral auténtico) con 40g de pechuga de pavo asada o jamón serrano magro sin tocino + café cortado.',
    ingredients: [
      { name: 'Pan 100% integral de grano entero', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'comprobar etiquetado 100% harina integral' },
      { name: 'Pechuga de pavo asada (>90% carne) o jamón serrano sin grasa', amount: 40, unit: 'g', category: 'Proteínas', rawStateNote: 'bajo en sal' },
      { name: 'Aceite de oliva virgen extra', amount: 3, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Café cortado sin azúcar', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 180,
    protein: 12,
    carbs: 18,
    fat: 5,
    fiber: 3.5,
    prepMinutes: 3,
    instructions: [
      'Abrir el panecillo integral, frotar unas gotas de tomate o AOVE y rellenar con el pavo o jamón serrano magro.',
      'Tomar a media mañana para evitar la fatiga o el bajón de energía previo al almuerzo.'
    ],
    scientificRationale:
      'Aporte de almidones complejos y proteína de digestión moderada. Mantiene la concentración mental sin somnolencia postprandial.',
    batchPrepNote: 'Corta el pan 100% integral en porciones de 40g y congélalas envueltas individualmente.'
  },
  {
    id: 'M3',
    title: '150g de Queso Fresco Batido 0% con Canela + Cortado',
    mealType: 'morning',
    category: 'Lácteo Proteico',
    proteinSource: 'lacteo',
    description: '150g de queso fresco batido desnatado o yogur griego natural sin azúcar con abundante canela de Ceilán + café cortado.',
    ingredients: [
      { name: 'Queso fresco batido 0% M.G.', amount: 150, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'desnatado sin azúcar' },
      { name: 'Canela de Ceilán en polvo', amount: 2, unit: 'g', category: 'Despensa & Condimentos' },
      { name: 'Café cortado sin azúcar', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 110,
    protein: 15,
    carbs: 6,
    fat: 1,
    fiber: 1,
    prepMinutes: 1,
    instructions: [
      'Servir 150g de queso fresco batido en un bol.',
      'Espolvorear con canela de Ceilán pura (evita la canela Cassia por su alto contenido en cumarina).',
      'Tomar frío junto con el café cortado.'
    ],
    scientificRationale:
      'La caseína láctea se coagula en el estómago proporcionando una liberación prolongada de aminoácidos durante 3-4 horas. La canela de Ceilán favorece la sensibilidad a la insulina.',
    batchPrepNote: 'Mantén las tarrinas de 500g de queso fresco batido en el estante superior de la nevera.'
  },
  {
    id: 'M4',
    title: '1 Huevo Campero Cocido con Sal y Pimienta + Cortado',
    mealType: 'morning',
    category: 'Huevo & Café',
    proteinSource: 'huevo',
    description: '1 huevo de gallina campera cocido con una vuelta de molinillo de pimienta negra y pizca de sal marina + cortado.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas', rawStateNote: 'hervido 9-10 min' },
      { name: 'Pimienta negra molida y sal marina', amount: 1, unit: 'pizca', category: 'Despensa & Condimentos' },
      { name: 'Café cortado sin azúcar', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 105,
    protein: 8,
    carbs: 2,
    fat: 6,
    fiber: 0.2,
    prepMinutes: 1,
    instructions: [
      'Pelar el huevo previamente cocido durante la sesión de batch cooking.',
      'Cortar en mitades, añadir un toque de pimienta negra y tomar junto al cortado.'
    ],
    scientificRationale:
      'La colina de la yema es esencial para el metabolismo lipídico hepático y la síntesis de neurotransmisores. 0 gramos de azúcares simples.',
    batchPrepNote: 'Cuece 4 huevos el domingo y consérvalos con cáscara en el frigorífico hasta 5 días.'
  }
];

// ==========================================
// COMIDAS PRINCIPALES (MEDIODÍA)
// [Con gramajes en crudo, 3-4 legumbres/sem, pescado azul potenciado]
// ==========================================
export const LUNCH_OPTIONS: MealOption[] = [
  {
    id: 'C1',
    title: 'Pechuga de Pollo Marinada al Wok con Verduras y Arroz Integral',
    mealType: 'lunch',
    category: 'Carnes Blancas',
    proteinSource: 'ave',
    description: 'Pechuga de pollo (170g en crudo) a la plancha marinada con especias + wok de calabacín (120g), pimiento (100g) y cebolla (50g) + 40g de arroz integral en crudo + 1 mandarina.',
    ingredients: [
      { name: 'Pechuga de pollo fresca en filetes', amount: 170, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo (limpia)' },
      { name: 'Calabacín con piel', amount: 120, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Pimiento rojo y verde', amount: 100, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Cebolla dulce tierna', amount: 50, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Arroz integral de grano redondo', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: '1 cucharada sopera rasa' },
      { name: 'Mandarina o ciruela fresca', amount: 90, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza de postre' }
    ],
    calories: 520,
    protein: 44,
    carbs: 45,
    fat: 14,
    fiber: 8,
    fruitPieces: 1,
    prepMinutes: 20,
    instructions: [
      'Cocer los 40g de arroz integral con hoja de laurel durante 25-30 min (o usar el cocido previamente en batch).',
      'Saltear en sartén wok las verduras troceadas en juliana con 5ml de AOVE hasta dejarlas al dente.',
      'Dorar el pollo a fuego vivo con el resto del AOVE, cúrcuma y orégano. Servir junto con el arroz y terminar con la fruta entera.'
    ],
    scientificRationale:
      'La combinación de fibra vegetal, cereal integral y proteína de alto valor biológico promueve una liberación glucémica plana de más de 4 horas sin caídas energéticas.',
    batchPrepNote: 'Ten el arroz integral hervido para 3 días en un tupper hermético.'
  },
  {
    id: 'C2',
    title: 'Filete de Ternera con Patata Cocida-Enfriada (Almidón Resistente) y Judías',
    mealType: 'lunch',
    category: 'Carnes Magras',
    proteinSource: 'ternera',
    description: 'Filete de ternera magra (140g en crudo) a la plancha + patata cocida y enfriada en nevera (140g) para generar almidón resistente + judías verdes al vapor (180g) con AOVE.',
    ingredients: [
      { name: 'Filete de ternera magra (babilla o cadera)', amount: 140, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo desgrasado' },
      { name: 'Patata cocida con piel y enfriada 24h', amount: 140, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo (almidón resistente tipo 3)' },
      { name: 'Judías verdes redondas frescas', amount: 180, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo limpias' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Ajo picado y perejil fresco', amount: 1, unit: 'diente', category: 'Despensa & Condimentos' }
    ],
    calories: 480,
    protein: 41,
    carbs: 34,
    fat: 15,
    fiber: 7.5,
    prepMinutes: 15,
    instructions: [
      'Utilizar la patata cocida con piel el día anterior y refrigerada a 4°C durante 24 horas (el enfriamiento retrograda el almidón reduciendo su índice glucémico).',
      'Cocinar las judías verdes al vapor durante 10-12 minutos para mantener su crujiente y clorofila.',
      'Cocinar la ternera a la plancha muy caliente 1 minuto por cada lado. Aliñar la patata y judías con el AOVE, sal marina y perejil.'
    ],
    scientificRationale:
      'El almidón resistente tipo 3 no se digiere en el intestino delgado; viaja al colon donde es fermentado por la microbiota en ácidos grasos de cadena corta (butirato), mejorando la sensibilidad a la insulina.',
    batchPrepNote: 'Cuece 3-4 patatas enteras con piel el domingo, enfríalas y consérvalas en la nevera toda la semana.'
  },
  {
    id: 'C3',
    title: 'Merluza al Horno sobre Cama de Patata Panadera y Pimientos Asados',
    mealType: 'lunch',
    category: 'Pescado Blanco',
    proteinSource: 'pescado_blanco',
    description: 'Lomo de merluza fresca o bacalao (190g en crudo) al horno sobre cama de patata cocida en rodajas (120g) y tiras de pimiento asado (120g).',
    ingredients: [
      { name: 'Lomo de merluza fresca o bacalao', amount: 190, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Patata en rodajas cocida y enfriada', amount: 120, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo' },
      { name: 'Pimientos asados en tiras (al natural sin azúcar)', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Cebolla en juliana fina', amount: 50, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 430,
    protein: 38,
    carbs: 29,
    fat: 12,
    fiber: 5.5,
    prepMinutes: 20,
    instructions: [
      'Disponer en bandeja refractaria la cebolla fina, las rodajas de patata y los pimientos asados.',
      'Colocar encima el lomo de merluza sazonado con limón, sal y los 10ml de AOVE.',
      'Hornear a 180°C durante 12-14 minutos. Servir jugoso.'
    ],
    scientificRationale:
      'Digestión muy ligera y alta densidad de aminoácidos esenciales con mínimo impacto inflamatorio.',
    batchPrepNote: 'Asa los pimientos en el horno el domingo durante la sesión de batch cooking.'
  },
  {
    id: 'C4',
    title: 'Salmón Fresco a la Plancha con Ensalada Mediterránea y Naranja',
    mealType: 'lunch',
    category: 'Pescado Azul',
    proteinSource: 'pescado_azul',
    description: 'Lomo de salmón fresco (160g en crudo) a la plancha con ensalada fresca de tomate (150g), pepino (80g) y brotes verdes (60g) con 10ml AOVE + 1 kiwi.',
    ingredients: [
      { name: 'Lomo de salmón fresco limpio de espinas', amount: 160, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Tomate de ensalada fresco', amount: 150, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Pepino fresco con piel', amount: 80, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Mix de brotes tiernos de lechuga y rúcula', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Kiwi fresco verde', amount: 100, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera de postre' }
    ],
    calories: 520,
    protein: 37,
    carbs: 18,
    fat: 31,
    fiber: 6.5,
    omega3Mg: 2800,
    fruitPieces: 1,
    prepMinutes: 14,
    instructions: [
      'Mezclar en ensaladera el tomate en gajos, el pepino en rodajas y los brotes. Aliñar con AOVE y vinagre de manzana.',
      'Cocinar el salmón en sartén caliente por la piel 3 minutos sin añadir grasa extra (el pescado liberará sus propios ácidos grasos).',
      'Dar la vuelta 1-2 minutos más y servir con la ensalada y el kiwi entero.'
    ],
    scientificRationale:
      'Aporta más de 2.500 mg de ácidos grasos Omega-3 (EPA y DHA). Los metabolitos bioactivos (resolvinas y protectinas) amortiguan la inflamación articular en articulaciones de carga (rodillas y cadera) a los 53 años.',
    batchPrepNote: 'Pide al pescadero que prepare los lomos de salmón individuales y congélalos si no vas a consumirlos en 48 horas.'
  },
  {
    id: 'C5',
    title: 'Lentejas Estofadas con Verduras de la Huerta (Sin Embutidos)',
    mealType: 'lunch',
    category: 'Legumbres Ligeras',
    proteinSource: 'legumbre',
    description: 'Lentejas pardinas (60g en crudo) estofadas con zanahoria (80g), cebolla (60g), pimiento (60g), tomate y laurel, sin chorizo ni grasas añadidas + 1 naranja entera.',
    ingredients: [
      { name: 'Lentejas pardinas secas', amount: 60, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Zanahoria fresca en rodajas', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Cebolla dulce picada', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pimiento verde picado', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate triturado natural', amount: 60, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 8, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Naranja entera fresca', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza rica en Vitamina C' }
    ],
    calories: 460,
    protein: 24,
    carbs: 68,
    fat: 9,
    fiber: 16,
    fruitPieces: 1,
    prepMinutes: 30,
    instructions: [
      'Poner en cazuela las lentejas lavadas con agua fría, la zanahoria, cebolla, pimiento, tomate, ajo y hoja de laurel.',
      'Cocer a fuego medio-bajo 25-30 minutos hasta que estén tiernas y el caldo espeso de forma natural.',
      'Añadir pimentón de la Vera y el AOVE en crudo al final. Comer la naranja de postre para que su vitamina C triplique la absorción del hierro vegetal.'
    ],
    scientificRationale:
      '16 gramos de fibra dietética en un solo plato. La fibra soluble retrasa la absorción de carbohidratos, alimentando las bacterias beneficiosas del colon y estabilizando la hemoglobina glicosilada.',
    batchPrepNote: 'Las lentejas ganan sabor de un día para otro. Cocina el doble y congela porciones individuales.'
  },
  {
    id: 'C6',
    title: 'Salteado de Quinoa con Pechuga de Pollo y Brócoli al Vapor',
    mealType: 'lunch',
    category: 'Cereales & Proteína',
    proteinSource: 'ave',
    description: 'Quinoa real (40g en crudo) salteada con pechuga de pollo desmenuzada (150g en crudo), brócoli al vapor (140g) y champiñones (80g) con AOVE.',
    ingredients: [
      { name: 'Pechuga de pollo cocida o asada desmenuzada', amount: 150, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Quinoa real lavada', amount: 40, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'peso en crudo seco' },
      { name: 'Brócoli fresco en arbolitos', amount: 140, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Champiñones laminados', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 470,
    protein: 43,
    carbs: 38,
    fat: 13,
    fiber: 8,
    prepMinutes: 18,
    instructions: [
      'Cocer la quinoa 12 minutos en agua hirviendo con sal y escurrir.',
      'Cocer el brócoli al vapor 6 minutos para preservar sus glucosinolatos protectores.',
      'En una sartén saltear los champiñones con AOVE, incorporar la quinoa y el pollo desmenuzado, removiendo 2 minutos con pimienta negra.'
    ],
    scientificRationale:
      'La quinoa aporta todos los aminoácidos esenciales con bajo índice glucémico. El sulforafano del brócoli reduce el estrés oxidativo articular y muscular.',
    batchPrepNote: 'Ten el pollo asado o hervido y desmenuzado previamente.'
  },
  {
    id: 'C7',
    title: 'Sardinas o Caballa a la Plancha con Pisto Manchego Casero (Omega-3)',
    mealType: 'lunch',
    category: 'Pescado Azul',
    proteinSource: 'pescado_azul',
    description: 'Filetes de caballa o sardinas frescas (170g en crudo) a la plancha con pisto casero de calabacín, berenjena, tomate y cebolla (sin azúcar) + 1 manzana.',
    ingredients: [
      { name: 'Caballa o sardinas frescas limpias', amount: 170, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo sin vísceras' },
      { name: 'Calabacín fresco en dados', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Berenjena fresca en dados', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate triturado natural', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Cebolla picada', amount: 50, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Manzana verde con piel', amount: 140, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' }
    ],
    calories: 490,
    protein: 38,
    carbs: 26,
    fat: 26,
    fiber: 9,
    omega3Mg: 2400,
    fruitPieces: 1,
    prepMinutes: 20,
    instructions: [
      'Pochar la cebolla, calabacín y berenjena en cazuela con 5ml de AOVE, añadir el tomate natural y reducir 15 min.',
      'Marcar los filetes de caballa o sardinas a la plancha 2 minutos por lado con el resto del AOVE.',
      'Servir caliente sobre el pisto y comer la manzana entera de postre.'
    ],
    scientificRationale:
      'Pescado azul de tamaño pequeño-mediano con mínima acumulación de metales pesados (mercurio) y máxima concentración de Omega-3 antiinflamatorio para articulaciones.',
    batchPrepNote: 'El pisto casero aguanta hasta 5 días en la nevera y sirve de guarnición versátil.'
  },
  {
    id: 'C8',
    title: 'Garbanzos Estofados con Espinacas y Bacalao Desalado (Cero Alcohol)',
    mealType: 'lunch',
    category: 'Legumbres Ligeras',
    proteinSource: 'legumbre',
    description: 'Garbanzos cocidos (160g cocidos / 60g en crudo) estofados con espinacas frescas (120g), bacalao desalado (100g en crudo) y caldo vegetal aromático con limón.',
    ingredients: [
      { name: 'Garbanzos cocidos de bote o hervidos', amount: 160, unit: 'g', category: 'Tubérculos & Cereales', rawStateNote: 'bien lavados y escurridos' },
      { name: 'Bacalao fresco o desalado en tacos', amount: 100, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Espinacas frescas lavadas', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Caldo vegetal casero desgrasado con limón (sin vino ni alcohol)', amount: 150, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Aceite de oliva virgen extra', amount: 8, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Pimentón dulce y ajo picado', amount: 1, unit: 'cucharadita', category: 'Despensa & Condimentos' }
    ],
    calories: 470,
    protein: 36,
    carbs: 46,
    fat: 12,
    fiber: 12,
    prepMinutes: 15,
    instructions: [
      'Dorar el ajo en cazuela con el AOVE, añadir el pimentón dulce retirando del fuego para que no amargue.',
      'Verter el caldo vegetal caliente con unas gotas de zumo de limón (sustituyendo cualquier uso de vino blanco).',
      'Incorporar los garbanzos, las espinacas y los tacos de bacalao. Cocer suave 6-8 minutos hasta que el bacalao esté en su punto.'
    ],
    scientificRationale:
      'Guiso tradicional reconvertido a versión cardiosaludable: 100% libre de alcohol, bajo en grasa saturada y con una altísima densidad de fibra prebiótica para el control glucémico.',
    batchPrepNote: 'Usa garbanzos ya cocidos de calidad en tarro de cristal para preparar este plato en 15 minutos.'
  }
];

// ==========================================
// MERIENDAS DE TARDE (17:30 - 18:30)
// [Fruta fresca entera, saciedad previa a la cena]
// ==========================================
export const SNACK_OPTIONS: MealOption[] = [
  {
    id: 'ME1',
    title: 'Manzana con Piel en Rodajas + 20g de Nueces Crudas',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'frutos_secos',
    description: '1 manzana mediana fresca comida con su piel + 20g de nueces peladas naturales (aprox. 4 nueces enteras) + infusión digestiva de manzanilla o té rooibos.',
    ingredients: [
      { name: 'Manzana fresca con piel (lavada)', amount: 160, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza mediana' },
      { name: 'Nueces peladas crudas', amount: 20, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso en crudo (aprox. 4 nueces)' },
      { name: 'Infusión digestiva (rooibos o manzanilla)', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 185,
    protein: 4,
    carbs: 22,
    fat: 10,
    fiber: 5,
    fruitPieces: 1,
    omega3Mg: 800,
    prepMinutes: 2,
    instructions: [
      'Lavar bien la manzana y cortarla en láminas finas manteniendo la piel.',
      'Acompañar con las nueces crudas y una infusión sin azúcar.'
    ],
    scientificRationale:
      'La combinación de fibra soluble (pectina) y grasa monoinsaturada detiene la grelina vespertina, llegando a la cena con saciedad regulada.',
    batchPrepNote: 'Lleva la manzana y el puñadito de nueces en una fiambrera si estás fuera de casa.'
  },
  {
    id: 'ME2',
    title: 'Yogur Kéfir Natural con Pera en Dados y Canela',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '150g de kéfir o yogur natural sin azúcar con 1 pera fresca madura troceada en dados y una pizca de canela de Ceilán.',
    ingredients: [
      { name: 'Kéfir o yogur natural sin azúcar', amount: 150, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Pera mediana fresca con piel', amount: 150, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' },
      { name: 'Canela de Ceilán pura', amount: 1, unit: 'g', category: 'Despensa & Condimentos' }
    ],
    calories: 165,
    protein: 7,
    carbs: 26,
    fat: 3.5,
    fiber: 5,
    fruitPieces: 1,
    prepMinutes: 2,
    instructions: [
      'Verter el kéfir natural en un tazón.',
      'Cortar la pera en dados pequeños con su piel lavada.',
      'Mezclar con la canela y comer con cuchara.'
    ],
    scientificRationale:
      'El kéfir aporta probióticos vivos que colonizan el tracto digestivo, reduciendo la inflamación de bajo grado y facilitando el tránsito intestinal.',
    batchPrepNote: 'Ten siempre botellas de kéfir en la nevera.'
  },
  {
    id: 'ME3',
    title: '1 Cuenco de Frutos Rojos Frescos + 15g de Almendras Crudas',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'frutos_secos',
    description: '100g de arándanos, moras o fresas frescas con 15g de almendras crudas con piel (aprox. 12 almendras) + té verde descafeinado.',
    ingredients: [
      { name: 'Arándanos, frambuesas o fresas frescas', amount: 100, unit: 'g', category: 'Frutas Frescas' },
      { name: 'Almendras crudas con piel sin tostar', amount: 15, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Té verde o infusión de jengibre', amount: 1, unit: 'taza', category: 'Despensa & Condimentos' }
    ],
    calories: 145,
    protein: 4,
    carbs: 14,
    fat: 8,
    fiber: 5,
    fruitPieces: 1,
    prepMinutes: 2,
    instructions: [
      'Lavar los frutos rojos y servirlos en un cuenco junto a las almendras.',
      'Acompañar con la infusión caliente.'
    ],
    scientificRationale:
      'Bajo impacto glucémico y alta concentración de flavonoides y vitamina C.',
    batchPrepNote: 'Compra bandejas de frutos rojos de proximidad.'
  },
  {
    id: 'ME4',
    title: 'Mini Tosta 100% Integral con Requesón Desnatado y Tomate Cherry + Kiwi',
    mealType: 'snack',
    category: 'Merienda & Fruta Fresca',
    proteinSource: 'lacteo',
    description: '1 tosta de pan 100% integral (30g) con 40g de requesón bajo en grasa o queso batido y 3 tomatitos cherry + 1 kiwi maduro entero.',
    ingredients: [
      { name: 'Pan 100% integral', amount: 30, unit: 'g', category: 'Tubérculos & Cereales' },
      { name: 'Requesón desnatado o queso fresco 0%', amount: 40, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Tomates cherry', amount: 50, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Kiwi verde fresco', amount: 90, unit: 'g', category: 'Frutas Frescas', rawStateNote: '1 pieza entera' }
    ],
    calories: 170,
    protein: 9,
    carbs: 24,
    fat: 3,
    fiber: 5,
    fruitPieces: 1,
    prepMinutes: 3,
    instructions: [
      'Untar el requesón sobre el pan integral y coronar con los cherrys cortados por la mitad.',
      'Comer el kiwi con cuchara.'
    ],
    scientificRationale:
      'El kiwi contiene actinidina, una enzima natural que optimiza la digestión proteica de la cena.',
    batchPrepNote: 'El requesón aguanta 4 días una vez abierto.'
  }
];

// ==========================================
// CENAS LIGERAS (NOCHE 20:30 - 21:30)
// [Sin carbohidratos refinados, moderación de huevos y atún, sin surimi ni embutidos salados]
// ==========================================
export const DINNER_OPTIONS: MealOption[] = [
  {
    id: 'N1',
    title: 'Crema Ligera de Calabacín y Puerro + Tortilla Francesa (1 Huevo + 1 Clara)',
    mealType: 'dinner',
    category: 'Cremas y Sopas',
    proteinSource: 'huevo',
    description: 'Crema casera de calabacín (200g) y puerro (60g) espesada con 50g de queso fresco batido 0% (sin patata) + tortilla francesa de 1 huevo campero y 1 clara adicional.',
    ingredients: [
      { name: 'Calabacín con piel', amount: 200, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Puerro o cebolla tierna', amount: 60, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Queso fresco batido 0% (para espesar)', amount: 50, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Huevo campero entero', amount: 1, unit: 'ud', category: 'Proteínas' },
      { name: 'Clara de huevo pasteurizada', amount: 40, unit: 'ml', category: 'Proteínas', rawStateNote: '1 clara extra para moderar colesterol' },
      { name: 'Aceite de oliva virgen extra', amount: 6, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 275,
    protein: 21,
    carbs: 11,
    fat: 13,
    fiber: 4,
    prepMinutes: 15,
    instructions: [
      'Cocer el calabacín troceado y el puerro en agua hirviendo con sal durante 8 minutos. Escurrir reservando un poco de caldo.',
      'Triturar con el queso fresco batido 0% hasta obtener una textura sedosa sin añadir patatas ni natas.',
      'Batir el huevo campero junto con la clara adicional y cuajar en sartén con 3ml de AOVE. Servir junto al cuenco de crema caliente.'
    ],
    scientificRationale:
      'Cena sin almidones refinados que optimiza la liberación nocturna de la hormona de crecimiento (GH) favoreciendo la reparación tisular. La proporción 1 huevo + 1 clara mantiene los lípidos plasmáticos estables.',
    batchPrepNote: 'Prepara una olla grande de crema de calabacín para 3 cenas y consérvala en tarros herméticos.'
  },
  {
    id: 'N2',
    title: 'Revuelto de Champiñones Laminados con Gambas al Ajillo y Brotes',
    mealType: 'dinner',
    category: 'Huevos & Marisco',
    proteinSource: 'marisco',
    description: 'Champiñones laminados (150g) salteados con gambas peladas (120g en crudo), ajo y 1 huevo campero batido suave + ensalada de brotes verdes con vinagre.',
    ingredients: [
      { name: 'Gambas o langostinos crudos pelados', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo (no surimi)' },
      { name: 'Champiñones frescos laminados', amount: 150, unit: 'g', category: 'Verduras & Hortalizas', rawStateNote: 'en crudo' },
      { name: 'Huevo campero entero', amount: 1, unit: 'ud', category: 'Proteínas' },
      { name: 'Brotes verdes frescos (rúcula, canónigos)', amount: 50, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Diente de ajo picado y perejil', amount: 1, unit: 'diente', category: 'Despensa & Condimentos' },
      { name: 'Aceite de oliva virgen extra', amount: 8, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 295,
    protein: 30,
    carbs: 7,
    fat: 14,
    fiber: 3.5,
    prepMinutes: 12,
    instructions: [
      'Dorar el ajo laminado con el AOVE, añadir los champiñones y saltear 4 minutos.',
      'Incorporar las gambas salpimentadas durante 1 minuto a fuego medio.',
      'Añadir 1 huevo campero batido y cuajar suavemente a fuego lento para que quede jugoso. Emplatar con los brotes tiernos.'
    ],
    scientificRationale:
      'El marisco aporta yodo y selenio fundamentales para el tiroides, sin grasas saturadas ni ultraprocesados (evitando surimi o gulas procesadas con almidón y sal).',
    batchPrepNote: 'Usa gambas ultracongeladas al natural y descongélalas bajo el grifo de agua fría en 2 minutos.'
  },
  {
    id: 'N3',
    title: 'Ensalada Completa con Caballa al Natural y Huevo Cocido',
    mealType: 'dinner',
    category: 'Ensaladas Proteicas',
    proteinSource: 'pescado_azul',
    description: 'Ensalada con mix de hojas verdes (100g), tomate (100g), pepino (80g), 1 lata de caballa al natural (80g escurrida) y 1 huevo cocido con 8ml AOVE.',
    ingredients: [
      { name: 'Caballa del norte al natural en lata', amount: 80, unit: 'g', category: 'Proteínas', rawStateNote: 'peso escurrido (alternativa baja en mercurio al atún)' },
      { name: 'Huevo campero cocido', amount: 1, unit: 'ud', category: 'Proteínas' },
      { name: 'Mix de lechugas, espinacas y canónigos', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Tomate de ensalada en gajos', amount: 100, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Pepino en láminas', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 8, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Vinagre de manzana ecológico', amount: 1, unit: 'cucharada', category: 'Despensa & Condimentos' }
    ],
    calories: 310,
    protein: 28,
    carbs: 9,
    fat: 16,
    fiber: 4,
    omega3Mg: 1600,
    prepMinutes: 7,
    instructions: [
      'Disponer las hojas verdes, el tomate troceado y el pepino en una fuente.',
      'Añadir la caballa al natural desmenuzada y el huevo duro cortado en cuartos.',
      'Aliñar con el AOVE y vinagre de manzana.'
    ],
    scientificRationale:
      'La caballa tiene significativamente menor acumulación de metales pesados que el atún rojo y ofrece una excelente dosis de ácidos grasos Omega-3 de cadena larga.',
    batchPrepNote: 'Ten los huevos cocidos en la nevera listos para incorporar en 30 segundos.'
  },
  {
    id: 'N4',
    title: 'Pescado Blanco a la Plancha con Espárragos Verdes al Vapor y Limón',
    mealType: 'dinner',
    category: 'Pescado Lindo',
    proteinSource: 'pescado_blanco',
    description: 'Filete de gallo, merluza o lenguado (170g en crudo) a la plancha con manojo de espárragos verdes o brócoli al vapor (160g) y zumo de limón.',
    ingredients: [
      { name: 'Filete de merluza, gallo o lubina', amount: 170, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Espárragos trigueros o brócoli fresco', amount: 160, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 8, unit: 'ml', category: 'Despensa & Condimentos' },
      { name: 'Zumo de limón fresco y sal marina', amount: 1, unit: 'pizca', category: 'Despensa & Condimentos' }
    ],
    calories: 250,
    protein: 34,
    carbs: 6,
    fat: 9,
    fiber: 4.5,
    prepMinutes: 12,
    instructions: [
      'Cocinar los espárragos al vapor o a la plancha con 3ml de AOVE 6-7 minutos hasta que estén tiernos.',
      'Hacer el pescado blanco a la plancha 2 minutos por lado.',
      'Regar con el AOVE restante en crudo y unas gotas de zumo de limón.'
    ],
    scientificRationale:
      'Cena de máxima digestibilidad y mínimo residuo gástrico, ideal para conciliar el sueño rápido y favorecer la depuración hepática nocturna.',
    batchPrepNote: 'Los espárragos se cocinan en 6 minutos al vapor o en estuche de silicona.'
  },
  {
    id: 'N5',
    title: 'Bol de Requesón o Queso Fresco Batido con 15g de Nueces y Canela',
    mealType: 'dinner',
    category: 'Cena Láctea Proteica',
    proteinSource: 'lacteo',
    description: '200g de requesón magro o queso fresco batido 0% con 15g de nueces troceadas a mano y canela de Ceilán pura.',
    ingredients: [
      { name: 'Requesón bajo en grasa o queso fresco batido 0%', amount: 200, unit: 'g', category: 'Lácteos & Frutos Secos' },
      { name: 'Nueces peladas crudas', amount: 15, unit: 'g', category: 'Lácteos & Frutos Secos', rawStateNote: 'peso exacto (3 nueces)' },
      { name: 'Canela de Ceilán pura en polvo', amount: 2, unit: 'g', category: 'Despensa & Condimentos' }
    ],
    calories: 250,
    protein: 24,
    carbs: 9,
    fat: 12,
    fiber: 2,
    prepMinutes: 2,
    instructions: [
      'Servir el requesón o queso fresco batido en un bol.',
      'Picar las nueces por encima y espolvorear la canela de Ceilán.',
      'Degustar con cuchara.'
    ],
    scientificRationale:
      'Excelente opción para noches en las que no apetece cocinar. La caseína láctea nutre la masa muscular durante las 8 horas de sueño previniendo el catabolismo proteico.',
    batchPrepNote: 'Tarda menos de 60 segundos en servirse.'
  },
  {
    id: 'N6',
    title: 'Tortilla de Calabacín y Espinacas con Brotes y AOVE',
    mealType: 'dinner',
    category: 'Tortillas Veg',
    proteinSource: 'huevo',
    description: 'Tortilla suave de calabacín rallado (120g) y espinacas tiernas (80g) con 1 huevo campero y 1 clara pasteurizada + ensalada pequeña de rúcula.',
    ingredients: [
      { name: 'Huevo campero talla L', amount: 1, unit: 'ud', category: 'Proteínas' },
      { name: 'Clara de huevo pasteurizada', amount: 40, unit: 'ml', category: 'Proteínas' },
      { name: 'Calabacín rallado fino', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Espinacas frescas picadas', amount: 80, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 6, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 245,
    protein: 19,
    carbs: 6,
    fat: 14,
    fiber: 4,
    prepMinutes: 10,
    instructions: [
      'Saltear el calabacín rallado y las espinacas 3 minutos en sartén antiadherente con 3ml de AOVE para evaporar el agua.',
      'Batir el huevo y la clara con una pizca de sal marina e incorporar la verdura.',
      'Cuajar la tortilla vuelta y vuelta a fuego medio.'
    ],
    scientificRationale:
      'Vegetales con alto contenido en magnesio y potasio que inducen la relajación del sistema nervioso central antes de dormir.',
    batchPrepNote: 'Ralla el calabacín con antelación y escúrrelo en papel de cocina.'
  },
  {
    id: 'N7',
    title: 'Caldo Casero de Verduras con Pollo Desgrasado y Verduras al Vapor',
    mealType: 'dinner',
    category: 'Cremas y Sopas',
    proteinSource: 'ave',
    description: 'Caldo depurativo casero de puerro, apio y zanahoria (sin grasas) con 120g de pechuga de pollo desmenuzada y judías verdes al vapor (120g).',
    ingredients: [
      { name: 'Pechuga de pollo cocida y desgrasada', amount: 120, unit: 'g', category: 'Proteínas', rawStateNote: 'peso en crudo' },
      { name: 'Caldo casero de verduras (puerro, apio, zanahoria, laurel)', amount: 250, unit: 'ml', category: 'Despensa & Condimentos', rawStateNote: 'sin pastillas industriales' },
      { name: 'Judías verdes o calabacín en dados', amount: 120, unit: 'g', category: 'Verduras & Hortalizas' },
      { name: 'Aceite de oliva virgen extra', amount: 5, unit: 'ml', category: 'Despensa & Condimentos' }
    ],
    calories: 255,
    protein: 32,
    carbs: 8,
    fat: 9,
    fiber: 4.5,
    prepMinutes: 10,
    instructions: [
      'Calentar el caldo casero de verduras en un cazo.',
      'Añadir las judías verdes y el pollo desmenuzado, dejando hervir suave 5 minutos para que se integren los sabores.',
      'Servir caliente en un plato hondo con un hilo de AOVE en crudo.'
    ],
    scientificRationale:
      'Hidratación óptima, aporte de electrolitos naturales (potasio, magnesio) y proteína limpia sin sobrecargar el aparato digestivo.',
    batchPrepNote: 'Prepara 2 litros de caldo casero de verduras los domingos y congélalo en tarros.'
  }
];

export const DAYS_CONFIG: Array<{ id: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'; name: string; short: string }> = [
  { id: 'lunes', name: 'Lunes', short: 'LUN' },
  { id: 'martes', name: 'Martes', short: 'MAR' },
  { id: 'miercoles', name: 'Miércoles', short: 'MIÉ' },
  { id: 'jueves', name: 'Jueves', short: 'JUE' },
  { id: 'viernes', name: 'Viernes', short: 'VIE' },
  { id: 'sabado', name: 'Sábado', short: 'SÁB' },
  { id: 'domingo', name: 'Domingo', short: 'DOM' }
];
