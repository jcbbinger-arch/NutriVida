import React, { useState } from 'react';
import { loginWithGoogle } from '../services/firebase';
import { Sparkles, ShieldCheck, Cloud, Zap, ArrowRight, Activity, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onGuestAccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGuestAccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Error al conectar con la cuenta de Google. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 my-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Brand & Logo Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20">
            <Sparkles className="w-9 h-9 fill-current" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Acceso Seguro Multidispositivo
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white pt-1">
              Nutri<span className="text-teal-400">Vida</span> & FitStudio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
              Plataforma de nutrición modular, entrenador por voz y seguimiento GPS / Garmin 735XT.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-bold text-white">Identificación de Usuario</h2>
            <p className="text-xs text-slate-400">
              Inicia sesión con tu cuenta de Google para acceder a tus entrenamientos y mediciones sincronizadas en la nube.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Action: Google Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 border border-slate-200 active:scale-[0.99]"
            >
              {/* Google Brand SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Conectando con Google...' : 'Iniciar Sesión con Google'}</span>
            </button>

            {/* Guest / Demo shortcut option */}
            {onGuestAccess && (
              <button
                type="button"
                onClick={onGuestAccess}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
              >
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Entrar en Modo Demostración (Invitado)</span>
              </button>
            )}
          </div>

          {/* Features bullet list */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Sincronización en tiempo real entre móvil, tablet y PC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Entrenador por voz en español y 18 ejercicios biomecánicos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Integración con datos del reloj Garmin Forerunner 735XT</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-500 text-center">
          NutriVida & FitStudio Engine · Alimentado por Firebase Firestore Nube
        </p>
      </div>
    </div>
  );
};
