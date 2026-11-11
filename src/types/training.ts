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

