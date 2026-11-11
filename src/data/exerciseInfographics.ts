export type ExerciseBlock = 'empujes' | 'tirones' | 'tren_inferior' | 'core' | 'cojin_equilibrio';

export interface ExerciseInfographicData {
  id: string; // e.g. 'EX-01' or 'EX-C01'
  number: number;
  block: ExerciseBlock;
  blockName: string;
  name: string;
  subtitle: string;
  equipment: string; // 'Pared / Encimera', 'Garrafas / Banda', 'Silla Firme', 'Cojín de Equilibrio Hinchable'
  equipmentIconName: 'wall' | 'bottle' | 'chair' | 'band' | 'mat' | 'bodyweight' | 'cushion';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  technique: string;
  focus: string;
  tempo: string;
  breathing: {
    inhale: string;
    exhale: string;
  };
  jointSafety: {
    protectedJoint: string; // 'Rodillas (rótula)', 'Columna Lumbar (L4-S1)', 'Hombro / Manguito', 'Tobillo'
    mechanism: string; // Por qué tiene cero impacto y cómo protege
    safeAngleTip: string; // 'Codos a 45°', 'Cadera atrás antes que rodilla', etc.
  };
  standardPrescription: {
    frequency: string; // '3 - 4 días por semana'
    setsAndReps: string; // '2 - 3 series de 10 - 12 reps'
    rest: string; // '60 segundos entre series'
    isIsometric: boolean;
  };
  commonErrors: string[];
  // Dynamic recommendations by Age & Weight
  adaptations: {
    baseGeneric: string;
    getSpecificAdvice: (age: number, weightKg: number) => {
      levelTag: string; // 'Descarga Lumbar', 'Bajo Impacto', 'Estándar', 'Avanzado'
      angleRecommendation: string;
      tempoAndReps: string;
      specialWarning: string;
      weightCompensationNote: string;
    };
  };
}

export const EXERCISE_BLOCKS_METADATA = [
  {
    id: 'empujes' as ExerciseBlock,
    name: 'Bloque 1: Empujes',
    subtitle: 'Pecho, Hombros y Tríceps',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    count: 3
  },
  {
    id: 'tirones' as ExerciseBlock,
    name: 'Bloque 2: Tirones',
    subtitle: 'Espalda, Bíceps y Postura',
    color: 'teal',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    count: 3
  },
  {
    id: 'tren_inferior' as ExerciseBlock,
    name: 'Bloque 3: Tren Inferior',
    subtitle: 'Piernas y Glúteos',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    count: 3
  },
  {
    id: 'core' as ExerciseBlock,
    name: 'Bloque 4: Core y Estabilidad',
    subtitle: 'Abdomen y Faja Lumbar',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    count: 3
  },
  {
    id: 'cojin_equilibrio' as ExerciseBlock,
    name: 'Cojín de Equilibrio Hinchable',
    subtitle: 'Propiocepción & Control de Rodilla',
    color: 'purple',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    count: 6
  }
];

