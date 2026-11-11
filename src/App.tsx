import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UserProfileBanner } from './components/UserProfileBanner';
import { EngineStatusCard } from './components/EngineStatusCard';
import { ActionToolbar } from './components/ActionToolbar';
import { WeeklyPlanTable } from './components/WeeklyPlanTable';
import { QuickInstructions } from './components/QuickInstructions';
import { ShoppingListSection } from './components/ShoppingListSection';
import { TrainingView } from './components/TrainingView';
import { TrackingView } from './components/TrackingView';
import { ExerciseInfographicsView } from './components/ExerciseInfographicsView';
import { FitStudioEngineView } from './components/FitStudioEngineView';
import { HomeLandingView } from './components/HomeLandingView';
import { LoginPage } from './components/LoginPage';
import { MealSwapModal } from './components/MealSwapModal';
import { RecipeModal } from './components/RecipeModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DaySelectorModal } from './components/DaySelectorModal';
import { AuthModal } from './components/AuthModal';
import { auth } from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  generateFortnightPlan,
  generateWeeklyPlan,
  swapDayPlan,
  swapSingleMeal
} from './services/mealEngine';
import { DEFAULT_USER_PROFILE } from './data/database';
import { DEFAULT_PHYSICAL_PROFILE } from './data/trainingDatabase';
import { FortnightPlan, MealOption, UserProfile } from './types/nutrition';
import { PhysicalProfile } from './types/training';
import { Check } from 'lucide-react';

