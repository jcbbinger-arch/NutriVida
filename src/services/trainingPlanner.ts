import {
  CustomDayAssignment,
  DayCardioOption,
  DaySlotRole,
  GeneratedFourWeekProgram,
  GeneratedSessionPlan,
  GymEquipmentId,
  HomeMaterialId,
  MovementPatternId,
  PatternAssignment,
  TrainingConfiguratorState
} from '../types/training';
import { UserProfile } from '../types/nutrition';

export interface HomeMaterialCatalogItem {
  id: HomeMaterialId;
  label: string;
  purpose: string;
  homemadeAlternative: string;
  safetyRule?: string;
}

export const HOME_MATERIAL_CATALOG: HomeMaterialCatalogItem[] = [
  {
    id: 'silla_estable',
    label: 'Silla estable',
    purpose: 'Sentadilla a silla, fondos asistidos, apoyo para equilibrio',
    homemadeAlternative: 'Sofá firme o cama (para sentarse y levantarse)',
    safetyRule: 'Colócala sobre suelo no resbaladizo y apoyada contra la pared.'
  },
  {
    id: 'escalon_step',
    label: 'Escalón o step',
    purpose: 'Subir y bajar, step-up, gemelos en escalón, zancadas inversas suaves',
    homemadeAlternative: 'Primer peldaño de una escalera o libro grueso con base antideslizante',
    safetyRule: 'Asegura superficie estable y barandilla/pared cerca.'
  },
  {
    id: 'cojin_equilibrio',
    label: 'Cojín de equilibrio inflable',
    purpose: 'Propiocepción, tobillos, core',
    homemadeAlternative: 'Cojín firme del sofá o toalla doblada en varias capas',
    safetyRule: 'Si eres principiante o tienes sobrepeso, déjalo para semanas avanzadas y ten pared/silla cerca.'
  },
  {
    id: 'gomas_elasticas',
    label: 'Gomas elásticas',
    purpose: 'Remo, press, Pallof, abducciones',
    homemadeAlternative: 'Cinturón o toalla (tensión isométrica), media o leggings anudadas',
    safetyRule: 'Revisa grietas antes de cada uso: una goma vieja puede saltar.'
  },
  {
    id: 'mancuernas_pesas',
    label: 'Mancuernas o pesas rusas',
    purpose: 'Press, remo, peso muerto rumano, sentadilla goblet',
    homemadeAlternative: 'Garrafas de agua de 2–5 L, botellas con arena, mochila con libros o bolsas de arroz',
    safetyRule: 'Agarre firme sin asas rotas; si usas mochila, ciérrala bien y pégala a la espalda.'
  },
  {
    id: 'esterilla',
    label: 'Esterilla',
    purpose: 'Suelo: puente de glúteo, plancha, dead bug',
    homemadeAlternative: 'Toalla grande o alfombra antideslizante'
  },
  {
    id: 'cinta_andar',
    label: 'Cinta de andar',
    purpose: 'Caminata, inclinación, intervalos',
    homemadeAlternative: 'Caminar al aire libre o subir escaleras del edificio'
  },
  {
    id: 'eliptica',
    label: 'Elíptica',
    purpose: 'Cardio de bajo impacto',
    homemadeAlternative: 'Bicicleta estática o caminata a ritmo constante'
  },
  {
    id: 'bici_estatica',
    label: 'Bici estática',
    purpose: 'Cardio sin impacto articular',
    homemadeAlternative: 'Caminata llana o con desnivel controlado con bastones'
  },
  {
    id: 'barra_puerta_trx',
    label: 'Barra de puerta o TRX',
    purpose: 'Dominadas asistidas, remos en suspensión',
    homemadeAlternative: 'Remo con toalla en puerta cerrada resistente o remo inclinado con mochila',
    safetyRule: 'Usa la puerta como anclaje SOLO si cierra bien y se abre en sentido contrario al que tiras. Nunca cuelgues peso de marcos no preparados.'
  },
  {
    id: 'pared',
    label: 'Pared',
    purpose: 'Flexiones en pared, sentadilla isométrica, apoyo de equilibrio',
    homemadeAlternative: 'Ya la tienes disponible en casa'
  }
];

export const GYM_EQUIPMENT_CATALOG: Array<{ id: GymEquipmentId; label: string; detail: string }> = [
  { id: 'maquinas_guiadas', label: 'Máquinas guiadas', detail: 'Prensa de piernas, prensa pecho, jalón, remo sentado, curl femoral' },
  { id: 'poleas', label: 'Poleas / Cables', detail: 'Jalón al pecho, remo en polea baja, press Pallof, tríceps' },
  { id: 'mancuernas', label: 'Mancuernas', detail: 'Press mancuernas, remo a una mano, peso muerto rumano, goblet' },
  { id: 'barras', label: 'Barras y racks', detail: 'Cajón para sentadilla, barras ligeras / guiadas' },
  { id: 'cardio_cinta_eliptica', label: 'Zona cardio (Cinta / Elíptica / Bici)', detail: 'Calentamiento 8–10 min y cardio suave final' },
  { id: 'entrenador_sala', label: 'Monitor / Entrenador de sala', detail: 'Disponible para revisar la técnica en la 1.ª sesión' }
];

