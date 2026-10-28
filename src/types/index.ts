export type Language = 'pt' | 'en';

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  hasUsedFreeTrial: boolean;
}

export interface Interviewer {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  style: string;
  voice: string;
}

export interface Message {
  id: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  isSnippet?: boolean;
}

export interface RephrasingExample {
  candidateQuote: string;
  seniorTechLeadRephrase: string;
  explanation: string;
}

export interface Evaluation {
  score: number;
  status: 'APROVADO' | 'REPROVADO_NA_ETAPA' | 'RISCO_ALTO';
  cameraFactor: {
    status: 'OPTIMAL' | 'CRITICAL_RISK';
    message: string;
  };
  englishScore: number;
  technicalScore: number;
  communicationScore: number;
  summary: string;
  detailedStrengths: string[];
  criticalWeaknesses: string[];
  rephrasingExamples: RephrasingExample[];
  actionPlan: string[];
}

export type AppView = 'landing' | 'setup' | 'interview' | 'verdict';
