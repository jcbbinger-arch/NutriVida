import React from 'react';
import { ChefHat, Clock, Flame, Sparkles, CheckCircle2, Apple, Scale, WineOff, Heart } from 'lucide-react';
import { getWeeklyPreparationGuide } from '../services/mealEngine';

export const QuickInstructions: React.FC = () => {
  const guide = getWeeklyPreparationGuide();

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Instrucciones Rápidas de Elaboración (Estrategia Culinaria en 3 Pasos)
            </h3>
            <p className="text-xs text-slate-500">
              Mejoras desde la cocina: batch cooking de almidón resistente, sofrito base sin alcohol y aceite pesado.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Batch Cooking del Domingo
        </span>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guide.map((item) => (
          <div
            key={item.step}
            className="relative bg-slate-50/70 hover:bg-slate-50 rounded-xl p-4 border border-slate-200/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  0{item.step}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {item.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1.5">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantiza control glucémico y adherencia</span>
            </div>
          </div>
        ))}
      </div>

      {/* Culinary Kitchen Hacks Grid from Juan's Review */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
          <Scale className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-950 block">Aceite Pesado (10-15 ml):</strong>
            <span className="text-slate-600">Pesar el AOVE en báscula o cuchara sopera evita meter 200 kcal invisibles por comida.</span>
          </div>
        </div>

        <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-2">
          <Apple className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-950 block">Fruta Entera con Piel:</strong>
            <span className="text-slate-600">Manzana, pera y kiwi aportan pectina y vitamina C. Nunca en zumo para evitar picos de fructosa.</span>
          </div>
        </div>

        <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 flex items-start gap-2">
          <WineOff className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-950 block">Sabor Sin Alcohol:</strong>
            <span className="text-slate-600">Sustituir vino por caldo casero de verduras desgrasado con unas gotas de limón o vinagre de manzana.</span>
          </div>
        </div>

        <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
          <Heart className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-950 block">Flexibilidad Semanal:</strong>
            <span className="text-slate-600">1 comida libre planificada a la semana mejora la adherencia psicológica más que la prohibición total.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