export const HOMEMADE_SAFETY_RULES: string[] = [
  'Peso improvisado: agarre firme y sin asas rotas. Mochila bien cerrada y pegada a la espalda.',
  'Silla o escalón: sobre suelo no resbaladizo; la silla siempre apoyada contra la pared.',
  'Gomas elásticas: revisa grietas o cortes antes de cada uso (una goma vieja puede saltar).',
  'Puerta como anclaje: solo si cierra bien y se abre hacia el lado contrario al que tiras.',
  'Sin barra de dominadas: nunca cuelgues peso de marcos o puertas no diseñados para ello.',
  'Equilibrio (especialmente >60 o principiantes): realiza las primeras sesiones junto a una pared o silla.'
];

export const GYM_INTENSITY_PROGRESSION_RULES = {
  effort: 'Termina cada serie con 2–3 repeticiones “en reserva” (RIR 2–3). Nada de ir al fallo en las primeras semanas.',
  rests: 'Descansos de 60–90 s en ejercicios accesorios y 90–120 s en los grandes (prensa, jalón, remo).',
  progression: 'Cuando llegues al tope de repeticiones en todas las series con buena técnica, sube un 2–5% de carga o añade +1 rep por serie.',
  deload: 'Cada 4–6 semanas realiza 1 semana de descarga con un 40–50% menos de series para reparar tejidos.',
  tracking: 'Apunta pesos, series y sensaciones para decidir con criterio cuándo subir.'
};

export const ROLE_LABELS: Record<DaySlotRole, string> = {
  fuerza_a: 'Fuerza A (Patrones base)',
  fuerza_b: 'Fuerza B (Variante / Alterna)',
  fuerza_full: 'Fuerza Full Body (6 Patrones)',
  torso: 'Torso (Empuje + Tirón + Core)',
  pierna: 'Pierna + Glúteo + Core',
  solo_cardio: 'Solo Cardio / Ruta',
  descanso_activo: 'Descanso / Recup. Activa'
};

export const CARDIO_LABELS: Record<DayCardioOption, string> = {
  caminata_desnivel: 'Caminata Desnivel',
  cinta_inclinacion: 'Cinta con Inclinación',
  eliptica_suave: 'Elíptica Suave',
  bici_estatica: 'Bicicleta Estática',
  paseo_llano: 'Paseo Dominical / Llano',
  recuperacion_activa: 'Paseo Suave + Movilidad',
  ninguno: 'Sin cardio adicional'
};

export const DEFAULT_CUSTOM_SCHEDULE: CustomDayAssignment[] = [
  {
    dayId: 'lunes',
    dayName: 'Lunes',
    role: 'fuerza_a',
    cardioType: 'caminata_desnivel',
    cardioDurationMinutes: 75,
    distanceKm: 6.9,
    elevationGainM: 238,
    elevationLossM: 238,
    note: 'Caminar con bastones en bajada (+238m / -238m) + Sesión Fuerza A.'
  },
  {
    dayId: 'martes',
    dayName: 'Martes',
    role: 'solo_cardio',
    cardioType: 'caminata_desnivel',
    cardioDurationMinutes: 70,
    distanceKm: 6.9,
    elevationGainM: 238,
    elevationLossM: 238,
    note: 'Cadencia ágil en subida; pasos cortos y elásticos al bajar.'
  },
  {
    dayId: 'miercoles',
    dayName: 'Miércoles',
    role: 'descanso_activo',
    cardioType: 'recuperacion_activa',
    cardioDurationMinutes: 35,
    distanceKm: 3.2,
    elevationGainM: 20,
    elevationLossM: 20,
    note: 'DÍA DE DESCANSO / RECUPERACIÓN ACTIVA: Paseo llano suave + 10 min movilidad de cadera y gemelos.'
  },
  {
    dayId: 'jueves',
    dayName: 'Jueves',
    role: 'fuerza_b',
    cardioType: 'caminata_desnivel',
    cardioDurationMinutes: 75,
    distanceKm: 6.9,
    elevationGainM: 238,
    elevationLossM: 238,
    note: 'Sesión Fuerza B (alternando variantes para no aburrirse) + ruta habitual.'
  },
  {
    dayId: 'viernes',
    dayName: 'Viernes',
    role: 'solo_cardio',
    cardioType: 'eliptica_suave',
    cardioDurationMinutes: 45,
    distanceKm: 6.0,
    elevationGainM: 0,
    elevationLossM: 0,
    note: 'Cardio sin impacto articular (elíptica o bici estática).'
  },
  {
    dayId: 'sabado',
    dayName: 'Sábado',
    role: 'fuerza_full',
    cardioType: 'caminata_desnivel',
    cardioDurationMinutes: 80,
    distanceKm: 6.9,
    elevationGainM: 238,
    elevationLossM: 238,
    note: 'Circuito completo de los 6 patrones + caminata con desnivel.'
  },
  {
    dayId: 'domingo',
    dayName: 'Domingo',
    role: 'solo_cardio',
    cardioType: 'paseo_llano',
    cardioDurationMinutes: 45,
    distanceKm: 4.5,
    elevationGainM: 30,
    elevationLossM: 30,
    note: 'Paseo dominical distendido. Coincide con la comida libre planificada.'
  }
];

