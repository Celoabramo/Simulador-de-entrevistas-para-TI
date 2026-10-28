/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppView, Evaluation, Interviewer, Language, Message, User } from './types';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { AuthModal } from './components/AuthModal';
import { SetupScreen } from './components/SetupScreen';
import { GoogleMeetRoom } from './components/GoogleMeetRoom';
import { VereditoScreen } from './components/VereditoScreen';

export default function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Setup & Interview state
  const [isInitializing, setIsInitializing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [lastResumeText, setLastResumeText] = useState('');
  const [lastJobDescription, setLastJobDescription] = useState('');
  const [cameraInitiallyOn, setCameraInitiallyOn] = useState(true);

  const [interviewer, setInterviewer] = useState<Interviewer>({
    name: 'David Keller',
    role: 'Director of Engineering',
    company: 'CloudScale Inc. (San Francisco)',
    avatarUrl: '/src/assets/images/interviewer_marcus_google_1793193588462.jpg',
    style: 'Direct, focused on trade-offs and verbal reasoning',
    voice: 'Fenrir',
  });
  const [initialGreeting, setInitialGreeting] = useState('');
  const [initialChatSnippet, setInitialChatSnippet] = useState('');

  // Evaluation & Paywall state
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);

  // User clicks "Fazer Entrevista" from Landing
  const handleStartInterviewClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentView('setup');
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView('setup');
  };

  // Launch interview from setup screen
  const handleLaunchMeeting = async (setupData: {
    resumeText: string;
    jobDescription: string;
    targetRole: string;
    level: string;
    interviewType: string;
    cameraOn: boolean;
  }) => {
    setIsInitializing(true);
    setTargetRole(setupData.targetRole);
    setLastResumeText(setupData.resumeText);
    setLastJobDescription(setupData.jobDescription);
    setCameraInitiallyOn(setupData.cameraOn);

    try {
      const res = await fetch('/api/interview/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setupData,
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInterviewer(data.interviewer);
        setInitialGreeting(data.greeting);
        setInitialChatSnippet(data.chatSnippet || '');
        setCurrentView('interview');
      }
    } catch (err) {
      console.error('Failed to init meeting:', err);
      // Fallback
      setInitialGreeting(
        "Hello! I'm David Keller, Director of Engineering. Welcome to this technical discussion. Let's start with your background in distributed systems and architecture."
      );
      setCurrentView('interview');
    } finally {
      setIsInitializing(false);
    }
  };

  // Default fallback evaluation
  const defaultEvaluation: Evaluation = {
    score: 64,
    status: 'REPROVADO_NA_ETAPA',
    cameraFactor: {
      status: cameraInitiallyOn ? 'OPTIMAL' : 'CRITICAL_RISK',
      message: cameraInitiallyOn
        ? 'Câmera ligada: Demonstrou engajamento visual pleno.'
        : 'Câmera desligada: Em processos seletivos dos EUA/Europa, manter a câmera fechada é motivo de desclassificação imediata.',
    },
    englishScore: 62,
    technicalScore: 70,
    communicationScore: 63,
    summary: 'O candidato possui boa fundamentação técnica, mas hesitou em momentos de pressão e utilizou respostas curtas que não demonstraram a profundidade de um profissional sênior.',
    detailedStrengths: [
      'Identificação rápida dos conceitos de concorrência e banco de dados.',
      'Boa postura e prontidão para a entrevista técnica.',
    ],
    criticalWeaknesses: [
      'Uso frequente de vícios de fala ("uhm", "like", "you know") durante momentos de raciocínio sob pressão.',
      'Dificuldade em pensar em voz alta ("think out loud") ao formular os trade-offs de escalabilidade.',
    ],
    rephrasingExamples: [
      {
        candidateQuote: "I think maybe we can put Redis because it is fast and easy to do.",
        seniorTechLeadRephrase: "We should introduce an in-memory Redis cluster as a look-aside cache to protect the primary PostgreSQL database from read spikes, reducing P99 latency to sub-5ms.",
        explanation: "Substitui uma fala hesitante por uma justificativa arquitetural precisa com métricas quantitativas.",
      },
      {
        candidateQuote: "If the server breaks, we just restart and see what happened in logs.",
        seniorTechLeadRephrase: "To ensure high availability and fast MTTR, we should configure health-check probes in Kubernetes for automated pod eviction, paired with distributed tracing via OpenTelemetry to diagnose the root cause.",
        explanation: "Demonstra maturidade sênior com termos técnicos da indústria (MTTR, OpenTelemetry).",
      },
    ],
    actionPlan: [
      'Treinar o framework STAR (Situation, Task, Action, Result) especificamente para System Design em inglês.',
      'Eliminar vícios de fala praticando pausas silenciosas intencionais em vez de interjeições como "uhm" e "ehh".',
      'Estudar vocabulário de concorrência e consistência de dados (CAP theorem, eventual consistency, idempotency).',
    ],
  };

  // Finish interview and compute evaluation
  const handleFinishInterview = async (conversation: Message[], cameraOn: boolean) => {
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation,
          jobDescription: lastJobDescription,
          resumeText: lastResumeText,
          cameraOn,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setEvaluation(defaultEvaluation);
      }

      // Deduct 1 credit if user has credits
      if (user && user.credits > 0) {
        setUser({
          ...user,
          credits: Math.max(0, user.credits - 1),
          hasUsedFreeTrial: true,
        });
      }

      setIsReportUnlocked(false);
      setCurrentView('verdict');
    } catch (err) {
      console.error('Failed to evaluate conversation:', err);
      setEvaluation(defaultEvaluation);
      setCurrentView('verdict');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleUnlockReport = (plan: 'single' | 'package') => {
    setIsReportUnlocked(true);
    if (plan === 'package' && user) {
      setUser({
        ...user,
        credits: user.credits + 3,
      });
    }
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Show header on non-interview screens */}
      {currentView !== 'interview' && (
        <Header
          language={language}
          setLanguage={setLanguage}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onStartClick={handleStartInterviewClick}
          onNavClick={handleScrollTo}
          currentView={currentView}
          onGoHome={() => setCurrentView('landing')}
        />
      )}

      {/* Screen 0: Landing Presentation */}
      {currentView === 'landing' && (
        <LandingHero language={language} onStartInterview={handleStartInterviewClick} />
      )}

      {/* Screen 1: Setup & Calibration */}
      {currentView === 'setup' && (
        <SetupScreen
          language={language}
          onBack={() => setCurrentView('landing')}
          onLaunchMeeting={handleLaunchMeeting}
          isInitializing={isInitializing}
        />
      )}

      {/* Screen 2: Google Meet Live Video Simulation */}
      {currentView === 'interview' && (
        <GoogleMeetRoom
          language={language}
          interviewer={interviewer}
          initialGreeting={initialGreeting}
          initialChatSnippet={initialChatSnippet}
          cameraInitiallyOn={cameraInitiallyOn}
          onFinishInterview={handleFinishInterview}
          onLeaveHome={() => setCurrentView('landing')}
          targetRole={targetRole}
        />
      )}

      {/* Screen 3: Gamified Veredito & Senior Diagnostic */}
      {currentView === 'verdict' && (
        <VereditoScreen
          language={language}
          evaluation={evaluation || defaultEvaluation}
          onRetake={() => setCurrentView('setup')}
          onUnlockReport={handleUnlockReport}
          isUnlocked={isReportUnlocked}
        />
      )}

      {/* Loading Overlay when generating evaluation */}
      {isEvaluating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-1">
            {language === 'pt' ? 'Comitê de Contratação Avaliando...' : 'Hiring Committee Deliberating...'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm">
            {language === 'pt'
              ? 'Calculando seu score de aprovação, analisando vocabulário de inglês e comparando com padrões de Tech Leads.'
              : 'Calculating hiring score, analyzing technical English fluency, and comparing against senior engineering standards.'}
          </p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        language={language}
      />
    </div>
  );
}
