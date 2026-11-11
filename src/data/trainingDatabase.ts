import { Exercise, WeeklyTrainingPlan, PhysicalProfile, TrackingEntry } from '../types/training';

// DEFAULT PHYSICAL PROFILE WITH JUAN'S 4 AUDIT DATA POINTS
export const DEFAULT_PHYSICAL_PROFILE: PhysicalProfile = {
  medicalClearanceApproved: true, // Visto bueno médico previo
  medicalNotes: 'Chequeo médico cardiorrespiratorio y analítica previa realizada para varón de 53 años (102 kg).',
  kneeDiscomfortLevel: 2, // 2/10 leve ocasional en bajadas
  lumbarDiscomfortLevel: 1, // 1/10 leve al estar mucho tiempo de pie
  strengthDaysAvailable: 3, // 3 días por semana
  sessionMinutesAvailable: 30, // 30 minutos por sesión
  availableEquipment: {
    firmChair: true,
    mat: true,
    resistanceBands: true,
    dumbbells: false,
    nordicPoles: true // Bastones de marcha nórdica esenciales para bajadas
  },
  preferredCardioAlternative: 'eliptica'
};

// ==========================================
// BANCO DE EJERCICIOS DE FUERZA ADAPTADOS
// [Sin impacto, protección rotuliana y lumbar]
// ==========================================
export const STRENGTH_EXERCISES: Exercise[] = [
  {
    id: 'E1',
    name: 'Sentadilla a la Silla con Énfasis Excéntrico (Bajada Lenta)',
    primaryMuscle: 'cuadriceps',
    equipment: 'silla_firme',
    targetReps: '10 - 12 reps',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: '3-4 seg bajando lento / 1 seg pausa / 1 seg subida potente',
    restSeconds: 60,
    jointProtectionNotes:
      'Prepara el cuádriceps y el tendón rotuliano para soportar la desaceleración y frenado en las bajadas de la ruta. La silla actúa como tope de seguridad eliminando el riesgo de flexión excesiva o pérdida de equilibrio a 102 kg.',
    instructions: [
      'Colócate de espaldas a una silla firme y estable, con los pies separados a la anchura de las caderas y puntas ligeramente hacia fuera (15°).',
      'Inicia el movimiento llevando las caderas hacia atrás como si fueras a sentarte, tardando 3-4 segundos completos en bajar.',
      'Roza ligeramente el asiento de la silla sin llegar a apoyar todo el peso ni relajarte.',
      'Sube empujando el suelo con el talón y el mediopié, apretando los glúteos al llegar arriba.'
    ],
    progressionTip:
      'En Semana 1: 2 series de 10 reps. En Semana 2: 3 series de 12 reps. Si resulta fácil, sostén 1 segundo antes de rozar la silla.'
  },
  {
    id: 'E2',
    name: 'Puente de Glúteos en Esterilla (Descarga Lumbar)',
    primaryMuscle: 'gluteos',
    equipment: 'esterilla',
    targetReps: '12 - 15 reps',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: '2 seg subida / 2 seg contracción isométrica arriba / 2 seg bajada',
    restSeconds: 45,
    jointProtectionNotes:
      'Fortalece el glúteo mayor y los isquiotibiales sin ninguna carga de compresión sobre las vértebras lumbares (L4-L5). Unos glúteos fuertes estabilizan la pelvis durante las subidas de monte.',
    instructions: [
      'Túmbate boca arriba en la esterilla con las rodillas flexionadas a 90° y los pies bien apoyados en el suelo.',
      'Mantén los brazos a los lados con las palmas hacia abajo y la zona lumbar apoyada en posición neutra.',
      'Empuja con los talones y eleva las caderas hasta formar una línea recta entre rodillas, caderas y hombros.',
      'Aprieta los glúteos arriba durante 2 segundos completos y baja de forma controlada.'
    ],
    progressionTip:
      'En Semana 1: 2 series de 12 reps. En Semana 2: 3 series de 15 reps o colocar una banda elástica alrededor de las rodillas para activar el glúteo medio.'
  },
  {
    id: 'E3',
    name: 'Remo Horizontal con Banda Elástica (Postura & Espalda)',
    primaryMuscle: 'espalda',
    equipment: 'banda_elastica',
    targetReps: '12 - 14 reps',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: '1 seg tirón / 2 seg pausa juntando escápulas / 3 seg retorno lento',
    restSeconds: 60,
    jointProtectionNotes:
      'Corrige la postura encorvada (cifosis) provocada por el peso corporal y mejora la biomecánica al caminar con bastones de marcha nórdica.',
    instructions: [
      'Siéntate en la silla con la espalda recta o de pie con rodillas semiflexionadas, sujetando la banda anclada a una puerta o pasada por los pies.',
      'Tracciona de los codos hacia atrás pegados a los costados, juntando conscientemente las escápulas (omóplatos).',
      'Mantén los hombros lejos de las orejas (sin encoger el cuello) y aguanta 2 segundos antes de volver despacio.'
    ],
    progressionTip:
      'En Semana 1: Banda de resistencia media (2 series x 12). En Semana 2: 3 series x 14 acortando la banda para mayor resistencia.'
  },
  {
    id: 'E4',
    name: 'Press de Pecho Inclinado en Pared o Mesa Firme',
    primaryMuscle: 'pecho',
    equipment: 'peso_corporal',
    targetReps: '10 - 12 reps',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: '3 seg bajada lenta / 1 seg empuje firme',
    restSeconds: 60,
    jointProtectionNotes:
      'Alternativa a las flexiones en suelo que elimina la sobrecarga en muñecas y lumbares, fortaleciendo pectorales, hombro anterior y tríceps de forma segura.',
    instructions: [
      'Coloca las manos a la altura del pecho sobre una mesa firme o en la pared, con el cuerpo en línea recta y el abdomen firme.',
      'Flexiona los codos a 45° respecto al torso bajando el pecho de forma controlada en 3 segundos.',
      'Empuja con firmeza hasta extender los brazos sin bloquear los codos de forma brusca.'
    ],
    progressionTip:
      'Para subir intensidad, aleja más los pies o usa una superficie más baja (ej. borde de la mesa en lugar de la pared).'
  },
  {
    id: 'E5',
    name: 'Dead Bug / Bicho Muerto (Core Antiextensión sin Daño Lumbar)',
    primaryMuscle: 'core',
    equipment: 'esterilla',
    targetReps: '8 - 10 por pierna',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: 'Movimiento lento, respiración diafragmática continua',
    restSeconds: 45,
    jointProtectionNotes:
      'El core NO reduce la grasa de la cintura directamente: su función clínica es fijar la columna lumbar y la pelvis. El dead bug activa el transverso abdominal y multífidos sin arquear la zona lumbar ni flexionar el cuello (cero encorvamiento de crunches).',
    instructions: [
      'Túmbate boca arriba con brazos apuntando al techo y rodillas y caderas flexionadas a 90° (posición de mesa invertida).',
      'Pega suavemente la zona lumbar contra la esterilla expulsando el aire.',
      'Extiende lentamente un brazo hacia atrás y la pierna contraria hacia delante rozando el suelo sin que la zona lumbar se despegue de la esterilla.',
      'Vuelve al centro y repite con el lado opuesto de forma coordinada.'
    ],
    progressionTip:
      'Si se despega la zona lumbar, no extiendas la pierna tan abajo; baja solo el talón a 45°.'
  },
  {
    id: 'E6',
    name: 'Elevación de Talones en Escalón con Descenso Excéntrico',
    primaryMuscle: 'gemelos',
    equipment: 'peso_corporal',
    targetReps: '12 - 15 reps',
    targetSetsWeek1: 2,
    targetSetsWeek2: 3,
    tempo: '1 seg subida en puntillas / 3 seg bajada lenta por debajo del escalón',
    restSeconds: 45,
    jointProtectionNotes:
      'Fortalece el complejo gastrocnemio-sóleo y el tendón de Aquiles. Los gemelos absorben gran parte del impacto vertical antes de que llegue a la rodilla.',
    instructions: [
      'Apoya la mitad delantera de los pies en un escalón o peldaño firme, sujetándote a la barandilla o pared para equilibrarte.',
      'Eleva los talones al máximo empujando con la base del dedo gordo.',
      'Baja muy despacio (3 segundos) dejando que los talones caigan ligeramente por debajo del escalón para estirar y fortalecer en excéntrico.'
    ],
    progressionTip:
      'En Semana 2: Realizar las últimas 4 repeticiones a una sola pierna o con una mochila con 2-3 kg.'
  }
];

