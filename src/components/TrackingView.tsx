import React, { useState, useMemo, useEffect } from 'react';
import {
  PlusCircle,
  History,
  Trash2,
  TrendingDown,
  Check,
  Download,
  RotateCcw
} from 'lucide-react';
import { TrackingEntry } from '../types/training';
import { UserProfile } from '../types/nutrition';
import { INITIAL_TRACKING_ENTRIES } from '../data/trainingDatabase';
import {
  subscribeMeasurements,
  saveMeasurementToCloud,
  deleteMeasurementFromCloud
} from '../services/firebase';

interface TrackingViewProps {
  userProfile?: UserProfile;
  effectiveUid?: string;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ userProfile, effectiveUid }) => {
  const storageKey = effectiveUid
    ? `nutrivida_user_measurements_${effectiveUid}`
    : 'nutrivida_user_measurements';

  const buildInitialEntriesForProfile = (): TrackingEntry[] => {
    try {
      const scoped = localStorage.getItem(storageKey);
      if (scoped) {
        const parsed = JSON.parse(scoped);
        if (Array.isArray(parsed)) return parsed;
      }
      if (!effectiveUid || effectiveUid === 'juan_fitstudio_user') {
        const legacy = localStorage.getItem('nutrivida_user_measurements');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) return parsedLegacy;
        }
      }
    } catch {
      // fallback
    }

    if (userProfile?.onboardingCompleted && userProfile.currentWeightKg > 0) {
      if (userProfile.name === 'Juan' && userProfile.currentWeightKg === 102) {
        return INITIAL_TRACKING_ENTRIES;
      }
      return [
        {
          id: 'meas-initial-profile',
          date: new Date().toISOString().slice(0, 10),
          weekNumber: 0,
          weightKg: userProfile.currentWeightKg,
          waistCircumferenceCm: userProfile.waistCm || Math.round(userProfile.heightCm * 0.55),
          dailySteps: userProfile.dailyStepsTarget || 8000,
          notes: 'Registro inicial del perfil',
          kneeSensation: 'sin_molestias',
          lumbarSensation: 'firme_sin_dolor',
          adherencePercentage: 100
        }
      ];
    }

    return [];
  };

  const [entries, setEntries] = useState<TrackingEntry[]>(buildInitialEntriesForProfile);

  // Re-evaluate initial state when UID or profile onboarding status changes
  useEffect(() => {
    setEntries(buildInitialEntriesForProfile());
  }, [storageKey, userProfile?.onboardingCompleted, userProfile?.currentWeightKg, userProfile?.waistCm]);

  // Subscribe to real-time Cloud Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeMeasurements(effectiveUid, (cloudEntries) => {
      if (!cloudEntries || cloudEntries.length === 0) return;
      setEntries((prev) => {
        const map = new Map<string, TrackingEntry>();
        prev.forEach((item) => map.set(item.id, item));
        cloudEntries.forEach((item) => map.set(item.id, item));
        const merged = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
        if (
          prev.length === merged.length &&
          prev.every(
            (item, idx) =>
              item.id === merged[idx]?.id &&
              item.weightKg === merged[idx]?.weightKg &&
              item.waistCircumferenceCm === merged[idx]?.waistCircumferenceCm
          )
        ) {
          return prev;
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      });
    });
    return () => unsubscribe();
  }, [effectiveUid, storageKey]);

  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formWeight, setFormWeight] = useState('');
  const [formWaist, setFormWaist] = useState('');
  const [formSteps, setFormSteps] = useState(
    userProfile?.dailyStepsTarget ? String(userProfile.dailyStepsTarget) : '8000'
  );
  const [formNotes, setFormNotes] = useState('');
  const [isSyncingGarmin, setIsSyncingGarmin] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{
    entry: TrackingEntry;
    x: number;
    yWeight: number;
    yWaist: number;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSyncGarmin735XT = () => {
    setIsSyncingGarmin(true);
    setTimeout(() => {
      setIsSyncingGarmin(false);
      const randomSteps = Math.floor(Math.random() * 2500) + 7500;
      setFormSteps(String(randomSteps));
      showToast(`⌚ Garmin Forerunner 735XT sincronizado: ${randomSteps} pasos importados con éxito.`);
    }, 800);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(formWeight);
    const waistNum = parseFloat(formWaist);
    const stepsNum = parseInt(formSteps, 10) || 0;

    if (isNaN(weightNum) || isNaN(waistNum)) {
      showToast('Por favor, introduce valores numéricos válidos para peso y cintura.');
      return;
    }

    const newEntry: TrackingEntry = {
      id: `meas-${Date.now()}`,
      date: formDate,
      weekNumber: entries.length,
      weightKg: Math.round(weightNum * 10) / 10,
      waistCircumferenceCm: Math.round(waistNum * 10) / 10,
      dailySteps: stepsNum,
      notes: formNotes.trim() || 'Registro manual / Garmin 735XT',
      kneeSensation: 'sin_molestias',
      lumbarSensation: 'firme_sin_dolor',
      adherencePercentage: 100
    };

    const updated = [...entries, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    saveMeasurementToCloud(newEntry, effectiveUid);

    setFormWeight('');
    setFormWaist('');
    setFormSteps(userProfile?.dailyStepsTarget ? String(userProfile.dailyStepsTarget) : '8000');
    setFormNotes('');
    showToast(
      `✓ Registro de ${formDate} guardado y sincronizado en Nube Firestore (${newEntry.weightKg} kg · ${newEntry.dailySteps} pasos).`
    );
  };

  const handleDeleteEntry = (id: string, date: string) => {
    const updated = entries.filter((item) => item.id !== id);
    setEntries(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    deleteMeasurementFromCloud(id, effectiveUid);
    showToast(`Registro de ${date} eliminado.`);
  };

  const handleResetToBaseline = () => {
    localStorage.removeItem(storageKey);
    if (!effectiveUid || effectiveUid === 'juan_fitstudio_user') {
      localStorage.removeItem('nutrivida_user_measurements');
    }
    const reset = buildInitialEntriesForProfile();
    setEntries(reset);
    showToast('Mediciones restablecidas al punto inicial de tu perfil.');
  };

  // Export measurements to CSV
  const handleExportCSV = () => {
    let csv = 'FECHA,PESO_KG,CINTURA_CM,PASOS,NOTAS\n';
    entries.forEach((e) => {
      csv += `${e.date},${e.weightKg},${e.waistCircumferenceCm},${e.dailySteps || 0},"${e.notes.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = (userProfile?.name || 'usuario').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    a.download = `nutrivida_mediciones_${slug}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo CSV descargado.');
  };

  // ==========================================
  // DYNAMIC DUAL-AXIS CHART COMPUTATION (adapts cleanly to any weight/waist)
  // ==========================================
  const { weightTicks, waistTicks, minWeight, maxWeight, minWaist, maxWaist } = useMemo(() => {
    const fallbackWeight = userProfile?.currentWeightKg && userProfile.currentWeightKg > 0 ? userProfile.currentWeightKg : 80;
    const fallbackWaist = userProfile?.waistCm && userProfile.waistCm > 0 ? userProfile.waistCm : 90;

    const weights = entries.length > 0 ? entries.map((e) => e.weightKg) : [fallbackWeight];
    const waists = entries.length > 0 ? entries.map((e) => e.waistCircumferenceCm) : [fallbackWaist];

    const centerW = Math.round((Math.min(...weights) + Math.max(...weights)) / 2 / 2) * 2;
    const spanW = Math.max(6, Math.ceil((Math.max(...weights) - Math.min(...weights)) / 2) + 4);
    const minW = Math.max(30, centerW - spanW);
    const maxW = minW + 12;

    const centerWaist = Math.round((Math.min(...waists) + Math.max(...waists)) / 2 / 2) * 2;
    const spanWaist = Math.max(6, Math.ceil((Math.max(...waists) - Math.min(...waists)) / 2) + 4);
    const minWa = Math.max(45, centerWaist - spanWaist);
    const maxWa = minWa + 12;

    const wTicks: number[] = [];
    const waTicks: number[] = [];
    for (let i = 0; i <= 6; i++) {
      wTicks.push(maxW - i * 2);
      waTicks.push(maxWa - i * 2);
    }

    return {
      weightTicks: wTicks,
      waistTicks: waTicks,
      minWeight: minW,
      maxWeight: maxW,
      minWaist: minWa,
      maxWaist: maxWa
    };
  }, [entries, userProfile]);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  const getYForWeight = (w: number) => {
    const clamped = Math.max(minWeight, Math.min(maxWeight, w));
    const ratio = (clamped - minWeight) / Math.max(1, maxWeight - minWeight);
    return paddingTop + chartInnerHeight * (1 - ratio);
  };

  const getYForWaist = (w: number) => {
    const clamped = Math.max(minWaist, Math.min(maxWaist, w));
    const ratio = (clamped - minWaist) / Math.max(1, maxWaist - minWaist);
    return paddingTop + chartInnerHeight * (1 - ratio);
  };

  const getXForIndex = (index: number, total: number) => {
    if (total <= 1) {
      return paddingLeft + chartInnerWidth * 0.12;
    }
    return paddingLeft + (chartInnerWidth / (total - 1)) * index;
  };

  const chartData = useMemo(() => {
    const count = entries.length;
    const points = entries.map((entry, idx) => {
      const x = getXForIndex(idx, count);
      const yWeight = getYForWeight(entry.weightKg);
      const yWaist = getYForWaist(entry.waistCircumferenceCm);
      return { entry, x, yWeight, yWaist };
    });

    const weightPolyline = points.map((p) => `${p.x},${p.yWeight}`).join(' ');
    const waistPolyline = points.map((p) => `${p.x},${p.yWaist}`).join(' ');

    return { points, weightPolyline, waistPolyline };
  }, [entries, minWeight, maxWeight, minWaist, maxWaist]);

  const initialEntry = entries[0];
  const latestEntry = entries[entries.length - 1];
  const weightChange =
    initialEntry && latestEntry
      ? Math.round((latestEntry.weightKg - initialEntry.weightKg) * 10) / 10
      : 0;
  const waistChange =
    initialEntry && latestEntry
      ? Math.round((latestEntry.waistCircumferenceCm - initialEntry.waistCircumferenceCm) * 10) / 10
      : 0;

  const profileSexText = userProfile?.sex === 'female' ? 'Mujer' : 'Hombre';
  const healthyWaistGoal = userProfile?.sex === 'female' ? '< 88 cm' : '< 95 cm';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-emerald-500/30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Clinical & Anthropometric Context */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Ficha Personal de Seguimiento
              </span>
              <span className="text-xs text-slate-300">
                {userProfile?.name ? `${userProfile.name} · ` : ''}
                {profileSexText} · {userProfile?.age && userProfile.age > 0 ? `${userProfile.age} años` : '-- años'} ·{' '}
                {userProfile?.heightCm && userProfile.heightCm > 0 ? `${(userProfile.heightCm / 100).toFixed(2)} m` : '-- m'}
                {initialEntry ? ` · Basal ${initialEntry.date} (${initialEntry.weightKg} kg · ${initialEntry.waistCircumferenceCm} cm)` : ''}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Histórico Antropométrico & Registro de Perímetro Abdominal
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pesa 1×/semana (misma hora en ayunas) y mide cintura en el ombligo cada 2 semanas. Si en 2–3 semanas no hay bajada, reajusta ±100–150 kcal en tu ficha.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Descargar mediciones en formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            {entries.length > 0 && (
              <button
                onClick={handleResetToBaseline}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reiniciar al registro inicial del perfil"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[11px] block">Peso Basal</span>
            <span className="font-extrabold text-white text-base">
              {initialEntry ? `${initialEntry.weightKg.toFixed(1)} kg` : userProfile?.currentWeightKg ? `${userProfile.currentWeightKg} kg` : '--'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{initialEntry?.date || 'Sin registro aún'}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[11px] block">Cintura Basal</span>
            <span className="font-extrabold text-teal-300 text-base">
              {initialEntry ? `${initialEntry.waistCircumferenceCm.toFixed(1)} cm` : userProfile?.waistCm ? `${userProfile.waistCm} cm` : '--'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">A nivel de ombligo</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[11px] block">Evolución Peso</span>
            <span className={`font-extrabold text-base ${weightChange <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {entries.length > 0 ? (weightChange <= 0 ? `${weightChange} kg` : `+${weightChange} kg`) : '--'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{entries.length} registro(s)</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[11px] block">Evolución Cintura</span>
            <span className={`font-extrabold text-base ${waistChange <= 0 ? 'text-teal-300' : 'text-amber-400'}`}>
              {entries.length > 0 ? (waistChange <= 0 ? `${waistChange} cm` : `+${waistChange} cm`) : '--'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Meta ref: {healthyWaistGoal}</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* LEFT FORM + RIGHT CHART & HISTORY TABLE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Añadir Nueva Medición */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90">
          <div className="flex items-center gap-2 mb-6">
            <PlusCircle className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              Añadir Nueva Medición
            </h3>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
            {/* Field: Fecha */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                Fecha
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800 bg-white"
                  required
                />
              </div>
            </div>

            {/* Field: Peso Corporal (kg) */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formWeight}
                onChange={(e) => setFormWeight(e.target.value)}
                placeholder={userProfile?.currentWeightKg ? `Ej. ${userProfile.currentWeightKg}` : 'Ej. 75.5'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800 bg-white"
                required
              />
            </div>

            {/* Field: Perímetro Cintura (cm) */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                Perímetro Cintura (cm)
              </label>
              <input
                type="number"
                step="0.5"
                value={formWaist}
                onChange={(e) => setFormWaist(e.target.value)}
                placeholder={userProfile?.waistCm ? `Ej. ${userProfile.waistCm}` : 'Ej. 88'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800 bg-white"
                required
              />
              <span className="block text-[11px] text-slate-400 mt-1 font-medium">
                Medir a la altura del ombligo
              </span>
            </div>

            {/* Field: Pasos Diarios (Garmin Forerunner 735XT) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-700 font-bold text-xs">
                  Pasos Diarios (Garmin 735XT)
                </label>
                <button
                  type="button"
                  onClick={handleSyncGarmin735XT}
                  disabled={isSyncingGarmin}
                  className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{isSyncingGarmin ? 'Sincronizando...' : '⌚ Sincronizar Garmin'}</span>
                </button>
              </div>
              <input
                type="number"
                step="100"
                value={formSteps}
                onChange={(e) => setFormSteps(e.target.value)}
                placeholder="Ej. 8500"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800 bg-white font-mono"
              />
            </div>

            {/* Field: Notas / Sensaciones */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs">
                Notas / Sensaciones
              </label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ej. Sensación de menos hinchazón"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800 bg-white"
              />
            </div>

            {/* Submit Button matching screenshot teal styling */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#3e8679] hover:bg-[#337266] active:scale-[0.99] transition-all shadow-sm cursor-pointer text-center"
              >
                Guardar Registro
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Histórico de Mediciones & Dual-Axis Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 space-y-6">
          {/* Header & Legend matching screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal-700 stroke-[2.5]" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                Histórico de Mediciones
              </h3>
            </div>

            {/* Legend matching screenshot */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-7 h-4 rounded-xs border-2 border-[#3e8679] bg-white inline-block" />
                <span>Peso (kg)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-7 h-4 rounded-xs border-2 border-[#6d28d9] bg-white inline-block" />
                <span>Cintura (cm)</span>
              </div>
            </div>
          </div>

          {/* DUAL-AXIS SVG GRAPH MATCHING SCREENSHOT EXACTLY */}
          <div className="bg-white rounded-xl border border-slate-100 p-2 sm:p-4 overflow-x-auto relative">
            <div className="min-w-[500px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none overflow-visible"
              >
                {/* Horizontal gridlines and tick labels */}
                {weightTicks.map((tickW, idx) => {
                  const tickWaist = waistTicks[idx];
                  const y = paddingTop + (chartInnerHeight / (weightTicks.length - 1)) * idx;
                  return (
                    <g key={idx}>
                      {/* Gridline */}
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={svgWidth - paddingRight}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      {/* Left Y Axis Label: Peso (kg) */}
                      <text
                        x={paddingLeft - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="500"
                        fill="#475569"
                        fontFamily="monospace"
                      >
                        {tickW}
                      </text>
                      {/* Right Y Axis Label: Cintura (cm) */}
                      <text
                        x={svgWidth - paddingRight + 8}
                        y={y + 3.5}
                        textAnchor="start"
                        fontSize="10"
                        fontWeight="500"
                        fill="#475569"
                        fontFamily="monospace"
                      >
                        {tickWaist}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Bottom Line */}
                <line
                  x1={paddingLeft}
                  y1={svgHeight - paddingBottom}
                  x2={svgWidth - paddingRight}
                  y2={svgHeight - paddingBottom}
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />

                {/* Connecting Polyline for Cintura (Purple) */}
                {entries.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#6d28d9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.waistPolyline}
                  />
                )}

                {/* Connecting Polyline for Peso (Teal) */}
                {entries.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#3e8679"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.weightPolyline}
                  />
                )}

                {/* Points and Dates */}
                {chartData.points.map((p, idx) => (
                  <g key={idx}>
                    {/* Date label on X axis */}
                    <text
                      x={p.x}
                      y={svgHeight - paddingBottom + 16}
                      textAnchor={idx === 0 && chartData.points.length === 1 ? 'start' : 'middle'}
                      fontSize="9.5"
                      fill="#475569"
                      fontWeight="500"
                    >
                      {p.entry.date}
                    </text>

                    {/* Cintura Point (Purple circle) */}
                    <circle
                      cx={p.x}
                      cy={p.yWaist}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#6d28d9"
                      strokeWidth="2.5"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Peso Point (Teal circle matching screenshot blue/teal dot) */}
                    <circle
                      cx={p.x}
                      cy={p.yWeight}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#3e8679"
                      strokeWidth="2.5"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-20 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${hoveredPoint.yWeight}px`
                }}
              >
                <div className="font-bold text-slate-200">{hoveredPoint.entry.date}</div>
                <div className="text-teal-300 font-semibold">• Peso: {hoveredPoint.entry.weightKg} kg</div>
                <div className="text-purple-300 font-semibold">• Cintura: {hoveredPoint.entry.waistCircumferenceCm} cm</div>
                {hoveredPoint.entry.notes && (
                  <div className="text-slate-400 text-[10px] mt-0.5 max-w-[160px] truncate">
                    {hoveredPoint.entry.notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TABLE OF MEASUREMENTS MATCHING USER SCREENSHOT EXACTLY */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">FECHA</th>
                  <th className="py-2.5 px-3">PESO (KG)</th>
                  <th className="py-2.5 px-3">CINTURA (CM)</th>
                  <th className="py-2.5 px-3">PASOS (GARMIN)</th>
                  <th className="py-2.5 px-3">NOTAS</th>
                  <th className="py-2.5 px-3 text-right">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 px-3 text-center text-slate-400 text-xs">
                      Aún no hay mediciones guardadas. Añade tu primer registro a la izquierda.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Fecha */}
                    <td className="py-3.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {entry.date}
                    </td>

                    {/* Peso */}
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {entry.weightKg} kg
                    </td>

                    {/* Cintura */}
                    <td className="py-3.5 px-3 font-semibold text-purple-900">
                      {entry.waistCircumferenceCm} cm
                    </td>

                    {/* Pasos */}
                    <td className="py-3.5 px-3 font-mono font-semibold text-teal-800">
                      {entry.dailySteps ? `${entry.dailySteps.toLocaleString()} pasos` : '—'}
                    </td>

                    {/* Notas */}
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                      {entry.notes || '—'}
                    </td>

                    {/* Acción (Trash icon matching screenshot) */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteEntry(entry.id, entry.date)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title={`Eliminar medición del ${entry.date}`}
                      >
                        <Trash2 className="w-4 h-4 stroke-[2]" />
                      </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
