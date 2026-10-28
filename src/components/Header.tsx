import React from 'react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { Globe, User as UserIcon, Sparkles } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  onOpenAuth: () => void;
  onStartClick: () => void;
  onNavClick: (section: string) => void;
  currentView: string;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  user,
  onOpenAuth,
  onStartClick,
  onNavClick,
  currentView,
  onGoHome,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-blue-600 transition-colors">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {t.brandName}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean text, no pill badges) */}
        {currentView === 'landing' ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavClick('how-it-works')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'pt' ? 'Como Funciona' : 'How it works'}
            </button>
            <button
              onClick={() => onNavClick('differentiators')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'pt' ? 'Diferenciais' : 'Features'}
            </button>
            <button
              onClick={() => onNavClick('pricing')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'pt' ? 'Planos & Créditos' : 'Pricing'}
            </button>
          </nav>
        ) : (
          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            {currentView === 'setup' && (language === 'pt' ? 'Passo 1 de 2: Calibração da Vaga' : 'Step 1 of 2: Setup')}
            {currentView === 'interview' && (language === 'pt' ? 'Sessão ao vivo em andamento' : 'Live session in progress')}
            {currentView === 'verdict' && (language === 'pt' ? 'Diagnóstico pós-entrevista' : 'Post-interview evaluation')}
          </div>
        )}

        {/* Zone 3: Actions & Language Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'pt'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Português"
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* User Credits or Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="text-xs font-medium text-slate-600">
                {user.credits > 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    {user.credits} {t.credits}
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">0 {t.credits}</span>
                )}
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              {t.login}
            </button>
          )}

          {/* Primary Action Button */}
          {currentView === 'landing' && (
            <button
              onClick={onStartClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap"
            >
              {t.startInterview}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
