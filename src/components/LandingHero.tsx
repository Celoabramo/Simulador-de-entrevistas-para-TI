import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { Video, ShieldAlert, Sparkles, Check, ArrowRight, Mic, Code2, Award, Zap } from 'lucide-react';

interface LandingHeroProps {
  language: Language;
  onStartInterview: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ language, onStartInterview }) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Header & Central CTA */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="text-xs font-semibold text-blue-600 tracking-wide uppercase mb-3">
              {t.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-5">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* Central Main Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartInterview}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3 group"
              >
                <span>{t.heroCta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{language === 'pt' ? '1ª Simulação Grátis inclusa no cadastro' : '1 Free trial simulation included'}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative max-w-5xl mx-auto mt-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
              <img
                src="/src/assets/images/hero_tech_interview_session_1793193588529.jpg"
                alt="Simulação de Entrevista Técnica no Google Meet"
                className="w-full h-auto object-cover max-h-[500px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white max-w-xl">
                  <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Google Meet Real-Time Audio & Video Interface</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {language === 'pt'
                      ? 'Não decore respostas. Treine o raciocínio sob interrupção e pressão real.'
                      : 'Do not memorize answers. Practice live thinking under authentic technical pressure.'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Proof Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
                <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mb-1">
                  {t.statsPassRate}
                </div>
                <div className="text-xs text-slate-500">{t.statsPassRateLabel}</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
                <div className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums mb-1">
                  {t.statsSalary}
                </div>
                <div className="text-xs text-slate-500">{t.statsSalaryLabel}</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
                <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums mb-1">
                  {t.statsFeedbackTime}
                </div>
                <div className="text-xs text-slate-500">{t.statsFeedbackTimeLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {language === 'pt' ? 'Como funciona a jornada' : 'How the journey works'}
            </h2>
            <p className="text-sm text-slate-600">
              {language === 'pt'
                ? 'Em apenas 3 etapas você testa seus limites e recebe o relatório de preparação.'
                : 'Test your limits and receive actionable hiring feedback in 3 steps.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">01 / SETUP</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'pt' ? 'Cruzamento Currículo + Vaga' : 'CV + Job Cross-Analysis'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'pt'
                  ? 'Você cola a descrição da vaga (LinkedIn/Google/Amazon) e seu currículo. A IA identifica gaps e gera perguntas personalizadas.'
                  : 'Paste your target job posting and technical resume. The AI spots potential weak points and tailors targeted questions.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">02 / SIMULAÇÃO</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'pt' ? 'Chamada Google Meet ao Vivo' : 'Live Google Meet Call'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'pt'
                  ? 'Você entra na videoconferência, liga sua câmera e responde por voz em inglês. O entrevistador reage, interrompe e manda código no chat.'
                  : 'Step into an authentic video call, toggle your webcam, and speak in English. The interviewer counter-questions and drops challenges in the chat.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">03 / VEREDITO</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'pt' ? 'Veredito & Gabarito Sênior' : 'Verdict & Senior Scripts'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'pt'
                  ? 'Receba o carimbo de Aprovação/Reprovação e veja exatamente o que um Staff Engineer nativo teria falado no seu lugar.'
                  : 'Get an instant pass/fail hiring score and discover verbatim how a Silicon Valley staff engineer would phrase your answers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIFFERENTIATORS vs CHATGPT */}
      <section id="differentiators" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {language === 'pt'
                ? 'Por que o ChatGPT não prepara você para a vida real'
                : 'Why standard ChatGPT fails to prepare you'}
            </h2>
            <p className="text-sm text-slate-600">
              {language === 'pt'
                ? 'Conversar com um chatbot de texto não gera a pressão psicológica de uma tela de entrevista.'
                : 'Text chatbots cannot simulate the psychological tension of an international video screening.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-7 rounded-2xl bg-white border border-rose-200">
              <div className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">
                {language === 'pt' ? 'O Jeito Antigo (ChatGPT / Textos)' : 'The Generic Chatbot Way'}
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{language === 'pt' ? 'Respostas digitadas sem pressão de voz em inglês.' : 'Typing answers without real spoken English pressure.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{language === 'pt' ? 'Feedback genérico que sempre elogia e não reprova ninguém.' : 'Polite generic feedback that never gives a realistic hiring rejection.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{language === 'pt' ? 'Zero contexto visual de uma reunião corporativa internacional.' : 'Zero corporate videoconference pressure or webcam eye contact.'}</span>
                </li>
              </ul>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-blue-200 shadow-sm">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                {language === 'pt' ? 'Com o SimulaTech AI' : 'With SimulaTech AI'}
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'pt' ? 'Interface Google Meet autêntica com áudio em tempo real.' : 'Authentic Google Meet UI with live voice evaluation.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'pt' ? 'Veredito rigoroso de Tech Lead: Passaria na vaga? Sim ou Não.' : 'Rigorous Tech Lead bar: Would you pass the interview? Yes or No.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'pt' ? 'Comparativo com falas de desenvolvedores nativos do Vale.' : 'Verbatim comparisons with native Silicon Valley engineers.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION (Validating Solution 1: R$ 39 vs R$ 79 vs R$ 119) */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {language === 'pt' ? 'Preços transparentes e calibrados' : 'Simple, transparent pricing'}
            </h2>
            <p className="text-sm text-slate-600">
              {language === 'pt'
                ? 'Sem assinaturas recorrentes com pegadinha. Pague apenas pelo que treinar.'
                : 'No recurring subscription traps. Pay only for the sessions you practice.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {language === 'pt' ? 'Degustação' : 'Free Trial'}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">R$ 0</div>
                <div className="text-xs text-slate-500 mb-6">
                  {language === 'pt' ? 'Disponível no cadastro' : 'Included on signup'}
                </div>
                <ul className="space-y-3 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? '1 Simulação completa no Google Meet' : '1 Full Google Meet simulation'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? 'Score Geral (0 a 100%)' : 'Overall Score (0-100%)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? 'Carimbo de Aprovação / Reprovação' : 'Pass / Fail Verdict Stamp'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartInterview}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {language === 'pt' ? 'Começar Grátis' : 'Start Free'}
              </button>
            </div>

            {/* Single Session */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {language === 'pt' ? 'Sessão Avulsa' : 'Single Session'}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">R$ 39</div>
                <div className="text-xs text-slate-500 mb-6">
                  {language === 'pt' ? 'Pagamento único' : 'One-time payment'}
                </div>
                <ul className="space-y-3 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? '1 Simulação completa' : '1 Full simulation'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? 'Relatório linha a linha desbloqueado' : 'Full diagnostic report unlocked'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? 'Gabarito comparativo com dev nativo' : 'Native dev comparative rephrasings'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'pt' ? 'Plano de estudos em 3 passos' : '3-Step immediate action plan'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartInterview}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {language === 'pt' ? 'Escolher Avulso' : 'Choose Single'}
              </button>
            </div>

            {/* 3 Sessions Pack (Recommended) */}
            <div className="p-7 rounded-2xl bg-slate-900 text-white border-2 border-blue-500 relative flex flex-col justify-between shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                {language === 'pt' ? 'Mais Recomendado · Economize 32%' : 'Best Value · Save 32%'}
              </div>

              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase mb-2">
                  {language === 'pt' ? 'Pacote 3 Simulações' : '3-Pack Sprint'}
                </div>
                <div className="text-3xl font-extrabold mb-1">R$ 79</div>
                <div className="text-xs text-slate-400 mb-6">
                  {language === 'pt' ? 'Apenas R$ 26,30 por sessão' : 'Only $5.30 per session'}
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{language === 'pt' ? '3 Simulações completas no Google Meet' : '3 Full Google Meet sessions'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{language === 'pt' ? '3 Relatórios com diagnósticos completos' : '3 In-depth diagnostic reports'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{language === 'pt' ? 'Voz com sotaque americano & britânico' : 'US and UK accent interviewer voices'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>{language === 'pt' ? 'Gabarito linha a linha e plano de estudos' : 'Line-by-line feedback & action plan'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartInterview}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md"
              >
                {language === 'pt' ? 'Garantir Pacote de 3' : 'Get 3-Pack Now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {t.brandName}. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>{language === 'pt' ? 'Preparação para Vagas Globais' : 'Global Tech Career Prep'}</span>
            <span>·</span>
            <span>{language === 'pt' ? 'Tecnologia & Inglês Técnico' : 'Tech & English Fluency'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
