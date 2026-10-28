import React, { useState } from 'react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim() || (email.split('@')[0] || 'Desenvolvedor'),
      email: email.trim() || 'dev@example.com',
      credits: 1, // 1 free trial simulation included
      hasUsedFreeTrial: false,
    };
    onSuccess(newUser);
    onClose();
  };

  const handleQuickDemo = () => {
    const demoUser: User = {
      id: 'usr_demo',
      name: 'Lucas Silva',
      email: 'lucas.tech@gmail.com',
      credits: 1,
      hasUsedFreeTrial: false,
    };
    onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-semibold text-blue-600 mb-1">
            {language === 'pt' ? 'ACESSO IMEDIATO' : 'INSTANT ACCESS'}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isSignUp
              ? language === 'pt'
                ? 'Crie sua conta e ganhe 1 simulação grátis'
                : 'Create your account & get 1 free simulation'
              : language === 'pt'
              ? 'Acesse sua conta'
              : 'Sign in to your account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'pt'
              ? 'Treine com IAs de Tech Lead sob pressão real antes da sua entrevista oficial.'
              : 'Practice high-pressure technical interviews before your real hiring loop.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {language === 'pt' ? 'Nome Completo' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Silva"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'pt' ? 'E-mail profissional' : 'Email address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'pt' ? 'Senha' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {isSignUp
                ? language === 'pt'
                  ? 'Criar Conta e Receber 1 Simulação Grátis'
                  : 'Sign Up & Claim 1 Free Simulation'
                : language === 'pt'
                ? 'Entrar na Plataforma'
                : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-600 hover:text-blue-600 font-medium"
          >
            {isSignUp
              ? language === 'pt'
                ? 'Já possui uma conta? Faça login'
                : 'Already have an account? Sign In'
              : language === 'pt'
              ? 'Não tem conta? Crie uma grátis'
              : "Don't have an account? Sign Up"}
          </button>

          <button
            onClick={handleQuickDemo}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
          >
            {language === 'pt' ? 'Acesso Rápido Demo' : '1-Click Fast Demo'}
          </button>
        </div>
      </div>
    </div>
  );
};