export function buildDefaultTrainingConfigurator(userProfile?: UserProfile): TrainingConfiguratorState {
  const age = userProfile?.age && userProfile.age > 0 ? userProfile.age : 53;
  const bmi = userProfile?.bmi && userProfile.bmi > 0 ? userProfile.bmi : 34;
  const isFemale = userProfile?.sex === 'female';
  const daysPref = userProfile?.trainingDaysPerWeek === 4 ? 4 : userProfile?.trainingDaysPerWeek === 2 ? 2 : 3;

  return {
    environment: 'home',
    experience: 'principiante',
    goal:
      userProfile?.goalType === 'gain'
        ? 'ganar_fuerza'
        : userProfile?.goalType === 'maintain'
        ? 'salud_general'
        : 'perder_grasa',
    daysPerWeek: daysPref,
    sessionMinutes: 45,
    splitPreference: 'full_body',
    includeOptionalPatterns: true,
    limitations: {
      knees: true,
      lowerBack: false,
      shoulders: false,
      overweightHighBmi: bmi >= 28,
      over50: age >= 50,
      over60: age >= 60,
      hypertensionOrCardiacOrDiabetes: (userProfile?.medicalConditions || []).some(
        (c) =>
          c.toLowerCase().includes('hipertensión') ||
          c.toLowerCase().includes('glucemia') ||
          c.toLowerCase().includes('diabetes')
      ),
      priorSurgeriesOrMeds: '',
      femaleGluteEmphasis: isFemale
    },
    gymEquipment: {
      maquinas_guiadas: true,
      poleas: true,
      mancuernas: true,
      barras: false,
      cardio_cinta_eliptica: true,
      entrenador_sala: true
    },
    homeMaterial: {
      silla_estable: true,
      escalon_step: true,
      cojin_equilibrio: false,
      gomas_elasticas: true,
      mancuernas_pesas: false,
      esterilla: true,
      cinta_andar: false,
      eliptica: true,
      bici_estatica: false,
      barra_puerta_trx: false,
      pared: true
    },
    useHomemadeAlternatives: true,
    gymDescriptionNote: '',
    customSchedule: DEFAULT_CUSTOM_SCHEDULE
  };
}

export function isStrengthRole(role: DaySlotRole): boolean {
  return role !== 'solo_cardio' && role !== 'descanso_activo';
}

/**
 * Checks whether the custom 7-day order puts two strength sessions back-to-back (<48h recovery).
 */
export function detectConsecutiveStrengthDays(schedule: CustomDayAssignment[]): string[] {
  const warnings: string[] = [];
  for (let i = 0; i < schedule.length; i++) {
    const curr = schedule[i];
    const next = schedule[(i + 1) % schedule.length];
    if (isStrengthRole(curr.role) && isStrengthRole(next.role)) {
      if (curr.role !== 'torso' || next.role !== 'pierna') {
        warnings.push(`${curr.dayName} y ${next.dayName}`);
      }
    }
  }
  return warnings;
}

/**
 * Auto-organizes the 7-day week preserving user's day count while respecting 48h rest between strength days.
 */
export function autoArrangeOptimalSchedule(
  current: CustomDayAssignment[],
  daysPerWeek: 2 | 3 | 4,
  split: 'full_body' | 'upper_lower'
): CustomDayAssignment[] {
  const rolesByIndex: Record<number, DaySlotRole> = {
    0: 'solo_cardio',
    1: 'solo_cardio',
    2: 'descanso_activo',
    3: 'solo_cardio',
    4: 'solo_cardio',
    5: 'solo_cardio',
    6: 'solo_cardio'
  };

  if (daysPerWeek === 2) {
    rolesByIndex[0] = 'fuerza_a';
    rolesByIndex[3] = 'fuerza_b';
    rolesByIndex[2] = 'descanso_activo';
  } else if (daysPerWeek === 3) {
    rolesByIndex[0] = 'fuerza_a';
    rolesByIndex[2] = 'descanso_activo';
    rolesByIndex[3] = 'fuerza_b';
    rolesByIndex[5] = 'fuerza_full';
  } else {
    if (split === 'upper_lower') {
      rolesByIndex[0] = 'torso';
      rolesByIndex[1] = 'pierna';
      rolesByIndex[2] = 'descanso_activo';
      rolesByIndex[3] = 'torso';
      rolesByIndex[4] = 'pierna';
    } else {
      rolesByIndex[0] = 'fuerza_a';
      rolesByIndex[2] = 'fuerza_b';
      rolesByIndex[3] = 'descanso_activo';
      rolesByIndex[4] = 'fuerza_a';
      rolesByIndex[6] = 'fuerza_b';
    }
  }

  return current.map((day, idx) => {
    const nextRole = rolesByIndex[idx];
    const isRest = nextRole === 'descanso_activo';
    return {
      ...day,
      role: nextRole,
      cardioType: isRest ? 'recuperacion_activa' : day.cardioType === 'recuperacion_activa' ? 'caminata_desnivel' : day.cardioType,
      cardioDurationMinutes: isRest ? 35 : day.cardioDurationMinutes < 40 ? 60 : day.cardioDurationMinutes
    };
  });
}

