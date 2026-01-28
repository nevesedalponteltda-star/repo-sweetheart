import React, { useState } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Inline styles to ensure they work even if Tailwind fails to load
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    } as React.CSSProperties,
    wrapper: {
      width: '100%',
      maxWidth: '400px'
    } as React.CSSProperties,
    logoContainer: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    logoIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      marginBottom: '1rem'
    } as React.CSSProperties,
    logoText: {
      fontSize: '2rem',
      fontWeight: 900,
      color: '#2563eb'
    } as React.CSSProperties,
    title: {
      fontSize: '1.875rem',
      fontWeight: 900,
      color: '#ffffff',
      letterSpacing: '-0.025em'
    } as React.CSSProperties,
    subtitle: {
      color: '#93c5fd',
      marginTop: '0.5rem',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      padding: '2rem'
    } as React.CSSProperties,
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '0.5rem',
      textAlign: 'center' as const
    },
    cardSubtitle: {
      color: '#6b7280',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      fontSize: '0.875rem'
    },
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#b91c1c',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    successBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    } as React.CSSProperties,
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.5rem'
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#111827',
      outline: 'none',
      transition: 'all 0.2s'
    } as React.CSSProperties,
    button: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: 700,
      padding: '0.875rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '0.5rem'
    } as React.CSSProperties,
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    } as React.CSSProperties,
    switchContainer: {
      marginTop: '1.5rem',
      textAlign: 'center' as const
    },
    switchText: {
      color: '#6b7280',
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
    },
    footerText: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      color: '#93c5fd',
      fontSize: '0.75rem'
    } as React.CSSProperties
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <span style={styles.logoText}>P</span>
          </div>
          <h1 style={styles.title}>
            Pro<span style={{ color: '#93c5fd' }}>Invoice</span>
          </h1>
          <p style={styles.subtitle}>Sistema de Faturamento Profissional</p>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p style={styles.cardSubtitle}>
            {isLogin
              ? 'Entre para acessar seu painel.'
              : 'Comece a gerenciar suas faturas.'}
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={styles.input}
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
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerText}>
            <span>🔒 Conexão Segura</span>
            <span>🛡️ Dados Protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
