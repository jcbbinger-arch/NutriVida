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
import {
  auth,
  deleteUserProfileFromCloud,
  loadUserProfileFromCloud,
  saveMeasurementToCloud,
  saveUserProfileToCloud
} from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  buildCanonical30DayPlan,
  generateWeeklyPlan,
  swapDayPlan,
  swapSingleMeal,
  toggleHardTrainingBonus
} from './services/mealEngine';
import { buildEmptyUserProfile, scaleMonthlyPlan } from './services/nutritionCalculator';
import { DEFAULT_USER_PROFILE } from './data/database';
import { DEFAULT_PHYSICAL_PROFILE } from './data/trainingDatabase';
import { MonthlyPlan, MealOption, UserProfile, WeeklyPlan } from './types/nutrition';
import { PhysicalProfile, TrackingEntry } from './types/training';
import { Check } from 'lucide-react';

type WeekKey = 'week1' | 'week2' | 'week3' | 'week4' | 'week5';

function getWeekKey(w: 1 | 2 | 3 | 4 | 5): WeekKey {
  return `week${w}`;
}

export default function App() {
  // Navigation tab state: 'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics'
  const [activeTab, setActiveTab] = useState<
    'home' | 'fitstudio' | 'tracking' | 'nutrition' | 'training' | 'infographics'
  >('home');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>({
    text: 'Plan 30 Días Intercambiable Activo (5 Tomas + Escalado Inteligente) + FitStudio & Garmin 735XT.',
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

  const effectiveUid = currentUser ? currentUser.uid : isGuestMode ? 'juan_fitstudio_user' : null;

  // 30-Day Monthly Plan state (canonical base recipes, dynamically scaled by userProfile.scaleFactor)
  const [baseMonthlyPlan, setBaseMonthlyPlan] = useState<MonthlyPlan>(() => buildCanonical30DayPlan());
  const [activeWeek, setActiveWeek] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);
  const [physicalProfile, setPhysicalProfile] = useState<PhysicalProfile>(DEFAULT_PHYSICAL_PROFILE);
  const [activeView, setActiveView] = useState<'table' | 'cards'>('table');
  const [isShuffling, setIsShuffling] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);

  // Load saved profile from localStorage + Cloud Firestore whenever user signs in or enters guest mode.
  // If no profile exists yet for this account, launch 5-step onboarding starting from zero!
  useEffect(() => {
    if (!effectiveUid) return;
    let isCancelled = false;
    const storageKey = `nutrivida_profile_v2_${effectiveUid}`;
    let hasLocalProfile = false;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        if (parsed && parsed.onboardingCompleted && parsed.age > 0 && parsed.currentWeightKg > 0) {
          hasLocalProfile = true;
          setUserProfile(parsed);
          setIsOnboardingMode(false);
        }
      }
    } catch {
      // ignore invalid JSON
    }

    loadUserProfileFromCloud(effectiveUid).then((cloudProfile) => {
      if (isCancelled) return;
      if (
        cloudProfile &&
        cloudProfile.onboardingCompleted &&
        cloudProfile.age > 0 &&
        cloudProfile.currentWeightKg > 0
      ) {
        setUserProfile(cloudProfile);
        setIsOnboardingMode(false);
        setIsProfileModalOpen(false);
        try {
          localStorage.setItem(storageKey, JSON.stringify(cloudProfile));
        } catch {
          // ignore
        }
      } else if (!hasLocalProfile) {
        // First time entering: start cleanly from zero
        setUserProfile(buildEmptyUserProfile());
        setIsOnboardingMode(true);
        setIsProfileModalOpen(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [effectiveUid]);

  // Dynamically scale the 30-day plan based on user's scaleFactor (targetCalories / 1750)
  const scaledMonthlyPlan = useMemo(
    () => scaleMonthlyPlan(baseMonthlyPlan, userProfile.scaleFactor || 1),
    [baseMonthlyPlan, userProfile.scaleFactor]
  );

  const allWeeks = useMemo<WeeklyPlan[]>(
    () => [
      scaledMonthlyPlan.week1,
      scaledMonthlyPlan.week2,
      scaledMonthlyPlan.week3,
      scaledMonthlyPlan.week4,
      scaledMonthlyPlan.week5
    ],
    [scaledMonthlyPlan]
  );

  // Active weekly plan based on selected week (1..5)
  const currentWeeklyPlan = useMemo(() => {
    return scaledMonthlyPlan[getWeekKey(activeWeek)];
  }, [scaledMonthlyPlan, activeWeek]);

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
      const weekKey = getWeekKey(activeWeek);
      const newPlan = generateWeeklyPlan(activeWeek, activeWeek % 2 === 1 ? 2 : 3);
      setBaseMonthlyPlan((prev) => ({
        ...prev,
        [weekKey]: newPlan
      }));
      setIsShuffling(false);
      showToast(
        `🎲 ${newPlan.label || `Semana ${activeWeek}`} remezclada respetando pescado azul, legumbres y comida libre del domingo.`
      );
    }, 300);
  }, [activeWeek, showToast]);

  // [ 📅 Restaurar Calendario Oficial 30 Días ]
  const handleRestoreCanonical30Days = useCallback(() => {
    setBaseMonthlyPlan(buildCanonical30DayPlan());
    showToast('📅 Calendario Oficial de 30 Días Intercambiable (Días 1–30) restaurado con valores originales.');
  }, [showToast]);

  // [ 🔄 Cambiar Día Específico ]
  const handleRegenerateDay = useCallback(
    (dayId: string) => {
      const weekKey = getWeekKey(activeWeek);
      const targetPlan = baseMonthlyPlan[weekKey];
      const updated = swapDayPlan(targetPlan, dayId);

      setBaseMonthlyPlan((prev) => ({
        ...prev,
        [weekKey]: updated
      }));

      const dayName = updated.days.find((d) => d.dayId === dayId)?.dayName || 'Día';
      showToast(`🔄 ${dayName} (${updated.label || `S${activeWeek}`}) regenerado respetando las 5 tomas y reglas anti-colisión.`);
    },
    [activeWeek, baseMonthlyPlan, showToast]
  );

  // Swap specific meal item across 5 daily slots
  const handleSelectMeal = useCallback(
    (dayId: string, mealType: 'breakfast' | 'morning' | 'lunch' | 'snack' | 'dinner', mealId: string) => {
      const weekKey = getWeekKey(activeWeek);
      const targetPlan = baseMonthlyPlan[weekKey];
      const updated = swapSingleMeal(targetPlan, dayId, mealType, mealId);

      setBaseMonthlyPlan((prev) => ({
        ...prev,
        [weekKey]: updated
      }));

      showToast(`Plato actualizado (${mealId}) dentro de la misma toma con balance validado.`);
    },
    [activeWeek, baseMonthlyPlan, showToast]
  );

  // Toggle +40g pan integral / +1 fruta bonus on hard training days
  const handleToggleHardTraining = useCallback(
    (dayId: string) => {
      const weekKey = getWeekKey(activeWeek);
      const targetPlan = baseMonthlyPlan[weekKey];
      const updated = toggleHardTrainingBonus(targetPlan, dayId);

      setBaseMonthlyPlan((prev) => ({
        ...prev,
        [weekKey]: updated
      }));

      const dayObj = updated.days.find((d) => d.dayId === dayId);
      if (dayObj?.hardTrainingBonus) {
        showToast(`⚡ Bonus de entreno duro activado en ${dayObj.dayName}: +40 g pan integral o +1 fruta (+140 kcal).`);
      } else {
        showToast(`Menu base restaurado en ${dayObj?.dayName || 'el día'} (sin extra de entreno duro).`, 'info');
      }
    },
    [activeWeek, baseMonthlyPlan, showToast]
  );

  // [ 🛒 Generar Lista de la Compra ] - scroll to section
  const handleScrollToShoppingList = useCallback(() => {
    setActiveTab('nutrition');
    setTimeout(() => {
      const el = document.getElementById('shopping-list-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        showToast(`🛒 Lista de la compra consolidada lista para consultar (Semana, Quincena o 30 Días).`);
      }
    }, 100);
  }, [showToast]);

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
    const label = currentWeeklyPlan.label || `Semana ${activeWeek}`;
    let summary = `🌟 PLAN DE 30 DÍAS INTERCAMBIABLE NUTRIVIDA - ${label.toUpperCase()}\n`;
    summary += `Perfil: ${userProfile.name || 'Usuario'} · Objetivo: ~${userProfile.targetCalories} kcal/día (Factor ×${(userProfile.scaleFactor || 1).toFixed(2)}) · ${userProfile.targetProteinMin}–${userProfile.targetProteinMax}g P · 2–3× Pescado Azul · 2–3× Legumbres · 0% Alcohol\n\n`;
    currentWeeklyPlan.days.forEach((d) => {
      const dayTag = d.dayNumber ? `DÍA ${d.dayNumber} · ${d.dayName.toUpperCase()}` : d.dayName.toUpperCase();
      summary += `📅 ${dayTag}${d.hardTrainingBonus ? ' [ENTRENO DURO +40g PAN/+1 FRUTA]' : ''}:\n`;
      summary += `  • 08:00 Desayuno (${d.breakfast.id}): ${d.breakfast.title} (${d.breakfast.calories} kcal)\n`;
      summary += `  • 11:00 Media Mañana (${d.morning.id}): ${d.morning.title} (${d.morning.calories} kcal)\n`;
      summary += `  • 14:30 Comida (${d.lunch.id}): ${d.lunch.title}${d.lunch.id === 'LIBRE' ? '' : ` (${d.lunch.calories} kcal)`}\n`;
      summary += `  • 18:00 Merienda (${d.snack.id}): ${d.snack.title} (${d.snack.calories} kcal)\n`;
      summary += `  • 21:00 Cena (${d.dinner.id}): ${d.dinner.title} (${d.dinner.calories} kcal)\n`;
      if (d.lunch.id !== 'LIBRE') {
        summary += `  Total Día: ${d.totalCalories} kcal | ${d.totalProtein}g P | ${d.totalFruitPieces} frutas\n\n`;
      } else {
        summary += `  Domingo: Comida libre semanal planificada (sin compensar ni saltar tomas)\n\n`;
      }
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      showToast(`📋 Resumen de ${label} copiado al portapapeles.`);
    }
  }, [activeWeek, currentWeeklyPlan, showToast, userProfile]);

  const handleSaveProfile = useCallback(
    async (updated: UserProfile) => {
      setUserProfile(updated);
      setIsOnboardingMode(false);
      if (effectiveUid) {
        try {
          localStorage.setItem(`nutrivida_profile_v2_${effectiveUid}`, JSON.stringify(updated));
        } catch {
          // ignore
        }
        await saveUserProfileToCloud(updated, effectiveUid);

        // Seed initial tracking measurement if none saved yet for this profile
        const measKey = `nutrivida_user_measurements_${effectiveUid}`;
        const existingMeas = localStorage.getItem(measKey);
        if ((!existingMeas || existingMeas === '[]') && updated.currentWeightKg > 0) {
          const today = new Date().toISOString().slice(0, 10);
          const seedEntry: TrackingEntry = {
            id: `meas-${Date.now()}`,
            date: today,
            weekNumber: 0,
            weightKg: updated.currentWeightKg,
            waistCircumferenceCm: updated.waistCm || Math.round(updated.heightCm * 0.55),
            dailySteps: updated.dailyStepsTarget || 8000,
            notes: 'Medición inicial al configurar el perfil',
            kneeSensation: 'sin_molestias',
            lumbarSensation: 'firme_sin_dolor',
            adherencePercentage: 100
          };
          try {
            localStorage.setItem(measKey, JSON.stringify([seedEntry]));
          } catch {
            // ignore
          }
          saveMeasurementToCloud(seedEntry, effectiveUid);
        }
      }
      showToast(
        `Perfil guardado: ${updated.targetCalories} kcal/día · Factor ×${(updated.scaleFactor || 1).toFixed(2)}. Menús adaptados.`
      );
    },
    [effectiveUid, showToast]
  );

  const handleResetProfileToZero = useCallback(async () => {
    const empty = buildEmptyUserProfile();
    setUserProfile(empty);
    setIsOnboardingMode(true);
    if (effectiveUid) {
      try {
        localStorage.removeItem(`nutrivida_profile_v2_${effectiveUid}`);
        localStorage.removeItem(`nutrivida_user_measurements_${effectiveUid}`);
      } catch {
        // ignore
      }
      await deleteUserProfileFromCloud(effectiveUid);
    }
    showToast('Perfil reiniciado desde cero. Introduce tus nuevos datos.', 'info');
  }, [effectiveUid, showToast]);

  const handleUpdatePhysicalProfile = useCallback(
    (updated: PhysicalProfile) => {
      setPhysicalProfile(updated);
      showToast('Perfil físico y disponibilidad actualizados.');
    },
    [showToast]
  );

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
            <div className="text-xs font-medium leading-relaxed pr-2">{toastMessage.text}</div>
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
          const lbl = w === 5 ? 'Días 29–30 (Cierre de Mes)' : `Semana ${w}`;
          showToast(`Cambiado a ${lbl} del Plan 30 Días.`);
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
        {activeTab === 'fitstudio' && <FitStudioEngineView />}

        {/* TAB 2: NUTRITION PLAN (30 DÍAS INTERCAMBIABLE) */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* User Profile & Clinical Rationale Banner */}
            <UserProfileBanner
              profile={userProfile}
              onEditProfile={() => setIsProfileModalOpen(true)}
              onNavigateToTracking={() => setActiveTab('tracking')}
            />

            {/* Real-Time Algorithmic Engine Status Card */}
            <EngineStatusCard
              report={currentWeeklyPlan.validationReport}
              activeWeekNumber={activeWeek}
              weekLabel={currentWeeklyPlan.label}
            />

            {/* Interactive Action Toolbar (30-Day Week Selector & Actions) */}
            <ActionToolbar
              onShuffleAll={handleShuffleWeek}
              onRestoreCanonical={handleRestoreCanonical30Days}
              onOpenDaySelector={() => setIsDaySelectorOpen(true)}
              onViewShoppingList={handleScrollToShoppingList}
              isShuffling={isShuffling}
              activeView={activeView}
              onChangeView={setActiveView}
              activeWeek={activeWeek}
              onChangeWeek={(w) => setActiveWeek(w)}
            />

            {/* Weekly Plan Table (5 Tomas Diarias + Escandallo + Bonus Entreno Duro) */}
            <WeeklyPlanTable
              days={currentWeeklyPlan.days}
              activeWeekNumber={activeWeek}
              weekLabel={currentWeeklyPlan.label}
              activeView={activeView}
              onSwapDay={handleRegenerateDay}
              onSwapMeal={handleOpenSwapMeal}
              onOpenMealDetail={handleOpenMealDetail}
              onToggleHardTraining={handleToggleHardTraining}
            />

            {/* Double Batch Cooking (Sunday + Wednesday) & Clinical Progression Rules */}
            <QuickInstructions />

            {/* Consolidated Grocery List (Active Week, Fortnight, or Full 30 Days) */}
            <ShoppingListSection
              currentWeekPlan={currentWeeklyPlan}
              allWeeks={allWeeks}
              activeWeekNumber={activeWeek}
            />
          </div>
        )}

        {/* TAB 3: TRAINING & JOINT PROTECTION PLAN */}
        {activeTab === 'training' && (
          <TrainingView
            physicalProfile={physicalProfile}
            onUpdatePhysicalProfile={handleUpdatePhysicalProfile}
            activeWeekNumber={activeWeek % 2 === 0 ? 2 : 1}
            onChangeWeek={(w) => setActiveWeek(w)}
            onNavigateToInfographics={() => setActiveTab('infographics')}
          />
        )}

        {/* TAB 4: TRACKING & REALISTIC MEASUREMENTS */}
        {activeTab === 'tracking' && (
          <TrackingView userProfile={userProfile} effectiveUid={effectiveUid || undefined} />
        )}

        {/* TAB 5: 12 EXERCISE INFOGRAPHICS WITH DYNAMIC AGE & WEIGHT ADAPTATION */}
        {activeTab === 'infographics' && <ExerciseInfographicsView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">NutriVida Integral</span>
            <span>·</span>
            <span>Plan Nutricional 30 Días Intercambiable (5 Tomas) + Entrenamiento Físico Progresivo</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ruta GPS: +238m / -238m</span>
            <span>·</span>
            <span>
              {userProfile.onboardingCompleted && userProfile.age > 0
                ? `${userProfile.sex === 'female' ? 'Mujer' : 'Hombre'} ${userProfile.age} años (${userProfile.currentWeightKg} kg · ×${(userProfile.scaleFactor || 1).toFixed(2)})`
                : 'Perfil personalizable en 5 pasos'}
            </span>
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
        onClose={() => {
          if (!isOnboardingMode) setIsProfileModalOpen(false);
        }}
        profile={userProfile}
        isFirstTimeOnboarding={isOnboardingMode}
        onSaveProfile={handleSaveProfile}
        onResetProfileToZero={handleResetProfileToZero}
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

