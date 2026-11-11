import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from '../services/firebase';
import { LogIn, LogOut, ShieldCheck, UserCheck, Cloud, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged?: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onUserChanged }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Error al iniciar sesión con Google.');
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Error al cerrar sesión.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm p-1 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6 text-teal-700" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {currentUser ? 'Cuenta Conectada en Nube' : 'Iniciar Sesión / Cambiar Cuenta'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sincroniza tus mediciones, rutas GPS y entrenamientos en tiempo real desde tu móvil, tablet y ordenador.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current User Card */}
        {currentUser ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Usuario'}
                  className="w-11 h-11 rounded-full border-2 border-teal-500 object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <span className="font-extrabold text-slate-900 text-sm block truncate">
                  {currentUser.displayName || 'Usuario Registrado'}
                </span>
                <span className="text-xs text-slate-500 font-mono block truncate">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>Nube Firebase Activa</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded">
                Sincronizado
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-3 border border-slate-700"
            >
              {/* Google logo SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isLoading ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Al iniciar sesión, tus datos se guardarán de forma privada y segura en tu cuenta de Firebase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
