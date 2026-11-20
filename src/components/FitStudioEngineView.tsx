import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Compass,
  Bike,
  Footprints,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Dumbbell,
  Activity,
  Flame,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Terminal,
  Zap,
  History,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Calendar,
  Trash2,
  BarChart3,
  MapPin,
  Filter
} from 'lucide-react';
import { fitStudioAudio } from '../services/fitStudioAudio';
import { ExerciseSvgInfographic } from './ExerciseSvgInfographic';
import { EXERCISE_INFOGRAPHICS } from '../data/exerciseInfographics';
import {
  subscribeOutdoorRoutes,
  saveOutdoorRouteToCloud,
  deleteOutdoorRouteFromCloud,
  subscribeEllipticalSessions,
  saveEllipticalSessionToCloud,
  deleteEllipticalSessionFromCloud,
  subscribeStrengthSessions,
  saveStrengthSessionToCloud,
  deleteStrengthSessionFromCloud
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
  fecha?: string;
  nombre_ruta?: string;
  timestamp: string;
  tipo: 'Caminata' | 'Bicicleta';
  distancia_km: number;
  tiempo_minutos: number;
  tiempo_formato?: string;
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
  fecha?: string;
  timestamp: string;
  tiempo_minutos: number;
  tiempo_formato?: string;
  nivel_resistencia: number; // 1-10
  rpm_promedio: number;
  calorias_estimadas: number;
  zona_intensidad: string;
  heart_rate_avg_bpm?: number;
  garmin_synced?: boolean;
}

const SPANISH_MONTHS: Record<string, string> = {
  ene: '01',
  feb: '02',
  mar: '03',
  abr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  sep: '09',
  sept: '09',
  oct: '10',
  nov: '11',
  dic: '12'
};

const SPANISH_MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function getTodayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function inferIsoDate(fecha?: string, timestamp?: string): string {
  if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }
  if (timestamp) {
    const normalized = timestamp.toLowerCase();
    const match = normalized.match(/(\d{1,2})\s+([a-z]{3,4})(?:[,\s]+(\d{4}))?/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = SPANISH_MONTHS[match[2]];
      const year = match[3] || String(new Date().getFullYear());
      if (month) {
        return `${year}-${month}-${day}`;
      }
    }
  }
  return getTodayIsoDate();
}

export function formatSpanishDateBadge(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const [y, m, d] = isoDate.split('-');
  const monthIdx = parseInt(m, 10) - 1;
  const monthLabel = SPANISH_MONTH_LABELS[monthIdx] || m;
  return `${parseInt(d, 10)} ${monthLabel} ${y}`;
}

export function paceToDecimalMinutes(paceStr: string, timeMin?: number, distKm?: number): number {
  if (timeMin && distKm && distKm > 0) {
    return timeMin / distKm;
  }
  if (!paceStr) return 0;
  const clean = paceStr.replace('min/km', '').trim();
  const parts = clean.split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    if (!isNaN(mins) && !isNaN(secs)) return mins + secs / 60;
  }
  return 0;
}

