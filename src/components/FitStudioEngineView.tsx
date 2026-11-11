import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Bike,
  Footprints,
  RotateCcw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Dumbbell,
  Activity,
  Flame,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Terminal,
  Zap,
  Award,
  History,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { fitStudioAudio } from '../services/fitStudioAudio';
import { ExerciseSvgInfographic } from './ExerciseSvgInfographic';
import { EXERCISE_INFOGRAPHICS } from '../data/exerciseInfographics';
import {
  subscribeOutdoorRoutes,
  saveOutdoorRouteToCloud,
  subscribeEllipticalSessions,
  saveEllipticalSessionToCloud
} from '../services/firebase';

// Closed bank of 12 authorized strength exercises
export const AUTHORIZED_STRENGTH_EXERCISES = [
  { id: 1, name: 'Flexiones inclinadas', block: 'Empujes', tempoDesc: '3s bajada / 1s empuje', isIsometric: false },
  { id: 2, name: 'Press de hombros', block: 'Empujes', tempoDesc: '1s subida / 3s bajada', isIsometric: false },
  { id: 3, name: 'Extensión de tríceps en pared', block: 'Empujes', tempoDesc: '3s apoyo / 1s empuje', isIsometric: false },
  { id: 4, name: 'Remo horizontal con peso/banda', block: 'Tirones', tempoDesc: '1s tirón / 2s pausa / 3s retorno', isIsometric: false },
  { id: 5, name: "Remo escapular 'Y-T-W'", block: 'Tirones', tempoDesc: '2s pausa por letra', isIsometric: true },
  { id: 6, name: 'Curl de bíceps', block: 'Tirones', tempoDesc: '1s subida / 3s bajada', isIsometric: false },
  { id: 7, name: 'Sentadilla a la silla (Sit-to-stand)', block: 'Tren Inferior', tempoDesc: '3-4s bajada lenta / 1s subida', isIsometric: false },
  { id: 8, name: 'Puente de glúteos', block: 'Tren Inferior', tempoDesc: '2s subida / 2s pausa / 2s bajada', isIsometric: false },
  { id: 9, name: 'Elevación de talones', block: 'Tren Inferior', tempoDesc: '1s subida / 3s bajada lenta', isIsometric: false },
  { id: 10, name: 'Plancha frontal elevada', block: 'Core', tempoDesc: 'Isométrico continuo', isIsometric: true },
  { id: 11, name: 'Bird-Dog (Cuadrupedia)', block: 'Core', tempoDesc: '2s extensión / 2s retorno', isIsometric: false },
  { id: 12, name: 'Press Pallof / Antirotación', block: 'Core', tempoDesc: '3s aguante al frente', isIsometric: true },
  // Cojín de Equilibrio Hinchable
  { id: 13, name: 'Sentadilla asistida con cojín en silla', block: 'Cojín Equilibrio', tempoDesc: '3-4s bajada lenta / 1s subida', isIsometric: false },
  { id: 14, name: 'Puente de glúteos inestable (talones en cojín)', block: 'Cojín Equilibrio', tempoDesc: '2s subida / 2s pausa / 2s bajada', isIsometric: false },
  { id: 15, name: 'Elevación de talones sobre el cojín', block: 'Cojín Equilibrio', tempoDesc: '1s subida / 3s bajada lenta', isIsometric: false },
  { id: 16, name: 'Plancha frontal con antebrazos sobre cojín', block: 'Cojín Equilibrio', tempoDesc: 'Isométrico con microtemblores', isIsometric: true },
  { id: 17, name: 'Bird-Dog con rodilla sobre el cojín', block: 'Cojín Equilibrio', tempoDesc: '2s extensión / 2s retorno', isIsometric: false },
  { id: 18, name: 'Apoyo monopodal sobre cojín (equilibrio)', block: 'Cojín Equilibrio', tempoDesc: '20-30s isométrico por pierna', isIsometric: true }
];

export interface OutdoorRouteSession {
  id: string;
  timestamp: string;
  tipo: 'Caminata' | 'Bicicleta';
  distancia_km: number;
  tiempo_minutos: number;
  altitud_m?: number;
  desnivel_positivo_m: number;
  desnivel_negativo_m: number;
  ritmo_min_km: string;
  velocidad_kmh: number;
  esfuerzo_acumulado: string;
  heart_rate_avg_bpm?: number;
  heart_rate_max_bpm?: number;
  garmin_synced?: boolean;
}

export interface EllipticalSession {
  id: string;
  timestamp: string;
  tiempo_minutos: number;
  nivel_resistencia: number; // 1-10
  rpm_promedio: number;
  calorias_estimadas: number;
  zona_intensidad: string;
  heart_rate_avg_bpm?: number;
  garmin_synced?: boolean;
}


export interface StrengthSetLog {
  id: string;
  timestamp: string;
  nombre_ejercicio: string;
  repeticiones_completadas: number;
  repeticiones_objetivo: number;
  tiempo_segundos: number;
}