// ==========================================
// RUTA DE CAMINATA CON NÚMEROS CORREGIDOS
// [Desnivel exacto: 74 m a 312 m (+238m / -238m)]
// ==========================================
export const TRAIL_ROUTE_SPECS = {
  name: 'Ruta Circular de Caminata con Desnivel (Ruta Habitual)',
  altitudeStartM: 74,
  altitudePeakM: 312,
  netElevationGainM: 238, // 312 - 74 = +238 m de subida
  netElevationLossM: 238, // -238 m de bajada en circuito de ida y vuelta (corregido de la errata de -292 m)
  totalDistanceKm: 6.9,
  estimatedDurationMin: '70 - 80 min',
  averageHeartRateTarget: '115 - 130 bpm (Zona 2 aeróbica)',
  downhillJointImpact:
    'En las bajadas, cada paso multiplica la fuerza de impacto hasta por 3.5 veces el peso corporal (~350 kg de carga en cada rodilla a 102 kg si no se amortigua correctamente).'
};

// ==========================================
// 3 TÉCNICAS CLAVE PARA BAJADAS
// [Reducción crítica del impacto en rodillas]
// ==========================================
export const DOWNHILL_TECHNIQUES = [
  {
    id: 'T1',
    title: '1. Uso de Bastones de Marcha Nórdica (Descarga del 20-25%)',
    description:
      'Los bastones transfieren de un 20% a un 25% del peso hacia los músculos de la espalda, hombros y brazos. Al descender, clava los bastones ligeramente por delante del cuerpo para frenar la inercia antes de que el talón impacte en el suelo.',
    benefit: 'Elimina entre 20 y 25 kg de presión puntual sobre el cartílago rotuliano en cada paso descendente.'
  },
  {
    id: 'T2',
    title: '2. Técnica de Descenso: Pasos Cortos y Rodillas Elásticas',
    description:
      'Evita dar zancadas largas que bloqueen la rodilla en hiperextensión ("talonar"). Mantén una cadencia alta con pasos cortos, centro de gravedad ligeramente bajo y rodillas en flexión elástica constante de 15-20° para que el cuádriceps actúe de muelle natural.',
    benefit: 'Evita el cizallamiento anterior de la tibia sobre el fémur y protege el ligamento cruzado y los meniscos.'
  },
  {
    id: 'T3',
    title: '3. Fuerza Excéntrica en Casa: Sentadilla Lenta a la Silla',
    description:
      'El ejercicio de sentadilla bajando en 3-4 segundos entrena la capacidad del cuádriceps de contraerse mientras se alarga (fase excéntrica). Es exactamente la misma contracción que utilizas al frenar tu peso corporal cuesta abajo.',
    benefit: 'Aumenta el grosor y tolerancia del tendón rotuliano, reduciendo el dolor o sobrecarga al llegar a casa.'
  }
];

