import React, { useState } from 'react';
import { X, User, Target, Flame, Dumbbell, ShieldAlert, Check, Activity, Scale, HeartPulse, Sparkles, Plus, Trash2 } from 'lucide-react';
import { UserProfile } from '../types/nutrition';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [weight, setWeight] = useState(profile.currentWeightKg);
  const [targetCalories, setTargetCalories] = useState(profile.targetCalories);
  const [currentBreakfast, setCurrentBreakfast] = useState(profile.currentBreakfast);
  const [hasFlexibleMeal, setHasFlexibleMeal] = useState(profile.hasFlexibleMeal);
  const [newExcludedFood, setNewExcludedFood] = useState('');
  const [excludedFoods, setExcludedFoods] = useState<string[]>(profile.excludedFoods);
  const [medicalConditions, setMedicalConditions] = useState<string[]>(profile.medicalConditions);

  if (!isOpen) return null;

  // Recalculate Mifflin-St Jeor on weight change
  const calcBMR = Math.round(10 * weight + 6.25 * profile.heightCm - 5 * profile.age + 5);
  const calcTDEE = Math.round(calcBMR * 1.40);

  const handleAddExcluded = () => {
    if (newExcludedFood.trim() && !excludedFoods.includes(newExcludedFood.trim())) {
      setExcludedFoods([...excludedFoods, newExcludedFood.trim()]);
      setNewExcludedFood('');
    }
  };

  const handleRemoveExcluded = (item: string) => {
    setExcludedFoods(excludedFoods.filter((f) => f !== item));
  };

  const toggleCondition = (cond: string) => {
    if (medicalConditions.includes(cond)) {
      setMedicalConditions(medicalConditions.filter((c) => c !== cond));
    } else {
      setMedicalConditions([...medicalConditions, cond]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
      currentWeightKg: weight,
      targetCalories,
      bmr: calcBMR,
      tdee: calcTDEE,
      currentBreakfast,
      hasFlexibleMeal,
      excludedFoods,
      medicalConditions
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Ficha del Usuario & Personalización (4 Puntos Clave)
              </h3>
              <p className="text-xs text-slate-400">NutriVida Clinical & Kitchen Alignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {/* 1. Antropometría & Calorías Objetivo */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                1. Antropometría & Calorías Objetivo (Escandallo)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                IMC ≈ 34 (Activo)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Edad</span>
                <span className="font-bold text-slate-800 text-sm">{profile.age} años</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Altura</span>
                <span className="font-bold text-slate-800 text-sm">{profile.heightCm} cm</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Peso Actual</span>
                <span className="font-bold text-emerald-700 text-sm">{weight} kg</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block">Meta</span>
                <span className="font-bold text-slate-800 text-sm">{profile.targetWeightKg} kg</span>
              </div>
            </div>

            {/* Calories target selector */}
            <div className="pt-2 border-t border-slate-200/70">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Déficit calórico objetivo diario:</span>
                <span className="text-emerald-700 font-bold">{targetCalories} kcal (TDEE: {calcTDEE} kcal)</span>
              </div>
              <input
                type="range"
                min="1750"
                max="2250"
                step="25"
                value={targetCalories}
                onChange={(e) => setTargetCalories(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.750 kcal (déficit alto)</span>
                <span>1.980 kcal (recomendado)</span>
                <span>2.250 kcal (déficit suave)</span>
              </div>
            </div>
          </div>

          {/* 2. Patologías, Alergias y Medicación */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              2. Patologías, Factores Clínicos o Medicación
            </div>
            <p className="text-[11px] text-slate-500">
              Marca las condiciones a tener en cuenta para afinar las opciones alimentarias:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Control de glucemia / Prevención picos insulina',
                'Protección articular (sobrepeso + 53 años)',
                'Control de colesterol / Moderación yemas',
                'Hipertensión / Control estricto de sodio',
                'Toma medicación habitual (consultar médico)'
              ].map((cond) => {
                const isSelected = medicalConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{cond}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Desayuno habitual y Comida libre semanal */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. ¿Qué desayuna hoy? & Comida Libre Semanal (Refeed)
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Desayuno habitual del usuario:
              </label>
              <input
                type="text"
                value={currentBreakfast}
                onChange={(e) => setCurrentBreakfast(e.target.value)}
                placeholder="Ej. Café cortado con tostada o galletas..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                El plan propone desayunos ricos en fibra soluble (avena integral, pan 100% integral) y 1 pieza de fruta entera para frenar la ansiedad.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block text-xs">Comida libre semanal planificada (Flexibilidad)</span>
                <span className="text-[10px] text-slate-500">
                  Permite 1 comida social a la semana (ej. Domingo) para maximizar la adherencia psicológica a largo plazo.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasFlexibleMeal}
                onChange={(e) => setHasFlexibleMeal(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Alimentos descartados / Exclusiones */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              4. Gustos & Alimentos Excluidos
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newExcludedFood}
                onChange={(e) => setNewExcludedFood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExcluded()}
                placeholder="Añadir alimento que no le guste o deba excluir..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddExcluded}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {excludedFoods.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveExcluded(item)}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            Ajustes aplicados al generador quincenal
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Guardar y Recalcular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