function buildPatternExercise(
  patternId: MovementPatternId,
  config: TrainingConfiguratorState
): PatternAssignment {
  const { environment, gymEquipment, homeMaterial, limitations, experience, useHomemadeAlternatives } = config;
  const isGym = environment === 'gym' || environment === 'hybrid';
  const isBeginnerOrJointCare =
    experience === 'principiante' ||
    limitations.overweightHighBmi ||
    limitations.knees ||
    limitations.over50 ||
    limitations.over60;

  const baseSets = isBeginnerOrJointCare ? '3 × 10–12' : '3–4 × 8–12';
  const restBig = 90;
  const restAcc = 60;

  // GYM MAPPING (or Hybrid Gym priority)
  if (isGym) {
    const hasMachines = gymEquipment.maquinas_guiadas;
    const hasCables = gymEquipment.poleas;
    const hasDumbbells = gymEquipment.mancuernas;

    switch (patternId) {
      case 'empuje_horizontal':
        return {
          patternId,
          patternLabel: 'Empuje horizontal',
          exerciseName: hasMachines ? 'Prensa de pecho en máquina guiada' : hasDumbbells ? 'Press de pecho con mancuernas' : 'Flexiones inclinadas en multipower / banco',
          alternativeVariantB: hasDumbbells ? 'Press plano/inclinado con mancuernas' : 'Press en máquina con agarre neutro',
          equipmentUsed: hasMachines ? 'Máquina guiada' : 'Mancuernas / Banco',
          setsReps: baseSets,
          rirNote: 'RIR 2–3 (deja 2-3 reps en recámara)',
          restSeconds: restBig,
          safetyCue: limitations.shoulders
            ? 'Hombro delicado: usa agarre neutro (palmas enfrentadas) y no bajes codos por detrás del torso.'
            : 'Escápulas atrás y abajo; baja en 3 s controlados.'
        };
      case 'tiron_vertical':
        return {
          patternId,
          patternLabel: 'Tirón vertical',
          exerciseName: hasCables || hasMachines ? 'Jalón al pecho en polea (agarre neutro o prono)' : 'Dominadas asistidas en máquina',
          alternativeVariantB: 'Dominadas asistidas o jalón agarre estrecho',
          equipmentUsed: hasCables ? 'Polea alta' : 'Máquina guiada',
          setsReps: baseSets,
          rirNote: 'RIR 2–3',
          restSeconds: restBig,
          safetyCue: limitations.shoulders
            ? 'NUNCA tras nuca; lleva la barra al pecho superior con agarre neutro.'
            : 'Lleva los codos hacia los bolsillos sin encoger hombros.'
        };
      case 'tiron_horizontal':
        return {
          patternId,
          patternLabel: 'Tirón horizontal',
          exerciseName: hasMachines ? 'Remo sentado en máquina (apoyo pectoral)' : hasCables ? 'Remo sentado en polea baja' : 'Remo con mancuerna apoyado en banco',
          alternativeVariantB: hasCables ? 'Remo en polea baja agarre neutro' : 'Remo con mancuerna a 1 mano',
          equipmentUsed: hasMachines ? 'Máquina remo' : hasCables ? 'Polea baja' : 'Mancuernas',
          setsReps: baseSets,
          rirNote: 'RIR 2–3 · Pausa 1 s juntando escápulas',
          restSeconds: restBig,
          safetyCue: limitations.lowerBack
            ? 'Prioriza apoyo pectoral en máquina para descargar la zona lumbar.'
            : 'Espalda erguida, sin balanceo lumbar.'
        };
      case 'pierna_rodilla':
        return {
          patternId,
          patternLabel: 'Pierna (dominante rodilla)',
          exerciseName: hasMachines ? 'Prensa de piernas inclinada / horizontal' : 'Sentadilla al cajón / silla',
          alternativeVariantB: 'Sentadilla al cajón controlada o Goblet ligera',
          equipmentUsed: hasMachines ? 'Prensa guiada' : 'Cajón / Mancuerna',
          setsReps: baseSets,
          rirNote: 'RIR 2–3 · Baja en 3 s',
          restSeconds: 105,
          safetyCue: limitations.knees || limitations.overweightHighBmi
            ? 'Rodilla / IMC alto: coloca los pies algo más altos en la plataforma, rango cómodo sin dolor y evita zancadas profundas.'
            : 'Rodillas alineadas con la punta de los pies sin bloquear arriba.'
        };
      case 'pierna_cadera':
        return {
          patternId,
          patternLabel: 'Pierna (dominante cadera)',
          exerciseName: hasMachines ? 'Curl femoral sentado / tumbado' : 'Puente de glúteo o Peso muerto rumano ligero',
          alternativeVariantB: limitations.femaleGluteEmphasis ? 'Puente de glúteo / Hip Thrust en banco' : 'Peso muerto rumano con mancuernas',
          equipmentUsed: hasMachines ? 'Máquina femoral' : 'Esterilla / Mancuernas',
          setsReps: isBeginnerOrJointCare ? '2–3 × 12' : '3 × 10–12',
          rirNote: 'RIR 2–3',
          restSeconds: restBig,
          safetyCue: limitations.lowerBack
            ? 'En curl femoral o puente de glúteo mantén pelvis neutra y evita hiperextender la zona lumbar.'
            : 'Empuja desde los talones y contrae glúteos arriba.'
        };
      case 'core':
        return {
          patternId,
          patternLabel: 'Core (estabilidad)',
          exerciseName: hasCables ? 'Press Pallof en polea (antirrotación)' : 'Plancha frontal inclinada / en suelo',
          alternativeVariantB: 'Plancha frontal 20–30 s o Crunch controlado en máquina',
          equipmentUsed: hasCables ? 'Polea media' : 'Esterilla / Máquina',
          setsReps: '2–3 × 20–30 s (o 10–12/lado)',
          rirNote: 'Control respiratorio continuo',
          restSeconds: restAcc,
          safetyCue: 'Costillas bajadas y glúteos firmes para blindar la columna lumbar.'
        };
      case 'empuje_vertical':
        return {
          patternId,
          patternLabel: 'Empuje vertical (opcional)',
          isOptional: true,
          exerciseName: hasMachines ? 'Press de hombro en máquina (agarre neutro)' : 'Press militar sentado con mancuernas',
          alternativeVariantB: 'Elevaciones laterales suaves con mancuernas',
          equipmentUsed: hasMachines ? 'Máquina hombro' : 'Mancuernas',
          setsReps: '2 × 10–12',
          rirNote: 'RIR 2–3',
          restSeconds: restAcc,
          safetyCue: limitations.shoulders
            ? 'Hombro delicado: sustituye por elevaciones laterales hasta 70–80° o trabaja con agarre neutro sin dolor.'
            : 'No arquees la zona lumbar al empujar.'
        };
      default:
        return {
          patternId: 'accesorios',
          patternLabel: 'Gemelos / Extensión / Brazos (opcional)',
          isOptional: true,
          exerciseName: 'Elevación de talones en prensa o máquina + curl/extensión ligera',
          alternativeVariantB: 'Extensión de rodilla en rango corto sin molestia rotuliana',
          equipmentUsed: 'Máquinas / Polea',
          setsReps: '2 × 12–15',
          rirNote: 'RIR 2–3',
          restSeconds: restAcc,
          safetyCue: 'Controla el descenso en gemelos (3 s) para proteger el tendón rotuliano en bajadas.'
        };
    }
  }

  // HOME MAPPING USING CHECKABLE LIST + HOMEMADE FALLBACKS
  const hasChair = homeMaterial.silla_estable;
  const hasStep = homeMaterial.escalon_step;
  const hasBands = homeMaterial.gomas_elasticas;
  const hasWeights = homeMaterial.mancuernas_pesas;
  const hasMat = homeMaterial.esterilla;
  const hasBar = homeMaterial.barra_puerta_trx;

  switch (patternId) {
    case 'empuje_horizontal':
      return {
        patternId,
        patternLabel: 'Empuje horizontal',
        exerciseName:
          isBeginnerOrJointCare || !hasWeights
            ? 'Flexiones inclinadas en pared o mesa firme'
            : 'Press suelo / flexiones con mancuernas o botellas',
        alternativeVariantB: 'Press de pecho con goma elástica pasada por la espalda',
        equipmentUsed: 'Pared / Mesa firme' + (hasBands ? ' o Goma' : ''),
        homemadeFallback: useHomemadeAlternatives ? 'Pared (ya disponible) o borde firme de mesa/sofá' : undefined,
        setsReps: '2–3 × 10–12',
        rirNote: 'RIR 2–3 · Baja en 3 s',
        restSeconds: restAcc,
        safetyCue: 'Codos a 45° del torso, abdomen firme y muñecas alineadas.'
      };
    case 'tiron_vertical':
      return {
        patternId,
        patternLabel: 'Tirón vertical',
        exerciseName: hasBands
          ? 'Jalón vertical con goma anclada arriba o sentado'
          : hasBar
          ? 'Remo alto / dominadas asistidas en barra o TRX'
          : 'Ángeles de pared / Pullover isométrico con toalla',
        alternativeVariantB: 'Pull-apart con goma o toalla tensa por encima de la cabeza',
        equipmentUsed: hasBands ? 'Goma elástica' : hasBar ? 'Barra / TRX' : 'Toalla / Pared',
        homemadeFallback: !hasBands && useHomemadeAlternatives ? 'Toalla o cinturón en tensión isométrica' : undefined,
        setsReps: '2–3 × 12',
        rirNote: 'RIR 2–3',
        restSeconds: restAcc,
        safetyCue: limitations.shoulders
          ? 'Trabaja sin dolor elevando brazos en plano escapular (30° hacia delante).'
          : 'Hombros lejos de las orejas al traccionar.'
      };
    case 'tiron_horizontal':
      return {
        patternId,
        patternLabel: 'Tirón horizontal',
        exerciseName: hasBands
          ? 'Remo sentado con goma elástica (en silla o pies)'
          : hasWeights
          ? 'Remo inclinado apoyado en silla con mancuerna / garrafa'
          : hasBar
          ? 'Remo en TRX / puerta cerrada'
          : 'Remo inclinado con mochila cargada o toalla en puerta',
        alternativeVariantB: 'Remo a 1 mano apoyado en silla estable',
        equipmentUsed: hasBands ? 'Gomas elásticas' : hasWeights ? 'Mancuernas / Pesas' : 'Alternativa casera',
        homemadeFallback:
          !hasBands && !hasWeights && useHomemadeAlternatives
            ? 'Mochila con libros bien pegada al cuerpo o toalla en puerta que cierre al lado contrario'
            : undefined,
        setsReps: '2–3 × 12–14',
        rirNote: 'RIR 2–3 · Pausa 2 s atrás',
        restSeconds: restAcc,
        safetyCue: 'Revisa grietas si usas gomas. Si usas puerta, asegúrate de que abre en sentido opuesto al tirón.'
      };
    case 'pierna_rodilla':
      return {
        patternId,
        patternLabel: 'Pierna (dominante rodilla)',
        exerciseName:
          hasChair || useHomemadeAlternatives
            ? 'Sentadilla a la silla con bajada lenta (3–4 s)'
            : hasStep
            ? 'Subida suave a escalón (step-up) con apoyo cercano'
            : 'Sentadilla isométrica en pared (wall-sit suave)',
        alternativeVariantB: hasStep
          ? 'Step-up en escalón con mano cerca de pared/barandilla'
          : 'Sentadilla isométrica en pared 20–30 s',
        equipmentUsed: hasChair ? 'Silla estable' : 'Sofá firme / Pared',
        homemadeFallback: !hasChair && useHomemadeAlternatives ? 'Sofá firme o cama + apoyo en pared' : undefined,
        setsReps: '2–3 × 10–12',
        rirNote: 'RIR 2–3 · Excéntrico 3–4 s',
        restSeconds: restBig,
        safetyCue: 'Silla apoyada contra la pared y suelo antideslizante. Rango cómodo si hay molestia de rodilla.'
      };
    case 'pierna_cadera':
      return {
        patternId,
        patternLabel: 'Pierna (dominante cadera)',
        exerciseName:
          hasMat || useHomemadeAlternatives
            ? 'Puente de glúteos en esterilla (pausa 2 s arriba)'
            : 'Peso muerto rumano suave con garrafa/mochila',
        alternativeVariantB:
          limitations.femaleGluteEmphasis || hasBands
            ? 'Puente de glúteo con goma o abducciones tumbado'
            : 'Buenos días / bisagra de cadera sin carga apoyado en pared',
        equipmentUsed: hasMat ? 'Esterilla' : 'Toalla grande / Alfombra',
        homemadeFallback: !hasMat && useHomemadeAlternatives ? 'Toalla grande o alfombra sobre suelo firme' : undefined,
        setsReps: '2–3 × 12–15',
        rirNote: 'RIR 2–3 · Empuja con talones',
        restSeconds: restAcc,
        safetyCue: 'No arquees la zona lumbar en lo alto del puente; contrae glúteos al subir.'
      };
    case 'core':
      return {
        patternId,
        patternLabel: 'Core (estabilidad)',
        exerciseName:
          limitations.overweightHighBmi || limitations.over60
            ? 'Dead Bug en esterilla o Plancha inclinada en pared/mesa'
            : hasBands
            ? 'Press Pallof con goma elástica (de pie o sentado)'
            : 'Dead Bug / Plancha frontal controlada',
        alternativeVariantB: 'Equilibrio a un pie cerca de pared/silla (sin cojín inestable al inicio)',
        equipmentUsed: hasMat ? 'Esterilla / Pared' : 'Toalla / Pared',
        homemadeFallback: !hasMat && useHomemadeAlternatives ? 'Toalla doblada + apoyo cercano de silla/pared' : undefined,
        setsReps: '2–3 × 8–10/lado o 20–30 s',
        rirNote: 'Sin perder tensión lumbar',
        restSeconds: 45,
        safetyCue: 'Principiantes, sobrepeso o >60: prioriza silla, pared y esterilla; deja el cojín de equilibrio para más adelante.'
      };
    case 'empuje_vertical':
      return {
        patternId,
        patternLabel: 'Empuje vertical (opcional)',
        isOptional: true,
        exerciseName: hasWeights
          ? 'Press de hombros sentado con mancuernas / botellas'
          : hasBands
          ? 'Press vertical sentado pisando la goma'
          : 'Deslizamiento de brazos en pared (Wall Slides)',
        alternativeVariantB: 'Elevaciones frontales/laterales suaves con botellas 1–2 L',
        equipmentUsed: hasWeights ? 'Mancuernas / Pesas' : hasBands ? 'Gomas' : 'Pared',
        homemadeFallback: !hasWeights && useHomemadeAlternatives ? 'Botellas de agua 1–2 L con agarre firme' : undefined,
        setsReps: '2 × 10–12',
        rirNote: 'RIR 2–3',
        restSeconds: restAcc,
        safetyCue: limitations.shoulders ? 'Si molesta el hombro, quédate en Wall Slides sin carga.' : 'No encoger cuello.'
      };
    default:
      return {
        patternId: 'accesorios',
        patternLabel: 'Gemelos & Tobillo (opcional)',
        isOptional: true,
        exerciseName: hasStep ? 'Elevación de talones en escalón (descenso lento 3 s)' : 'Elevación de talones en suelo con apoyo',
        alternativeVariantB: 'Equilibrio suave cerca de silla o pared',
        equipmentUsed: hasStep ? 'Escalón / Step' : 'Primer peldaño / Pared',
        homemadeFallback: !hasStep && useHomemadeAlternatives ? 'Primer peldaño de escalera o libro grueso antideslizante' : undefined,
        setsReps: '2 × 12–15',
        rirNote: 'RIR 2–3',
        restSeconds: 45,
        safetyCue: 'Sujétate suavemente a la pared o barandilla; protege el tendón rotuliano.'
      };
  }
}

