import React from 'react';

interface ExerciseSvgProps {
  exerciseId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ExerciseSvgInfographic: React.FC<ExerciseSvgProps> = ({
  exerciseId,
  className = '',
  size = 'md'
}) => {
  const heightClasses = {
    sm: 'h-36',
    md: 'h-52',
    lg: 'h-72'
  }[size];

  const musclePrimary = '#059669'; // Emerald
  const muscleSecondary = '#0284c7'; // Sky/Blue
  const motionArrow = '#0d9488'; // Teal
  const boneJoint = '#334155'; // Slate 700
  const shieldColor = '#10b981'; // Green

  const renderStoryboardGraphic = () => {
    switch (exerciseId) {
      // EX-01: Flexiones Inclinadas (Pared / Encimera)
      case 'EX-01':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f0fdf4" rx="12" />
            {/* Divider */}
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① INICIO (Brazos extendidos) */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#d1fae5" />
              <text x="95" y="26" fontSize="9.5" fill="#065f46" fontWeight="extrabold" textAnchor="middle">① POSICIÓN INICIAL (Brazos estirados)</text>

              {/* Wall */}
              <line x1="150" y1="40" x2="150" y2="175" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              {/* Ground */}
              <line x1="20" y1="175" x2="165" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              {/* Figure */}
              <circle cx="35" cy="172" r="4" fill={boneJoint} />
              <line x1="35" y1="172" x2="85" y2="135" stroke={boneJoint} strokeWidth="5" strokeLinecap="round" />
              <line x1="85" y1="135" x2="130" y2="100" stroke={boneJoint} strokeWidth="6" strokeLinecap="round" />
              <circle cx="140" cy="90" r="9" fill="#64748b" />
              <polyline points="130,100 148,105" fill="none" stroke={musclePrimary} strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Transition Arrow */}
            <path d="M 175 105 L 185 105" stroke={motionArrow} strokeWidth="3" markerEnd="url(#arrow)" />

            {/* PANEL 2: ② EJECUCIÓN (Pecho cerca, 3s bajada) */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#ccfbf1" />
              <text x="95" y="26" fontSize="9.5" fill="#115e59" fontWeight="extrabold" textAnchor="middle">② FLEXIÓN (3s Bajada / Codos 45°)</text>

              {/* Wall */}
              <line x1="150" y1="40" x2="150" y2="175" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              {/* Ground */}
              <line x1="20" y1="175" x2="165" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              {/* Figure lowered */}
              <circle cx="35" cy="172" r="4" fill={boneJoint} />
              <line x1="35" y1="172" x2="95" y2="145" stroke={boneJoint} strokeWidth="5" strokeLinecap="round" />
              <line x1="95" y1="145" x2="135" y2="120" stroke={musclePrimary} strokeWidth="6" strokeLinecap="round" />
              <circle cx="142" cy="115" r="9" fill="#64748b" />
              <polyline points="135,120 145,135 148,125" fill="none" stroke={musclePrimary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // EX-02: Press de Hombros
      case 'EX-02':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f0fdfa" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① INICIO (Garrafas a altura de hombros) */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#ccfbf1" />
              <text x="95" y="26" fontSize="9.5" fill="#115e59" fontWeight="extrabold" textAnchor="middle">① INICIO (Garrafas en Hombros)</text>
              {/* Chair & Torso */}
              <line x1="60" y1="120" x2="120" y2="120" stroke="#94a3b8" strokeWidth="4" />
              <line x1="60" y1="80" x2="60" y2="175" stroke="#94a3b8" strokeWidth="4" />
              <line x1="85" y1="120" x2="88" y2="70" stroke={boneJoint} strokeWidth="6" strokeLinecap="round" />
              <circle cx="88" cy="55" r="9" fill="#64748b" />
              {/* Hands at shoulders */}
              <rect x="75" y="65" width="10" height="15" rx="2" fill="#0284c7" />
            </g>

            {/* PANEL 2: ② FINAL (Brazos extendidos arriba) */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#99f6e4" />
              <text x="95" y="26" fontSize="9.5" fill="#047857" fontWeight="extrabold" textAnchor="middle">② FINAL (Empuje Vertical)</text>
              {/* Chair & Torso */}
              <line x1="60" y1="120" x2="120" y2="120" stroke="#94a3b8" strokeWidth="4" />
              <line x1="60" y1="80" x2="60" y2="175" stroke="#94a3b8" strokeWidth="4" />
              <line x1="85" y1="120" x2="88" y2="70" stroke={boneJoint} strokeWidth="6" strokeLinecap="round" />
              <circle cx="88" cy="55" r="9" fill="#64748b" />
              {/* Hands extended up */}
              <rect x="83" y="30" width="10" height="18" rx="2" fill="#0284c7" />
              <path d="M 88 50 L 88 32" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-03: Extensión de Tríceps en Pared
      case 'EX-03':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f8fafc" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① ANTEBRAZOS APOYADOS */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e2e8f0" />
              <text x="95" y="26" fontSize="9.5" fill="#334155" fontWeight="extrabold" textAnchor="middle">① ANTEBRAZOS EN PARED</text>
              <line x1="150" y1="40" x2="150" y2="175" stroke="#475569" strokeWidth="6" />
              <line x1="60" y1="175" x2="160" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="60" y1="175" x2="105" y2="110" stroke={boneJoint} strokeWidth="5" />
              <circle cx="130" cy="95" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② EMPUJE EXTENDIDO */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#cbd5e1" />
              <text x="95" y="26" fontSize="9.5" fill="#0f172a" fontWeight="extrabold" textAnchor="middle">② EMPUJE (Brazos Estirados)</text>
              <line x1="150" y1="40" x2="150" y2="175" stroke="#475569" strokeWidth="6" />
              <line x1="60" y1="175" x2="160" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="60" y1="175" x2="115" y2="100" stroke={boneJoint} strokeWidth="5" />
              <circle cx="135" cy="85" r="9" fill="#64748b" />
              <path d="M 115 110 L 135 95" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-04: Remo Horizontal con Peso / Banda
      case 'EX-04':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f0fdf4" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① BRAZOS AL FRENTE */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#dcfce7" />
              <text x="95" y="26" fontSize="9.5" fill="#166534" fontWeight="extrabold" textAnchor="middle">① BRAZOS AL FRENTE (Estirados)</text>
              <line x1="70" y1="110" x2="130" y2="110" stroke="#94a3b8" strokeWidth="4" />
              <line x1="70" y1="80" x2="70" y2="175" stroke="#94a3b8" strokeWidth="4" />
              <line x1="80" y1="110" x2="85" y2="65" stroke={boneJoint} strokeWidth="6" />
              <circle cx="87" cy="50" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② TRACCIÓN A LA CADERA */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#bbf7d0" />
              <text x="95" y="26" fontSize="9.5" fill="#14532d" fontWeight="extrabold" textAnchor="middle">② TRACCIÓN (Codos a Cadera)</text>
              <line x1="70" y1="110" x2="130" y2="110" stroke="#94a3b8" strokeWidth="4" />
              <line x1="70" y1="80" x2="70" y2="175" stroke="#94a3b8" strokeWidth="4" />
              <line x1="80" y1="110" x2="85" y2="65" stroke={boneJoint} strokeWidth="6" />
              <circle cx="87" cy="50" r="9" fill="#64748b" />
              <path d="M 100 75 L 85 85" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-05: Remo Escapular 'Y-T-W'
      case 'EX-05':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f8fafc" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① TUMBADO PRONO */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e0f2fe" />
              <text x="95" y="26" fontSize="9.5" fill="#0369a1" fontWeight="extrabold" textAnchor="middle">① TUMBADO BOCA ABAJO</text>
              <rect x="30" y="150" width="130" height="6" rx="2" fill="#38bdf8" />
              <line x1="45" y1="145" x2="145" y2="145" stroke={boneJoint} strokeWidth="6" />
              <circle cx="155" cy="142" r="8" fill="#64748b" />
            </g>

            {/* PANEL 2: ② LETRAS Y-T-W */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#bae6fd" />
              <text x="95" y="26" fontSize="9.5" fill="#0284c7" fontWeight="extrabold" textAnchor="middle">② ELEVACIÓN Y · T · W</text>
              <rect x="30" y="150" width="130" height="6" rx="2" fill="#38bdf8" />
              <line x1="45" y1="145" x2="145" y2="145" stroke={boneJoint} strokeWidth="6" />
              <circle cx="155" cy="142" r="8" fill="#64748b" />
              <path d="M 95 130 L 95 110" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-06: Curl de Bíceps
      case 'EX-06':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#fef3c7" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① BRAZOS ABAJO */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#fde68a" />
              <text x="95" y="26" fontSize="9.5" fill="#92400e" fontWeight="extrabold" textAnchor="middle">① BRAZOS EXTENDIDOS ABAJO</text>
              <line x1="90" y1="175" x2="90" y2="60" stroke={boneJoint} strokeWidth="7" />
              <circle cx="90" cy="45" r="9" fill="#64748b" />
              <rect x="85" y="120" width="10" height="18" rx="2" fill="#0284c7" />
            </g>

            {/* PANEL 2: ② FLEXIÓN ARRIBA */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#fcd34d" />
              <text x="95" y="26" fontSize="9.5" fill="#78350f" fontWeight="extrabold" textAnchor="middle">② FLEXIÓN CONTRACCIÓN (3s)</text>
              <line x1="90" y1="175" x2="90" y2="60" stroke={boneJoint} strokeWidth="7" />
              <circle cx="90" cy="45" r="9" fill="#64748b" />
              <rect x="105" y="75" width="14" height="18" rx="2" fill="#0284c7" />
              <path d="M 95 105 A 20 20 0 0 0 110 80" fill="none" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-07: Sentadilla a la Silla (Sit-to-Stand)
      case 'EX-07':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#ecfdf5" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① DE PIE FRENTE A SILLA */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#d1fae5" />
              <text x="95" y="26" fontSize="9.5" fill="#065f46" fontWeight="extrabold" textAnchor="middle">① DE PIE (Preparado)</text>
              {/* Chair */}
              <rect x="40" y="120" width="35" height="6" rx="2" fill="#475569" />
              <line x1="40" y1="80" x2="40" y2="175" stroke="#475569" strokeWidth="4" />
              {/* Figure standing */}
              <line x1="120" y1="175" x2="120" y2="65" stroke={boneJoint} strokeWidth="6" />
              <circle cx="120" cy="50" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② DESCENSO LENTO A LA SILLA */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#a7f3d0" />
              <text x="95" y="26" fontSize="9.5" fill="#047857" fontWeight="extrabold" textAnchor="middle">② DESCENSO LENTO (3-4s)</text>
              {/* Chair */}
              <rect x="40" y="120" width="35" height="6" rx="2" fill="#475569" />
              <line x1="40" y1="80" x2="40" y2="175" stroke="#475569" strokeWidth="4" />
              {/* Figure squatting touching chair */}
              <line x1="130" y1="175" x2="115" y2="120" stroke={boneJoint} strokeWidth="5" />
              <line x1="115" y1="120" x2="70" y2="120" stroke={musclePrimary} strokeWidth="7" />
              <circle cx="95" cy="65" r="9" fill="#64748b" />
              <path d="M 105 80 L 85 105" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-08: Puente de Glúteos (Suelo)
      case 'EX-08':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f0fdfa" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① TUMBADO PELVIS EN SUELO */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#ccfbf1" />
              <text x="95" y="26" fontSize="9.5" fill="#115e59" fontWeight="extrabold" textAnchor="middle">① TUMBADO (Pelvis en suelo)</text>
              <line x1="20" y1="165" x2="165" y2="165" stroke="#0ea5e9" strokeWidth="4" />
              <circle cx="45" cy="155" r="9" fill="#64748b" />
              <line x1="55" y1="158" x2="95" y2="158" stroke={boneJoint} strokeWidth="6" />
            </g>

            {/* PANEL 2: ② CADERA ELEVADA */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#99f6e4" />
              <text x="95" y="26" fontSize="9.5" fill="#047857" fontWeight="extrabold" textAnchor="middle">② CADERA ARRIBA (Contracción 2s)</text>
              <line x1="20" y1="165" x2="165" y2="165" stroke="#0ea5e9" strokeWidth="4" />
              <circle cx="45" cy="155" r="9" fill="#64748b" />
              <line x1="55" y1="158" x2="105" y2="115" stroke={musclePrimary} strokeWidth="7" />
              <path d="M 80 140 L 95 120" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-09: Elevación de Talones (Gemelos)
      case 'EX-09':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f8fafc" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① PIES PLANOS */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e2e8f0" />
              <text x="95" y="26" fontSize="9.5" fill="#334155" fontWeight="extrabold" textAnchor="middle">① PIES PLANOS EN SUELO</text>
              <line x1="30" y1="170" x2="160" y2="170" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="90" y1="170" x2="90" y2="65" stroke={boneJoint} strokeWidth="6" />
              <circle cx="90" cy="50" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② EN PUNTILLAS */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#cbd5e1" />
              <text x="95" y="26" fontSize="9.5" fill="#0f172a" fontWeight="extrabold" textAnchor="middle">② PUNTILLAS (3s Bajada)</text>
              <line x1="30" y1="170" x2="160" y2="170" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="90" y1="160" x2="90" y2="55" stroke={musclePrimary} strokeWidth="6" />
              <circle cx="90" cy="40" r="9" fill="#64748b" />
              <path d="M 95 130 L 95 110" stroke={motionArrow} strokeWidth="2.5" />
            </g>
          </svg>
        );

      // EX-10: Plancha Frontal Elevada
      case 'EX-10':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#fffbeb" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① PREPARACIÓN ANTEBRAZOS */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#fef3c7" />
              <text x="95" y="26" fontSize="9.5" fill="#92400e" fontWeight="extrabold" textAnchor="middle">① POSICIÓN EN MESA</text>
              <rect x="120" y="110" width="50" height="8" rx="2" fill="#475569" />
              <line x1="30" y1="175" x2="165" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="30" y1="175" x2="80" y2="135" stroke={boneJoint} strokeWidth="5" />
              <line x1="80" y1="135" x2="135" y2="105" stroke={boneJoint} strokeWidth="6" />
              <circle cx="150" cy="95" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② ISOMÉTRICO 30S */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#fde68a" />
              <text x="95" y="26" fontSize="9.5" fill="#78350f" fontWeight="extrabold" textAnchor="middle">② ISOMÉTRICO (Glúteos y Core)</text>
              <rect x="120" y="110" width="50" height="8" rx="2" fill="#475569" />
              <line x1="30" y1="175" x2="165" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="30" y1="175" x2="80" y2="135" stroke={musclePrimary} strokeWidth="5" />
              <line x1="80" y1="135" x2="135" y2="105" stroke={musclePrimary} strokeWidth="6" />
              <circle cx="150" cy="95" r="9" fill="#64748b" />
            </g>
          </svg>
        );

      // EX-11: Bird-Dog (Cuadrupedia)
      case 'EX-11':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f8fafc" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① CUADRUPEDIA 4 APOYOS */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e0f2fe" />
              <text x="95" y="26" fontSize="9.5" fill="#0369a1" fontWeight="extrabold" textAnchor="middle">① CUADRUPEDIA (4 Apoyos)</text>
              <rect x="30" y="155" width="130" height="6" rx="2" fill="#38bdf8" />
              <line x1="60" y1="125" x2="130" y2="125" stroke={boneJoint} strokeWidth="6" />
              <circle cx="140" cy="120" r="9" fill="#64748b" />
              <line x1="60" y1="125" x2="60" y2="155" stroke={boneJoint} strokeWidth="5" />
              <line x1="130" y1="125" x2="130" y2="155" stroke={boneJoint} strokeWidth="5" />
            </g>

            {/* PANEL 2: ② EXTENSIÓN CRUZADA */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#bae6fd" />
              <text x="95" y="26" fontSize="9.5" fill="#0284c7" fontWeight="extrabold" textAnchor="middle">② EXTENSIÓN CRUZADA HORIZONTAL</text>
              <rect x="30" y="155" width="130" height="6" rx="2" fill="#38bdf8" />
              <line x1="60" y1="125" x2="130" y2="125" stroke={musclePrimary} strokeWidth="6" />
              <circle cx="140" cy="120" r="9" fill="#64748b" />
              <line x1="130" y1="125" x2="170" y2="125" stroke={motionArrow} strokeWidth="4" />
              <line x1="60" y1="125" x2="25" y2="125" stroke={motionArrow} strokeWidth="4" />
            </g>
          </svg>
        );

      // EX-12: Press Pallof / Antirotación
      case 'EX-12':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f0fdf4" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① MANOS AL PECHO */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#dcfce7" />
              <text x="95" y="26" fontSize="9.5" fill="#166534" fontWeight="extrabold" textAnchor="middle">① MANOS AL PECHO</text>
              <rect x="25" y="60" width="6" height="100" fill="#475569" />
              <line x1="110" y1="175" x2="110" y2="70" stroke={boneJoint} strokeWidth="7" />
              <circle cx="110" cy="55" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② EXTENSIÓN AL FRENTE */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#bbf7d0" />
              <text x="95" y="26" fontSize="9.5" fill="#14532d" fontWeight="extrabold" textAnchor="middle">② EXTENSIÓN RESISTIDA (3s)</text>
              <rect x="25" y="60" width="6" height="100" fill="#475569" />
              <line x1="110" y1="175" x2="110" y2="70" stroke={musclePrimary} strokeWidth="7" />
              <circle cx="110" cy="55" r="9" fill="#64748b" />
              <line x1="110" y1="90" x2="155" y2="90" stroke={motionArrow} strokeWidth="4" />
            </g>
          </svg>
        );

      // ==========================================
      // COJÍN DE EQUILIBRIO HINCHABLE (EX-C01 to EX-C06)
      // ==========================================

      // EX-C01: Sentadilla con Cojín en Silla
      case 'EX-C01':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① INICIO (De pie sobre cojín en silla) */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① INICIO (Silla con Cojín)</text>
              <rect x="35" y="120" width="45" height="6" fill="#475569" />
              <ellipse cx="57" cy="115" rx="20" ry="5" fill="#8b5cf6" />
              <line x1="120" y1="175" x2="120" y2="65" stroke={boneJoint} strokeWidth="6" />
              <circle cx="120" cy="52" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② DESCENSO INESTABLE */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② DESCENSO (Corrección Aire)</text>
              <rect x="35" y="120" width="45" height="6" fill="#475569" />
              <ellipse cx="57" cy="115" rx="20" ry="5" fill="#8b5cf6" />
              <line x1="125" y1="175" x2="110" y2="120" stroke={boneJoint} strokeWidth="5" />
              <line x1="110" y1="120" x2="70" y2="115" stroke="#10b981" strokeWidth="7" />
              <circle cx="90" cy="65" r="9" fill="#64748b" />
            </g>
          </svg>
        );

      // EX-C02: Puente de Glúteos Inestable (Talones en Cojín)
      case 'EX-C02':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① TALONES EN COJÍN */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① TALONES EN COJÍN DE AIRE</text>
              <line x1="20" y1="165" x2="165" y2="165" stroke="#0ea5e9" strokeWidth="3" />
              <ellipse cx="130" cy="160" rx="20" ry="6" fill="#8b5cf6" />
              <circle cx="40" cy="155" r="8" fill="#64748b" />
            </g>

            {/* PANEL 2: ② CADERA ELEVADA INESTABLE */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② ELEVACIÓN (Isquios y Glúteos)</text>
              <line x1="20" y1="165" x2="165" y2="165" stroke="#0ea5e9" strokeWidth="3" />
              <ellipse cx="130" cy="160" rx="20" ry="6" fill="#8b5cf6" />
              <circle cx="40" cy="155" r="8" fill="#64748b" />
              <line x1="48" y1="158" x2="95" y2="115" stroke="#10b981" strokeWidth="7" />
            </g>
          </svg>
        );

      // EX-C03: Elevación de Talones Inestable sobre Cojín
      case 'EX-C03':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① PIES EN COJÍN */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① PIES EN COJÍN (Apoyo Pared)</text>
              <line x1="155" y1="30" x2="155" y2="175" stroke="#475569" strokeWidth="5" />
              <ellipse cx="100" cy="170" rx="24" ry="7" fill="#8b5cf6" />
              <line x1="100" y1="170" x2="100" y2="70" stroke={boneJoint} strokeWidth="6" />
              <circle cx="100" cy="55" r="8" fill="#64748b" />
            </g>

            {/* PANEL 2: ② EN PUNTILLAS INESTABLE */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② PUNTILLAS (Resistencia Aire)</text>
              <line x1="155" y1="30" x2="155" y2="175" stroke="#475569" strokeWidth="5" />
              <ellipse cx="100" cy="170" rx="24" ry="7" fill="#8b5cf6" />
              <line x1="100" y1="160" x2="100" y2="55" stroke="#10b981" strokeWidth="6" />
              <circle cx="100" cy="40" r="8" fill="#64748b" />
            </g>
          </svg>
        );

      // EX-C04: Plancha Frontal con Antebrazos sobre Cojín
      case 'EX-C04':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① ANTEBRAZOS EN COJÍN */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① ANTEBRAZOS EN COJÍN</text>
              <rect x="110" y="115" width="45" height="8" fill="#475569" />
              <ellipse cx="132" cy="110" rx="18" ry="5" fill="#8b5cf6" />
              <line x1="30" y1="175" x2="140" y2="140" stroke={boneJoint} strokeWidth="5" />
              <line x1="140" y1="140" x2="132" y2="110" stroke={boneJoint} strokeWidth="6" />
              <circle cx="145" cy="98" r="8" fill="#64748b" />
            </g>

            {/* PANEL 2: ② ISOMÉTRICO CON TEMBLOR */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② CORE REACTIVO (Temblor aire)</text>
              <rect x="110" y="115" width="45" height="8" fill="#475569" />
              <ellipse cx="132" cy="110" rx="18" ry="5" fill="#8b5cf6" />
              <line x1="30" y1="175" x2="140" y2="140" stroke="#10b981" strokeWidth="5" />
              <line x1="140" y1="140" x2="132" y2="110" stroke="#10b981" strokeWidth="6" />
              <circle cx="145" cy="98" r="8" fill="#64748b" />
            </g>
          </svg>
        );

      // EX-C05: Bird-Dog con Rodilla sobre Cojín
      case 'EX-C05':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① RODILLA EN COJÍN */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① RODILLA SOBRE COJÍN</text>
              <rect x="30" y="155" width="120" height="5" fill="#38bdf8" />
              <ellipse cx="110" cy="150" rx="18" ry="5" fill="#8b5cf6" />
              <line x1="60" y1="125" x2="120" y2="125" stroke={boneJoint} strokeWidth="6" />
              <circle cx="130" cy="120" r="8" fill="#64748b" />
            </g>

            {/* PANEL 2: ② EXTENSIÓN INESTABLE */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② EXTENSIÓN Y ESTABILIZACIÓN</text>
              <rect x="30" y="155" width="120" height="5" fill="#38bdf8" />
              <ellipse cx="110" cy="150" rx="18" ry="5" fill="#8b5cf6" />
              <line x1="60" y1="125" x2="120" y2="125" stroke="#10b981" strokeWidth="6" />
              <circle cx="130" cy="120" r="8" fill="#64748b" />
              <line x1="120" y1="125" x2="160" y2="125" stroke={motionArrow} strokeWidth="3" />
            </g>
          </svg>
        );

      // EX-C06: Apoyo Monopodal sobre Cojín
      case 'EX-C06':
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#faf5ff" rx="12" />
            <line x1="190" y1="15" x2="190" y2="185" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* PANEL 1: ① EQUILIBRIO 1 PIERNA */}
            <g transform="translate(0, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#f3e8ff" />
              <text x="95" y="26" fontSize="9.5" fill="#6b21a8" fontWeight="extrabold" textAnchor="middle">① EQUILIBRIO (1 Pie en Cojín)</text>
              <line x1="150" y1="20" x2="150" y2="175" stroke="#475569" strokeWidth="5" />
              <ellipse cx="100" cy="170" rx="22" ry="6" fill="#8b5cf6" />
              <line x1="100" y1="165" x2="100" y2="80" stroke={boneJoint} strokeWidth="6" />
              <circle cx="100" cy="65" r="9" fill="#64748b" />
            </g>

            {/* PANEL 2: ② MICROFLEXIÓN 30S */}
            <g transform="translate(190, 0)">
              <rect x="15" y="12" width="160" height="20" rx="6" fill="#e9d5ff" />
              <text x="95" y="26" fontSize="9.5" fill="#581c87" fontWeight="extrabold" textAnchor="middle">② PROPIOCEPCIÓN (Glúteo Medio)</text>
              <line x1="150" y1="20" x2="150" y2="175" stroke="#475569" strokeWidth="5" />
              <ellipse cx="100" cy="170" rx="22" ry="6" fill="#8b5cf6" />
              <line x1="100" y1="165" x2="100" y2="80" stroke="#10b981" strokeWidth="6" />
              <circle cx="100" cy="65" r="9" fill="#64748b" />
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full select-none">
            <rect width="380" height="200" fill="#f8fafc" rx="12" />
            <text x="190" y="105" fontSize="12" fill="#64748b" fontWeight="bold" textAnchor="middle">Infografía Biomecánica Detallada (Múltiples Posiciones)</text>
          </svg>
        );
    }
  };

  return (
    <div className={`w-full ${heightClasses} flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-200 ${className}`}>
      {renderStoryboardGraphic()}
    </div>
  );
};
