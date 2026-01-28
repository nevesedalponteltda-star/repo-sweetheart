import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import proinvoiceLogo from '@/assets/proinvoice-logo.png';
import featureDashboard from '@/assets/feature-dashboard.png';
import featureInvoice from '@/assets/feature-invoice.png';
import featureClients from '@/assets/feature-clients.png';

const features = [
  {
    id: 1,
    title: 'Dashboard Inteligente',
    description: 'Visualize todas as suas faturas em um painel organizado com filtros por status, busca rápida e métricas de faturamento.',
    image: featureDashboard,
    icon: '📊'
  },
  {
    id: 2,
    title: 'Criação de Faturas',
    description: 'Crie faturas profissionais com cálculo automático de impostos, descontos e conversão de moedas em tempo real.',
    image: featureInvoice,
    icon: '📄'
  },
  {
    id: 3,
    title: 'Gestão de Clientes',
    description: 'Cadastre e gerencie seus clientes com facilidade. Dados salvos para uso rápido em novas faturas.',
    image: featureClients,
    icon: '👥'
  }
];

const benefits = [
  { icon: '⚡', title: 'Rápido', desc: 'Crie faturas em segundos' },
  { icon: '🔒', title: 'Seguro', desc: 'Dados criptografados' },
  { icon: '📱', title: 'Responsivo', desc: 'Use em qualquer dispositivo' },
  { icon: '🌍', title: 'Multi-moeda', desc: 'Suporte a várias moedas' }
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
      setCurrentFeature((prev) => (prev + 1) % features.length);
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

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#0f172a'
    } as React.CSSProperties,
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      padding: '3rem',
      position: 'relative' as const,
      overflow: 'hidden'
    } as React.CSSProperties,
    leftOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
      pointerEvents: 'none' as const
    } as React.CSSProperties,
    leftContent: {
      position: 'relative' as const,
      zIndex: 1,
      maxWidth: '600px',
      margin: '0 auto'
    } as React.CSSProperties,
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: 900,
      color: '#ffffff',
      marginBottom: '1rem',
      lineHeight: 1.2
    } as React.CSSProperties,
    heroSubtitle: {
      fontSize: '1.125rem',
      color: '#93c5fd',
      marginBottom: '2rem',
      lineHeight: 1.6
    } as React.CSSProperties,
    featureCarousel: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '2rem'
    } as React.CSSProperties,
    featureImage: {
      width: '100%',
      height: '280px',
      objectFit: 'cover' as const,
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    } as React.CSSProperties,
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    } as React.CSSProperties,
    featureDesc: {
      fontSize: '0.9rem',
      color: '#bfdbfe',
      lineHeight: 1.5
    } as React.CSSProperties,
    dotsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    } as React.CSSProperties,
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s'
    } as React.CSSProperties,
    dotActive: {
      width: '24px',
      borderRadius: '4px',
      backgroundColor: '#ffffff'
    } as React.CSSProperties,
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem'
    } as React.CSSProperties,
    benefitCard: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '1rem',
      border: '1px solid rgba(255,255,255,0.1)'
    } as React.CSSProperties,
    benefitIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem'
    } as React.CSSProperties,
    benefitTitle: {
      fontSize: '0.875rem',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: '0.25rem'
    } as React.CSSProperties,
    benefitDesc: {
      fontSize: '0.75rem',
      color: '#93c5fd'
    } as React.CSSProperties,
    rightPanel: {
      width: '480px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      padding: '3rem'
    } as React.CSSProperties,
    logoContainer: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    } as React.CSSProperties,
    logoImg: {
      height: '48px',
      marginBottom: '1rem'
    } as React.CSSProperties,
    welcomeTitle: {
      fontSize: '1.75rem',
      fontWeight: 800,
      color: '#1e293b',
      marginBottom: '0.5rem'
    } as React.CSSProperties,
    welcomeSubtitle: {
      color: '#64748b',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.25rem'
    } as React.CSSProperties,
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    } as React.CSSProperties,
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151'
    } as React.CSSProperties,
    input: {
      padding: '0.875rem 1rem',
      backgroundColor: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '1rem',
      color: '#1e293b',
      outline: 'none',
      transition: 'all 0.2s'
    } as React.CSSProperties,
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    } as React.CSSProperties,
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    successBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    button: {
      padding: '1rem',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '1rem',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
    } as React.CSSProperties,
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    } as React.CSSProperties,
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '1.5rem 0'
    } as React.CSSProperties,
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#e2e8f0'
    } as React.CSSProperties,
    dividerText: {
      color: '#94a3b8',
      fontSize: '0.75rem',
      fontWeight: 500
    } as React.CSSProperties,
    switchContainer: {
      textAlign: 'center' as const
    } as React.CSSProperties,
    switchText: {
      color: '#64748b',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    switchButton: {
      color: '#2563eb',
      fontWeight: 600,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    footer: {
      marginTop: '2rem',
      textAlign: 'center' as const
    } as React.CSSProperties,
    footerText: {
      color: '#94a3b8',
      fontSize: '0.75rem'
    } as React.CSSProperties,
    mobileHide: {
      display: 'none'
    } as React.CSSProperties
  };

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={styles.container}>
      {/* Left Panel - Features Showcase */}
      {!isMobile && (
        <div style={styles.leftPanel}>
          <div style={styles.leftOverlay} />
          <div style={styles.leftContent}>
            <h1 style={styles.heroTitle}>
              Sistema de Faturamento<br />
              <span style={{ color: '#60a5fa' }}>Profissional</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Simplifique sua gestão financeira com faturas elegantes, 
              cálculos automáticos e controle total dos seus clientes.
            </p>

            {/* Feature Carousel */}
            <div style={styles.featureCarousel}>
              <img 
                src={features[currentFeature].image} 
                alt={features[currentFeature].title}
                style={styles.featureImage}
              />
              <h3 style={styles.featureTitle}>
                <span>{features[currentFeature].icon}</span>
                {features[currentFeature].title}
              </h3>
              <p style={styles.featureDesc}>
                {features[currentFeature].description}
              </p>
              
              {/* Dots */}
              <div style={styles.dotsContainer}>
                {features.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    style={{
                      ...styles.dot,
                      ...(index === currentFeature ? styles.dotActive : {})
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div style={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <div key={index} style={styles.benefitCard}>
                  <div style={styles.benefitIcon}>{benefit.icon}</div>
                  <div style={styles.benefitTitle}>{benefit.title}</div>
                  <div style={styles.benefitDesc}>{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Login Form */}
      <div style={{
        ...styles.rightPanel,
        ...(isMobile ? { width: '100%', padding: '2rem 1.5rem' } : {})
      }}>
        <div style={styles.logoContainer}>
          <img src={proinvoiceLogo} alt="ProInvoice" style={styles.logoImg} />
          <h2 style={styles.welcomeTitle}>
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p style={styles.welcomeSubtitle}>
            {isLogin
              ? 'Entre para acessar seu painel de faturas'
              : 'Comece a gerenciar suas faturas hoje'}
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === 'email' ? styles.inputFocus : {})
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocus : {})
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OU</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              style={styles.switchButton}
            >
              {isLogin ? 'Criar agora' : 'Fazer login'}
            </button>
          </p>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Ao continuar, você concorda com nossos<br />
            Termos de Uso e Política de Privacidade
          </p>
        </div>

        {/* Mobile Feature Preview */}
        {isMobile && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ 
              textAlign: 'center', 
              color: '#64748b', 
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem'
            }}>
              Funcionalidades
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  style={{ 
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div style={{ 
                    fontSize: '1.5rem',
                    marginBottom: '0.25rem',
                    opacity: currentFeature === index ? 1 : 0.5
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ 
                    fontSize: '0.625rem',
                    color: currentFeature === index ? '#2563eb' : '#94a3b8',
                    fontWeight: 600
                  }}>
                    {feature.title.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