export function generateFourWeekProgram(config: TrainingConfiguratorState): GeneratedFourWeekProgram {
  const { environment, experience, daysPerWeek, sessionMinutes, splitPreference, includeOptionalPatterns, limitations } =
    config;

  const isUpperLower = experience === 'intermedio' && daysPerWeek === 4 && splitPreference === 'upper_lower';

  const core6: MovementPatternId[] = [
    'pierna_rodilla',
    'empuje_horizontal',
    'tiron_vertical',
    'tiron_horizontal',
    'pierna_cadera',
    'core'
  ];
  const fullPatterns: MovementPatternId[] =
    includeOptionalPatterns && sessionMinutes >= 45
      ? [...core6, 'empuje_vertical', 'accesorios']
      : core6;

  const fullBodyPatterns = fullPatterns.map((p) => buildPatternExercise(p, config));

  // Build Session A and Session B (varying order or using alternativeVariantB in B)
  const sessionA: GeneratedSessionPlan = {
    sessionKey: 'fuerza_a',
    title: environment === 'gym' ? 'Sesión A · Cuerpo Completo (Máquinas / Patrones)' : 'Sesión A · Cuerpo Completo en Casa',
    warmup:
      environment === 'gym'
        ? '8–10 min: 5 min cinta/elíptica suave + movilidad de cadera, hombros y columna + 1 serie ligera del primer ejercicio.'
        : '5 min: movilidad articular de cadera, hombros y tobillos + 10 sentadillas parciales suaves sin carga.',
    patterns: fullBodyPatterns,
    cooldown:
      environment === 'gym'
        ? '10–15 min: cardio suave en cinta con inclinación, elíptica o bici + estiramientos de cadera y gemelos.'
        : '5 min: respiración diafragmática y estiramientos suaves de cuádriceps, pecho y gemelos.',
    estimatedMinutes: sessionMinutes
  };

  const sessionB: GeneratedSessionPlan = {
    sessionKey: 'fuerza_b',
    title:
      environment === 'gym'
        ? 'Sesión B · Cuerpo Completo (Variante Anti-Aburrimiento)'
        : 'Sesión B · Cuerpo Completo (Variante Alterna)',
    warmup: sessionA.warmup,
    patterns: fullBodyPatterns.map((p) => ({
      ...p,
      exerciseName: p.alternativeVariantB,
      alternativeVariantB: p.exerciseName
    })),
    cooldown: sessionA.cooldown,
    estimatedMinutes: sessionMinutes
  };

  const sessionFull: GeneratedSessionPlan = {
    ...sessionA,
    sessionKey: 'fuerza_full',
    title: 'Sesión Completa · Circuito 6 Patrones'
  };

  const torsoPatterns: MovementPatternId[] = ['empuje_horizontal', 'tiron_horizontal', 'tiron_vertical', 'empuje_vertical', 'core'];
  const piernaPatterns: MovementPatternId[] = ['pierna_rodilla', 'pierna_cadera', 'accesorios', 'core'];

  const sessionTorso: GeneratedSessionPlan = {
    sessionKey: 'torso',
    title: 'Torso · Empujes, Tirones & Core',
    warmup: '6–8 min: movilidad torácica y escapular + serie ligera de aproximación.',
    patterns: torsoPatterns.map((p) => buildPatternExercise(p, config)),
    cooldown: '10 min cardio suave sin impacto + estiramientos pectorales y dorsales.',
    estimatedMinutes: sessionMinutes
  };

  const sessionPierna: GeneratedSessionPlan = {
    sessionKey: 'pierna',
    title: 'Pierna · Rodilla, Cadera, Glúteo & Core',
    warmup: '6–8 min: bici/elíptica suave + movilidad de cadera y tobillos.',
    patterns: piernaPatterns.map((p) => buildPatternExercise(p, config)),
    cooldown: '10 min caminata/elíptica suave + descarga de cuádriceps y gemelos.',
    estimatedMinutes: sessionMinutes
  };

  const structureTitle = isUpperLower
    ? 'Intermedio (4 días) · División Torso / Pierna'
    : experience === 'intermedio'
    ? `Intermedio (${daysPerWeek} días) · Cuerpo Completo con Variantes A/B`
    : `Principiante / Vuelta (${daysPerWeek} días) · Cuerpo Completo (6 Patrones)`;

  const structureRationale =
    environment === 'gym'
      ? isUpperLower
        ? 'Estructura Torso/Pierna con mancuernas, poleas y máquinas guiadas, manteniendo RIR 2–3 y 48 h de recuperación por grupo.'
        : 'Cuerpo completo en cada sesión priorizando máquinas guiadas y poleas: más seguro, aprendizaje rápido y cobertura total de los 6 patrones.'
      : 'Cuerpo completo por patrones de movimiento adaptado exactamente al material marcado (y alternativas caseras seguras), en sesiones prácticas de ' +
        `${sessionMinutes} min.`;

  const safetyAlerts: string[] = [];
  if (limitations.hypertensionOrCardiacOrDiabetes) {
    safetyAlerts.push(
      'Hipertensión, problemas cardíacos o diabetes en tratamiento: confirma el visto bueno médico antes de iniciar o subir intensidad.'
    );
  }
  if (limitations.overweightHighBmi) {
    safetyAlerts.push(
      'Sobrepeso / IMC alto: prioriza prensa o sentadilla a silla frente a sentadilla libre profunda, y cinta con inclinación / elíptica / bici en lugar de saltos o carrera.'
    );
  }
  if (limitations.knees) {
    safetyAlerts.push(
      'Rodillas delicadas: rango cómodo sin dolor, pies algo más altos en prensa, bajada excéntrica controlada (3 s) y evitar zancadas profundas.'
    );
  }
  if (limitations.shoulders) {
    safetyAlerts.push('Hombros delicados: usa agarre neutro y evita press tras nuca o fondos profundos.');
  }
  if (limitations.over50 || limitations.over60) {
    safetyAlerts.push(
      limitations.over60
        ? 'Mayor de 60 años: refuerza levantarse de la silla y equilibrio siempre junto a pared o silla; deja 48 h entre sesiones de fuerza.'
        : 'Mayor de 50 años: calentamiento/movilidad más largo (8–10 min), fuerza 2–3 días y 48 h de descanso entre sesiones.'
    );
  }
  if (environment === 'gym') {
    safetyAlerts.push(
      'En gimnasio con máquinas nuevas: pide al monitor de sala revisar tu postura en la 1.ª sesión antes de subir peso. Para de inmediato ante dolor agudo, mareo o falta de aire anormal.'
    );
  }
  if (limitations.priorSurgeriesOrMeds.trim()) {
    safetyAlerts.push(`Nota médica/cirugías del usuario: ${limitations.priorSurgeriesOrMeds.trim()}`);
  }

  return {
    structureTitle,
    structureRationale,
    sessions: {
      fuerza_a: sessionA,
      fuerza_b: sessionB,
      fuerza_full: sessionFull,
      torso: sessionTorso,
      pierna: sessionPierna
    },
    weeks: [
      {
        weekNumber: 1,
        label: 'Semana 1 · Aprendizaje Técnico y Adaptación',
        isDeload: false,
        setsMultiplierLabel: experience === 'principiante' ? '2–3 series base' : '3 series base',
        rirTarget: 'RIR 3 (lejos del fallo)',
        progressionNote: 'Foco en aprender el movimiento, rango cómodo y apuntar cargas/sensaciones.'
      },
      {
        weekNumber: 2,
        label: 'Semana 2 · Consolidación de Repeticiones',
        isDeload: false,
        setsMultiplierLabel: '3 series completas',
        rirTarget: 'RIR 2–3',
        progressionNote: 'Añade +1 repetición por serie respecto a Semana 1 manteniendo técnica limpia.'
      },
      {
        weekNumber: 3,
        label: 'Semana 3 · Progresión Controlada (+2–5% carga)',
        isDeload: false,
        setsMultiplierLabel: '3 series (tope de reps o +2–5%)',
        rirTarget: 'RIR 2',
        progressionNote: 'Si llegaste al tope de reps en todas las series, sube un 2–5% la carga o dificultad.'
      },
      {
        weekNumber: 4,
        label: 'Semana 4 · Descarga Activa (−40–50% series)',
        isDeload: true,
        setsMultiplierLabel: '1–2 series por patrón (−40–50%)',
        rirTarget: 'RIR 3–4 (muy cómodo)',
        progressionNote: 'Reduce series a la mitad manteniendo calidad técnica para reparar tendones y preparar el siguiente ciclo.'
      }
    ],
    safetyAlerts,
    homemadeSafetyRules: HOMEMADE_SAFETY_RULES
  };
}