export default function App() {
  // Navigation tab state: 'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics'
  const [activeTab, setActiveTab] = useState<'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics'>('home');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>({
    text: 'Plan Integral NutriVida Activo: 5 tomas nutricionales con escandallo + Plan Físico corregido (+238m/-238m, bastones y fuerza excéntrica).',
    type: 'success'
  });

  const showToast = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  // Firebase Auth user state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const prevUserRef = useRef<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !prevUserRef.current) {
        showToast(`Bienvenido, ${user.displayName || user.email}. Sincronizando con tu cuenta de Firebase.`);
      }
      prevUserRef.current = user;
      setCurrentUser(user);
    });
    return () => unsub();
  }, [showToast]);

  // Fortnight (2-week plan) state
  const [fortnight, setFortnight] = useState<FortnightPlan>(() => generateFortnightPlan());
  const [activeWeek, setActiveWeek] = useState<1 | 2>(1);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [physicalProfile, setPhysicalProfile] = useState<PhysicalProfile>(DEFAULT_PHYSICAL_PROFILE);
  const [activeView, setActiveView] = useState<'table' | 'cards'>('table');
  const [isShuffling, setIsShuffling] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);

  // Active weekly plan based on selected tab
  const currentWeeklyPlan = useMemo(() => {
    return activeWeek === 1 ? fortnight.week1 : fortnight.week2;
  }, [fortnight, activeWeek]);

  const otherWeeklyPlan = useMemo(() => {
    return activeWeek === 1 ? fortnight.week2 : fortnight.week1;
  }, [fortnight, activeWeek]);

  // Meal swap modal state
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    dayId: string;
    mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner' | 'full_day';
  }>({
    isOpen: false,
    dayId: 'lunes',
    mealType: 'lunch'
  });

  // Recipe detail modal state
  const [recipeModalState, setRecipeModalState] = useState<{
    isOpen: boolean;
    meal: MealOption | null;
    dayName: string;
    mealTypeLabel: string;
  }>({
    isOpen: false,
    meal: null,
    dayName: '',
    mealTypeLabel: ''
  });



  // [ 🎲 Mezclar Menú de la Semana Activa ]
  const handleShuffleWeek = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      const newPlan = generateWeeklyPlan(activeWeek, activeWeek === 1 ? 3 : 4);
      setFortnight((prev) => ({
        ...prev,
        [activeWeek === 1 ? 'week1' : 'week2']: newPlan
      }));
      setIsShuffling(false);
      showToast(`🎲 Semana ${activeWeek} remezclada: 100% verificada con rotación variada y balance proteico.`);
    }, 300);
  }, [activeWeek, showToast]);

  // [ 🔄 Cambiar Día Específico ]
  const handleRegenerateDay = useCallback((dayId: string) => {
    const targetPlan = activeWeek === 1 ? fortnight.week1 : fortnight.week2;
    const updated = swapDayPlan(targetPlan, dayId);

    setFortnight((prev) => ({
      ...prev,
      [activeWeek === 1 ? 'week1' : 'week2']: updated
    }));

    const dayName = updated.days.find((d) => d.dayId === dayId)?.dayName || 'Día';
    showToast(`🔄 ${dayName} de la Semana ${activeWeek} regenerado con éxito respetando las 5 tomas y días adyacentes.`);
  }, [activeWeek, fortnight, showToast]);

  // Swap specific meal item across 5 daily slots
  const handleSelectMeal = useCallback(
    (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner', mealId: string) => {
      const targetPlan = activeWeek === 1 ? fortnight.week1 : fortnight.week2;
      const updated = swapSingleMeal(targetPlan, dayId, mealType, mealId);

      setFortnight((prev) => ({
        ...prev,
        [activeWeek === 1 ? 'week1' : 'week2']: updated
      }));

      showToast(`Plato actualizado con validación estricta de escandallo y balance.`);
    },
    [activeWeek, fortnight, showToast]
  );

  // [ 🛒 Generar Lista de la Compra ] - scroll to section
  const handleScrollToShoppingList = useCallback(() => {
    setActiveTab('nutrition');
    setTimeout(() => {
      const el = document.getElementById('shopping-list-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        showToast(`🛒 Lista de la compra consolidada para la Semana ${activeWeek} lista para consultar.`);
      }
    }, 100);
  }, [activeWeek, showToast]);

  // Open single meal swap
  const handleOpenSwapMeal = useCallback(
    (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner') => {
      setSwapModalState({
        isOpen: true,
        dayId,
        mealType
      });
    },
    []
  );

  // Open recipe details
  const handleOpenMealDetail = useCallback(
    (meal: MealOption, dayName: string, mealTypeLabel: string) => {
      setRecipeModalState({
        isOpen: true,
        meal,
        dayName,
        mealTypeLabel
      });
    },
    []
  );

  // Print menu
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Share menu summary
  const handleShare = useCallback(() => {
    let summary = `🌟 PLAN INTEGRAL NUTRIVIDA - SEMANA ${activeWeek}\n`;
    summary += `Objetivo: Reducción de grasa global, control glucémico y protección articular\n\n`;
    currentWeeklyPlan.days.forEach((d) => {
      summary += `📅 ${d.dayName.toUpperCase()}:\n`;
      summary += `  • 08:00 Desayuno: ${d.breakfast.title} (${d.breakfast.calories} kcal)\n`;
      summary += `  • 11:00 Media Mañana: ${d.morning.title} (${d.morning.calories} kcal)\n`;
      summary += `  • 14:30 Comida: ${d.lunch.title} (${d.lunch.calories} kcal)\n`;
      summary += `  • 18:00 Merienda: ${d.snack.title} (${d.snack.calories} kcal)\n`;
      summary += `  • 21:00 Cena: ${d.dinner.title} (${d.dinner.calories} kcal)\n`;
      summary += `  Total Día: ${d.totalCalories} kcal | ${d.totalProtein}g P | ${d.totalFruitPieces} frutas\n\n`;
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      showToast('📋 Resumen completo de la semana copiado al portapapeles.');
    }
  }, [activeWeek, currentWeeklyPlan, showToast]);

  const handleSaveProfile = useCallback((updated: UserProfile) => {
    setUserProfile(updated);
    showToast(`Perfil clínico y escandallo objetivo actualizados (${updated.targetCalories} kcal).`);
  }, [showToast]);

  const handleUpdatePhysicalProfile = useCallback((updated: PhysicalProfile) => {
    setPhysicalProfile(updated);
    showToast('Perfil físico y disponibilidad actualizados.');
  }, [showToast]);

  // Mandatory Login Gate: Lock entire application until signed in with Google (or guest demo)
  if (!currentUser && !isGuestMode) {
    return <LoginPage onGuestAccess={() => setIsGuestMode(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top duration-300 shadow-xl rounded-xl overflow-hidden border border-emerald-200">
          <div className="bg-slate-900 text-white p-3.5 flex items-start gap-3">
            <div className="p-1 rounded-md bg-emerald-500 text-slate-950 shrink-0 mt-0.5">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="text-xs font-medium leading-relaxed pr-2">
              {toastMessage.text}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs ml-auto shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Header with Navigation Tabs */}
      <Header
        userProfile={userProfile}
        validationReport={currentWeeklyPlan.validationReport}
        activeWeek={activeWeek}
        onChangeWeek={(w) => {
          setActiveWeek(w);
          showToast(`Cambiado a vista de Semana ${w}.`);
        }}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onPrint={handlePrint}
        onShare={handleShare}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1 w-full">
        {/* TAB 0: HOME LANDING VIEW */}
        {activeTab === 'home' && (
          <HomeLandingView
            onNavigateTab={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {/* TAB 1: FITSTUDIO ENGINE (VIRTUAL TRAINER & DASHBOARD) */}
        {activeTab === 'fitstudio' && (
          <FitStudioEngineView />
        )}

        {/* TAB 1: NUTRITION PLAN */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* User Profile & Clinical Rationale Banner */}
            <UserProfileBanner
              profile={userProfile}
              onEditProfile={() => setIsProfileModalOpen(true)}
              onNavigateToTracking={() => setActiveTab('tracking')}
            />

            {/* Real-Time Algorithmic Engine Status Card with 8 Juan Improvements */}
            <EngineStatusCard
              report={currentWeeklyPlan.validationReport}
              activeWeekNumber={activeWeek}
            />

            {/* Interactive Action Toolbar (Week Selector & Actions) */}
            <ActionToolbar
              onShuffleAll={handleShuffleWeek}
              onOpenDaySelector={() => setIsDaySelectorOpen(true)}
              onViewShoppingList={handleScrollToShoppingList}
              isShuffling={isShuffling}
              activeView={activeView}
              onChangeView={setActiveView}
              activeWeek={activeWeek}
              onChangeWeek={(w) => setActiveWeek(w)}
            />

            {/* 1. Weekly Plan Table (5 Tomas Diarias + Escandallo) */}
            <WeeklyPlanTable
              days={currentWeeklyPlan.days}
              activeWeekNumber={activeWeek}
              activeView={activeView}
              onSwapDay={handleRegenerateDay}
              onSwapMeal={handleOpenSwapMeal}
              onOpenMealDetail={handleOpenMealDetail}
            />

            {/* 3. Quick Preparation Instructions (Batch Cooking & Kitchen Hacks) */}
            <QuickInstructions />

            {/* 4. Calculated Dynamic Grocery List (Week 1, Week 2 or Fortnight) */}
            <ShoppingListSection
              currentWeekPlan={currentWeeklyPlan}
              otherWeekPlan={otherWeeklyPlan}
              activeWeekNumber={activeWeek}
            />
          </div>
        )}

        {/* TAB 2: TRAINING & JOINT PROTECTION PLAN */}
        {activeTab === 'training' && (
          <TrainingView
            physicalProfile={physicalProfile}
            onUpdatePhysicalProfile={handleUpdatePhysicalProfile}
            activeWeekNumber={activeWeek}
            onChangeWeek={(w) => setActiveWeek(w)}
            onNavigateToInfographics={() => setActiveTab('infographics')}
          />
        )}

        {/* TAB 3: TRACKING & REALISTIC MEASUREMENTS */}
        {activeTab === 'tracking' && (
          <TrackingView />
        )}

        {/* TAB 4: 12 EXERCISE INFOGRAPHICS WITH DYNAMIC AGE & WEIGHT ADAPTATION */}
        {activeTab === 'infographics' && (
          <ExerciseInfographicsView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">NutriVida Integral</span>
            <span>·</span>
            <span>Plan Nutricional 2 Semanas + Entrenamiento Físico Progresivo & Protección Articular</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ruta GPS: +238m / -238m</span>
            <span>·</span>
            <span>Varón 53 años (102 kg)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MealSwapModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState((prev) => ({ ...prev, isOpen: false }))}
        dayId={swapModalState.dayId}
        mealType={swapModalState.mealType}
        weeklyPlan={currentWeeklyPlan}
        onSelectMeal={handleSelectMeal}
        onRegenerateDay={handleRegenerateDay}
      />

      <RecipeModal
        isOpen={recipeModalState.isOpen}
        onClose={() => setRecipeModalState((prev) => ({ ...prev, isOpen: false }))}
        meal={recipeModalState.meal}
        dayName={recipeModalState.dayName}
        mealTypeLabel={recipeModalState.mealTypeLabel}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <DaySelectorModal
        isOpen={isDaySelectorOpen}
        onClose={() => setIsDaySelectorOpen(false)}
        weeklyPlan={currentWeeklyPlan}
        onSelectDayToSwap={(dayId) => {
          setSwapModalState({
            isOpen: true,
            dayId,
            mealType: 'full_day'
          });
        }}
        onDirectRegenerateDay={handleRegenerateDay}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
