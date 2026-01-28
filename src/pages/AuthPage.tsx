import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import proinvoiceLogo from '@/src/assets/proinvoice-logo.png';
import featureDashboard from '@/src/assets/feature-dashboard.png';
import featureInvoice from '@/src/assets/feature-invoice.png';
import featureClients from '@/src/assets/feature-clients.png';

const features = [
  {
    title: 'Dashboard Inteligente',
    description: 'Acompanhe suas receitas, faturas pendentes e métricas em tempo real.',
    image: featureDashboard
  },
  {
    title: 'Faturas Profissionais',
    description: 'Crie faturas personalizadas com sua marca e exporte em PDF.',
    image: featureInvoice
  },
  {
    title: 'Gestão de Clientes',
    description: 'Organize todos os seus clientes em um só lugar.',
    image: featureClients
  }
];

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        setSuccess('Conta criada com sucesso! Você já pode fazer login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (err.message.includes('User already registered')) {
        setError('Este email já está cadastrado. Faça login.');
        setIsLogin(true);
      } else if (err.message.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(err.message || 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">
      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 lg:max-w-[50vw] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden flex-shrink-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 w-full h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src={proinvoiceLogo} alt="ProInvoice" className="h-10 xl:h-12 w-auto" />
            <span className="text-xl xl:text-2xl font-black text-white tracking-tight">
              Pro<span className="text-blue-200">Invoice</span>
            </span>
          </div>

          {/* Feature Carousel */}
          <div className="flex-1 flex flex-col justify-center min-h-0 py-6 overflow-hidden">
            <div className="mb-4 xl:mb-8 flex-shrink-0">
              <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2 xl:mb-4">
                {features[currentFeature].title}
              </h2>
              <p className="text-blue-100 text-base xl:text-lg max-w-md">
                {features[currentFeature].description}
              </p>
            </div>

            {/* Feature Image */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 xl:p-4 shadow-2xl overflow-hidden flex-shrink min-h-0">
              <img
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                className="w-full h-auto max-h-[40vh] object-contain rounded-lg shadow-lg transition-all duration-500"
              />
            </div>

            {/* Carousel Dots */}
            <div className="flex space-x-3 mt-4 xl:mt-8 flex-shrink-0">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentFeature
                      ? 'bg-white w-8'
                      : 'bg-white/40 w-3 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-3 gap-4 xl:gap-6 pt-6 xl:pt-8 border-t border-white/20 flex-shrink-0">
            <div>
              <p className="text-2xl xl:text-3xl font-bold text-white">10k+</p>
              <p className="text-blue-200 text-xs xl:text-sm">Faturas Geradas</p>
            </div>
            <div>
              <p className="text-2xl xl:text-3xl font-bold text-white">500+</p>
              <p className="text-blue-200 text-xs xl:text-sm">Empresas Ativas</p>
            </div>
            <div>
              <p className="text-2xl xl:text-3xl font-bold text-white">99.9%</p>
              <p className="text-blue-200 text-xs xl:text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Pro<span className="text-blue-600">Invoice</span>
            </h1>
            <p className="text-gray-500 mt-2">Sistema de Faturamento Profissional</p>
          </div>

          {/* Welcome Text (Desktop) */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="text-gray-500">
              {isLogin
                ? 'Entre para acessar seu painel de faturamento.'
                : 'Comece a gerenciar suas faturas de forma profissional.'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="lg:hidden text-xl font-bold text-gray-900 mb-6 text-center">
              {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Aguarde...
                  </span>
                ) : isLogin ? (
                  'Entrar'
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {isLogin ? 'Criar agora' : 'Fazer login'}
                </button>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center text-xs">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Conexão Segura
            </div>
            <div className="flex items-center text-xs">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Dados Protegidos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
