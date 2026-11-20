import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  User,
  Printer,
  Share2,
  CalendarRange,
  Utensils,
  Activity,
  LineChart,
  Dumbbell,
  Zap,
  Home
} from 'lucide-react';
import { UserProfile, RuleValidationReport } from '../types/nutrition';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  userProfile: UserProfile;
  validationReport: RuleValidationReport;
  activeWeek: 1 | 2 | 3 | 4 | 5;
  onChangeWeek: (week: 1 | 2 | 3 | 4 | 5) => void;
  activeTab: 'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics';
  onChangeTab: (tab: 'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics') => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  currentUser: FirebaseUser | null;
  onPrint: () => void;
  onShare: () => void;
}

const WEEK_OPTIONS: Array<{ value: 1 | 2 | 3 | 4 | 5; label: string; title: string }> = [
  { value: 1, label: 'S1', title: 'Semana 1 (Días 1–7)' },
  { value: 2, label: 'S2', title: 'Semana 2 (Días 8–14)' },
  { value: 3, label: 'S3', title: 'Semana 3 (Días 15–21)' },
  { value: 4, label: 'S4', title: 'Semana 4 (Días 22–28)' },
  { value: 5, label: 'D29-30', title: 'Cierre del Mes (Días 29–30)' }
];

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  activeWeek,
  onChangeWeek,
  activeTab,
  onChangeTab,
  onOpenProfile,
  onOpenAuth,
  currentUser,
  onPrint,
  onShare
}) => {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top row: Brand & Profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Engine Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Nutri<span className="text-emerald-600">Vida</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Plan 30 Días Intercambiable & Entreno
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                5 Tomas · ~{userProfile.targetCalories || 1750} kcal · {userProfile.targetProteinMin}–{userProfile.targetProteinMax}g P · Factor ×{(userProfile.scaleFactor || 1).toFixed(2)} · Pescado Azul & Legumbres
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Login / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer border border-slate-800"
              title="Iniciar sesión con Google o cambiar de cuenta"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Usuario'}
                  className="w-4 h-4 rounded-full border border-teal-400"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-teal-400" />
              )}
              <span>{currentUser ? currentUser.displayName?.split(' ')[0] || 'Mi Cuenta' : 'Iniciar Sesión'}</span>
            </button>

            {/* 30-Day Week Selector (S1..S4 + D29-30) */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200/80 text-xs">
              <CalendarRange className="w-3 h-3 text-emerald-600 mx-1.5 hidden sm:inline shrink-0" />
              {WEEK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChangeWeek(opt.value)}
                  title={opt.title}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeWeek === opt.value
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Ver ficha clínica del usuario y ajustes de escalado (5 pasos)"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">
                {userProfile.onboardingCompleted && userProfile.name ? userProfile.name : 'Mi Perfil'}
              </span>
              <span className="text-slate-500">
                {userProfile.onboardingCompleted && userProfile.age > 0
                  ? `${userProfile.age}a · ${userProfile.currentWeightKg}kg`
                  : 'Configurar perfil'}
              </span>
              {Math.abs((userProfile.scaleFactor || 1) - 1) > 0.04 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ×{(userProfile.scaleFactor || 1).toFixed(2)}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={onPrint}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Imprimir / PDF"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onShare}
                className="p-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                title="Compartir"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Primary Navigation Tabs */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => onChangeTab('home')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-teal-400" />
            <span>Inicio / Presentación</span>
          </button>

          <button
            onClick={() => onChangeTab('fitstudio')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
              activeTab === 'fitstudio'
                ? 'bg-slate-950 text-white shadow-md ring-2 ring-teal-400'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-teal-400 fill-current" />
            <span>⚡ FitStudio Engine (Voz & Registro)</span>
          </button>

          <button
            onClick={() => onChangeTab('tracking')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#3e8679] text-white shadow-sm ring-2 ring-[#3e8679]/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Mi Ficha (Histórico)</span>
          </button>

          <button
            onClick={() => onChangeTab('nutrition')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'nutrition'
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Plan Nutricional 30 Días (5 Tomas)</span>
          </button>

          <button
            onClick={() => onChangeTab('training')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'training'
                ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-800/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-300" />
            <span>3. Plan Físico & Desnivel (+238m / -238m)</span>
          </button>

          <button
            onClick={() => onChangeTab('infographics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'infographics'
                ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-300" />
            <span>4. 🏋️ Infografías 12 Ejercicios de Fuerza</span>
          </button>
        </div>
      </div>
    </header>
  );
};
