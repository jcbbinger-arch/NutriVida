import React from 'react';
import {
  Zap,
  Utensils,
  Activity,
  LineChart,
  Dumbbell,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Cloud,
  Watch,
  Heart,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface HomeLandingViewProps {
  onNavigateTab: (tab: 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics') => void;
  onOpenAuth: () => void;
  currentUser: FirebaseUser | null;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onNavigateTab,
  onOpenAuth,
  currentUser
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. CLEAN HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full font-extrabold uppercase tracking-wider bg-teal-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              NutriVida & FitStudio Engine
            </span>
            <span className="px-3 py-1 rounded-full font-medium bg-slate-800/80 text-teal-300 border border-slate-700/80 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-teal-400" />
              Sincronizado en Nube (Móvil · Tablet · PC)
            </span>
            <span className="px-3 py-1 rounded-full font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80">
              Varón 53 años (102 kg) · Protección Articular
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Tu Asistente Inteligente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Nutrición & Entrenamiento</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Plataforma diseñada bajo principios biomecánicos universales: cero impacto en rodillas y lumbares,
              entrenador de fuerza guiado por voz con tempo controlado, planes nutricionales de 5 tomas con escandallo y
              seguimiento con tu reloj <strong>Garmin Forerunner 735XT</strong>.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('fitstudio')}
              className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Abrir Entrenador Guiado por Voz</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => onNavigateTab('nutrition')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>Ver Plan Nutricional 2 Semanas</span>
            </button>

            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Conectar Cuenta Google</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. THE 4 CORE MODULE CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ¿Qué puedes hacer en esta aplicación?
            </h2>
            <p className="text-xs text-slate-500">
              Accede directamente a los 4 módulos principales de tu entrenamiento y nutrición
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: FitStudio Engine */}
          <div
            onClick={() => onNavigateTab('fitstudio')}
            className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:border-teal-500/50"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-teal-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Módulo 1 · Voz & Tempo
                </span>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  FitStudio Engine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Entrenador con conteo de tempo por voz en vivo (3s bajada/1s subida), infografías SVG paso a paso y 18 ejercicios (12 base + 6 con cojín de equilibrio).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Iniciar Sesión de Fuerza</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Outdoor Route & Elliptical */}
          <div
            onClick={() => onNavigateTab('fitstudio')}
            className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:border-emerald-500/50"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Módulo 2 · Cardio & Garmin
                </span>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Rutas GPS & Elíptica
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Registro de caminatas con desnivel (+238m / -238m), GPS en vivo, gasto calórico exacto en elíptica y sincronización de frecuencia cardíaca (Garmin 735XT).
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Registrar Ruta o Elíptica</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Nutrition Plan */}
          <div
            onClick={() => onNavigateTab('nutrition')}
            className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:border-slate-800/50"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Utensils className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Módulo 3 · Nutrición 2 Semanas
                </span>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-slate-800 transition-colors">
                  Plan Nutricional Modular
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  5 tomas diarias programadas, balance de macronutrientes (135-155g proteicos), escandallo en crudo, rotación de platos y lista de compra automática.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Ver Menú Semanal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Antropometric Tracking */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 hover:border-[#3e8679]/50"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Módulo 4 · Histórico & Nube
                </span>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
                  Ficha Antropométrica
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gráfico dual-axis para peso corporal, perímetro de cintura a nivel de ombligo y pasos diarios importados desde el reloj Garmin 735XT.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800">
              <span>Ver Histórico de Avance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY SPECIFICATIONS & GARMIN SYNC HIGHLIGHT */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl space-y-2 border border-slate-700 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-sm text-white">Protección Articular</h4>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Fuerza excéntrica adaptada para reducir el impacto rotuliano en un 25% con bastones de marcha nórdica e infografías SVG biomecánicas.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl space-y-2 border border-slate-700 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Watch className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-sm text-white">Garmin Forerunner 735XT</h4>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Integración de pasos diarios, frecuencia cardíaca media/máxima (bpm) y datos de caminatas sincronizados en tiempo real.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl space-y-2 border border-slate-700 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Cloud className="w-4 h-4" />
            </span>
            <h4 className="font-extrabold text-sm text-white">Nube Firebase Firestore</h4>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Accede desde cualquier dispositivo (móvil, tablet o PC) manteniendo tu histórico guardado y actualizado al instante.
          </p>
        </div>
      </section>
    </div>
  );
};
