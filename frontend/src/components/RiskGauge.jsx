import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function RiskGauge({ score, size = 160, labelTextOverride }) {
  const { t } = useLanguage();
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Safe clamp between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let gradientId = 'gaugeGradientLow';
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let labelText = labelTextOverride || t('lowRisk');
  let badgeBg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

  if (normalizedScore >= 70) {
    gradientId = 'gaugeGradientHigh';
    glowColor = 'rgba(239, 68, 68, 0.45)';
    labelText = labelTextOverride || t('highRisk');
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (normalizedScore >= 30) {
    gradientId = 'gaugeGradientSuspicious';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    labelText = labelTextOverride || t('suspicious');
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Subtle ambient backglow */}
      <div
        className="absolute inset-4 rounded-full blur-xl pointer-events-none transition-all duration-700 opacity-60"
        style={{ backgroundColor: glowColor }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="gaugeGradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="gaugeGradientSuspicious" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="gaugeGradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 10px ${glowColor})`
          }}
        />
      </svg>

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-2">
        <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
          {normalizedScore}
        </span>
        <span className={`px-2 py-0.5 mt-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border max-w-[90%] truncate ${badgeBg}`}>
          {labelText}
        </span>
        <span className="text-[10px] text-slate-400 font-medium mt-0.5">{t('outOf100')}</span>
      </div>
    </div>
  );
}