export function formatDecimalMinutesAsPace(decimalMin: number): string {
  if (!decimalMin || isNaN(decimalMin) || decimalMin <= 0) return '—';
  const totalSec = Math.round(decimalMin * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Helper to parse time in various formats: "1:15:23", "01:15:23", "75:23", "103", "103 min", "1:15"
export function parseTimeToMinutes(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  if (!raw) return 0;
  const clean = String(raw).trim().toLowerCase().replace('min', '').replace('m', '').trim();
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseFloat(p.trim().replace(',', '.')));
    if (parts.length === 3) {
      // hh:mm:ss -> e.g. 1:15:23 -> 1*60 + 15 + 23/60 = 75.3833 min
      const [h, m, s] = parts;
      if (isNaN(h) || isNaN(m) || isNaN(s)) return 0;
      return h * 60 + m + s / 60;
    }
    if (parts.length === 2) {
      const [p1, p2] = parts;
      if (isNaN(p1) || isNaN(p2)) return 0;
      if (p1 > 12) {
        // mm:ss -> e.g. 75:23 -> 75 min + 23 sec
        return p1 + p2 / 60;
      } else {
        // hh:mm -> e.g. 1:15 -> 1h 15m = 75 min
        return p1 * 60 + p2;
      }
    }
  }
  const parsed = parseFloat(clean.replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}

// Format minutes into Garmin watch display e.g. "1:15:23 min" or "0:45:00 min"
export function formatMinutesToGarminTime(totalMinutes: number): string {
  if (!totalMinutes || isNaN(totalMinutes) || totalMinutes <= 0) return '0:00:00 min';
  const totalSeconds = Math.round(totalMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  if (hours > 0) {
    return `${hours}:${pad(mins)}:${pad(secs)} min`;
  }
  return `0:${pad(mins)}:${pad(secs)} min`;
}

export interface StrengthSetLog {
  id: string;
  fecha: string;
  timestamp: string;
  nombre_ejercicio: string;
  series_completadas?: number;
  repeticiones_completadas: number;
  repeticiones_objetivo: number;
  cadencia_tempo?: string;
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
  const [routeDate, setRouteDate] = useState<string>(() => getTodayIsoDate());
  const [routeName, setRouteName] = useState<string>('');
  const [routeDistance, setRouteDistance] = useState('6.9');
  const [routeTime, setRouteTime] = useState('1:15:23');
  const [routeAltitude, setRouteAltitude] = useState('312');
  const [routeElevGain, setRouteElevGain] = useState('238');
  const [routeElevLoss, setRouteElevLoss] = useState('238');
  const [routeHeartRateAvg, setRouteHeartRateAvg] = useState('124');
  const [routeHeartRateMax, setRouteHeartRateMax] = useState('142');
  const [ellipticalHeartRateAvg, setEllipticalHeartRateAvg] = useState('128');
  const [isSyncingGarminDevice, setIsSyncingGarminDevice] = useState(false);

  // Comparison chart controls (Module 1)
  const [compareActivityFilter, setCompareActivityFilter] = useState<'Caminata' | 'Bicicleta' | 'Todas'>('Caminata');
  const [compareScope, setCompareScope] = useState<'similar' | 'all'>('similar');
  const [compareMetric, setCompareMetric] = useState<'velocidad' | 'ritmo'>('velocidad');
  const [compareReferenceKey, setCompareReferenceKey] = useState<string>('auto');
  const [hoveredOutdoorId, setHoveredOutdoorId] = useState<string | null>(null);
  const [confirmDeleteOutdoorId, setConfirmDeleteOutdoorId] = useState<string | null>(null);

  const deletedIdsRef = useRef<Set<string>>(new Set());

  const handleSyncGarminDevice = () => {
    setIsSyncingGarminDevice(true);
    setTimeout(() => {
      setIsSyncingGarminDevice(false);
      setRouteTime('1:15:23');
      setRouteHeartRateAvg(String(Math.floor(Math.random() * 10) + 120));
      setRouteHeartRateMax(String(Math.floor(Math.random() * 12) + 138));
      setEllipticalHeartRateAvg(String(Math.floor(Math.random() * 10) + 125));
      fitStudioAudio.speak('Reloj Garmin sincronizado. Tiempo 1:15:23 min, frecuencia cardíaca y datos actualizados.');
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
        fecha: '2026-11-11',
        nombre_ruta: 'Ruta Base Desnivel',
        timestamp: '11 nov 2026 09:30',
        tipo: 'Caminata',
        distancia_km: 6.9,
        tiempo_minutos: 75.38,
        tiempo_formato: '1:15:23 min',
        altitud_m: 312,
        desnivel_positivo_m: 238,
        desnivel_negativo_m: 238,
        ritmo_min_km: '10:55',
        velocidad_kmh: 5.49,
        esfuerzo_acumulado: 'Moderado Alto (+238m desnivel)'
      }
    ];
  });

  // Sorted route history (newest date first)
  const sortedRouteHistory = useMemo(() => {
    return [...routeHistory].sort((a, b) => {
      const da = inferIsoDate(a.fecha, a.timestamp);
      const db = inferIsoDate(b.fecha, b.timestamp);
      if (db !== da) return db.localeCompare(da);
      return b.id.localeCompare(a.id);
    });
  }, [routeHistory]);

  // Distinct named routes for quick chips & reference filter
  const savedRouteNames = useMemo(() => {
    const names = new Set<string>();
    routeHistory.forEach((r) => {
      if (r.nombre_ruta && r.nombre_ruta.trim()) {
        names.add(r.nombre_ruta.trim());
      }
    });
    return Array.from(names);
  }, [routeHistory]);

  // Calculate live outdoor metrics
  const liveOutdoorMetrics = useMemo(() => {
    const dist = parseFloat(String(routeDistance).replace(',', '.')) || 0;
    const time = parseTimeToMinutes(routeTime);
    const gain = parseFloat(String(routeElevGain).replace(',', '.')) || 0;

    const formattedTime = formatMinutesToGarminTime(time);

    if (dist <= 0 || time <= 0) {
      return {
        ritmo: '—',
        velocidadKmh: 0,
        esfuerzo: 'Pendiente de datos',
        tiempoFormateado: formattedTime,
        tiempoMinutos: time,
        distanciaKm: dist
      };
    }

    const paceDecimal = time / dist;
    const paceMin = Math.floor(paceDecimal);
    const paceSec = Math.round((paceDecimal - paceMin) * 60);
    const ritmoStr = `${paceMin}:${paceSec < 10 ? '0' : ''}${paceSec} min/km`;
    const velocidad = Math.round((dist / (time / 60)) * 100) / 100;

    let esfuerzo = 'Bajo (Llano)';
    if (gain > 200) esfuerzo = `Alto (+${Math.round(gain)}m desnivel pronunciado)`;
    else if (gain > 80) esfuerzo = `Moderado (+${Math.round(gain)}m desnivel medio)`;

    return {
      ritmo: ritmoStr,
      velocidadKmh: velocidad,
      esfuerzo,
      tiempoFormateado: formattedTime,
      tiempoMinutos: time,
      distanciaKm: dist
    };
  }, [routeDistance, routeTime, routeElevGain]);

  // Helper: Find comparable sessions for a given route (same route name OR similar km ±0.75 km within same activity type)
  const getOutdoorComparisonBaseline = useCallback(
    (target: { tipo: 'Caminata' | 'Bicicleta'; distancia_km: number; nombre_ruta?: string }, excludeId?: string) => {
      const sameType = routeHistory.filter((r) => r.tipo === target.tipo && r.id !== excludeId);
      const trimmedName = target.nombre_ruta?.trim().toLowerCase();

      if (trimmedName) {
        const sameName = sameType.filter((r) => r.nombre_ruta?.trim().toLowerCase() === trimmedName);
        if (sameName.length > 0) {
          const meanSpeed = sameName.reduce((sum, r) => sum + (r.velocidad_kmh || 0), 0) / sameName.length;
          return { pool: sameName, meanSpeed, label: `ruta "${target.nombre_ruta?.trim()}"` };
        }
      }

      const similarDist = sameType.filter((r) => Math.abs(r.distancia_km - target.distancia_km) <= 0.75);
      if (similarDist.length > 0) {
        const meanSpeed = similarDist.reduce((sum, r) => sum + (r.velocidad_kmh || 0), 0) / similarDist.length;
        return {
          pool: similarDist,
          meanSpeed,
          label: `${target.tipo.toLowerCase()}s ~${target.distancia_km.toFixed(1)} km`
        };
      }

      if (sameType.length > 0) {
        const meanSpeed = sameType.reduce((sum, r) => sum + (r.velocidad_kmh || 0), 0) / sameType.length;
        return { pool: sameType, meanSpeed, label: `todas tus ${target.tipo.toLowerCase()}s` };
      }

      return null;
    },
    [routeHistory]
  );

  // Live preview comparison for the form input
  const liveFormComparison = useMemo(() => {
    if (liveOutdoorMetrics.velocidadKmh <= 0 || liveOutdoorMetrics.distanciaKm <= 0) return null;
    const baseline = getOutdoorComparisonBaseline({
      tipo: routeType,
      distancia_km: liveOutdoorMetrics.distanciaKm,
      nombre_ruta: routeName
    });
    if (!baseline) return null;
    const diff = liveOutdoorMetrics.velocidadKmh - baseline.meanSpeed;
    const pct = baseline.meanSpeed > 0 ? (diff / baseline.meanSpeed) * 100 : 0;
    return {
      ...baseline,
      diff,
      pct,
      isFaster: diff >= 0.02,
      isSlower: diff <= -0.02
    };
  }, [liveOutdoorMetrics, routeType, routeName, getOutdoorComparisonBaseline]);

  // Reference options for the "Misma Ruta / Km Similares" chart filter
  const compareReferenceOptions = useMemo(() => {
    const typePool =
      compareActivityFilter === 'Todas'
        ? routeHistory
        : routeHistory.filter((r) => r.tipo === compareActivityFilter);

    const options: Array<{ key: string; label: string; kind: 'name' | 'dist'; value: string | number }> = [];
    const seenNames = new Set<string>();
    const seenBuckets = new Set<number>();

    typePool.forEach((r) => {
      const n = r.nombre_ruta?.trim();
      if (n && !seenNames.has(n.toLowerCase())) {
        seenNames.add(n.toLowerCase());
        options.push({ key: `name:${n}`, label: `Ruta: ${n}`, kind: 'name', value: n });
      }
      const bucket = Math.round(r.distancia_km * 2) / 2; // 0.5 km buckets
      if (!seenBuckets.has(bucket)) {
        seenBuckets.add(bucket);
        options.push({
          key: `dist:${bucket}`,
          label: `Distancia ~${bucket.toFixed(1)} km (±0.75 km)`,
          kind: 'dist',
          value: bucket
        });
      }
    });

    return options;
  }, [routeHistory, compareActivityFilter]);

  // Filtered & chronologically sorted sessions for the Outdoor Mean Comparison SVG chart
  const outdoorChartData = useMemo(() => {
    let pool =
      compareActivityFilter === 'Todas'
        ? [...routeHistory]
        : routeHistory.filter((r) => r.tipo === compareActivityFilter);

    let scopeLabel =
      compareActivityFilter === 'Todas' ? 'Todas las rutas' : `Todas las ${compareActivityFilter.toLowerCase()}s`;

    if (compareScope === 'similar' && pool.length > 0) {
      if (compareReferenceKey.startsWith('name:')) {
        const targetName = compareReferenceKey.slice(5).toLowerCase();
        pool = pool.filter((r) => r.nombre_ruta?.trim().toLowerCase() === targetName);
        scopeLabel = `Ruta "${compareReferenceKey.slice(5)}"`;
      } else if (compareReferenceKey.startsWith('dist:')) {
        const targetDist = parseFloat(compareReferenceKey.slice(5));
        if (!isNaN(targetDist)) {
          pool = pool.filter((r) => Math.abs(r.distancia_km - targetDist) <= 0.75);
          scopeLabel = `Distancia ~${targetDist.toFixed(1)} km (±0.75 km)`;
        }
      } else {
        // 'auto': match current form routeName or form distance, else latest session
        const formName = routeName.trim().toLowerCase();
        const formDist = parseFloat(String(routeDistance).replace(',', '.'));
        const nameMatches = formName ? pool.filter((r) => r.nombre_ruta?.trim().toLowerCase() === formName) : [];
        if (nameMatches.length > 0) {
          pool = nameMatches;
          scopeLabel = `Ruta "${routeName.trim()}"`;
        } else if (!isNaN(formDist) && formDist > 0) {
          const distMatches = pool.filter((r) => Math.abs(r.distancia_km - formDist) <= 0.75);
          if (distMatches.length > 0) {
            pool = distMatches;
            scopeLabel = `Distancia ~${formDist.toFixed(1)} km (±0.75 km)`;
          }
        }
      }
    }

    const chronological = [...pool].sort((a, b) => {
      const da = inferIsoDate(a.fecha, a.timestamp);
      const db = inferIsoDate(b.fecha, b.timestamp);
      if (da !== db) return da.localeCompare(db);
      return a.id.localeCompare(b.id);
    });

    const points = chronological.map((item) => {
      const isoDate = inferIsoDate(item.fecha, item.timestamp);
      const speed =
        item.velocidad_kmh && item.velocidad_kmh > 0
          ? item.velocidad_kmh
          : item.tiempo_minutos > 0
          ? Math.round((item.distancia_km / (item.tiempo_minutos / 60)) * 100) / 100
          : 0;
      const pace = paceToDecimalMinutes(item.ritmo_min_km, item.tiempo_minutos, item.distancia_km);
      const value = compareMetric === 'velocidad' ? speed : pace;
      return {
        item,
        isoDate,
        dateLabel: formatSpanishDateBadge(isoDate),
        speed,
        pace,
        value
      };
    });

    const validValues = points.map((p) => p.value).filter((v) => v > 0);
    const meanValue = validValues.length > 0 ? validValues.reduce((s, v) => s + v, 0) / validValues.length : 0;

    let bestPoint = points[0] || null;
    if (points.length > 0) {
      bestPoint = points.reduce((best, curr) => {
        if (compareMetric === 'velocidad') {
          return curr.value > best.value ? curr : best;
        }
        return curr.value > 0 && (best.value <= 0 || curr.value < best.value) ? curr : best;
      }, points[0]);
    }

    const latestPoint = points.length > 0 ? points[points.length - 1] : null;
    const latestDelta = latestPoint && meanValue > 0 ? latestPoint.value - meanValue : 0;

    return {
      points,
      meanValue,
      bestPoint,
      latestPoint,
      latestDelta,
      scopeLabel
    };
  }, [routeHistory, compareActivityFilter, compareScope, compareReferenceKey, compareMetric, routeName, routeDistance]);

  // Handle register outdoor route tool
  const handleRegisterOutdoorRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dist = parseFloat(String(routeDistance).replace(',', '.'));
    const time = parseTimeToMinutes(routeTime);
    const alt = parseFloat(String(routeAltitude).replace(',', '.')) || 0;
    const gain = parseFloat(String(routeElevGain).replace(',', '.')) || 0;
    const loss = parseFloat(String(routeElevLoss).replace(',', '.')) || 0;

    if (isNaN(dist) || isNaN(time) || dist <= 0 || time <= 0) return;

    const chosenFecha = routeDate || getTodayIsoDate();
    const formattedTime = formatMinutesToGarminTime(time);
    const trimmedName = routeName.trim();
    const nowTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newSession: OutdoorRouteSession = {
      id: `out-${Date.now()}`,
      fecha: chosenFecha,
      ...(trimmedName ? { nombre_ruta: trimmedName } : {}),
      timestamp: `${formatSpanishDateBadge(chosenFecha)} ${nowTime}`,
      tipo: routeType,
      distancia_km: dist,
      tiempo_minutos: Math.round(time * 100) / 100,
      tiempo_formato: formattedTime,
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
    setCompareActivityFilter(routeType);
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

  const handleDeleteOutdoorRoute = (id: string) => {
    deletedIdsRef.current.add(id);
    const updated = routeHistory.filter((r) => r.id !== id);
    setRouteHistory(updated);
    setConfirmDeleteOutdoorId(null);
    try {
      localStorage.setItem('fitstudio_outdoor_history', JSON.stringify(updated));
    } catch {}
    deleteOutdoorRouteFromCloud(id);
  };

  // ----------------------------------------------------
  // MODULE 2: ELLIPTICAL STATE & FORM
  // ----------------------------------------------------
  const [ellipticalDate, setEllipticalDate] = useState<string>(() => getTodayIsoDate());
  const [ellipticalTime, setEllipticalTime] = useState('45');
  const [ellipticalResistance, setEllipticalResistance] = useState('6');
  const [ellipticalRpm, setEllipticalRpm] = useState('65');
  const [ellipticalCompareMetric, setEllipticalCompareMetric] = useState<'kcal' | 'kcal_min'>('kcal');
  const [hoveredEllipticalId, setHoveredEllipticalId] = useState<string | null>(null);
  const [confirmDeleteEllipticalId, setConfirmDeleteEllipticalId] = useState<string | null>(null);

  const [ellipticalHistory, setEllipticalHistory] = useState<EllipticalSession[]>(() => {
    try {
      const saved = localStorage.getItem('fitstudio_elliptical_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'elp-baseline',
        fecha: '2026-11-10',
        timestamp: '10 nov 2026 18:00',
        tiempo_minutos: 45,
        nivel_resistencia: 6,
        rpm_promedio: 65,
        calorias_estimadas: Math.round(45 * (6 * 0.7 + 4)), // = 45 * 8.2 = 369 kcal
        zona_intensidad: 'Zona 2 Aeróbica (Bajo Impacto)'
      }
    ];
  });

  const sortedEllipticalHistory = useMemo(() => {
    return [...ellipticalHistory].sort((a, b) => {
      const da = inferIsoDate(a.fecha, a.timestamp);
      const db = inferIsoDate(b.fecha, b.timestamp);
      if (db !== da) return db.localeCompare(da);
      return b.id.localeCompare(a.id);
    });
  }, [ellipticalHistory]);

  const ellipticalChartData = useMemo(() => {
    const chronological = [...ellipticalHistory].sort((a, b) => {
      const da = inferIsoDate(a.fecha, a.timestamp);
      const db = inferIsoDate(b.fecha, b.timestamp);
      if (da !== db) return da.localeCompare(db);
      return a.id.localeCompare(b.id);
    });

    const points = chronological.map((item) => {
      const isoDate = inferIsoDate(item.fecha, item.timestamp);
      const kcalPerMin = item.tiempo_minutos > 0 ? Math.round((item.calorias_estimadas / item.tiempo_minutos) * 100) / 100 : 0;
      const value = ellipticalCompareMetric === 'kcal' ? item.calorias_estimadas : kcalPerMin;
      return {
        item,
        isoDate,
        dateLabel: formatSpanishDateBadge(isoDate),
        kcalPerMin,
        value
      };
    });

    const validValues = points.map((p) => p.value).filter((v) => v > 0);
    const meanValue = validValues.length > 0 ? validValues.reduce((s, v) => s + v, 0) / validValues.length : 0;
    const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0;

    return { points, meanValue, maxValue };
  }, [ellipticalHistory, ellipticalCompareMetric]);

  // ----------------------------------------------------
  // MODULE 3: STRENGTH TRAINER (18 EXERCISES WITH REAL VOICE, TEMPO & DATE HISTORY)
  // ----------------------------------------------------
  const [selectedExerciseName, setSelectedExerciseName] = useState('Sentadilla a la silla (Sit-to-stand)');
  const [strengthDate, setStrengthDate] = useState<string>(() => getTodayIsoDate());
  const [strengthSeries, setStrengthSeries] = useState<number>(3);
  const [targetReps, setTargetReps] = useState(10);
  const [tempoCadence, setTempoCadence] = useState<'3-1-1' | '4-1-2'>('3-1-1');
  const [confirmDeleteStrengthId, setConfirmDeleteStrengthId] = useState<string | null>(null);

  const [strengthHistory, setStrengthHistory] = useState<StrengthSetLog[]>(() => {
    try {
      const saved = localStorage.getItem('fitstudio_strength_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const sortedStrengthHistory = useMemo(() => {
    return [...strengthHistory].sort((a, b) => {
      const da = inferIsoDate(a.fecha, a.timestamp);
      const db = inferIsoDate(b.fecha, b.timestamp);
      if (db !== da) return db.localeCompare(da);
      return b.id.localeCompare(a.id);
    });
  }, [strengthHistory]);

  // Real-time Cloud Firestore Synchronization for Outdoor Routes, Elliptical & Strength Sessions
  useEffect(() => {
    const unsubOutdoor = subscribeOutdoorRoutes(undefined, (cloudRoutes) => {
      if (!cloudRoutes || cloudRoutes.length === 0) return;
      setRouteHistory((prev) => {
        const map = new Map<string, OutdoorRouteSession>();
        prev.forEach((r) => {
          if (!deletedIdsRef.current.has(r.id)) map.set(r.id, r);
        });
        cloudRoutes.forEach((r) => {
          if (!deletedIdsRef.current.has(r.id)) map.set(r.id, r);
        });
        const merged = Array.from(map.values());
        if (
          prev.length === merged.length &&
          prev.every(
            (item, idx) =>
              item.id === merged[idx]?.id &&
              item.fecha === merged[idx]?.fecha &&
              item.nombre_ruta === merged[idx]?.nombre_ruta &&
              item.velocidad_kmh === merged[idx]?.velocidad_kmh
          )
        ) {
          return prev;
        }
        try {
          localStorage.setItem('fitstudio_outdoor_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });

    const unsubElliptical = subscribeEllipticalSessions(undefined, (cloudSessions) => {
      if (!cloudSessions || cloudSessions.length === 0) return;
      setEllipticalHistory((prev) => {
        const map = new Map<string, EllipticalSession>();
        prev.forEach((s) => {
          if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
        });
        cloudSessions.forEach((s) => {
          if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
        });
        const merged = Array.from(map.values());
        if (
          prev.length === merged.length &&
          prev.every(
            (item, idx) =>
              item.id === merged[idx]?.id &&
              item.fecha === merged[idx]?.fecha &&
              item.calorias_estimadas === merged[idx]?.calorias_estimadas
          )
        ) {
          return prev;
        }
        try {
          localStorage.setItem('fitstudio_elliptical_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });

    const unsubStrength = subscribeStrengthSessions(undefined, (cloudStrength) => {
      if (!cloudStrength || cloudStrength.length === 0) return;
      setStrengthHistory((prev) => {
        const map = new Map<string, StrengthSetLog>();
        prev.forEach((s) => {
          if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
        });
        cloudStrength.forEach((s) => {
          if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
        });
        const merged = Array.from(map.values());
        if (
          prev.length === merged.length &&
          prev.every(
            (item, idx) =>
              item.id === merged[idx]?.id &&
              item.fecha === merged[idx]?.fecha &&
              item.repeticiones_completadas === merged[idx]?.repeticiones_completadas
          )
        ) {
          return prev;
        }
        try {
          localStorage.setItem('fitstudio_strength_history', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });

    return () => {
      unsubOutdoor();
      unsubElliptical();
      unsubStrength();
    };
  }, []);

  // Calculate calories strictly via formula: (Tiempo en min) * (Nivel Resistencia * 0.7 + 4)
  const liveEllipticalMetrics = useMemo(() => {
    const time = parseTimeToMinutes(ellipticalTime);
    const res = parseFloat(ellipticalResistance) || 1;
    const rpm = parseFloat(ellipticalRpm) || 0;

    const calories = Math.round(time * (res * 0.7 + 4));

    let zona = 'Zona 1 (Recuperación activa)';
    if (res >= 7 || rpm >= 75) zona = 'Zona 3 (Umbral aeróbico / Resistencia)';
    else if (res >= 4 || rpm >= 60) zona = 'Zona 2 (Aeróbica óptima / Quema de grasa)';

    return {
      calorias: calories,
      factorFormula: (res * 0.7 + 4).toFixed(2),
      zona,
      tiempoFormateado: formatMinutesToGarminTime(time)
    };
  }, [ellipticalTime, ellipticalResistance, ellipticalRpm]);

  const handleRegisterElliptical = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const time = parseTimeToMinutes(ellipticalTime);
    const res = parseInt(ellipticalResistance);
    const rpm = parseFloat(ellipticalRpm) || 60;

    if (isNaN(time) || isNaN(res) || time <= 0) return;

    const chosenFecha = ellipticalDate || getTodayIsoDate();
    const calories = Math.round(time * (res * 0.7 + 4));
    const nowTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newSession: EllipticalSession = {
      id: `elp-${Date.now()}`,
      fecha: chosenFecha,
      timestamp: `${formatSpanishDateBadge(chosenFecha)} ${nowTime}`,
      tiempo_minutos: Math.round(time * 100) / 100,
      tiempo_formato: formatMinutesToGarminTime(time),
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

  const handleDeleteElliptical = (id: string) => {
    deletedIdsRef.current.add(id);
    const updated = ellipticalHistory.filter((s) => s.id !== id);
    setEllipticalHistory(updated);
    setConfirmDeleteEllipticalId(null);
    try {
      localStorage.setItem('fitstudio_elliptical_history', JSON.stringify(updated));
    } catch {}
    deleteEllipticalSessionFromCloud(id);
  };

  // Exercise runner active state
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const [isExercisePaused, setIsExercisePaused] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'prep' | 'eccentric' | 'inflection' | 'concentric' | 'completed'>('prep');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(3);
  const [voiceSpokenPrompt, setVoiceSpokenPrompt] = useState('Listo para iniciar.');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completionLoggedRef = useRef(false);

  const logStrengthWorkout = useCallback(
    (exerciseName: string, reps: number, fechaStr: string, seriesCount: number, cadence: '3-1-1' | '4-1-2') => {
      const chosenFecha = fechaStr || getTodayIsoDate();
      const nowTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const secondsPerRep = cadence === '4-1-2' ? 7 : 5;
      const newLog: StrengthSetLog = {
        id: `str-${Date.now()}`,
        fecha: chosenFecha,
        timestamp: `${formatSpanishDateBadge(chosenFecha)} ${nowTime}`,
        nombre_ejercicio: exerciseName,
        series_completadas: seriesCount,
        repeticiones_completadas: reps,
        repeticiones_objetivo: reps,
        cadencia_tempo: cadence,
        tiempo_segundos: reps * secondsPerRep * seriesCount
      };
      setStrengthHistory((prev) => {
        const updated = [newLog, ...prev];
        try {
          localStorage.setItem('fitstudio_strength_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      saveStrengthSessionToCloud(newLog);
      setConsoleOutput({
        toolName: 'registrarFuerza',
        status: 'EXITO',
        data: newLog,
        timestamp: new Date().toLocaleTimeString()
      });
    },
    []
  );

  const handleDeleteStrengthSession = (id: string) => {
    deletedIdsRef.current.add(id);
    const updated = strengthHistory.filter((s) => s.id !== id);
    setStrengthHistory(updated);
    setConfirmDeleteStrengthId(null);
    try {
      localStorage.setItem('fitstudio_strength_history', JSON.stringify(updated));
    } catch {}
    deleteStrengthSessionFromCloud(id);
  };

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

  // Step-by-step phase transition handler
  const advanceExercisePhase = React.useCallback(() => {
    setCurrentPhase((prevPhase) => {
      if (prevPhase === 'prep') {
        const eccentricSeconds = tempoCadence === '4-1-2' ? 4 : 3;
        setPhaseSecondsLeft(eccentricSeconds);
        fitStudioAudio.speak('Baja lento');
        setVoiceSpokenPrompt(`Repetición ${currentRep + 1}: Baja en ${eccentricSeconds} segundos...`);
        return 'eccentric';
      }

      if (prevPhase === 'eccentric') {
        setPhaseSecondsLeft(1);
        fitStudioAudio.playBeep(440, 0.1);
        setVoiceSpokenPrompt('¡Pausa!');
        return 'inflection';
      }

      if (prevPhase === 'inflection') {
        const nextRep = currentRep + 1;
        setCurrentRep(nextRep);
        fitStudioAudio.playBeep(660, 0.18, 'triangle');

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
          setIsExerciseRunning(false);
          setPhaseSecondsLeft(0);
          return 'completed';
        }

        setPhaseSecondsLeft(1);
        return 'concentric';
      }

      if (prevPhase === 'concentric') {
        const eccentricSeconds = tempoCadence === '4-1-2' ? 4 : 3;
        setPhaseSecondsLeft(eccentricSeconds);
        return 'eccentric';
      }

      return prevPhase;
    });
  }, [currentRep, targetReps, tempoCadence]);

  // Robust 1-second interval ticker (guaranteed no infinite loops)
  useEffect(() => {
    if (!isExerciseRunning || isExercisePaused) return;

    timerRef.current = setInterval(() => {
      setPhaseSecondsLeft((prevSec) => {
        if (prevSec > 1) {
          if (currentPhase === 'eccentric') {
            fitStudioAudio.playBeep(330, 0.08);
          }
          return prevSec - 1;
        }

        setTimeout(() => {
          advanceExercisePhase();
        }, 0);
        return 0;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExerciseRunning, isExercisePaused, currentPhase, advanceExercisePhase]);

  // Auto-save completed voice-guided strength set with selected strengthDate (once per set)
  useEffect(() => {
    if (currentPhase === 'prep') {
      completionLoggedRef.current = false;
    } else if (currentPhase === 'completed' && !completionLoggedRef.current) {
      completionLoggedRef.current = true;
      logStrengthWorkout(selectedExerciseName, targetReps, strengthDate, 1, tempoCadence);
    }
  }, [currentPhase, selectedExerciseName, targetReps, strengthDate, tempoCadence, logStrengthWorkout]);

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

            {/* Fecha del Entrenamiento & Series */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-teal-50/60 p-3 rounded-2xl border border-teal-200/80">
              <div className="space-y-1">
                <label className="font-bold text-teal-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>Fecha del Entrenamiento:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={strengthDate}
                    onChange={(e) => setStrengthDate(e.target.value)}
                    disabled={isExerciseRunning}
                    className="flex-1 px-2.5 py-1.5 rounded-xl border border-teal-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    disabled={isExerciseRunning}
                    onClick={() => setStrengthDate(getTodayIsoDate())}
                    className="px-2 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-800 font-bold text-[11px] hover:bg-teal-100 cursor-pointer"
                  >
                    Hoy
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-teal-950 block">
                  Series a Registrar:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={isExerciseRunning}
                      onClick={() => setStrengthSeries(s)}
                      className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        strengthSeries === s
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-white border border-teal-200 hover:bg-teal-100 text-slate-700'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Selecciona uno de los 18 Ejercicios:
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

            {/* Start / Stop / Manual Save Controls */}
            <div className="pt-2 space-y-2">
              {!isExerciseRunning ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleStartStrengthExercise()}
                    className="w-full py-3.5 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Conteo Guiado con Voz (Tool)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      logStrengthWorkout(selectedExerciseName, targetReps, strengthDate, strengthSeries, tempoCadence)
                    }
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-teal-50 text-teal-900 border border-teal-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-teal-700" />
                    <span>
                      Registrar Entrenamiento en {formatSpanishDateBadge(strengthDate)} ({strengthSeries}×{targetReps} reps)
                    </span>
                  </button>
                </>
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

              {/* STRENGTH WORKOUT HISTORY BY DATE */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                    <History className="w-4 h-4 text-teal-700" />
                    <span>Histórico de Entrenamientos de Fuerza por Fecha</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {sortedStrengthHistory.length} registro(s)
                  </span>
                </div>

                {sortedStrengthHistory.length === 0 ? (
                  <p className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-dashed border-slate-300">
                    Aún no hay sesiones de fuerza guardadas. Completa una serie guiada por voz o pulsa{' '}
                    <strong>"Registrar Entrenamiento en Fecha"</strong> para guardar tus entrenamientos pasados o de hoy.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {sortedStrengthHistory.map((log) => {
                      const iso = inferIsoDate(log.fecha, log.timestamp);
                      const series = log.series_completadas || 1;
                      const totalReps = series * log.repeticiones_completadas;
                      return (
                        <div
                          key={log.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[10px]">
                                <Calendar className="w-3 h-3" />
                                {formatSpanishDateBadge(iso)}
                              </span>
                              <strong className="text-slate-900 truncate">{log.nombre_ejercicio}</strong>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-semibold text-teal-800">
                                {series}×{log.repeticiones_completadas} reps ({totalReps} total)
                              </span>
                              {log.cadencia_tempo && (
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                  Tempo {log.cadencia_tempo}
                                </span>
                              )}
                            </div>
                          </div>

                          {confirmDeleteStrengthId === log.id ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDeleteStrengthSession(log.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Sí, borrar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStrengthId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteStrengthId(log.id)}
                              title="Eliminar registro"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                    onClick={() => {
                      setRouteType('Caminata');
                      setCompareActivityFilter('Caminata');
                    }}
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
                    onClick={() => {
                      setRouteType('Bicicleta');
                      setCompareActivityFilter('Bicicleta');
                    }}
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

              {/* Date Picker & Optional Route Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/70">
                <div>
                  <label className="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Fecha de Actividad:</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={routeDate}
                      onChange={(e) => setRouteDate(e.target.value)}
                      className="flex-1 px-2.5 py-2 rounded-xl border border-emerald-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setRouteDate(getTodayIsoDate())}
                      className="px-2 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 cursor-pointer"
                    >
                      Hoy
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-800/80 block mt-0.5">
                    Va directo a ese día en el histórico
                  </span>
                </div>

                <div>
                  <label className="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nombre de Ruta (opcional):</span>
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="Ej. Ruta Río, Subida Ermita"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-emerald-800/80 block mt-0.5">
                    Para comparar siempre la misma ruta
                  </span>
                </div>

                {savedRouteNames.length > 0 && (
                  <div className="sm:col-span-2 flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-emerald-900">Rutas guardadas:</span>
                    {savedRouteNames.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setRouteName(name)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          routeName.trim().toLowerCase() === name.toLowerCase()
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Distance and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Distancia (km):
                  </label>
                  <input
                    type="text"
                    value={routeDistance}
                    onChange={(e) => setRouteDistance(e.target.value)}
                    placeholder="Ej. 6,74 o 6.9"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Admite decimales con coma o punto (ej. 6,74)
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      Tiempo (ej. 1:15:23 min):
                    </label>
                    {routeTime && (
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
                        ⏱️ {liveOutdoorMetrics.tiempoFormateado}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={routeTime}
                    onChange={(e) => setRouteTime(e.target.value)}
                    placeholder="Ej. 1:15:23 o 103"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Formato reloj Garmin (<strong>1:15:23 min</strong>) o minutos (<strong>103</strong>).
                  </span>
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
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                    Cálculo Automático Instantáneo:
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-200/60 px-2 py-0.5 rounded-full">
                    Garmin 735XT Calibrado
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Tiempo Garmin:</span>
                    <strong className="text-emerald-900 font-mono text-xs sm:text-sm">{liveOutdoorMetrics.tiempoFormateado}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Ritmo Medio:</span>
                    <strong className="text-slate-900 font-mono text-xs sm:text-sm">{liveOutdoorMetrics.ritmo}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Velocidad Media:</span>
                    <strong className="text-emerald-800 font-mono text-xs sm:text-sm">{liveOutdoorMetrics.velocidadKmh} km/h</strong>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-900 pt-0.5">
                  <strong>Esfuerzo acumulado:</strong> {liveOutdoorMetrics.esfuerzo}
                </div>

                {/* Live comparison vs historical mean */}
                {liveFormComparison && (
                  <div
                    className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                      liveFormComparison.isFaster
                        ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                        : liveFormComparison.isSlower
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {liveFormComparison.isFaster ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      )}
                      <span>
                        Media en <strong>{liveFormComparison.label}</strong>:{' '}
                        <strong className="font-mono">{liveFormComparison.meanSpeed.toFixed(2)} km/h</strong>
                      </span>
                    </div>
                    <strong className="font-mono shrink-0">
                      {liveFormComparison.diff >= 0 ? '+' : ''}
                      {liveFormComparison.diff.toFixed(2)} km/h (
                      {liveFormComparison.isFaster ? 'más rápida' : liveFormComparison.isSlower ? 'más lenta' : 'en la media'})
                    </strong>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm text-center"
              >
                Guardar Ruta en Fecha ({formatSpanishDateBadge(routeDate)})
              </button>
            </form>
          </div>

          {/* Right: Mean Comparison Chart + History */}
          <div className="lg:col-span-7 space-y-5">
            {/* COMPARISON CHART & MEAN LINE CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-700" />
                    <span>Comparativa de Rendimiento y Línea de Media</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Compara si hiciste la misma ruta o kilómetros similares más rápido o más lento que tu media histórica.
                  </p>
                </div>

                {/* Metric Toggle */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-[11px] font-bold shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => setCompareMetric('velocidad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      compareMetric === 'velocidad' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Velocidad (km/h)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareMetric('ritmo')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      compareMetric === 'ritmo' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ritmo (min/km)
                  </button>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 font-bold">
                  {(['Caminata', 'Bicicleta', 'Todas'] as const).map((typeOpt) => (
                    <button
                      key={typeOpt}
                      type="button"
                      onClick={() => {
                        setCompareActivityFilter(typeOpt);
                        setCompareReferenceKey('auto');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                        compareActivityFilter === typeOpt
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {typeOpt}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-xl bg-slate-100 p-1 font-bold">
                  <button
                    type="button"
                    onClick={() => setCompareScope('similar')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                      compareScope === 'similar' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    <span>Misma Ruta / Km Similares</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareScope('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      compareScope === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas del Tipo
                  </button>
                </div>

                {compareScope === 'similar' && compareReferenceOptions.length > 0 && (
                  <select
                    value={compareReferenceKey}
                    onChange={(e) => setCompareReferenceKey(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-[11px] font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="auto">Automático (según formulario)</option>
                    {compareReferenceOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-200">
                  <span className="text-[10px] font-bold uppercase text-teal-800 block">
                    Línea de Media ({outdoorChartData.points.length})
                  </span>
                  <strong className="text-sm sm:text-base font-black font-mono text-teal-950">
                    {outdoorChartData.meanValue > 0
                      ? compareMetric === 'velocidad'
                        ? `${outdoorChartData.meanValue.toFixed(2)} km/h`
                        : `${formatDecimalMinutesAsPace(outdoorChartData.meanValue)} min/km`
                      : '—'}
                  </strong>
                  <span className="text-[10px] text-teal-700 block truncate">{outdoorChartData.scopeLabel}</span>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Mejor Marca</span>
                  <strong className="text-sm sm:text-base font-black font-mono text-emerald-950">
                    {outdoorChartData.bestPoint && outdoorChartData.bestPoint.value > 0
                      ? compareMetric === 'velocidad'
                        ? `${outdoorChartData.bestPoint.value.toFixed(2)} km/h`
                        : `${formatDecimalMinutesAsPace(outdoorChartData.bestPoint.value)} min/km`
                      : '—'}
                  </strong>
                  <span className="text-[10px] text-emerald-700 block truncate">
                    {outdoorChartData.bestPoint ? outdoorChartData.bestPoint.dateLabel : 'Sin datos'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">Última vs Media</span>
                  {outdoorChartData.latestPoint && outdoorChartData.meanValue > 0 ? (
                    (() => {
                      const isBetter =
                        compareMetric === 'velocidad'
                          ? outdoorChartData.latestDelta >= 0
                          : outdoorChartData.latestDelta <= 0;
                      const formattedDelta =
                        compareMetric === 'velocidad'
                          ? `${outdoorChartData.latestDelta >= 0 ? '+' : ''}${outdoorChartData.latestDelta.toFixed(2)} km/h`
                          : `${outdoorChartData.latestDelta >= 0 ? '+' : '-'}${formatDecimalMinutesAsPace(
                              Math.abs(outdoorChartData.latestDelta)
                            )} min/km`;
                      return (
                        <>
                          <strong
                            className={`text-sm sm:text-base font-black font-mono ${
                              isBetter ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {formattedDelta}
                          </strong>
                          <span className="text-[10px] text-slate-500 block">
                            {isBetter ? 'Más rápida que la media' : 'Más lenta que la media'}
                          </span>
                        </>
                      );
                    })()
                  ) : (
                    <strong className="text-sm font-mono text-slate-400">—</strong>
                  )}
                </div>
              </div>

              {/* SVG LINE CHART WITH HORIZONTAL MEAN LINE */}
              {outdoorChartData.points.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
                  No hay sesiones para este filtro todavía. Cambia el filtro a <strong>"Todas del Tipo"</strong> o registra una nueva sesión.
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  {(() => {
                    const W = 620;
                    const H = 210;
                    const padL = 48;
                    const padR = 26;
                    const padT = 24;
                    const padB = 34;
                    const innerW = W - padL - padR;
                    const innerH = H - padT - padB;

                    const pts = outdoorChartData.points;
                    const mean = outdoorChartData.meanValue;
                    const rawValues = pts.map((p) => p.value);
                    const rawMin = Math.min(...rawValues, mean);
                    const rawMax = Math.max(...rawValues, mean);
                    const span = rawMax - rawMin;
                    const padVal = span < 0.2 ? (compareMetric === 'velocidad' ? 0.5 : 1) : span * 0.25;
                    const minY = Math.max(0, rawMin - padVal);
                    const maxY = rawMax + padVal;
                    const rangeY = maxY - minY || 1;

                    const getX = (idx: number) =>
                      pts.length <= 1 ? padL + innerW / 2 : padL + (idx / (pts.length - 1)) * innerW;
                    const getY = (val: number) => padT + innerH - ((val - minY) / rangeY) * innerH;

                    const meanY = getY(mean);
                    const polylinePoints = pts.map((p, idx) => `${getX(idx)},${getY(p.value)}`).join(' ');
                    const hoveredPoint = pts.find((p) => p.item.id === hoveredOutdoorId) || pts[pts.length - 1];

                    return (
                      <>
                        <div className="w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[440px]">
                            {/* Horizontal grid guides */}
                            {[0, 0.5, 1].map((t) => {
                              const val = minY + t * rangeY;
                              const y = getY(val);
                              return (
                                <g key={t}>
                                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                                  <text
                                    x={padL - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#64748b"
                                    fontFamily="monospace"
                                  >
                                    {compareMetric === 'velocidad' ? val.toFixed(1) : formatDecimalMinutesAsPace(val)}
                                  </text>
                                </g>
                              );
                            })}

                            {/* HORIZONTAL DASHED MEAN COMPARISON LINE */}
                            <line
                              x1={padL}
                              y1={meanY}
                              x2={W - padR}
                              y2={meanY}
                              stroke="#0f766e"
                              strokeWidth="2"
                              strokeDasharray="6 4"
                            />
                            <rect
                              x={W - padR - 118}
                              y={Math.max(4, meanY - 18)}
                              width="116"
                              height="15"
                              rx="4"
                              fill="#0f766e"
                            />
                            <text
                              x={W - padR - 60}
                              y={Math.max(14, meanY - 8)}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="bold"
                              fill="#ffffff"
                              fontFamily="monospace"
                            >
                              MEDIA: {compareMetric === 'velocidad' ? `${mean.toFixed(2)} km/h` : `${formatDecimalMinutesAsPace(mean)} /km`}
                            </text>

                            {/* Connecting line */}
                            {pts.length > 1 && (
                              <polyline
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={polylinePoints}
                              />
                            )}

                            {/* Data points */}
                            {pts.map((p, idx) => {
                              const cx = getX(idx);
                              const cy = getY(p.value);
                              const isFaster =
                                compareMetric === 'velocidad' ? p.value >= mean - 0.001 : p.value <= mean + 0.001;
                              const isActive = hoveredPoint?.item.id === p.item.id;
                              return (
                                <g
                                  key={p.item.id}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredOutdoorId(p.item.id)}
                                  onClick={() => setHoveredOutdoorId(p.item.id)}
                                >
                                  {isActive && (
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r="9"
                                      fill={isFaster ? 'rgba(16,185,129,0.22)' : 'rgba(245,158,11,0.22)'}
                                    />
                                  )}
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={isActive ? '5.5' : '4.5'}
                                    fill={isFaster ? '#10b981' : '#f59e0b'}
                                    stroke="#ffffff"
                                    strokeWidth="1.8"
                                  />
                                  <text
                                    x={cx}
                                    y={H - 10}
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fill="#475569"
                                    fontWeight={isActive ? 'bold' : 'normal'}
                                  >
                                    {p.dateLabel.replace(/\s+\d{4}$/, '')}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        {/* Legend + Active Point Detail */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <span className="w-4 h-0.5 border-t-2 border-dashed border-teal-700 inline-block" />
                              <span>Línea de Media</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                              <span>Más rápida que la media</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                              <span>Más lenta que la media</span>
                            </span>
                          </div>

                          {hoveredPoint && (
                            <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-800">
                              <strong>{hoveredPoint.dateLabel}</strong> · {hoveredPoint.item.distancia_km} km ·{' '}
                              <strong>{hoveredPoint.speed.toFixed(2)} km/h</strong> ({hoveredPoint.item.ritmo_min_km})
                            </div>
                          )}
                        </div>

                        {pts.length === 1 && (
                          <p className="text-[10px] text-slate-500 text-center">
                            Registra una segunda sesión similar para ver tu evolución frente a la línea de media.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* HISTORY LIST */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-700" />
                  Histórico de Rutas Registradas
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {sortedRouteHistory.length} sesión(es)
                </span>
              </div>

              <div className="space-y-3">
                {sortedRouteHistory.map((item) => {
                  const iso = inferIsoDate(item.fecha, item.timestamp);
                  const speed =
                    item.velocidad_kmh && item.velocidad_kmh > 0
                      ? item.velocidad_kmh
                      : item.tiempo_minutos > 0
                      ? Math.round((item.distancia_km / (item.tiempo_minutos / 60)) * 100) / 100
                      : 0;
                  const baseline = getOutdoorComparisonBaseline(
                    { tipo: item.tipo, distancia_km: item.distancia_km, nombre_ruta: item.nombre_ruta },
                    item.id
                  );
                  const diff = baseline ? speed - baseline.meanSpeed : 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200 transition-all space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                            {item.tipo === 'Caminata' ? <Footprints className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-slate-900 text-sm">{item.tipo}</strong>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px]">
                                <Calendar className="w-3 h-3 text-emerald-700" />
                                {formatSpanishDateBadge(iso)}
                              </span>
                              {item.nombre_ruta && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-900 font-bold text-[10px]">
                                  <MapPin className="w-3 h-3" />
                                  {item.nombre_ruta}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[10px] block mt-0.5">{item.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            {item.distancia_km} km
                          </span>

                          {confirmDeleteOutdoorId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteOutdoorRoute(item.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Borrar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteOutdoorId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteOutdoorId(item.id)}
                              title="Eliminar ruta"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Tiempo (Garmin)</span>
                          <strong className="text-slate-800 font-mono">
                            {item.tiempo_formato || formatMinutesToGarminTime(item.tiempo_minutos)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Velocidad</span>
                          <strong className="text-teal-800 font-mono">{speed.toFixed(2)} km/h</strong>
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

                      <div className="pt-1 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span><strong>Esfuerzo:</strong> {item.esfuerzo_acumulado}</span>
                          {baseline && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                diff >= 0.02
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : diff <= -0.02
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-slate-200 text-slate-800 border-slate-300'
                              }`}
                            >
                              {diff >= 0.02 ? '⚡' : diff <= -0.02 ? '🐢' : '⚖️'}{' '}
                              {diff >= 0 ? '+' : ''}
                              {diff.toFixed(2)} km/h vs media ({baseline.label})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.heart_rate_avg_bpm && (
                            <span className="text-rose-700 font-semibold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              ♥ {item.heart_rate_avg_bpm} bpm (Garmin)
                            </span>
                          )}
                          {item.altitud_m ? <span>Cota máx: {item.altitud_m}m</span> : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              {/* Fecha de la Sesión */}
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/80 space-y-1">
                <label className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  <span>Fecha de la Sesión:</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={ellipticalDate}
                    onChange={(e) => setEllipticalDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-blue-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setEllipticalDate(getTodayIsoDate())}
                    className="px-3 py-2 rounded-xl bg-white border border-blue-300 text-blue-800 font-bold text-[11px] hover:bg-blue-100 cursor-pointer"
                  >
                    Hoy
                  </button>
                </div>
                <span className="text-[10px] text-blue-800/80 block">
                  Asigna la sesión directamente a su día real aunque la registres más tarde.
                </span>
              </div>

              {/* Tiempo */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">
                    Tiempo Transcurrido (ej. 1:15:23 min):
                  </label>
                  {ellipticalTime && (
                    <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-300">
                      ⏱️ {liveEllipticalMetrics.tiempoFormateado}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={ellipticalTime}
                  onChange={(e) => setEllipticalTime(e.target.value)}
                  placeholder="Ej. 1:15:23 o 45"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Admite formato reloj Garmin (<strong>1:15:23 min</strong>) o minutos directos (<strong>45</strong>).
                </span>
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
                    Kcal = ({liveEllipticalMetrics.tiempoFormateado}) × ({ellipticalResistance} × 0.7 + 4) ={' '}
                    <strong>{liveEllipticalMetrics.calorias} kcal</strong>
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
                Guardar Sesión de Elíptica ({formatSpanishDateBadge(ellipticalDate)})
              </button>
            </form>
          </div>

          {/* Right: Elliptical Mean Comparison Chart & History */}
          <div className="lg:col-span-7 space-y-5">
            {/* COMPARISON CHART WITH MEAN LINE */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-700" />
                    <span>Comparativa Elíptica y Línea de Media</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Evolución por fecha frente a tu media histórica
                  </span>
                </div>

                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-[11px] font-bold self-start">
                  <button
                    type="button"
                    onClick={() => setEllipticalCompareMetric('kcal')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      ellipticalCompareMetric === 'kcal' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Kcal Totales
                  </button>
                  <button
                    type="button"
                    onClick={() => setEllipticalCompareMetric('kcal_min')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      ellipticalCompareMetric === 'kcal_min' ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Kcal / min
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                  <span className="text-[10px] font-bold uppercase text-blue-800 block">Media Histórica</span>
                  <strong className="text-sm sm:text-base font-black font-mono text-blue-950">
                    {ellipticalChartData.meanValue > 0
                      ? ellipticalCompareMetric === 'kcal'
                        ? `${Math.round(ellipticalChartData.meanValue)} kcal`
                        : `${ellipticalChartData.meanValue.toFixed(2)} kcal/m`
                      : '—'}
                  </strong>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Máximo</span>
                  <strong className="text-sm sm:text-base font-black font-mono text-emerald-950">
                    {ellipticalChartData.maxValue > 0
                      ? ellipticalCompareMetric === 'kcal'
                        ? `${Math.round(ellipticalChartData.maxValue)} kcal`
                        : `${ellipticalChartData.maxValue.toFixed(2)} kcal/m`
                      : '—'}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">Sesiones</span>
                  <strong className="text-sm sm:text-base font-black font-mono text-slate-900">
                    {ellipticalChartData.points.length}
                  </strong>
                </div>
              </div>

              {ellipticalChartData.points.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  {(() => {
                    const W = 620;
                    const H = 185;
                    const padL = 48;
                    const padR = 26;
                    const padT = 22;
                    const padB = 32;
                    const innerW = W - padL - padR;
                    const innerH = H - padT - padB;

                    const pts = ellipticalChartData.points;
                    const mean = ellipticalChartData.meanValue;
                    const vals = pts.map((p) => p.value);
                    const rawMin = Math.min(...vals, mean);
                    const rawMax = Math.max(...vals, mean);
                    const span = rawMax - rawMin;
                    const padVal = span < 1 ? (ellipticalCompareMetric === 'kcal' ? 30 : 1) : span * 0.25;
                    const minY = Math.max(0, rawMin - padVal);
                    const maxY = rawMax + padVal;
                    const rangeY = maxY - minY || 1;

                    const getX = (idx: number) =>
                      pts.length <= 1 ? padL + innerW / 2 : padL + (idx / (pts.length - 1)) * innerW;
                    const getY = (val: number) => padT + innerH - ((val - minY) / rangeY) * innerH;
                    const meanY = getY(mean);
                    const poly = pts.map((p, idx) => `${getX(idx)},${getY(p.value)}`).join(' ');
                    const hovered = pts.find((p) => p.item.id === hoveredEllipticalId) || pts[pts.length - 1];

                    return (
                      <>
                        <div className="w-full overflow-x-auto">
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[420px]">
                            {[0, 0.5, 1].map((t) => {
                              const val = minY + t * rangeY;
                              const y = getY(val);
                              return (
                                <g key={t}>
                                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                                  <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">
                                    {ellipticalCompareMetric === 'kcal' ? Math.round(val) : val.toFixed(1)}
                                  </text>
                                </g>
                              );
                            })}

                            <line
                              x1={padL}
                              y1={meanY}
                              x2={W - padR}
                              y2={meanY}
                              stroke="#1d4ed8"
                              strokeWidth="2"
                              strokeDasharray="6 4"
                            />
                            <rect x={W - padR - 118} y={Math.max(4, meanY - 18)} width="116" height="15" rx="4" fill="#1d4ed8" />
                            <text
                              x={W - padR - 60}
                              y={Math.max(14, meanY - 8)}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="bold"
                              fill="#ffffff"
                              fontFamily="monospace"
                            >
                              MEDIA: {ellipticalCompareMetric === 'kcal' ? `${Math.round(mean)} kcal` : `${mean.toFixed(1)} kcal/m`}
                            </text>

                            {pts.length > 1 && (
                              <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" points={poly} />
                            )}

                            {pts.map((p, idx) => {
                              const cx = getX(idx);
                              const cy = getY(p.value);
                              const aboveMean = p.value >= mean - 0.01;
                              const active = hovered?.item.id === p.item.id;
                              return (
                                <g
                                  key={p.item.id}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredEllipticalId(p.item.id)}
                                  onClick={() => setHoveredEllipticalId(p.item.id)}
                                >
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={active ? '5.5' : '4.5'}
                                    fill={aboveMean ? '#10b981' : '#f59e0b'}
                                    stroke="#ffffff"
                                    strokeWidth="1.8"
                                  />
                                  <text x={cx} y={H - 10} textAnchor="middle" fontSize="9.5" fill="#475569">
                                    {p.dateLabel.replace(/\s+\d{4}$/, '')}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        {hovered && (
                          <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-200/80">
                            <span>Línea azul discontinua = Media histórica</span>
                            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                              <strong>{hovered.dateLabel}</strong> · {hovered.item.calorias_estimadas} kcal ({hovered.kcalPerMin} kcal/min)
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ELLIPTICAL HISTORY LIST */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-700" />
                  Histórico de Sesiones en Elíptica
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {sortedEllipticalHistory.length} sesión(es)
                </span>
              </div>

              <div className="space-y-3">
                {sortedEllipticalHistory.map((item) => {
                  const iso = inferIsoDate(item.fecha, item.timestamp);
                  const meanKcal = ellipticalChartData.meanValue;
                  const diffKcal =
                    ellipticalCompareMetric === 'kcal'
                      ? item.calorias_estimadas - meanKcal
                      : (item.tiempo_minutos > 0 ? item.calorias_estimadas / item.tiempo_minutos : 0) - meanKcal;

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200 transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                            <Activity className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-slate-900 text-sm">Elíptica Bajo Impacto</strong>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px]">
                                <Calendar className="w-3 h-3 text-blue-700" />
                                {formatSpanishDateBadge(iso)}
                              </span>
                            </div>
                            <span className="text-slate-400 text-[10px] block mt-0.5">{item.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="font-extrabold text-amber-600 font-mono text-base block">
                              {item.calorias_estimadas} kcal
                            </span>
                            <span className="text-[10px] text-slate-400">gasto estimado</span>
                          </div>

                          {confirmDeleteEllipticalId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteElliptical(item.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Borrar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteEllipticalId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteEllipticalId(item.id)}
                              title="Eliminar sesión"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Tiempo (Garmin)</span>
                          <strong className="text-slate-800 font-mono">
                            {item.tiempo_formato || formatMinutesToGarminTime(item.tiempo_minutos)}
                          </strong>
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

                      <div className="text-[11px] text-slate-600 pt-0.5 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span><strong>Zona:</strong> {item.zona_intensidad}</span>
                          {ellipticalHistory.length > 1 && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                diffKcal >= 0
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              {diffKcal >= 0 ? '+' : ''}
                              {ellipticalCompareMetric === 'kcal' ? Math.round(diffKcal) : diffKcal.toFixed(1)}{' '}
                              {ellipticalCompareMetric === 'kcal' ? 'kcal' : 'kcal/m'} vs media
                            </span>
                          )}
                        </div>
                        {item.heart_rate_avg_bpm && (
                          <span className="text-rose-700 font-semibold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            ♥ {item.heart_rate_avg_bpm} bpm (Garmin)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