// ==========================================
// PLAN SEMANAL DE ENTRENAMIENTO (7 DÍAS)
// [Con día de descanso/recuperación activa]
// ==========================================
export const WEEK_1_TRAINING_PLAN: WeeklyTrainingPlan = {
  weekNumber: 1,
  title: 'Semana 1: Adaptación de la Carga & Protección Articular',
  focus: 'Consolidar la técnica en bajadas con bastones, 3 sesiones de fuerza de 2 series e instaurar el día de recuperación activa.',
  totalWeeklyKm: 34.5,
  strengthSessionsCount: 3,
  activeRecoveryDaysCount: 1,
  days: [
    {
      dayId: 'lunes',
      dayName: 'Lunes',
      cardioType: 'caminata_desnivel',
      cardioDurationMinutes: 75,
      distanceKm: 6.9,
      elevationGainM: 238,
      elevationLossM: 238,
      hasStrengthSession: true,
      strengthSessionName: 'Fuerza A (Cuádriceps, Core & Glúteos)',
      strengthExercises: [STRENGTH_EXERCISES[0], STRENGTH_EXERCISES[1], STRENGTH_EXERCISES[4]],
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Caminar con bastones en la bajada (+238m / -238m). Sentadilla a la silla bajando lento al volver.'
    },
    {
      dayId: 'martes',
      dayName: 'Martes',
      cardioType: 'caminata_desnivel',
      cardioDurationMinutes: 70,
      distanceKm: 6.9,
      elevationGainM: 238,
      elevationLossM: 238,
      hasStrengthSession: false,
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Cadencia ágil en subida para trabajo cardiovascular; pasos cortos en la bajada sin bloquear rodilla.'
    },
    {
      dayId: 'miercoles',
      dayName: 'Miércoles',
      cardioType: 'recuperacion_activa',
      cardioDurationMinutes: 35,
      distanceKm: 3.2,
      elevationGainM: 20,
      elevationLossM: 20,
      hasStrengthSession: false,
      isRestOrActiveRecovery: true,
      jointFocusTip: 'DÍA DE DESCANSO / RECUPERACIÓN ACTIVA: Paseo llano suave y 10 min de estiramientos de cadera y gemelos. Permite que el cartílago y tendón rotuliano se reparen.'
    },
    {
      dayId: 'jueves',
      dayName: 'Jueves',
      cardioType: 'caminata_desnivel',
      cardioDurationMinutes: 75,
      distanceKm: 6.9,
      elevationGainM: 238,
      elevationLossM: 238,
      hasStrengthSession: true,
      strengthSessionName: 'Fuerza B (Cadena Posterior & Postura)',
      strengthExercises: [STRENGTH_EXERCISES[2], STRENGTH_EXERCISES[3], STRENGTH_EXERCISES[5]],
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Fuerza en casa centrada en remo con banda y gemelos. Clave para estabilidad del tobillo.'
    },
    {
      dayId: 'viernes',
      dayName: 'Viernes',
      cardioType: 'eliptica_suave',
      cardioDurationMinutes: 45,
      distanceKm: 6.0,
      elevationGainM: 0,
      elevationLossM: 0,
      hasStrengthSession: false,
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Elíptica de bajo impacto (cero choque vertical en rodillas y columna). Resistencia moderada y postura erguida.'
    },
    {
      dayId: 'sabado',
      dayName: 'Sábado',
      cardioType: 'caminata_desnivel',
      cardioDurationMinutes: 80,
      distanceKm: 6.9,
      elevationGainM: 238,
      elevationLossM: 238,
      hasStrengthSession: true,
      strengthSessionName: 'Fuerza Completa (6 Ejercicios / 2 Series)',
      strengthExercises: STRENGTH_EXERCISES,
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Circuito de fuerza completo de 25 minutos con 6 ejercicios. Mantener 3 segundos de bajada en sentadilla.'
    },
    {
      dayId: 'domingo',
      dayName: 'Domingo',
      cardioType: 'paseo_llano',
      cardioDurationMinutes: 45,
      distanceKm: 4.5,
      elevationGainM: 30,
      elevationLossM: 30,
      hasStrengthSession: false,
      isRestOrActiveRecovery: false,
      jointFocusTip: 'Paseo dominical distendido. Coincide con la comida libre planificada semanal para recuperación psicológica.'
    }
  ]
};