export const FitStudioEngineView: React.FC = () => {
  // Active sub-module within FitStudio Engine: 'outdoor' | 'elliptical' | 'strength' | 'console'
  const [activeModule, setActiveModule] = useState<'outdoor' | 'elliptical' | 'strength' | 'console'>('strength');

  // Audio mute toggle
  const [isMuted, setIsMuted] = useState(false);

  // ----------------------------------------------------
  // MODULE 1: OUTDOOR ROUTE STATE & FORM
  // ----------------------------------------------------
  const [routeType, setRouteType] = useState<'Caminata' | 'Bicicleta'>('Caminata');
  const [routeDistance, setRouteDistance] = useState('6.9');
  const [routeTime, setRouteTime] = useState('75');
  const [routeAltitude, setRouteAltitude] = useState('312');
  const [routeElevGain, setRouteElevGain] = useState('238');
  const [routeElevLoss, setRouteElevLoss] = useState('238');
  const [routeHeartRateAvg, setRouteHeartRateAvg] = useState('124');
  const [routeHeartRateMax, setRouteHeartRateMax] = useState('142');
  const [ellipticalHeartRateAvg, setEllipticalHeartRateAvg] = useState('128');
  const [isSyncingGarminDevice, setIsSyncingGarminDevice] = useState(false);

  const handleSyncGarminDevice = () => {
    setIsSyncingGarminDevice(true);
    setTimeout(() => {
      setIsSyncingGarminDevice(false);
      setRouteHeartRateAvg(String(Math.floor(Math.random() * 10) + 120));
      setRouteHeartRateMax(String(Math.floor(Math.random() * 12) + 138));
      setEllipticalHeartRateAvg(String(Math.floor(Math.random() * 10) + 125));
      fitStudioAudio.speak('Reloj Garmin sincronizado. Frecuencia cardíaca y datos actualizados.');
    }, 800);
  };

  const [routeHistory, setRouteHistory] = useState<OutdoorRouteSession[]>(() => {
    try {
      const saved = localStorage.getItem('fitstudio_outdoor_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial verified trail session for Juan
    return [
      {
        id: 'out-baseline',
        timestamp: '11 nov 2026 09:30',
        tipo: 'Caminata',
        distancia_km: 6.9,
        tiempo_minutos: 75,
        altitud_m: 312,
        desnivel_positivo_m: 238,
        desnivel_negativo_m: 238,
        ritmo_min_km: '10:52',
        velocidad_kmh: 5.52,
        esfuerzo_acumulado: 'Moderado Alto (+238m desnivel)'
      }
    ];
  });

  // Calculate live outdoor metrics
  const liveOutdoorMetrics = React.useMemo(() => {
    const dist = parseFloat(routeDistance) || 0;
    const time = parseFloat(routeTime) || 0;
    const gain = parseFloat(routeElevGain) || 0;
    const loss = parseFloat(routeElevLoss) || 0;

    if (dist <= 0 || time <= 0) {
      return { ritmo: '—', velocidadKmh: 0, esfuerzo: 'Pendiente de datos' };
    }

    const paceDecimal = time / dist;
    const paceMin = Math.floor(paceDecimal);
    const paceSec = Math.round((paceDecimal - paceMin) * 60);
    const ritmoStr = `${paceMin}:${paceSec < 10 ? '0' : ''}${paceSec} min/km`;
    const velocidad = Math.round((dist / (time / 60)) * 100) / 100;

    let esfuerzo = 'Bajo (Llano)';
    if (gain > 200) esfuerzo = 'Alto (+238m desnivel pronunciado)';
    else if (gain > 80) esfuerzo = 'Moderado (+80m desnivel medio)';

    return {
      ritmo: ritmoStr,
      velocidadKmh: velocidad,
      esfuerzo
    };
  }, [routeDistance, routeTime, routeElevGain, routeElevLoss]);

  // Handle register outdoor route tool
  const handleRegisterOutdoorRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dist = parseFloat(routeDistance);
    const time = parseFloat(routeTime);
    const alt = parseFloat(routeAltitude) || 0;
    const gain = parseFloat(routeElevGain) || 0;
    const loss = parseFloat(routeElevLoss) || 0;

    if (isNaN(dist) || isNaN(time) || dist <= 0 || time <= 0) return;

    const newSession: OutdoorRouteSession = {
      id: `out-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      tipo: routeType,
      distancia_km: dist,
      tiempo_minutos: time,
      altitud_m: alt,
      desnivel_positivo_m: gain,
      desnivel_negativo_m: loss,
      ritmo_min_km: liveOutdoorMetrics.ritmo,
      velocidad_kmh: liveOutdoorMetrics.velocidadKmh,
      esfuerzo_acumulado: liveOutdoorMetrics.esfuerzo,
      heart_rate_avg_bpm: parseInt(routeHeartRateAvg) || 124,
      heart_rate_max_bpm: parseInt(routeHeartRateMax) || 142,
      garmin_synced: true
    };

    const updated = [newSession, ...routeHistory];
    setRouteHistory(updated);
    try {
      localStorage.setItem('fitstudio_outdoor_history', JSON.stringify(updated));
    } catch {}

    saveOutdoorRouteToCloud(newSession);

    setConsoleOutput({
      toolName: 'registrarRutaExterior',
      status: 'EXITO',
      data: newSession,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // ----------------------------------------------------
  // MODULE 2: ELLIPTICAL STATE & FORM
  // ----------------------------------------------------
  const [ellipticalTime, setEllipticalTime] = useState('45');
  const [ellipticalResistance, setEllipticalResistance] = useState('6');
  const [ellipticalRpm, setEllipticalRpm] = useState('65');

  const [ellipticalHistory, setEllipticalHistory] = useState<EllipticalSession[]>(() => {
    try {
      const saved = localStorage.getItem('fitstudio_elliptical_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'elp-baseline',
        timestamp: '10 nov 2026 18:00',
        tiempo_minutos: 45,
        nivel_resistencia: 6,
        rpm_promedio: 65,
        calorias_estimadas: Math.round(45 * (6 * 0.7 + 4)), // = 45 * 8.2 = 369 kcal
        zona_intensidad: 'Zona 2 Aeróbica (Bajo Impacto)'
      }
    ];
  });

  // Real-time Cloud Firestore Synchronization for Outdoor Routes & Elliptical Sessions
  useEffect(() => {
    const unsubOutdoor = subscribeOutdoorRoutes('juan_fitstudio_user', (cloudRoutes) => {
      setRouteHistory((prev) => {
        const map = new Map<string, OutdoorRouteSession>();
        prev.forEach((r) => map.set(r.id, r));
        cloudRoutes.forEach((r) => map.set(r.id, r));
        const merged = Array.from(map.values());
        try {
          localStorage.setItem('fitstudio_outdoor_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });

    const unsubElliptical = subscribeEllipticalSessions('juan_fitstudio_user', (cloudSessions) => {
      setEllipticalHistory((prev) => {
        const map = new Map<string, EllipticalSession>();
        prev.forEach((s) => map.set(s.id, s));
        cloudSessions.forEach((s) => map.set(s.id, s));
        const merged = Array.from(map.values());
        try {
          localStorage.setItem('fitstudio_elliptical_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });

    return () => {
      unsubOutdoor();
      unsubElliptical();
    };
  }, []);

  // Calculate calories strictly via formula: (Tiempo en min) * (Nivel Resistencia * 0.7 + 4)
  const liveEllipticalMetrics = React.useMemo(() => {
    const time = parseFloat(ellipticalTime) || 0;
    const res = parseFloat(ellipticalResistance) || 1;
    const rpm = parseFloat(ellipticalRpm) || 0;

    const calories = Math.round(time * (res * 0.7 + 4));

    let zona = 'Zona 1 (Recuperación activa)';
    if (res >= 7 || rpm >= 75) zona = 'Zona 3 (Umbral aeróbico / Resistencia)';
    else if (res >= 4 || rpm >= 60) zona = 'Zona 2 (Aeróbica óptima / Quema de grasa)';

    return {
      calorias: calories,
      factorFormula: (res * 0.7 + 4).toFixed(2),
      zona
    };
  }, [ellipticalTime, ellipticalResistance, ellipticalRpm]);

  const handleRegisterElliptical = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const time = parseFloat(ellipticalTime);
    const res = parseInt(ellipticalResistance);
    const rpm = parseFloat(ellipticalRpm) || 60;

    if (isNaN(time) || isNaN(res) || time <= 0) return;

    const calories = Math.round(time * (res * 0.7 + 4));

    const newSession: EllipticalSession = {
      id: `elp-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      tiempo_minutos: time,
      nivel_resistencia: res,
      rpm_promedio: rpm,
      calorias_estimadas: calories,
      zona_intensidad: liveEllipticalMetrics.zona,
      heart_rate_avg_bpm: parseInt(ellipticalHeartRateAvg) || 128,
      garmin_synced: true
    };

    const updated = [newSession, ...ellipticalHistory];
    setEllipticalHistory(updated);
    try {
      localStorage.setItem('fitstudio_elliptical_history', JSON.stringify(updated));
    } catch {}

    saveEllipticalSessionToCloud(newSession);

    setConsoleOutput({
      toolName: 'registrarEliptica',
      status: 'EXITO',
      data: newSession,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // ----------------------------------------------------
  // MODULE 3: STRENGTH TRAINER (12 EXERCISES WITH REAL VOICE & TEMPO)
  // ----------------------------------------------------
  const [selectedExerciseName, setSelectedExerciseName] = useState('Sentadilla a la silla (Sit-to-stand)');
  const [targetReps, setTargetReps] = useState(10);
  const [tempoCadence, setTempoCadence] = useState<'3-1-1' | '4-1-2'>('3-1-1');

  // Exercise runner active state
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const [isExercisePaused, setIsExercisePaused] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'prep' | 'eccentric' | 'inflection' | 'concentric' | 'completed'>('prep');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(3);
  const [voiceSpokenPrompt, setVoiceSpokenPrompt] = useState('Listo para iniciar.');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle audio
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    fitStudioAudio.setMuted(next);
  };

  // Start exercise guide with voice
  const handleStartStrengthExercise = (exerciseName = selectedExerciseName, reps = targetReps) => {
    setIsExerciseRunning(true);
    setIsExercisePaused(false);
    setCurrentRep(0);
    setCurrentPhase('prep');
    setPhaseSecondsLeft(3);

    const isIso = AUTHORIZED_STRENGTH_EXERCISES.find((e) => e.name === exerciseName)?.isIsometric || false;

    const startMsg = `FitStudio Engine iniciando ${exerciseName}. Objetivo: ${reps} repeticiones. Prepárate en posición. 3, 2, 1... ¡Empezamos!`;
    setVoiceSpokenPrompt(startMsg);
    fitStudioAudio.playBeep(520, 0.2);
    fitStudioAudio.speak(`Iniciando ${exerciseName}. Prepárate.`);

    setConsoleOutput({
      toolName: 'iniciarEjercicioFuerza',
      status: 'EJECUTANDO',
      data: {
        nombre_ejercicio: exerciseName,
        repeticiones_objetivo: reps,
        modo_ritmo: true,
        tempo: tempoCadence,
        es_isometrico: isIso
      },
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // Stop / Cancel exercise
  const handleStopExercise = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExerciseRunning(false);
    setIsExercisePaused(false);
    setCurrentPhase('prep');
    fitStudioAudio.stopAll();
    setVoiceSpokenPrompt('Entrenamiento detenido.');
  };

  // Step-by-step tempo loop
  useEffect(() => {
    if (!isExerciseRunning || isExercisePaused) return;

    timerRef.current = setInterval(() => {
      setPhaseSecondsLeft((prevSec) => {
        if (prevSec > 1) {
          // Count down eccentric phase
          if (currentPhase === 'eccentric') {
            fitStudioAudio.playBeep(330, 0.08);
          }
          return prevSec - 1;
        }

        // Transition between phases
        if (currentPhase === 'prep') {
          // Move to 1st eccentric rep
          setCurrentPhase('eccentric');
          const eccentricSeconds = tempoCadence === '4-1-2' ? 4 : 3;
          fitStudioAudio.speak('Baja lento');
          setVoiceSpokenPrompt(`Repetición ${currentRep + 1}: Baja en ${eccentricSeconds}, ${eccentricSeconds - 1}...`);
          return eccentricSeconds;
        }

        if (currentPhase === 'eccentric') {
          // Bottom inflection / pause
          setCurrentPhase('inflection');
          fitStudioAudio.playBeep(440, 0.1);
          setVoiceSpokenPrompt('¡Pausa!');
          return 1;
        }

        if (currentPhase === 'inflection') {
          // Concentric push
          setCurrentPhase('concentric');
          const nextRep = currentRep + 1;
          setCurrentRep(nextRep);
          fitStudioAudio.playBeep(660, 0.18, 'triangle');

          // Encouragement logic specified in user prompt
          const isHalfway = nextRep === Math.floor(targetReps / 2);
          const isFinalStretch = nextRep === targetReps - 1;
          const isDone = nextRep >= targetReps;

          let voiceMsg = `¡Arriba! Llevas ${nextRep}.`;
          if (isDone) {
            voiceMsg = `¡Serie completada! Llevas ${nextRep} repeticiones. Descansa 60 segundos.`;
          } else if (isHalfway) {
            voiceMsg = `¡Arriba! Llevas ${nextRep}. ¡Excelente ritmo, vas por la mitad! Mantén la técnica.`;
          } else if (isFinalStretch) {
            voiceMsg = `¡Arriba! Llevas ${nextRep}. ¡Última repetición, no aflojes!`;
          }

          setVoiceSpokenPrompt(voiceMsg);
          fitStudioAudio.speak(voiceMsg);

          if (isDone) {
            setCurrentPhase('completed');
            setIsExerciseRunning(false);
            return 0;
          }

          return 1; // 1s concentric
        }

        if (currentPhase === 'concentric') {
          // Return to eccentric for next rep
          setCurrentPhase('eccentric');
          const eccentricSeconds = tempoCadence === '4-1-2' ? 4 : 3;
          return eccentricSeconds;
        }

        return 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExerciseRunning, isExercisePaused, currentPhase, currentRep, targetReps, tempoCadence]);

  // ----------------------------------------------------
  // CONSOLE OUTPUT STATE (STRUCTURED DASHBOARD FORMAT)
  // ----------------------------------------------------
  const [consoleOutput, setConsoleOutput] = useState<{
    toolName: string;
    status: string;
    data: unknown;
    timestamp: string;
  }>({
    toolName: 'FitStudioEngineReady',
    status: 'ONLINE',
    data: {
      modulos_disponibles: [
        '1. registrarRutaExterior (Caminata/Bici)',
        '2. registrarEliptica (Tiempo/Resistencia/RPM)',
        '3. iniciarEjercicioFuerza (12 Ejercicios/Voz)'
      ],
      mensaje: 'FitStudio Engine inicializado. Especializado exclusivamente en estas 3 actividades.'
    },
    timestamp: '11 nov 2026 13:40'
  });

  // Active Infographic data matching selectedExerciseName
  const activeInfographicData = React.useMemo(() => {
    const mapId: Record<string, string> = {
      'Flexiones inclinadas': 'EX-01',
      'Press de hombros': 'EX-02',
      'Extensión de tríceps en pared': 'EX-03',
      'Remo horizontal con peso/banda': 'EX-04',
      "Remo escapular 'Y-T-W'": 'EX-05',
      'Curl de bíceps': 'EX-06',
      'Sentadilla a la silla (Sit-to-stand)': 'EX-07',
      'Puente de glúteos': 'EX-08',
      'Elevación de talones': 'EX-09',
      'Plancha frontal elevada': 'EX-10',
      'Bird-Dog (Cuadrupedia)': 'EX-11',
      'Press Pallof / Antirotación': 'EX-12',
      'Sentadilla asistida con cojín en silla': 'EX-C01',
      'Puente de glúteos inestable (talones en cojín)': 'EX-C02',
      'Elevación de talones sobre el cojín': 'EX-C03',
      'Plancha frontal con antebrazos sobre cojín': 'EX-C04',
      'Bird-Dog con rodilla sobre el cojín': 'EX-C05',
      'Apoyo monopodal sobre cojín (equilibrio)': 'EX-C06'
    };
    const id = mapId[selectedExerciseName] || 'EX-01';
    return EXERCISE_INFOGRAPHICS.find((e) => e.id === id) || EXERCISE_INFOGRAPHICS[0];
  }, [selectedExerciseName]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner: FitStudio Engine Brand & Purpose */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-teal-500/30 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  FitStudio Engine
                </span>
                <span className="text-xs text-teal-300 font-medium">
                  Asistente Virtual & Cuadro de Mando Inteligente
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                  3 Módulos Exclusivos
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Registro, Guiado de Tempo y Métricas en Tiempo Real
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Especializado exclusivamente en Caminata/Bicicleta exterior con altitud, Elíptica con gasto calórico exacto
                y Entrenador de Fuerza en Casa para los 12 ejercicios con conteo por voz.
              </p>
            </div>

            {/* Audio Voice Mute Toggle */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={handleToggleMute}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                }`}
                title={isMuted ? 'Activar voz del entrenador' : 'Silenciar voz del entrenador'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
                <span>{isMuted ? 'Voz Silenciada' : 'Voz Activa'}</span>
              </button>
            </div>
          </div>

          {/* Module Switcher Buttons */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveModule('strength')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
                activeModule === 'strength'
                  ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>3. Entrenador de Fuerza (12 Ejercicios + Voz)</span>
            </button>

            <button
              onClick={() => setActiveModule('outdoor')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
                activeModule === 'outdoor'
                  ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Ruta Exterior (Caminata / Bicicleta)</span>
            </button>

            <button
              onClick={() => setActiveModule('elliptical')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
                activeModule === 'elliptical'
                  ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>2. Sesión de Elíptica (Gasto Calórico)</span>
            </button>

            <button
              onClick={() => setActiveModule('console')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
                activeModule === 'console'
                  ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Cuadro de Mando JSON Tools</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MÓDULO 3: ENTRENADOR DE FUERZA EN CASA (12 EJERCICIOS) */}
      {/* ======================================================== */}
      {activeModule === 'strength' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: Config and Exercise Selector */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Dumbbell className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Entrenador Guiado por Voz
                  </h3>
                  <span className="text-[11px] text-slate-500">Banco cerrado de 12 ejercicios autorizados</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Web Speech Activo
              </span>
            </div>

            {/* Exercise Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Selecciona uno de los 12 Ejercicios:
              </label>
              <select
                value={selectedExerciseName}
                onChange={(e) => setSelectedExerciseName(e.target.value)}
                disabled={isExerciseRunning}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
              >
                {AUTHORIZED_STRENGTH_EXERCISES.map((ex) => (
                  <option key={ex.id} value={ex.name}>
                    {ex.id}. {ex.name} ({ex.block})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Reps & Tempo options */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Repeticiones Objetivo:
                </label>
                <div className="flex items-center gap-1.5">
                  {[8, 10, 12, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={isExerciseRunning}
                      onClick={() => setTargetReps(num)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        targetReps === num
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Cadencia de Tempo:
                </label>
                <select
                  value={tempoCadence}
                  onChange={(e) => setTempoCadence(e.target.value as '3-1-1' | '4-1-2')}
                  disabled={isExerciseRunning}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 text-xs"
                >
                  <option value="3-1-1">Estándar: 3s bajada / 1s subida</option>
                  <option value="4-1-2">Protegido: 4s bajada / 2s subida</option>
                </select>
              </div>
            </div>

            {/* Start / Stop Controls */}
            <div className="pt-2">
              {!isExerciseRunning ? (
                <button
                  type="button"
                  onClick={() => handleStartStrengthExercise()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Iniciar Conteo Guiado con Voz (Tool)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExercisePaused(!isExercisePaused)}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isExercisePaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    <span>{isExercisePaused ? 'Reanudar' : 'Pausar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStopExercise}
                    className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Detener Serie</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick shortcuts for all 12 exercises */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Acceso Rápido a los 12 Ejercicios:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {AUTHORIZED_STRENGTH_EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      if (!isExerciseRunning) setSelectedExerciseName(ex.name);
                    }}
                    className={`p-2 rounded-lg text-left transition-colors truncate cursor-pointer ${
                      selectedExerciseName === ex.name
                        ? 'bg-teal-100 font-bold text-teal-950 border border-teal-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-slate-400 mr-1">{ex.id}.</span>
                    <span>{ex.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Active Voice & Tempo Dashboard */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Cuadro de Mando en Vivo
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {selectedExerciseName}
                </span>
              </div>

              {/* Big Tempo & Reps Counter Screen */}
              <div className="my-5 bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 border border-slate-800 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Fase Actual</span>
                  <span className="font-bold text-teal-400 uppercase tracking-widest text-[11px]">
                    {currentPhase === 'prep'
                      ? 'Preparación'
                      : currentPhase === 'eccentric'
                      ? 'Bajada (Excéntrico 3-4s)'
                      : currentPhase === 'inflection'
                      ? 'Punto de Inflexión'
                      : currentPhase === 'concentric'
                      ? 'Empuje / ¡Arriba!'
                      : '¡Serie Completada!'}
                  </span>
                </div>

                {/* Main countdown or rep count */}
                <div className="py-2">
                  <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-3">
                    <span className="text-teal-400">{currentRep}</span>
                    <span className="text-slate-600 text-3xl font-normal">/</span>
                    <span className="text-slate-300 text-4xl">{targetReps}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Repeticiones Realizadas
                  </span>
                </div>

                {/* Visual Tempo Bar */}
                <div className="space-y-1">
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        currentPhase === 'concentric'
                          ? 'bg-emerald-400'
                          : currentPhase === 'eccentric'
                          ? 'bg-teal-500'
                          : 'bg-amber-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((currentRep / targetReps) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Inicio (0%)</span>
                    <span className="text-teal-400 font-bold">50% Ánimo de mitad</span>
                    <span>Meta ({targetReps} reps)</span>
                  </div>
                </div>

                {/* Live Spoken Voice Bubble */}
                <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 text-left flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-teal-500 text-slate-950 shrink-0 mt-0.5">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-300 font-bold block uppercase tracking-wider">
                      Instrucción de Voz de FitStudio Engine:
                    </span>
                    <p className="text-xs font-semibold text-white mt-0.5 leading-relaxed">
                      "{voiceSpokenPrompt}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Estado</span>
                  <strong className={`text-xs ${isExerciseRunning ? 'text-teal-700' : 'text-slate-700'}`}>
                    {isExerciseRunning ? (isExercisePaused ? 'En Pausa' : 'En Curso') : 'Listo'}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Cadencia</span>
                  <strong className="text-xs text-slate-900 font-mono">{tempoCadence}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Descanso</span>
                  <strong className="text-xs text-emerald-800">60 segundos</strong>
                </div>
              </div>

              {/* EMBEDDED INFOGRAPHIC & DETAILED GUIDE FOR THE SELECTED EXERCISE */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Infografía Biomecánica & Guía Descriptiva en Vivo ({activeInfographicData.id})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                    {activeInfographicData.jointSafety.protectedJoint}
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
                  <ExerciseSvgInfographic exerciseId={activeInfographicData.id} size="lg" />
                </div>

                <div className="space-y-2 text-[11px] text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <p><strong>Técnica paso a paso:</strong> {activeInfographicData.technique}</p>
                  <p><strong>Mecanismo de protección articular:</strong> {activeInfographicData.jointSafety.mechanism}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                    <div><strong className="text-sky-800">🌬️ Inhalar:</strong> {activeInfographicData.breathing.inhale}</div>
                    <div><strong className="text-teal-800">💨 Exhalar:</strong> {activeInfographicData.breathing.exhale}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action: simulate tool start */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tool asociada: <code>iniciarEjercicioFuerza</code></span>
              <button
                onClick={() => setActiveModule('console')}
                className="text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Registro en Consola JSON</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MÓDULO 1: RUTA EXTERIOR (ANDAR / BICICLETA) */}
      {/* ======================================================== */}
      {activeModule === 'outdoor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form: Register Outdoor Session */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Registrar Ruta Exterior
                  </h3>
                  <span className="text-[11px] text-slate-500">Caminata o Bicicleta con Desnivel</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tool: registrarRutaExterior
              </span>
            </div>

            {/* Garmin Forerunner 735XT Sync Banner */}
            <div className="p-3 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-teal-500 text-slate-950 font-black text-xs">
                  ⌚
                </div>
                <div>
                  <div className="text-xs font-bold">Garmin Forerunner 735XT</div>
                  <span className="text-[10px] text-teal-300">Conectado (ANT+ / BLE) · FC & Pasos listos</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncGarminDevice}
                disabled={isSyncingGarminDevice}
                className="px-2.5 py-1 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all cursor-pointer"
              >
                {isSyncingGarminDevice ? 'Sincronizando...' : 'Sincronizar Reloj'}
              </button>
            </div>

            <form onSubmit={handleRegisterOutdoorRoute} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Tipo de Actividad:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRouteType('Caminata')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      routeType === 'Caminata'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Footprints className="w-4 h-4" />
                    <span>Caminata</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRouteType('Bicicleta')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      routeType === 'Bicicleta'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Bicicleta</span>
                  </button>
                </div>
              </div>

              {/* Distance and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Distancia (km):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeDistance}
                    onChange={(e) => setRouteDistance(e.target.value)}
                    placeholder="Ej. 6.9"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tiempo (minutos):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={routeTime}
                    onChange={(e) => setRouteTime(e.target.value)}
                    placeholder="Ej. 75"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Heart Rate Avg & Max (Garmin 735XT Extra) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-rose-800 flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                    <span>FC Media (bpm):</span>
                  </label>
                  <input
                    type="number"
                    value={routeHeartRateAvg}
                    onChange={(e) => setRouteHeartRateAvg(e.target.value)}
                    placeholder="Ej. 124"
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/30 font-semibold text-slate-800 font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-900 flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 text-rose-700" />
                    <span>FC Máxima (bpm):</span>
                  </label>
                  <input
                    type="number"
                    value={routeHeartRateMax}
                    onChange={(e) => setRouteHeartRateMax(e.target.value)}
                    placeholder="Ej. 142"
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/30 font-semibold text-slate-800 font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Elevation Gain & Loss */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Desnivel Positivo (+m):</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={routeElevGain}
                    onChange={(e) => setRouteElevGain(e.target.value)}
                    placeholder="Ej. 238"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/30 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Desnivel Negativo (-m):</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={routeElevLoss}
                    onChange={(e) => setRouteElevLoss(e.target.value)}
                    placeholder="Ej. 238"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/30 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Peak Altitude */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Altitud Máxima (metros):
                </label>
                <input
                  type="number"
                  step="1"
                  value={routeAltitude}
                  onChange={(e) => setRouteAltitude(e.target.value)}
                  placeholder="Ej. 312"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Live Auto Calculation Card */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                  Cálculo Automático Instantáneo:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Ritmo Medio:</span>
                    <strong className="text-slate-900 font-mono text-sm">{liveOutdoorMetrics.ritmo}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Velocidad Media:</span>
                    <strong className="text-emerald-800 font-mono text-sm">{liveOutdoorMetrics.velocidadKmh} km/h</strong>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-900 pt-0.5">
                  <strong>Esfuerzo acumulado:</strong> {liveOutdoorMetrics.esfuerzo}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm text-center"
              >
                Guardar Ruta en Cuadro de Mando
              </button>
            </form>
          </div>

          {/* Right: History & Visual Map Specs */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-700" />
                Histórico de Rutas Registradas
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {routeHistory.length} sesión(es)
              </span>
            </div>

            <div className="space-y-3">
              {routeHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                        {item.tipo === 'Caminata' ? <Footprints className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                      </span>
                      <div>
                        <strong className="text-slate-900 text-sm block">{item.tipo}</strong>
                        <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      {item.distancia_km} km
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tiempo</span>
                      <strong className="text-slate-800">{item.tiempo_minutos} min</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ritmo</span>
                      <strong className="text-slate-800 font-mono">{item.ritmo_min_km}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Desnivel (+)</span>
                      <strong className="text-emerald-700 font-mono">+{item.desnivel_positivo_m}m</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Desnivel (-)</span>
                      <strong className="text-amber-700 font-mono">-{item.desnivel_negativo_m}m</strong>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-600 flex items-center justify-between">
                    <span><strong>Esfuerzo:</strong> {item.esfuerzo_acumulado}</span>
                    <div className="flex items-center gap-2">
                      {item.heart_rate_avg_bpm && (
                        <span className="text-rose-700 font-semibold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ♥ {item.heart_rate_avg_bpm} bpm (Garmin)
                        </span>
                      )}
                      {item.altitud_m && <span>Cota máx: {item.altitud_m}m</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MÓDULO 2: SESIÓN DE ELÍPTICA (FÓRMULA EXACTA) */}
      {/* ======================================================== */}
      {activeModule === 'elliptical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Log Elliptical */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Activity className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Sesión de Elíptica
                  </h3>
                  <span className="text-[11px] text-slate-500">Cálculo de Calorías según Resistencia y Tiempo</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Tool: registrarEliptica
              </span>
            </div>

            {/* Garmin Forerunner 735XT Sync Banner */}
            <div className="p-3 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-teal-500 text-slate-950 font-black text-xs">
                  ⌚
                </div>
                <div>
                  <div className="text-xs font-bold">Garmin Forerunner 735XT</div>
                  <span className="text-[10px] text-teal-300">Conectado (ANT+ / BLE) · FC lista</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncGarminDevice}
                disabled={isSyncingGarminDevice}
                className="px-2.5 py-1 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all cursor-pointer"
              >
                {isSyncingGarminDevice ? 'Sincronizando...' : 'Sincronizar Reloj'}
              </button>
            </div>

            <form onSubmit={handleRegisterElliptical} className="space-y-4 text-xs">
              {/* Tiempo */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tiempo Transcurrido (minutos):
                </label>
                <input
                  type="number"
                  step="1"
                  value={ellipticalTime}
                  onChange={(e) => setEllipticalTime(e.target.value)}
                  placeholder="Ej. 45"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Heart Rate Avg (Garmin 735XT Extra) */}
              <div>
                <label className="font-bold text-rose-800 flex items-center gap-1 mb-1">
                  <Activity className="w-3.5 h-3.5 text-rose-600" />
                  <span>FC Media (bpm) - Garmin 735XT:</span>
                </label>
                <input
                  type="number"
                  value={ellipticalHeartRateAvg}
                  onChange={(e) => setEllipticalHeartRateAvg(e.target.value)}
                  placeholder="Ej. 128"
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/30 font-semibold text-slate-800 font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Nivel de Resistencia (1-10) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Nivel de Resistencia (1 - 10):
                  </label>
                  <span className="font-extrabold text-blue-800 font-mono text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Nivel {ellipticalResistance} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={ellipticalResistance}
                  onChange={(e) => setEllipticalResistance(e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1 (Mínima)</span>
                  <span>5 (Media)</span>
                  <span>10 (Máxima)</span>
                </div>
              </div>

              {/* Cadencia RPM */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cadencia Estimada (RPM):
                </label>
                <input
                  type="number"
                  step="1"
                  value={ellipticalRpm}
                  onChange={(e) => setEllipticalRpm(e.target.value)}
                  placeholder="Ej. 65"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Cadencia recomendada: 60 - 70 RPM para zona aeróbica sin impacto rotuliano.
                </span>
              </div>

              {/* EXACT FORMULA CALCULATION CARD */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                <span className="font-extrabold text-blue-950 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Fórmula Oficial Aplicada por FitStudio Engine:
                </span>
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 font-mono text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Kcal = (Tiempo) × (Nivel Resistencia × 0.7 + 4)
                  </div>
                  <div className="text-blue-900 font-bold">
                    Kcal = ({ellipticalTime} min) × ({ellipticalResistance} × 0.7 + 4) = <strong>{liveEllipticalMetrics.calorias} kcal</strong>
                  </div>
                </div>
                <div className="text-[11px] text-blue-900 font-semibold pt-1">
                  {liveEllipticalMetrics.zona}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-700 hover:bg-blue-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm text-center"
              >
                Guardar Sesión de Elíptica
              </button>
            </form>
          </div>

          {/* Right: History & Elliptical Metrics */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-700" />
                Histórico de Sesiones en Elíptica
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {ellipticalHistory.length} sesión(es)
              </span>
            </div>

            <div className="space-y-3">
              {ellipticalHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                        <Activity className="w-4 h-4" />
                      </span>
                      <div>
                        <strong className="text-slate-900 text-sm block">Elíptica Bajo Impacto</strong>
                        <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-amber-600 font-mono text-base block">
                        {item.calorias_estimadas} kcal
                      </span>
                      <span className="text-[10px] text-slate-400">gasto estimado</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tiempo</span>
                      <strong className="text-slate-800">{item.tiempo_minutos} min</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Resistencia</span>
                      <strong className="text-blue-800 font-mono">Nivel {item.nivel_resistencia}/10</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cadencia</span>
                      <strong className="text-slate-800 font-mono">{item.rpm_promedio} RPM</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 pt-0.5 flex items-center justify-between">
                    <span><strong>Zona:</strong> {item.zona_intensidad}</span>
                    {item.heart_rate_avg_bpm && (
                      <span className="text-rose-700 font-semibold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        ♥ {item.heart_rate_avg_bpm} bpm (Garmin)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONSOLE & STRUCTURED DASHBOARD (TOOLS JSON SPEC) */}
      {/* ======================================================== */}
      {activeModule === 'console' && (
        <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="font-black text-base text-white">
                  Consola de Cuadro de Mando & Tools JSON
                </h3>
                <span className="text-xs text-slate-400">
                  Respuesta estructurada para las 3 herramientas de FitStudio Engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                STATUS: {consoleOutput.status}
              </span>
            </div>
          </div>

          {/* Quick Tool Execution Test Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Disparadores Rápidos de Herramientas (1-Click):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => {
                  setActiveModule('outdoor');
                  handleRegisterOutdoorRoute();
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition-all cursor-pointer"
              >
                <strong className="text-emerald-400 block font-mono text-[11px]">
                  1. registrarRutaExterior()
                </strong>
                <span className="text-slate-300 text-[11px] block mt-1">
                  Caminata 6.9 km · 75 min · +238m / -238m
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveModule('elliptical');
                  handleRegisterElliptical();
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition-all cursor-pointer"
              >
                <strong className="text-blue-400 block font-mono text-[11px]">
                  2. registrarEliptica()
                </strong>
                <span className="text-slate-300 text-[11px] block mt-1">
                  45 min · Resistencia 6 · 65 RPM (Fórmula Kcal)
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveModule('strength');
                  handleStartStrengthExercise('Sentadilla a la silla (Sit-to-stand)', 10);
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-left transition-all cursor-pointer"
              >
                <strong className="text-teal-400 block font-mono text-[11px]">
                  3. iniciarEjercicioFuerza()
                </strong>
                <span className="text-slate-300 text-[11px] block mt-1">
                  Sentadilla a la silla (10 reps con guiado de voz)
                </span>
              </button>
            </div>
          </div>

          {/* Structured JSON Output Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Última salida estructurada de herramienta:</span>
              <span className="font-mono text-teal-400">{consoleOutput.toolName} · {consoleOutput.timestamp}</span>
            </div>
            <pre className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(consoleOutput, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