export const EXERCISE_INFOGRAPHICS: ExerciseInfographicData[] = [
  // ========================================================
  // BLOQUE 1: EMPUJES
  // ========================================================
  {
    id: 'EX-01',
    number: 1,
    block: 'empujes',
    blockName: 'Bloque 1: Empujes (Pecho, Hombros y Tríceps)',
    name: 'Flexiones Inclinadas (Pared o Encimera)',
    subtitle: 'Empuje horizontal en plano inclinado con descarga de peso',
    equipment: 'Pared o Encimera de Cocina',
    equipmentIconName: 'wall',
    primaryMuscles: ['Pectoral Mayor', 'Deltoides Anterior', 'Tríceps Braquial'],
    secondaryMuscles: ['Serrato Anterior', 'Transverso del Abdomen'],
    technique:
      'Apoya las manos a la anchura de los hombros en una superficie elevada (pared, encimera o mesa firme). Mantén el cuerpo en línea recta sin que caiga la cadera. Flexiona los codos a 45° respecto al torso hasta que el pecho roce la superficie. Empuja con firmeza hasta la posición inicial sin bloquear los codos.',
    focus: 'Pecho, hombro anterior y tríceps sin sobrecargar la zona lumbar ni muñecas.',
    tempo: '3 segundos bajando (excéntrico lento) / 1 segundo pausa / 1 segundo subida',
    breathing: {
      inhale: 'Inhala por la nariz mientras desciendes el pecho de forma controlada hacia la superficie.',
      exhale: 'Exhala por la boca con fuerza mientras empujas la superficie alejándote de ella.'
    },
    jointSafety: {
      protectedJoint: 'Columna Lumbar y Muñecas',
      mechanism:
        'Al elevar las manos en pared o encimera, se reduce del 65% al 35% el peso corporal soportado, eliminando la hiperlordosis por gravedad sobre las vértebras L4-S1.',
      safeAngleTip: 'Codos abiertos a 45° con el torso formando una "flecha" (evitar codos a 90° en "cruz" para proteger el hombro).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Dejar caer la cadera hacia abajo (falta de activación del abdomen).',
      'Abrir los codos en cruz a 90° respecto al cuello, lo que comprime el manguito rotador.',
      'Mirar hacia arriba encorvando la columna cervical.'
    ],
    adaptations: {
      baseGeneric: 'Inclinación media en encimera con cuerpo a 45°-60°, 2-3 series de 10-12 repeticiones.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Inclinación Alta (Pared)',
            angleRecommendation: 'Pared o encimera alta (inclinación de 65° a 75° respecto al suelo)',
            tempoAndReps: '2-3 series de 8-10 reps con bajada muy lenta de 3 seg',
            specialWarning: 'A más de 100 kg, no usar mesas bajas; la pared protege las muñecas y evita que la pelvis caiga.',
            weightCompensationNote: 'Al usar la pared, tu carga efectiva baja a ~38-42 kg, totalmente segura para cartílago.'
          };
        } else if (age >= 60) {
          return {
            levelTag: 'Adaptación Articular Suave',
            angleRecommendation: 'Pared vertical con pies a 40 cm del zócalo',
            tempoAndReps: '2 series de 10 reps sin llegar al fallo',
            specialWarning: 'Centrarse en el empuje simétrico para cuidar la articulación acromioclavicular.',
            weightCompensationNote: 'Facilita la respiración fluida sin generar tensión en cuello.'
          };
        } else {
          return {
            levelTag: 'Estándar / Encimera',
            angleRecommendation: 'Encimera de cocina o mesa estable (45°)',
            tempoAndReps: '3 series de 12 reps con 3 seg de bajada',
            specialWarning: 'Mantener glúteos apretados todo el trayecto.',
            weightCompensationNote: 'Progresión natural hacia superficies más bajas según se gane fuerza.'
          };
        }
      }
    }
  },

  {
    id: 'EX-02',
    number: 2,
    block: 'empujes',
    blockName: 'Bloque 1: Empujes (Pecho, Hombros y Tríceps)',
    name: 'Press de Hombros (Con Garrafas o Banda Elástica)',
    subtitle: 'Empuje vertical por encima de la cabeza con faja abdominal neutra',
    equipment: 'Garrafas de Agua (2L-5L) o Banda Elástica',
    equipmentIconName: 'bottle',
    primaryMuscles: ['Deltoides Medio y Anterior', 'Tríceps', 'Trapecio Superior'],
    secondaryMuscles: ['Transverso Abdominal', 'Erectores Espinales'],
    technique:
      'Sentado en una silla firme con la espalda recta o de pie con rodillas semiflexionadas y abdomen activo. Sujeta las garrafas o los extremos de la banda a la altura de las orejas/hombros. Empuja verticalmente hacia arriba hasta estirar los brazos sin bloquear bruscamente los codos. Desciende despacio en 3 segundos.',
    focus: 'Deltoides y estabilidad del torso sin arquear la zona lumbar.',
    tempo: '1 segundo subida controlada / 3 segundos bajada lenta resistida',
    breathing: {
      inhale: 'Toma aire mientras desciendes el peso hacia la altura de las orejas.',
      exhale: 'Expulsa el aire con firmeza mientras empujas el peso hacia el techo.'
    },
    jointSafety: {
      protectedJoint: 'Hombro (Espacio Subacromial) y Lumbares',
      mechanism:
        'Hacerlo sentado en silla con respaldo o de pie con rodillas semiflexionadas evita la hiperextensión lumbar al levantar el peso.',
      safeAngleTip: 'Subir los codos ligeramente por delante del plano coronal (30° adelantados, plano escapular) para no pinzar tendones.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Arquear la espalda lumbar hacia atrás al empujar el peso.',
      'Bloquear los codos violentamente al llegar arriba.',
      'Llevar las garrafas demasiado por detrás de la cabeza.'
    ],
    adaptations: {
      baseGeneric: 'Sentado en silla firme con garrafas de 2L a 5L según nivel, 3 series x 10-12 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100 || age >= 50) {
          return {
            levelTag: 'Sentado con Respaldo',
            angleRecommendation: 'Obligatorio sentado en silla firme con espalda apoyada al respaldo',
            tempoAndReps: '2 series x 10 reps con garrafas de 2L a 3L (o banda elástica ligera)',
            specialWarning: 'Evitar hacerlo de pie para no trasladar la inercia del torso a las vértebras lumbares.',
            weightCompensationNote: 'Garantiza aislamiento puro de deltoides sin compensación postural.'
          };
        } else {
          return {
            levelTag: 'De Pie o Sentado Libre',
            angleRecommendation: 'De pie con rodillas elásticas a 10° o sentado libre',
            tempoAndReps: '3 series x 12 reps con 4L a 5L',
            specialWarning: 'Apretar glúteos y ombligo hacia dentro antes de cada empuje.',
            weightCompensationNote: 'Excelente activación de la faja media.'
          };
        }
      }
    }
  },

  {
    id: 'EX-03',
    number: 3,
    block: 'empujes',
    blockName: 'Bloque 1: Empujes (Pecho, Hombros y Tríceps)',
    name: 'Extensión de Tríceps en Pared',
    subtitle: 'Aislamiento de tríceps sin impacto ni riesgo de codo de tenista',
    equipment: 'Pared Firme',
    equipmentIconName: 'wall',
    primaryMuscles: ['Tríceps Braquial (3 cabezas)'],
    secondaryMuscles: ['Antebrazos', 'Estabilizadores Escapulares'],
    technique:
      'Frente a la pared, apoya los antebrazos completamente en ella a la altura de la cabeza, pies separados atrás. Manteniendo el cuerpo recto, empuja firmemente con las palmas de las manos contra la pared para extender los codos y despegar los antebrazos. Vuelve despacio en 3 segundos apoyando los antebrazos de nuevo.',
    focus: 'Aislamiento de tríceps mediante palanca corporal controlada.',
    tempo: '3 segundos apoyando antebrazos lento / 1 segundo empuje concéntrico',
    breathing: {
      inhale: 'Inhala despacio mientras acercas la frente y apoyas los antebrazos.',
      exhale: 'Exhala mientras empujas con las palmas estirando los brazos.'
    },
    jointSafety: {
      protectedJoint: 'Codos y Tendón del Tríceps',
      mechanism:
        'La pared permite graduar los milímetros de inclinación. Si hay molestia en el tendón tricipital, basta dar medio paso hacia la pared para aliviar la carga.',
      safeAngleTip: 'Antebrazos paralelos, codos alineados con las muñecas sin abrirse hacia fuera.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Abrir los codos en "V" hacia fuera al empujar.',
      'Mover las caderas en vez de hacer la fuerza exclusivamente con los codos.',
      'Golpear la pared bruscamente al apoyar los antebrazos.'
    ],
    adaptations: {
      baseGeneric: 'Pies a 50-60 cm de la pared, antebrazos a la altura de la frente, 3 series x 10-12 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Pies Cercanos a la Pared',
            angleRecommendation: 'Pies a 35-40 cm de la pared (inclinación muy suave)',
            tempoAndReps: '2-3 series x 10 reps controladas',
            specialWarning: 'No alejar los pies en exceso para evitar hiperextensión en tendones del codo.',
            weightCompensationNote: 'A 102 kg la palanca corporal es alta, por lo que una inclinación leve basta.'
          };
        } else {
          return {
            levelTag: 'Inclinación Media',
            angleRecommendation: 'Pies a 60 cm de la pared',
            tempoAndReps: '3 series x 12 reps con 3 seg de bajada',
            specialWarning: 'Foco en no despegar los dedos de la pared.',
            weightCompensationNote: 'Excelente bombeo muscular en los tres haces del tríceps.'
          };
        }
      }
    }
  },

  // ========================================================
  // BLOQUE 2: TIRONES
  // ========================================================
  {
    id: 'EX-04',
    number: 4,
    block: 'tirones',
    blockName: 'Bloque 2: Tirones (Espalda, Bíceps y Postura)',
    name: 'Remo Horizontal con Peso / Banda',
    subtitle: 'Tracción horizontal para ensanchar la espalda y estabilizar escápulas',
    equipment: 'Banda Elástica o Garrafa de 5L',
    equipmentIconName: 'band',
    primaryMuscles: ['Dorsal Ancho', 'Romboides', 'Trapecio Medio e Inferior'],
    secondaryMuscles: ['Bíceps Braquial', 'Deltoides Posterior'],
    technique:
      'De pie con rodillas semiflexionadas y torso inclinado a 45°, o sentado con banda pasada bajo los pies. Espalda neutra con curvatura natural (pecho orgulloso). Tira de la banda o el peso llevando los codos pegados al cuerpo hacia la cadera. Junta conscientemente las escápulas atrás durante 2 segundos y regresa despacio.',
    focus: 'Dorsal ancho, romboides y corrección de postura encorvada.',
    tempo: '1 segundo tirón / 2 segundos contracción escapular atrás / 3 segundos retorno',
    breathing: {
      inhale: 'Inhala mientras extiendes los brazos devolviendo el peso.',
      exhale: 'Exhala con fuerza mientras traccionas hacia la cadera y juntas los omóplatos.'
    },
    jointSafety: {
      protectedJoint: 'Columna Lumbar y Cuello',
      mechanism:
        'Si se realiza sentado en silla con la banda pasada por los pies, la carga sobre las vértebras lumbares pasa a CERO, permitiendo trabajar la espalda sin riesgo de pinzamiento.',
      safeAngleTip: 'Espalda recta a 45°, mirada al suelo 2 metros adelante (cuello alineado).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Encorvar la zona lumbar al inclinarse ("espalda de gato").',
      'Encoger los hombros hacia las orejas usando el trapecio superior.',
      'Tirar con las muñecas en vez de iniciar el movimiento desde los codos.'
    ],
    adaptations: {
      baseGeneric: 'Inclinado a 45° o sentado con banda elástica, 3 series de 12 repeticiones.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100 || age >= 50) {
          return {
            levelTag: 'Remo Sentado en Silla',
            angleRecommendation: 'Sentado en el borde de una silla firme con talones apoyados y banda en pies',
            tempoAndReps: '3 series de 12 reps con 2 seg de pausa escapular',
            specialWarning: 'Recomendado sentado para eliminar el estrés del sobrepeso en los erectores lumbares.',
            weightCompensationNote: 'Permite centrar toda la energía neuromuscular en juntar escápulas y corregir la postura.'
          };
        } else {
          return {
            levelTag: 'Remo Inclinado de Pie',
            angleRecommendation: 'De pie a 45° con garrafa en cada mano o banda doble',
            tempoAndReps: '3 series de 12-14 reps con cadencia 3-1-1',
            specialWarning: 'Asegurar que la cadera permanece atrás todo el tiempo.',
            weightCompensationNote: 'Excelente transferencia al patrón de caminata.'
          };
        }
      }
    }
  },

  {
    id: 'EX-05',
    number: 5,
    block: 'tirones',
    blockName: 'Bloque 2: Tirones (Espalda, Bíceps y Postura)',
    name: "Remo Escapular en 'Y-T-W' (Suelo o Cama)",
    subtitle: 'Activación neuromuscular de manguito rotador y retracción escapular',
    equipment: 'Esterilla o Cama Firme (Autocarga)',
    equipmentIconName: 'mat',
    primaryMuscles: ['Manguito Rotador (Infraespinoso, Redondo Menor)', 'Romboides', 'Trapecio Medio/Inferior'],
    secondaryMuscles: ['Deltoides Posterior', 'Erectores Espinales'],
    technique:
      'Tumbado boca abajo sobre la esterilla o en el colchón firme de la cama con la frente apoyada en una toalla. Eleva los brazos formando secuencialmente las letras Y (brazos a 45° con pulgares arriba), T (brazos en cruz a 90° con pulgares arriba) y W (codos flexionados pegados a costados). Junta las escápulas 2 segundos en cada letra.',
    focus: 'Salud del manguito rotador y zona alta de la espalda sin impacto.',
    tempo: '2 segundos sosteniendo arriba cada letra / 1 segundo de descanso entre letras',
    breathing: {
      inhale: 'Inhala mientras los brazos descansan en el suelo.',
      exhale: 'Exhala largo mientras elevas los brazos y aprietas escápulas.'
    },
    jointSafety: {
      protectedJoint: 'Hombro (Bolsa Subacromial y Manguito Rotador)',
      mechanism:
        'El movimiento con pulgares hacia el techo rota externamente el húmero, abriendo al máximo el espacio articular y evitando el choque acromial.',
      safeAngleTip: 'Pulgares siempre apuntando hacia el techo; frente apoyada para no hiperextender el cuello.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 6 a 8 ciclos completos (Y-T-W = 1 ciclo)',
      rest: '60 segundos entre series',
      isIsometric: true
    },
    commonErrors: [
      'Girar los pulgares hacia el suelo (rotación interna peligrosa).',
      'Elevar la cabeza arrugando la nuca en vez de mantener la frente apoyada.',
      'Mover los brazos de forma rápida sin sostener la contracción arriba.'
    ],
    adaptations: {
      baseGeneric: 'Tumbado prono en esterilla, 2-3 series de 8 ciclos.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'En Cama Firme o Inclinado de Pie',
            angleRecommendation: 'Hacerlo sobre cama firme o de pie apoyando el pecho en una pared a 45°',
            tempoAndReps: '2 series de 6 ciclos completos con 2 seg de parada en cada letra',
            specialWarning: 'Si tumbarse boca abajo oprime el abdomen o cuesta respirar, hacerlo inclinado de pie contra pared.',
            weightCompensationNote: 'Consigue la misma activación escapular sin sensación de opresión diafragmática.'
          };
        } else {
          return {
            levelTag: 'Prono en Suelo',
            angleRecommendation: 'Tumbado en esterilla con toalla bajo la frente',
            tempoAndReps: '3 series de 8 ciclos completos',
            specialWarning: 'Mantener la contracción escapular en cada letra.',
            weightCompensationNote: 'El mejor ejercicio preventivo para dolor de cuello y hombros encorvados.'
          };
        }
      }
    }
  },

  {
    id: 'EX-06',
    number: 6,
    block: 'tirones',
    blockName: 'Bloque 2: Tirones (Espalda, Bíceps y Postura)',
    name: 'Curl de Bíceps',
    subtitle: 'Flexión de codo pura con agarre supino y codos bloqueados en costados',
    equipment: 'Garrafas de Agua (2L-5L) o Banda Elástica',
    equipmentIconName: 'bottle',
    primaryMuscles: ['Bíceps Braquial', 'Braquial Anterior', 'Braquiorradial'],
    secondaryMuscles: ['Flexores de los Dedos y Muñeca'],
    technique:
      'De pie con rodillas levemente flexionadas y espalda recta (o sentado en silla). Sujeta el peso con palmas hacia el frente. Flexiona los codos subiendo el peso hacia los hombros sin balancear el cuerpo ni separar los codos de los costados. Aprieta 1 segundo arriba y desciende en 3 segundos lentos.',
    focus: 'Bíceps braquial y fortalecimiento de tendones del antebrazo.',
    tempo: '1 segundo subida / 1 segundo contracción arriba / 3 segundos bajada lenta',
    breathing: {
      inhale: 'Inhala mientras bajas el peso lentamente hacia los muslos.',
      exhale: 'Exhala mientras flexionas los codos subiendo el peso.'
    },
    jointSafety: {
      protectedJoint: 'Tendón del Bíceps Distal y Columna Lumbar',
      mechanism:
        'Mantener los codos fijos en los costados impide que el deltoides anterior o el balanceo lumbar ayuden, aislando el músculo sin riesgo vertebral.',
      safeAngleTip: 'Codos pegados a la cintura sin adelantarse más de 2 centímetros.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Balancear el torso hacia atrás para coger impulso (trampa lumbar).',
      'Despegar los codos hacia delante al subir.',
      'Dejar caer el peso en la bajada sin frenarlo.'
    ],
    adaptations: {
      baseGeneric: 'De pie o sentado, peso de 2L a 5L, 3 series x 10-12 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100 || age >= 55) {
          return {
            levelTag: 'Sentado con Carga Moderada',
            angleRecommendation: 'Sentado en silla para anular balanceo lumbar',
            tempoAndReps: '2-3 series de 10 reps con garrafas de 2L o 3L y 3 segundos de bajada',
            specialWarning: 'Priorizar el frenado de 3 segundos en bajada para fortalecer el tendón del bíceps.',
            weightCompensationNote: 'Sentado se aísla por completo el bíceps sin sobrecarga espinal.'
          };
        } else {
          return {
            levelTag: 'De Pie Alterno o Simultáneo',
            angleRecommendation: 'De pie con pies a la anchura de hombros',
            tempoAndReps: '3 series de 12 reps con 4L a 5L',
            specialWarning: 'Glúteos firmes para noarquear la zona lumbar.',
            weightCompensationNote: 'Aumentar carga de medio en medio litro de agua en la garrafa.'
          };
        }
      }
    }
  },

  // ========================================================
  // BLOQUE 3: TREN INFERIOR
  // ========================================================
  {
    id: 'EX-07',
    number: 7,
    block: 'tren_inferior',
    blockName: 'Bloque 3: Tren Inferior (Piernas y Glúteos)',
    name: 'Sentadilla a la Silla (Sit-to-Stand)',
    subtitle: 'Patrón de sentadilla seguro con freno excéntrico y tope protector',
    equipment: 'Silla Firme y Estable',
    equipmentIconName: 'chair',
    primaryMuscles: ['Cuádriceps', 'Glúteo Mayor'],
    secondaryMuscles: ['Isquiotibiales', 'Gastrocnemio', 'Transverso Abdominal'],
    technique:
      'De pie frente a una silla firme, pies separados al ancho de hombros con puntas ligeramente hacia fuera (15°). Desplaza la cadera hacia atrás como si fueras a sentarte y desciende de forma muy lenta y controlada (3-4 segundos de bajada). Roza ligeramente el asiento sin relajarte y levántate de forma fluida empujando el suelo con los talones.',
    focus: 'Cuádriceps y glúteos con énfasis en la fuerza excéntrica (clave para bajadas de monte).',
    tempo: '3-4 segundos bajada lenta / 1 segundo pausa rozando / 1 segundo subida',
    breathing: {
      inhale: 'Inhala profundamente llenando el abdomen mientras desciendes en 3-4 segundos.',
      exhale: 'Exhala con fuerza mientras empujas con los talones y te pones de pie.'
    },
    jointSafety: {
      protectedJoint: 'Articulación Femororrotuliana (Rodillas) y Meniscos',
      mechanism:
        'La silla fija un tope angular de 90° que impide que la rodilla se doble en exceso. La bajada lenta de 3-4 segundos fortalece el tendón rotuliano sin ningún impacto de frenado brusco.',
      safeAngleTip: 'Las rodillas deben viajar alineadas con el segundo dedo del pie sin meterse hacia dentro (valgo).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Dejar caer el peso en el asiento sin frenar la bajada ("dejarse caer").',
      'Permitir que las rodillas se junten hacia dentro al subir.',
      'Despegar los talones del suelo al descender.'
    ],
    adaptations: {
      baseGeneric: 'Silla estándar de 45 cm de altura, 3 series de 10-12 repeticiones.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Silla Alta o con Cojín Firme',
            angleRecommendation: 'Añadir un cojín firme sobre la silla (altura ~50 cm) para que el ángulo no baje de 90°',
            tempoAndReps: '2 series en semana 1, 3 en semana 2 de 10 reps con 4 seg de bajada',
            specialWarning: 'Si las rodillas crujen o hay molestia, no bajar de 90°. Puedes apoyar suavemente las manos en una mesa frontal.',
            weightCompensationNote: 'A 102 kg cada sentadilla entrena la capacidad de frenado necesaria para no sufrir en las bajadas de 238m de tu ruta.'
          };
        } else if (age >= 65) {
          return {
            levelTag: 'Silla con Asistencia de Apoyo',
            angleRecommendation: 'Silla firme con las manos preparadas cerca de apoyabrazos o mesa',
            tempoAndReps: '2 series de 8-10 reps a ritmo suave',
            specialWarning: 'Asegurar suelo antideslizante y zapatilla adecuada.',
            weightCompensationNote: 'El mejor ejercicio funcional para mantener la autonomía motriz.'
          };
        } else {
          return {
            levelTag: 'Sentadilla Libre o Silla Baja',
            angleRecommendation: 'Silla baja rozando apenas el asiento',
            tempoAndReps: '3 series de 12 reps con 3 seg de descenso',
            specialWarning: 'Mantener el pecho erguido y mirada al frente.',
            weightCompensationNote: 'Excelente desarrollo de fuerza pura en cuádriceps.'
          };
        }
      }
    }
  },

  {
    id: 'EX-08',
    number: 8,
    block: 'tren_inferior',
    blockName: 'Bloque 3: Tren Inferior (Piernas y Glúteos)',
    name: 'Puente de Glúteos (Suelo)',
    subtitle: 'Extensión pura de cadera sin carga de compresión lumbar',
    equipment: 'Esterilla o Alfombra',
    equipmentIconName: 'mat',
    primaryMuscles: ['Glúteo Mayor', 'Glúteo Medio'],
    secondaryMuscles: ['Isquiotibiales', 'Erectores Espinales', 'Transverso'],
    technique:
      'Tumbado boca arriba con rodillas dobladas a 90° y plantas de los pies firmemente apoyadas en el suelo a la anchura de las caderas. Brazos apoyados a los lados. Eleva la pelvis empujando con los talones hasta formar una rampa recta desde hombros a rodillas. Aprieta los glúteos intensamente durante 2 segundos arriba sin arquear la zona lumbar. Baja despacio.',
    focus: 'Glúteo mayor e isquiotibiales con cero presión en discos vertebrales.',
    tempo: '2 segundos subida / 2 segundos contracción isométrica arriba / 2 segundos bajada',
    breathing: {
      inhale: 'Toma aire mientras estás con la espalda apoyada en el suelo.',
      exhale: 'Expulsa el aire mientras empujas con los talones y contraes glúteos arriba.'
    },
    jointSafety: {
      protectedJoint: 'Columna Lumbar y Rodillas',
      mechanism:
        'Al estar apoyado horizontalmente en el suelo, la gravedad no comprime las vértebras lumbares. Despierta el glúteo "dormido" por el sedentarismo.',
      safeAngleTip: 'No hiperarquear la columna al subir: detenerse cuando el cuerpo forme una línea recta continua.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 12 a 15 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Arquear la espalda lumbar intentando subir más alto de la cuenta.',
      'Empujar con las puntas de los pies en vez de con los talones.',
      'Bajar de golpe sin controlar el movimiento.'
    ],
    adaptations: {
      baseGeneric: 'Tumbado en suelo con pies a 90°, 3 series de 12-15 repeticiones.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Pies Anchos & Cama Firme Opcional',
            angleRecommendation: 'Pies ligeramente más anchos que la cadera (apertura de 20°) en esterilla o cama firme',
            tempoAndReps: '2-3 series de 12 reps sosteniendo 2 seg completos arriba',
            specialWarning: 'Si tumbarse y levantarse del suelo es incómodo, se puede ejecutar perfectamente en un colchón firme.',
            weightCompensationNote: 'El sobrepeso en el abdomen queda sostenido sin presionar articulaciones.'
          };
        } else {
          return {
            levelTag: 'Banda Elástica en Rodillas',
            angleRecommendation: 'Colocar una minibanda alrededor de las rodillas',
            tempoAndReps: '3 series de 15 reps empujando rodillas hacia fuera',
            specialWarning: 'Asegurar contracción máxima en glúteo medio.',
            weightCompensationNote: 'Máxima estabilidad de cadera para caminar y correr.'
          };
        }
      }
    }
  },

  {
    id: 'EX-09',
    number: 9,
    block: 'tren_inferior',
    blockName: 'Bloque 3: Tren Inferior (Piernas y Glúteos)',
    name: 'Elevación de Talones (Gemelos)',
    subtitle: 'Fortalecimiento de la bomba gemelar y amortiguador del tobillo',
    equipment: 'Pared para Equilibrio (o Escalón)',
    equipmentIconName: 'wall',
    primaryMuscles: ['Gastrocnemio (Gemelos)', 'Sóleo'],
    secondaryMuscles: ['Tibial Posterior', 'Fascia Plantar'],
    technique:
      'De pie apoyando las yemas de los dedos en la pared para mantener el equilibrio, pies paralelos a la anchura de las caderas. Sube empujando sobre las puntas de los pies (base del dedo gordo) hasta la máxima altura. Mantén 1-2 segundos arriba contrayendo fuerte la pantorrilla y desciende muy despacio (3 segundos) hasta que el talón toque el suelo.',
    focus: 'Tríceps sural (gemelos y sóleo), tendón de Aquiles y estabilidad de tobillos.',
    tempo: '1 segundo subida en puntillas / 2 segundos contracción arriba / 3 segundos descenso lento',
    breathing: {
      inhale: 'Inhala mientras bajas los talones despacio hacia el suelo.',
      exhale: 'Exhala mientras te elevas sobre las puntas de los pies.'
    },
    jointSafety: {
      protectedJoint: 'Tendón de Aquiles, Tobillo y Menisco Rotuliano',
      mechanism:
        'Los gemelos son la primera línea de absorción del choque vertical al caminar. Al fortalecerlos, retienen hasta el 30% del impacto antes de que llegue a la rodilla.',
      safeAngleTip: 'Empujar con el dedo gordo y el segundo dedo para evitar que el tobillo se tuerza hacia fuera (supinación).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 12 a 15 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Rebotar deprisa sin sostener la pausa arriba.',
      'Torcer los tobillos hacia fuera al subir.',
      'Doblar las rodillas en vez de mantener las piernas estiradas pero relajadas.'
    ],
    adaptations: {
      baseGeneric: 'Apoyo bipedal en suelo o borde de escalón, 3 series de 15 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Apoyo Bipedal en Suelo Plano',
            angleRecommendation: 'En suelo plano (no en escalón) con ambas manos apoyadas en la pared',
            tempoAndReps: '2-3 series de 12 reps con 3 segundos de bajada lenta',
            specialWarning: 'No hacerlo en escalón hasta perder peso para no sobreestirar el tendón de Aquiles bajo 102 kg de carga.',
            weightCompensationNote: 'Al soportar 102 kg en dos apoyos, cada gemelo ya está levantando más de 50 kg efectivos.'
          };
        } else {
          return {
            levelTag: 'En Borde de Escalón',
            angleRecommendation: 'Dejar caer el talón 2 cm por debajo del escalón para rango excéntrico completo',
            tempoAndReps: '3 series de 15 reps (o a una sola pierna)',
            specialWarning: 'Subida explosiva y bajada lenta en 4 segundos.',
            weightCompensationNote: 'Inmuniza el tendón frente a pendientes y desniveles.'
          };
        }
      }
    }
  },

  // ========================================================
  // BLOQUE 4: CORE Y ESTABILIDAD
  // ========================================================
  {
    id: 'EX-10',
    number: 10,
    block: 'core',
    blockName: 'Bloque 4: Core y Estabilidad (Abdomen y Faja Lumbar)',
    name: 'Plancha Frontal Elevada (Silla/Mesa)',
    subtitle: 'Activación isométrica del transverso sin flexión cervical ni compresión discal',
    equipment: 'Mesa Firme, Encimera o Silla',
    equipmentIconName: 'chair',
    primaryMuscles: ['Transverso del Abdomen', 'Recto Abdominal'],
    secondaryMuscles: ['Oblicuos', 'Glúteos', 'Serrato'],
    technique:
      'Apoya los antebrazos sobre una superficie firme y elevada (mesa, encimera o silla estable). Retrasa los pies hasta que tu cuerpo forme una línea recta diagonal desde la coronilla hasta los talones. Activa glúteos y lleva el ombligo suavemente hacia la columna. Mantén la postura fija respirando con calma, sin dejar caer la cadera ni levantar el glúteo.',
    focus: 'Trabajo isométrico de la faja abdominal protectora (sin encorvar la espalda).',
    tempo: 'Isométrico continuo de 20 a 30 segundos / Respiración controlada',
    breathing: {
      inhale: 'Inhala suave por la nariz manteniendo el abdomen firme (tensión cilíndrica).',
      exhale: 'Exhala largo por la boca como si soplaras por una pajita, contrayendo más el ombligo.'
    },
    jointSafety: {
      protectedJoint: 'Discos Lumbares (L4-L5-S1) y Cuello',
      mechanism:
        'Cero flexión espinal (nada de abdominales tradicionales tipo crunch que desgastan el disco). La elevación de la superficie reduce la palanca de gravedad.',
      safeAngleTip: 'Cuerpo en línea recta a 45°-60° del suelo; no dejar arquear la cintura hacia abajo.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 20 a 30 segundos isométricos',
      rest: '60 segundos entre series',
      isIsometric: true
    },
    commonErrors: [
      'Dejar caer la cadera hacia el suelo por fatiga del abdomen.',
      'Contener la respiración (apnea peligrosa para la tensión arterial).',
      'Levantar el glúteo formando un triángulo en vez de una línea recta.'
    ],
    adaptations: {
      baseGeneric: 'Inclinada sobre mesa o silla firme, 3 series de 20-30 segundos.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Plancha en Encimera Alta o Mesa',
            angleRecommendation: 'Encimera de cocina o mesa alta y robusta (ángulo de 50° a 60°)',
            tempoAndReps: '3 series de 15 a 20 segundos de máxima calidad técnica',
            specialWarning: 'Si la cadera empieza a hundirse aunque sea 1 cm, parar la serie inmediatamente.',
            weightCompensationNote: 'A 102 kg en el suelo la gravedad sobrecarga la espalda baja; la mesa la protege al 100%.'
          };
        } else if (age >= 60) {
          return {
            levelTag: 'Plancha en Pared o Mesa Alta',
            angleRecommendation: 'Pared o mesa firme con descanso de 75 segundos entre series',
            tempoAndReps: '2-3 series de 15-20 segundos respirando continuo',
            specialWarning: 'Vigilar no tensar los trapecios ni el cuello.',
            weightCompensationNote: 'Excelente para tonificar el corsé natural del abdomen.'
          };
        } else {
          return {
            levelTag: 'Plancha en Silla o Banco',
            angleRecommendation: 'Superficie a la altura de la rodilla (silla firme)',
            tempoAndReps: '3 series de 30 a 40 segundos',
            specialWarning: 'Apretar glúteos con fuerza para fijar la pelvis.',
            weightCompensationNote: 'Alta exigencia metabólica y postural.'
          };
        }
      }
    }
  },

  {
    id: 'EX-11',
    number: 11,
    block: 'core',
    blockName: 'Bloque 4: Core y Estabilidad (Abdomen y Faja Lumbar)',
    name: 'Bird-Dog (Cuadrupedia)',
    subtitle: 'El ejercicio de oro de estabilidad espinal del Dr. Stuart McGill',
    equipment: 'Esterilla o Cama Firme',
    equipmentIconName: 'mat',
    primaryMuscles: ['Multífidos Espinales', 'Transverso Abdominal', 'Glúteo Mayor'],
    secondaryMuscles: ['Deltoides Posterior', 'Trapecio', 'Isquiotibiales'],
    technique:
      'Colócate en posición de cuadrupedia sobre la esterilla (manos bajo los hombros, rodillas bajo las caderas). Espalda en posición neutra. Extiende simultáneamente el brazo derecho hacia delante y la pierna izquierda hacia atrás en horizontal. Mantén 2 segundos formando una línea recta sin que la cadera rote. Vuelve al centro y alterna lados.',
    focus: 'Estabilidad lumbopélvica y coordinación cruzada sin compresión articular.',
    tempo: '2 segundos sosteniendo en extensión horizontal / 2 segundos retorno lento',
    breathing: {
      inhale: 'Inhala en la posición de cuadrupedia (4 apoyos).',
      exhale: 'Exhala despacio mientras extiendes brazo y pierna contraria fijando el abdomen.'
    },
    jointSafety: {
      protectedJoint: 'Vértebras Lumbares y Articulación Sacroilíaca',
      mechanism:
        'Científicamente comprobado: produce la mayor activación de los estabilizadores profundos de la columna (multífidos) con la menor carga compresiva de todos los ejercicios de core.',
      safeAngleTip: 'No levantar la pierna por encima de la línea horizontal de la espalda para no arquear la columna lumbar.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 8 a 10 repeticiones por lado',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Girar o ladear la cadera hacia un lado al levantar la pierna.',
      'Patear hacia arriba hiperarqueando la zona lumbar.',
      'Mirar hacia arriba flexionando la columna cervical.'
    ],
    adaptations: {
      baseGeneric: 'En esterilla en suelo, 3 series de 8-10 reps alternadas por lado.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Apoyo con Toalla en Rodillas o en Cama',
            angleRecommendation: 'Colocar una toalla doblada bajo las rodillas en esterilla, o hacerlo en colchón firme',
            tempoAndReps: '2 series de 6 a 8 reps por lado sin prisas',
            specialWarning: 'Si cuesta mantener el equilibrio, mover primero solo la pierna y dejar ambas manos apoyadas.',
            weightCompensationNote: 'Aliviar la presión sobre las rótulas con la toalla acolchada es clave a 102 kg.'
          };
        } else {
          return {
            levelTag: 'Bird-Dog Completo con Pausa',
            angleRecommendation: 'En esterilla firme',
            tempoAndReps: '3 series de 10 reps por lado con 3 seg de parada isométrica',
            specialWarning: 'Imaginar un vaso de agua sobre la espalda baja que no debe derramarse.',
            weightCompensationNote: 'Patrón rey para erradicar las molestias lumbares al caminar.'
          };
        }
      }
    }
  },

  {
    id: 'EX-12',
    number: 12,
    block: 'core',
    blockName: 'Bloque 4: Core y Estabilidad (Abdomen y Faja Lumbar)',
    name: 'Press Pallof (Isométrico con Banda o Pared)',
    subtitle: 'Control antirotacional y blindaje lateral del abdomen',
    equipment: 'Banda Elástica Anclada a Puerta (o Empuje Isométrico en Pared)',
    equipmentIconName: 'band',
    primaryMuscles: ['Oblicuos Internos y Externos', 'Transverso Abdominal'],
    secondaryMuscles: ['Deltoides', 'Pectoral', 'Glúteo Medio'],
    technique:
      'De pie de perfil respecto a una puerta con la banda elástica anclada a la altura del pecho (o de perfil empujando con ambas manos contra una pared lateral). Pies a la anchura de hombros, rodillas ligeramente flexionadas. Con las manos juntas en el pecho, extiende los brazos al frente en línea recta resistiendo la fuerza elástica que intenta girar tu torso. Mantén 2-3 segundos y vuelve.',
    focus: 'Oblicuos y control antirotacional del núcleo (fuerza isométrica pura).',
    tempo: 'Extender al frente / Sostener 2-3 segundos / Recoger al pecho en 2 segundos',
    breathing: {
      inhale: 'Inhala con las manos pegadas al pecho.',
      exhale: 'Exhala largo mientras extiendes los brazos al frente aguantando la resistencia antirotación.'
    },
    jointSafety: {
      protectedJoint: 'Discos Intervertebrales Lumbares',
      mechanism:
        'La columna lumbar está diseñada anatómicamente para resistir rotaciones (solo permite ~5° de torsión), no para girar con carga. El Press Pallof entrena precisamente a resistir giros bruscos.',
      safeAngleTip: 'Hombros y caderas siempre paralelos al frente, sin rotar ni un grado.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 8 a 10 repeticiones por cada lado',
      rest: '60 segundos entre series',
      isIsometric: true
    },
    commonErrors: [
      'Dejarse girar por la banda hacia la puerta.',
      'Bloquear las rodillas estiradas del todo en vez de mantenerlas semiflexionadas.',
      'Subir los hombros tensando el cuello.'
    ],
    adaptations: {
      baseGeneric: 'De pie con banda elástica a tensión media, 3 series x 8-10 reps por lado.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100 || age >= 50) {
          return {
            levelTag: 'Base Ancha y Tensión Moderada',
            angleRecommendation: 'Pies bien separados (más anchos que caderas) para base de sustentación amplia',
            tempoAndReps: '2-3 series de 8 reps por lado aguantando 2 segundos al frente',
            specialWarning: 'Si no tienes banda, empuja con las dos palmas contra una pared lateral con el 50% de tu fuerza.',
            weightCompensationNote: 'Garantiza máxima firmeza lateral protegiendo la pelvis durante caminatas con desniveles.'
          };
        } else {
          return {
            levelTag: 'Tensión Progresiva / Zancada',
            angleRecommendation: 'De pie o en postura de semiarrodillado para mayor reto',
            tempoAndReps: '3 series de 10 reps con 3 segundos de aguante al frente',
            specialWarning: 'Asegurar que los brazos se extienden completamente en línea recta.',
            weightCompensationNote: 'Desarrolla una faja lateral indestructible.'
          };
        }
      }
    }
  },

  // ========================================================
  // BLOQUE: EJERCICIOS POTENCIADOS CON COJÍN DE EQUILIBRIO HINCHABLE
  // ========================================================
  {
    id: 'EX-C01',
    number: 13,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Tren Inferior (Rodilla)',
    name: 'Sentadilla Asistida con Cojín en Silla / Pie Inestable',
    subtitle: 'Máxima estabilidad y control de rodilla corrigiendo el valgo dinámico',
    equipment: 'Cojín de Equilibrio Hinchable + Silla Firme',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Cuádriceps (Vasto Interno)', 'Glúteo Medio y Mayor'],
    secondaryMuscles: ['Estabilizadores del Tobillo', 'Transverso Abdominal'],
    technique:
      'Coloca el cojín de equilibrio hinchable sobre el asiento de la silla (o realiza la sentadilla bipodal con un pie sobre el cojín y el otro en el suelo). Al hacer la Sentadilla a la Silla, la inestabilidad de la cámara de aire obliga a tus glúteos y cuádriceps a microcorregir la postura en el momento exacto de rozar el asiento y levantarte, protegiendo las rodillas y mejorando el equilibrio propioceptivo.',
    focus: 'Máxima estabilidad y control de rodilla, activando el vasto medial para evitar desviaciones rotulianas.',
    tempo: '3-4 segundos bajada excéntrica lenta / 1 segundo pausa sobre el aire / 1 segundo subida fluida',
    breathing: {
      inhale: 'Inhala profundamente mientras desciendes lento buscando el cojín.',
      exhale: 'Exhala expulsando el aire mientras empujas con los talones y te pones de pie.'
    },
    jointSafety: {
      protectedJoint: 'Articulación Femororrotuliana y Meniscos',
      mechanism:
        'El cojín absorbe el impacto terminal al sentarse y desactiva las sacudidas articulares, mientras estimula los mecanorreceptores de la rodilla.',
      safeAngleTip: 'Alinear rodilla con el segundo dedo del pie; la inestabilidad del cojín entrena a no juntar las rodillas (evita el valgo).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Dejarse caer bruscamente aplastando el cojín.',
      'Permitir que las rodillas oscilen descontroladas sin apretar glúteos.',
      'Mirar a los pies encorvando la columna dorsal.'
    ],
    adaptations: {
      baseGeneric: 'Cojín inflado a presión media sobre silla estándar de 45 cm, 3 series x 10 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Cojín en Asiento + Silla Firme',
            angleRecommendation: 'Obligatorio con cojín sobre la silla (no pie directo en suelo aún) para no sobrecargar meniscos a 102 kg',
            tempoAndReps: '2-3 series de 10 reps con 4 seg de bajada muy lenta',
            specialWarning: 'Inflar el cojín al 70-80% de presión para que no toque fondo bajo 102 kg.',
            weightCompensationNote: 'Al rozar el cojín, el aire disipa la inercia del peso corporal protegiendo las rodillas.'
          };
        } else {
          return {
            levelTag: 'Pie Inestable Alterno',
            angleRecommendation: 'Un pie sobre el cojín en suelo y el otro en suelo plano (alternando series)',
            tempoAndReps: '3 series de 10-12 reps por lado',
            specialWarning: 'Foco en la estabilidad del tobillo en el pie elevado.',
            weightCompensationNote: 'Aumenta exponencialmente la propiocepción para senderos pedregosos.'
          };
        }
      }
    }
  },

  {
    id: 'EX-C02',
    number: 14,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Tren Inferior (Glúteos & Isquios)',
    name: 'Puente de Glúteos Inestable (Talones en Cojín)',
    subtitle: 'Activación neuromuscular intensiva de la cadena posterior sin daño lumbar',
    equipment: 'Cojín de Equilibrio Hinchable + Esterilla',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Glúteo Mayor', 'Isquiotibiales (Bíceps Femoral, Semitendinoso)'],
    secondaryMuscles: ['Glúteo Medio', 'Erectores Espinales', 'Fascia Plantar'],
    technique:
      'Túmbate boca arriba en la esterilla y, en lugar de apoyar los pies planos en el suelo, apoya ambos talones encima del cojín de equilibrio hinchable. Brazos a los lados. Empuja elevando la cadera hasta formar una rampa recta. Al estar la superficie inestable por el aire interno, los isquiotibiales y glúteos deben contraerse el doble para evitar que los pies se deslicen o tiemblen.',
    focus: 'Isquiotibiales y glúteos potenciados con microestabilización sin compresión vertebral.',
    tempo: '2 segundos subida / 2 segundos contracción isométrica en inestabilidad / 2 segundos bajada',
    breathing: {
      inhale: 'Inhala en el suelo con la pelvis apoyada.',
      exhale: 'Exhala largo mientras elevas la cadera y fijas los talones contra el cojín.'
    },
    jointSafety: {
      protectedJoint: 'Columna Lumbar y Ligamentos Cruzados',
      mechanism:
        'Fortalece los isquiotibiales en co-contracción con los glúteos, el principal freno que protege el ligamento cruzado anterior.',
      safeAngleTip: 'No hiperarquear la zona lumbar: detener la subida en línea recta hombro-cadera-rodilla.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Dejar que el cojín se desplace hacia delante.',
      'Subir impulsando con la zona lumbar en vez de con los glúteos.',
      'Apoyar solo la punta de los dedos en vez del talón firme.'
    ],
    adaptations: {
      baseGeneric: 'Talones en el centro del cojín a 90° de flexión de rodilla, 3 series x 12 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Talones Anchos en Cojín',
            angleRecommendation: 'Pies ligeramente separados sobre el cojín para base de apoyo más amplia',
            tempoAndReps: '2-3 series de 10 reps aguantando 2 segundos arriba',
            specialWarning: 'Si los isquios amenazan con subir en rampa (calambre), acercar el cojín 5 cm más hacia los glúteos.',
            weightCompensationNote: 'Al estar tumbado, los 102 kg no impactan en discos lumbares.'
          };
        } else {
          return {
            levelTag: 'Puente Unipodal (Opcional)',
            angleRecommendation: 'Progresar a un solo pie sobre el cojín y el otro en el aire',
            tempoAndReps: '3 series de 8 reps por pierna',
            specialWarning: 'Máxima exigencia de fuerza estabilizadora.',
            weightCompensationNote: 'Ideal para corredores y montañeros.'
          };
        }
      }
    }
  },

  {
    id: 'EX-C03',
    number: 15,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Tren Inferior (Tobillos)',
    name: 'Elevación de Talones Inestable sobre Cojín',
    subtitle: 'Fortalecimiento de tobillos, sóleo y ligamentos con resistencia de aire',
    equipment: 'Cojín de Equilibrio + Pared para Apoyo',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Sóleo', 'Gastrocnemio (Gemelos)', 'Peroneos'],
    secondaryMuscles: ['Tibial Posterior', 'Ligamentos del Tobillo'],
    technique:
      'Coloca las puntas de los pies sobre el cojín hinchable y los talones en el suelo (o ambos pies completos sobre el cojín con las manos tocando suavemente la pared para mantener el equilibrio). Al elevarte sobre las puntas, la resistencia inestable del aire desafía los propioceptores del tobillo, fortaleciendo el sóleo, gemelos y ligamentos laterales a otro nivel.',
    focus: 'Tríceps sural profundo, tendón de Aquiles y prevención de esguinces en descensos.',
    tempo: '1 segundo subida en puntillas / 2 segundos contrayendo en inestabilidad / 3 segundos descenso lento',
    breathing: {
      inhale: 'Inhala mientras bajas los talones despacio.',
      exhale: 'Exhala mientras te elevas sobre el cojín apretando gemelos.'
    },
    jointSafety: {
      protectedJoint: 'Articulación del Tobillo y Tendón de Aquiles',
      mechanism:
        'Entrena a los músculos peroneos y al tibial posterior a responder en milisegundos cuando pisas una piedra o raíz suelta en el monte.',
      safeAngleTip: 'Manos siempre rozando la pared; no soltarse para no arriesgar caídas.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 10 a 12 repeticiones',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Hacerlo sin apoyar las manos en la pared (riesgo de torcedura innecesaria).',
      'Rebotar sobre el aire del cojín en vez de controlar la subida y bajada.',
      'Torcer los tobillos hacia fuera.'
    ],
    adaptations: {
      baseGeneric: 'Puntas en cojín y talón en suelo firme con apoyo en pared, 3 series x 12 reps.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Apoyo Bipedal con Manos en Pared',
            angleRecommendation: 'Puntas en cojín y ambas manos apoyadas firmemente en la pared a la altura de los hombros',
            tempoAndReps: '2-3 series de 10 reps con 3 seg de bajada',
            specialWarning: 'No hacerlo a 1 pierna bajo 102 kg; el trabajo bipodal sobre aire ya genera una carga excelente.',
            weightCompensationNote: 'Prepara el tobillo para amortiguar el peso en las bajadas de 238m de tu ruta.'
          };
        } else {
          return {
            levelTag: 'Pies Completos en Cojín',
            angleRecommendation: 'Pies completamente sobre el cojín tocando la pared con un solo dedo',
            tempoAndReps: '3 series de 12-14 reps con cadencia 1-2-3',
            specialWarning: 'Control milimétrico del eje longitudinal.',
            weightCompensationNote: 'Blindaje total contra esguinces por inversión.'
          };
        }
      }
    }
  },

  {
    id: 'EX-C04',
    number: 16,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Core y Faja Abdominal',
    name: 'Plancha Frontal con Antebrazos sobre el Cojín',
    subtitle: 'Sobrecarga isométrica reactiva del transverso por microtemblores de aire',
    equipment: 'Cojín de Equilibrio Hinchable en Mesa o Suelo',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Transverso del Abdomen', 'Serrato Anterior', 'Oblicuos'],
    secondaryMuscles: ['Deltoides', 'Glúteos', 'Multífidos'],
    technique:
      'En lugar de apoyar los antebrazos sobre una superficie fija, apóyalos sobre el cojín hinchable (colocado sobre una mesa firme para descarga lumbar, o en el suelo). Retrasa los pies hasta alinear el cuerpo. Al temblar ligeramente por el aire interno del cojín, tu abdomen profundo (transverso) y tus hombros deben hacer un esfuerzo isométrico reactivo continuo para no perder el equilibrio.',
    focus: 'Core reactivo profundo, transverso y estabilidad escapulotorácica.',
    tempo: 'Isométrico continuo de 15 a 25 segundos / Respiración diafragmática fluida',
    breathing: {
      inhale: 'Inhala suave por la nariz manteniendo el corsé abdominal activo.',
      exhale: 'Exhala largo contrayendo el ombligo como si soplaras por una pajita.'
    },
    jointSafety: {
      protectedJoint: 'Columna Lumbar y Manguito Rotador',
      mechanism:
        'Los microtemblores del aire activan los propioceptores del manguito y del serrato sin necesidad de mover la columna vertebral.',
      safeAngleTip: 'Cuerpo en rampa recta; si tiemblas en exceso, apoyar antebrazos con cojín en mesa alta.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 15 a 25 segundos isométricos',
      rest: '60 segundos entre series',
      isIsometric: true
    },
    commonErrors: [
      'Dejar caer la cadera hacia abajo arqueando las lumbares.',
      'Contener la respiración durante los temblores del cojín.',
      'Hundir el pecho entre los hombros (falta de empuje del serrato).'
    ],
    adaptations: {
      baseGeneric: 'Cojín sobre mesa firme a 45°, 3 series de 20 segundos.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Cojín en Mesa Alta / Encimera',
            angleRecommendation: 'Cojín colocado obligatoriamente sobre mesa alta o encimera (no en el suelo)',
            tempoAndReps: '3 series de 15 segundos de máxima calidad técnica',
            specialWarning: 'A 102 kg en el suelo el cojín provocaría arqueo lumbar; en mesa alta es 100% seguro y eficaz.',
            weightCompensationNote: 'Reduce el vector de gravedad permitiendo que el transverso trabaje sin fatiga lesiva.'
          };
        } else {
          return {
            levelTag: 'Cojín en Suelo',
            angleRecommendation: 'Cojín en esterilla en suelo horizontal con pies juntos',
            tempoAndReps: '3 series de 25 a 35 segundos',
            specialWarning: 'Activar glúteos intensamente para fijar pelvis.',
            weightCompensationNote: 'Exigencia abdominal muy alta.'
          };
        }
      }
    }
  },

  {
    id: 'EX-C05',
    number: 17,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Core y Estabilidad Lumbopélvica',
    name: 'Bird-Dog con Rodilla sobre Cojín de Equilibrio',
    subtitle: 'Desafío neuromuscular asimétrico para fijar la faja lumbar',
    equipment: 'Cojín de Equilibrio Hinchable + Esterilla',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Multífidos Espinales', 'Oblicuos Internos/Externos', 'Glúteo Mayor'],
    secondaryMuscles: ['Transverso', 'Deltoides Posterior'],
    technique:
      'En posición de cuadrupedia en la esterilla, coloca el cojín de equilibrio hinchable bajo la rodilla de apoyo (o bajo la mano de apoyo). Espalda neutra. Extiende simultáneamente el brazo derecho y la pierna izquierda en horizontal. La pérdida de estabilidad en un solo punto obliga a los oblicuos y a los multífidos de la zona lumbar a estabilizar la columna de inmediato con máxima precisión.',
    focus: 'Estabilidad lumbopélvica y coordinación cruzada reactiva frente a fuerzas asimétricas.',
    tempo: '2 segundos sosteniendo en extensión horizontal / 2 segundos retorno lento',
    breathing: {
      inhale: 'Inhala en la posición de 4 apoyos sobre el cojín.',
      exhale: 'Exhala despacio mientras extiendes brazo y pierna contraria fijando el abdomen.'
    },
    jointSafety: {
      protectedJoint: 'Vértebras Lumbares (L4-S1) y Articulación Sacroilíaca',
      mechanism:
        'El cojín añade inestabilidad sin aumentar la carga compresiva vertebral, multiplicando el reclutamiento de los multífidos.',
      safeAngleTip: 'Extender la pierna solo hasta la horizontal (nunca por encima de la cadera).'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 6 a 8 repeticiones por lado',
      rest: '60 segundos entre series',
      isIsometric: false
    },
    commonErrors: [
      'Girar la cadera hacia el lado del cojín por falta de fuerza en oblicuos.',
      'Moverse rápido sin mantener los 2 segundos de pausa arriba.',
      'Mirar hacia arriba quebrando la columna cervical.'
    ],
    adaptations: {
      baseGeneric: 'Cojín bajo una rodilla en esterilla, 2-3 series de 8 reps por lado.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100) {
          return {
            levelTag: 'Cojín con Apoyo Amplio de Manos',
            angleRecommendation: 'Manos bien firmes en la esterilla y cojín con presión al 70% bajo la rodilla',
            tempoAndReps: '2 series de 6 reps por lado con calma',
            specialWarning: 'Si cuesta mantener el equilibrio, mover solo la pierna y mantener ambas manos firmes en el suelo.',
            weightCompensationNote: 'El acolchado de aire elimina por completo la molestia del contacto óseo de la rótula.'
          };
        } else {
          return {
            levelTag: 'Bird-Dog Doble Inestabilidad',
            angleRecommendation: 'Cojín bajo rodilla y mano opuesta en superficie inestable',
            tempoAndReps: '3 series de 8-10 reps por lado con 3 seg de parada',
            specialWarning: 'Foco en la inmovilidad de la pelvis.',
            weightCompensationNote: 'Máxima activación del core del atleta.'
          };
        }
      }
    }
  },

  {
    id: 'EX-C06',
    number: 18,
    block: 'cojin_equilibrio',
    blockName: 'Cojín de Equilibrio: Postura & Equilibrio General',
    name: 'Apoyo Monopodal sobre Cojín (Equilibrio a 1 Pierna)',
    subtitle: 'Prevención de caídas y torceduras con estimulación propioceptiva vestibular',
    equipment: 'Cojín de Equilibrio Hinchable + Pared Cerca',
    equipmentIconName: 'cushion',
    primaryMuscles: ['Glúteo Medio', 'Tibial Posterior', 'Peroneos'],
    secondaryMuscles: ['Cuádriceps', 'Core Profundo', 'Intrínsecos del Pie'],
    technique:
      'De pie, colócate sobre una sola pierna en el centro del cojín de equilibrio hinchable. Mantén la rodilla de apoyo levemente flexionada (microflexión de 10°, nunca bloqueada). Mantén el equilibrio durante 20 a 30 segundos mientras realizas respiraciones profundas con la mirada fija en un punto al frente. Mantén una pared o respaldo a mano para tocar en caso de desequilibrio. Alterna piernas.',
    focus: 'Prevención de torceduras de tobillo, estabilidad femororrotuliana y equilibrio postural integral.',
    tempo: '20 a 30 segundos continuos por pierna / Respiración profunda',
    breathing: {
      inhale: 'Inhala profundamente en 3 segundos llenando el diafragma y expandiendo costillas.',
      exhale: 'Exhala lento en 4 segundos sintiendo la faja abdominal activa y la mirada firme.'
    },
    jointSafety: {
      protectedJoint: 'Tobillo, Meniscos de Rodilla y Cadera',
      mechanism:
        'Refuerza la musculatura estabilizadora del glúteo medio, que es el responsable de mantener la pelvis horizontal al caminar cuesta abajo.',
      safeAngleTip: 'Rodilla con microflexión elástica de 10°; nunca bloquear en hiperextensión.'
    },
    standardPrescription: {
      frequency: '3 a 4 días por semana',
      setsAndReps: '2 a 3 series de 20 a 30 segundos por pierna',
      rest: '45 segundos entre piernas',
      isIsometric: true
    },
    commonErrors: [
      'Bloquear la rodilla completamente recta (apaga el cuádriceps y sobrecarga la articulación).',
      'Cerrar los ojos sin haber dominado antes con ojos abiertos.',
      'Alejarse demasiado de la pared de seguridad.'
    ],
    adaptations: {
      baseGeneric: 'Un pie en cojín tocando pared con 1 dedo, 3 series x 25 segundos.',
      getSpecificAdvice: (age, weightKg) => {
        if (weightKg >= 100 || age >= 50) {
          return {
            levelTag: 'Con Pared de Apoyo a 10 cm',
            angleRecommendation: 'Colocar el cojín a 10 cm de la pared para tener la mano lista de inmediato',
            tempoAndReps: '2-3 series de 20 segundos por pierna con respiración continua',
            specialWarning: 'Si notas que el tobillo tiembla con fatiga, apoya la otra punta del pie para reequilibrarte.',
            weightCompensationNote: 'A 102 kg el glúteo medio soporta una carga enorme al caminar; este ejercicio lo blinda.'
          };
        } else {
          return {
            levelTag: 'Libre con Reto Visual',
            angleRecommendation: 'En centro de la habitación sin apoyos; mover los brazos o girar la cabeza despacio',
            tempoAndReps: '3 series de 30 a 45 segundos por pierna',
            specialWarning: 'Mantener la pelvis nivelada.',
            weightCompensationNote: 'Excelente entrenamiento propioceptivo para senderismo técnico.'
          };
        }
      }
    }
  }
];