export const WEEK_2_TRAINING_PLAN: WeeklyTrainingPlan = {
  ...WEEK_1_TRAINING_PLAN,
  weekNumber: 2,
  title: 'Semana 2: Progresión de Volumen & Fuerza Excéntrica',
  focus: 'Aumento a 3 series en sentadillas a la silla y puentes de glúteo, mayor control excéntrico y ritmo sostenido en subida.',
  days: WEEK_1_TRAINING_PLAN.days.map((day) => ({
    ...day,
    jointFocusTip: day.hasStrengthSession
      ? 'Aumentar a 3 series por ejercicio (Semana 2). Mantener 3-4 segundos de fase excéntrica.'
      : day.jointFocusTip
  }))
};

// INITIAL TRACKING ENTRIES MATCHING USER SCREENSHOT EXACTLY
export const INITIAL_TRACKING_ENTRIES: TrackingEntry[] = [
  {
    id: 'track-init-20261101',
    date: '2026-11-01',
    weekNumber: 0,
    weightKg: 102.0,
    waistCircumferenceCm: 106.0,
    dailySteps: 8450,
    kneeSensation: 'sin_molestias',
    lumbarSensation: 'firme_sin_dolor',
    adherencePercentage: 100,
    notes: 'Registro inicial (Garmin 735XT)'
  }
];

