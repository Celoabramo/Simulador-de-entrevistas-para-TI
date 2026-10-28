import React, { useState, useEffect } from 'react';
import { Evaluation, Language } from '../types';
import { translations } from '../utils/translations';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  TrendingUp,
  FileCheck2,
  Quote,
} from 'lucide-react';

interface VereditoScreenProps {
  language: Language;
  evaluation: Evaluation;
  onRetake: () => void;
  onUnlockReport: (plan: 'single' | 'package') => void;
  isUnlocked: boolean;
}

export const VereditoScreen: React.FC<VereditoScreenProps> = ({
  language,
  evaluation,
  onRetake,
  onUnlockReport,
  isUnlocked,
}) => {
  const t = translations[language];

  // Gamified score animated climbing
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    let current = 0;
    const target = evaluation.score;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedScore(target);
        setShowStamp(true);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [evaluation.score]);

  const isApproved = evaluation.status === 'APROVADO';
  const isHighRisk = evaluation.status === 'RISCO_ALTO';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            {t.verdictSubtitle}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.verdictTitle}
          </h1>
        </div>

        {/* 1. GAMIFIED VERDICT HERO BANNER */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center">
          {/* Subtle background glow */}
          <div
            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isApproved ? 'bg-emerald-500' : isHighRisk ? 'bg-amber-500' : 'bg-red-500'
            }`}
          />

          {/* Animated Numeric Counter */}
          <div className="relative z-10 mb-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {t.overallScore}
            </div>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <span
                className={`text-6xl sm:text-7xl font-black tabular-nums transition-colors duration-300 ${
                  animatedScore >= 75
                    ? 'text-emerald-400'
                    : animatedScore >= 60
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {animatedScore}
              </span>
              <span className="text-2xl text-slate-500 font-semibold">/ 100</span>
            </div>

            {/* Gamified progress bar */}
            <div className="w-full max-w-md mx-auto h-3 bg-slate-800 rounded-full overflow-hidden mt-4 p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  animatedScore >= 75
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    : animatedScore >= 60
                    ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                    : 'bg-gradient-to-r from-red-600 to-red-400'
                }`}
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>

          {/* Dramatic Verdict Stamp */}
          {showStamp && (
            <div className="relative z-10 transform scale-100 transition-all duration-300">
              <div
                className={`inline-block px-6 py-2.5 rounded-xl border-2 font-black text-sm sm:text-base uppercase tracking-wider shadow-lg ${
                  isApproved
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 rotate-[-1deg]'
                    : isHighRisk
                    ? 'border-amber-500 bg-amber-950/60 text-amber-300 rotate-[1deg]'
                    : 'border-red-500 bg-red-950/60 text-red-300 rotate-[-2deg]'
                }`}
              >
                {isApproved
                  ? `[ ${t.approvedBadge} ]`
                  : isHighRisk
                  ? `[ ${t.riskBadge} ]`
                  : `[ ${t.rejectedBadge} ]`}
              </div>
            </div>
          )}

          <p className="relative z-10 text-sm text-slate-300 mt-6 max-w-xl mx-auto leading-relaxed">
            {evaluation.summary}
          </p>
        </div>

        {/* 2. CAMERA PROFESSIONALISM FACTOR */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            evaluation.cameraFactor.status === 'OPTIMAL'
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
          }`}
        >
          {evaluation.cameraFactor.status === 'OPTIMAL' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <div className="font-bold text-sm mb-0.5">{t.cameraFactorTitle}</div>
            <div className="leading-relaxed opacity-90">{evaluation.cameraFactor.message}</div>
          </div>
        </div>

        {/* 3. THREE CORE PILLARS SCORES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">{t.englishFluency}</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {evaluation.englishScore}%
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${evaluation.englishScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">{t.techAccuracy}</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {evaluation.technicalScore}%
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${evaluation.technicalScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">{t.communication}</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {evaluation.communicationScore}%
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${evaluation.communicationScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. PAYWALL UNLOCK OR UNLOCKED DETAILED DIAGNOSTIC */}
        {!isUnlocked ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            {/* Blurred Teaser Behind */}
            <div className="filter blur-md opacity-30 select-none pointer-events-none space-y-6">
              <div className="h-6 w-1/3 bg-slate-700 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-800 rounded" />
                <div className="h-4 w-4/6 bg-slate-800 rounded" />
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="h-4 w-1/2 bg-blue-500/40 rounded mb-2" />
                <div className="h-4 w-full bg-slate-700 rounded" />
              </div>
            </div>

            {/* Foreground Paywall Card */}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {t.unlockFullReportTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
                {t.unlockFullReportDesc}
              </p>

              {/* Pricing Cards Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl text-left">
                {/* Single Unlock */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400">
                      {language === 'pt' ? 'Desbloquear esta simulação' : 'Single Report Unlock'}
                    </div>
                    <div className="text-2xl font-black text-white font-mono my-1">
                      {t.singleReportPrice}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {language === 'pt' ? 'Gabarito completo e plano de ação' : 'Full script & action plan'}
                    </div>
                  </div>
                  <button
                    onClick={() => onUnlockReport('single')}
                    className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                  >
                    {language === 'pt' ? 'Desbloquear Relatório (R$ 39)' : 'Unlock Report ($8)'}
                  </button>
                </div>

                {/* 3-Pack Best Value */}
                <div className="p-4 rounded-xl bg-blue-950/60 border-2 border-blue-500 flex flex-col justify-between relative shadow-lg">
                  <div className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {t.packageReportBadge}
                  </div>
                  <div>
                    <div className="text-xs text-blue-300 font-semibold">
                      {language === 'pt' ? 'Pacote 3 Simulações' : '3-Session Sprint'}
                    </div>
                    <div className="text-2xl font-black text-white font-mono my-1">
                      {t.packageReportPrice}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {language === 'pt' ? '3 chamadas completas + 3 relatórios' : '3 Full calls + 3 reports'}
                    </div>
                  </div>
                  <button
                    onClick={() => onUnlockReport('package')}
                    className="w-full mt-4 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                  >
                    {language === 'pt' ? 'Garantir Pacote (R$ 79)' : 'Get 3-Pack ($16)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* UNLOCKED FULL DETAILED DIAGNOSTIC */
          <div className="space-y-6">
            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-emerald-900/40">
                <div className="text-xs font-semibold uppercase text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.strengths}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {evaluation.detailedStrengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-red-900/40">
                <div className="text-xs font-semibold uppercase text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.criticalGaps}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {evaluation.criticalWeaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">!</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Senior Dev Verbatim Rephrasing Comparison */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Quote className="w-4 h-4 text-blue-400" />
                <span>{t.rephrasingTitle}</span>
              </div>

              <div className="space-y-4">
                {evaluation.rephrasingExamples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="text-xs">
                      <span className="text-red-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                        {language === 'pt' ? 'Como você disse:' : 'How you said it:'}
                      </span>
                      <p className="text-slate-300 italic font-mono bg-red-950/20 p-2 rounded border border-red-900/30">
                        "{ex.candidateQuote}"
                      </p>
                    </div>

                    <div className="text-xs">
                      <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                        {language === 'pt' ? 'Como um Tech Lead nativo falaria:' : 'How a Native Senior Tech Lead would phrase it:'}
                      </span>
                      <p className="text-emerald-200 font-mono bg-emerald-950/30 p-2.5 rounded border border-emerald-800/40 font-medium">
                        "{ex.seniorTechLeadRephrase}"
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <strong className="text-slate-300">{language === 'pt' ? 'Por que funciona:' : 'Why it works:'}</strong> {ex.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Step Action Plan */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-blue-900/50 space-y-4">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{t.actionPlanTitle}</span>
              </div>

              <div className="space-y-3">
                {evaluation.actionPlan.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Retake / New Simulation CTA */}
        <div className="text-center pt-6 border-t border-slate-800">
          <button
            onClick={onRetake}
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retakeInterview}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
