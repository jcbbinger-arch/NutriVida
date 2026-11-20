export type MuscleGroup = 'cuadriceps' | 'gluteos' | 'core' | 'espalda' | 'pecho' | 'gemelos' | 'cadera';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  equipment: 'silla_firme' | 'banda_elastica' | 'esterilla' | 'peso_corporal' | 'mancuernas';
  targetReps: string; // e.g. "10-12 reps"
  targetSetsWeek1: number;
  targetSetsWeek2: number;
  tempo: string; // e.g. "3 seg bajada lenta (excéntrico) / 1 seg subida"
  restSeconds: number;
  jointProtectionNotes: string; // Por qué protege rodillas o lumbares
  instructions: string[];
  progressionTip: string; // Cuándo y cómo subir la dificultad
}

export interface DayWorkoutPlan {
  dayId: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  dayName: string;
  cardioType: 'caminata_desnivel' | 'eliptica_suave' | 'recuperacion_activa' | 'paseo_llano';
  cardioDurationMinutes: number;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  hasStrengthSession: boolean;
  strengthSessionName?: string;
  strengthExercises?: Exercise[];
  isRestOrActiveRecovery: boolean;
  jointFocusTip: string;
}

export interface WeeklyTrainingPlan {
  weekNumber: 1 | 2;
  title: string;
  focus: string;
  days: DayWorkoutPlan[];
  totalWeeklyKm: number;
  strengthSessionsCount: number;
  activeRecoveryDaysCount: number;
}

export interface PhysicalProfile {
  medicalClearanceApproved: boolean; // Visto bueno médico previo
  medicalNotes: string;
  kneeDiscomfortLevel: number; // 0 - 10 (Escala EVA)
  lumbarDiscomfortLevel: number; // 0 - 10
  strengthDaysAvailable: number; // 2 o 3 días
  sessionMinutesAvailable: number; // 25-35 min
  availableEquipment: {
    firmChair: boolean;
    mat: boolean;
    resistanceBands: boolean;
    dumbbells: boolean;
    nordicPoles: boolean; // Bastones marcha nórdica
  };
  preferredCardioAlternative: 'eliptica' | 'bici_estatica' | 'caminata_llana';
}

export interface TrackingEntry {
  id: string;
  date: string;
  weekNumber: number;
  weightKg: number;
  waistCircumferenceCm: number; // Medido a nivel de ombligo en ayunas
  dailySteps: number; // Pasos diarios (Garmin Forerunner 735XT)
  kneeSensation: 'sin_molestias' | 'ligera_sobrecarga' | 'molestia_moderada';
  lumbarSensation: 'firme_sin_dolor' | 'ligera_tension' | 'molestia';
  adherencePercentage: number;
  notes: string;
}

export type TrainingEnvironment = 'gym' | 'home' | 'hybrid';
export type ExperienceLevel = 'principiante' | 'intermedio';
export type TrainingGoalOption = 'perder_grasa' | 'ganar_fuerza' | 'salud_general';
export type SplitPreference = 'full_body' | 'upper_lower';

export type MovementPatternId =
  | 'empuje_horizontal'
  | 'tiron_vertical'
  | 'tiron_horizontal'
  | 'pierna_rodilla'
  | 'pierna_cadera'
  | 'core'
  | 'empuje_vertical'
  | 'accesorios';

export type GymEquipmentId =
  | 'maquinas_guiadas'
  | 'poleas'
  | 'mancuernas'
  | 'barras'
  | 'cardio_cinta_eliptica'
  | 'entrenador_sala';

export type HomeMaterialId =
  | 'silla_estable'
  | 'escalon_step'
  | 'cojin_equilibrio'
  | 'gomas_elasticas'
  | 'mancuernas_pesas'
  | 'esterilla'
  | 'cinta_andar'
  | 'eliptica'
  | 'bici_estatica'
  | 'barra_puerta_trx'
  | 'pared';

export type DaySlotRole =
  | 'fuerza_a'
  | 'fuerza_b'
  | 'fuerza_full'
  | 'torso'
  | 'pierna'
  | 'solo_cardio'
  | 'descanso_activo';

export type DayCardioOption =
  | 'caminata_desnivel'
  | 'cinta_inclinacion'
  | 'eliptica_suave'
  | 'bici_estatica'
  | 'paseo_llano'
  | 'recuperacion_activa'
  | 'ninguno';

export interface CustomDayAssignment {
  dayId: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  dayName: string;
  role: DaySlotRole;
  cardioType: DayCardioOption;
  cardioDurationMinutes: number;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  note?: string;
}

export interface TrainingLimitations {
  knees: boolean;
  lowerBack: boolean;
  shoulders: boolean;
  overweightHighBmi: boolean;
  over50: boolean;
  over60: boolean;
  hypertensionOrCardiacOrDiabetes: boolean;
  priorSurgeriesOrMeds: string;
  femaleGluteEmphasis: boolean;
}

export interface TrainingConfiguratorState {
  environment: TrainingEnvironment;
  experience: ExperienceLevel;
  goal: TrainingGoalOption;
  daysPerWeek: 2 | 3 | 4;
  sessionMinutes: 30 | 45 | 60;
  splitPreference: SplitPreference;
  includeOptionalPatterns: boolean;
  limitations: TrainingLimitations;
  gymEquipment: Record<GymEquipmentId, boolean>;
  homeMaterial: Record<HomeMaterialId, boolean>;
  useHomemadeAlternatives: boolean;
  gymDescriptionNote: string;
  customSchedule: CustomDayAssignment[];
  updatedAt?: string;
}

export interface PatternAssignment {
  patternId: MovementPatternId;
  patternLabel: string;
  isOptional?: boolean;
  exerciseName: string;
  alternativeVariantB: string;
  equipmentUsed: string;
  homemadeFallback?: string;
  setsReps: string;
  rirNote: string;
  restSeconds: number;
  safetyCue: string;
}

export interface GeneratedSessionPlan {
  sessionKey: 'fuerza_a' | 'fuerza_b' | 'fuerza_full' | 'torso' | 'pierna';
  title: string;
  warmup: string;
  patterns: PatternAssignment[];
  cooldown: string;
  estimatedMinutes: number;
}

export interface GeneratedFourWeekProgram {
  structureTitle: string;
  structureRationale: string;
  sessions: Record<string, GeneratedSessionPlan>;
  weeks: Array<{
    weekNumber: 1 | 2 | 3 | 4;
    label: string;
    isDeload: boolean;
    setsMultiplierLabel: string;
    rirTarget: string;
    progressionNote: string;
  }>;
  safetyAlerts: string[];
  homemadeSafetyRules: string[];
}


