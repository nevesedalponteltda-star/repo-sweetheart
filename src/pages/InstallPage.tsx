import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import proinvoiceLogo from '@/src/assets/proinvoice-logo.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    height: '64px',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  titleAccent: {
    color: '#2563eb',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  installIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#eff6ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#111827',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  sectionText: {
    color: '#6b7280',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.875rem',
    color: '#374151',
    lineHeight: 1.5,
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    width: '100%',
    boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)',
  },
  divider: {
    borderTop: '1px solid #e5e7eb',
    margin: '1.5rem 0',
    paddingTop: '1.5rem',
  },
  benefitsTitle: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.75rem',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    color: '#22c55e',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    color: '#2563eb',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginTop: '1.5rem',
    textDecoration: 'none',
  },
};

const InstallPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={proinvoiceLogo} alt="ProInvoice" style={styles.logo} />
        <h1 style={styles.title}>
          Pro<span style={styles.titleAccent}>Invoice</span>
        </h1>
        <p style={styles.subtitle}>Instale o app no seu dispositivo</p>
      </div>

      <div style={styles.card}>
        {isInstalled ? (
          <div style={{ textAlign: 'center' }}>
            <div style={styles.successIcon}>
              <svg style={{ width: '32px', height: '32px', color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>App Instalado!</h2>
            <p style={styles.sectionText}>
              O ProInvoice já está instalado no seu dispositivo.
            </p>
            <Link to="/" style={{ ...styles.btnPrimary, display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
              Abrir App
            </Link>
          </div>
        ) : isIOS ? (
          <div>
            <h2 style={styles.sectionTitle}>Instalar no iPhone/iPad</h2>
            <p style={styles.sectionText}>Siga os passos abaixo:</p>
            <div style={styles.stepList}>
              <div style={styles.step}>
                <span style={styles.stepNumber}>1</span>
                <p style={styles.stepText}>
                  Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta) na barra do Safari
                </p>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>2</span>
                <p style={styles.stepText}>
                  Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>
                </p>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>3</span>
                <p style={styles.stepText}>
                  Toque em <strong>"Adicionar"</strong> no canto superior direito
                </p>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div style={{ textAlign: 'center' }}>
            <div style={styles.installIcon}>
              <svg style={{ width: '32px', height: '32px', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>Pronto para instalar!</h2>
            <p style={styles.sectionText}>
              Instale o ProInvoice para acesso rápido e funcionamento offline.
            </p>
            <button onClick={handleInstall} style={styles.btnPrimary}>
              Instalar Agora
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...styles.installIcon, backgroundColor: '#f3f4f6' }}>
              <svg style={{ width: '32px', height: '32px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>Instalar o App</h2>
            <p style={styles.sectionText}>
              Abra o menu do navegador (três pontos) e selecione "Instalar app" ou "Adicionar à tela inicial".
            </p>
          </div>
        )}

        <div style={styles.divider}>
          <h3 style={styles.benefitsTitle}>Benefícios do app:</h3>
          <div style={styles.benefitsList}>
            <div style={styles.benefit}>
              <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Acesso rápido pela tela inicial
            </div>
            <div style={styles.benefit}>
              <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Funciona offline
            </div>
            <div style={styles.benefit}>
              <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Interface otimizada para mobile
            </div>
            <div style={styles.benefit}>
              <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Carregamento mais rápido
            </div>
          </div>
        </div>

        <Link to="/" style={styles.backLink}>
          ← Voltar para o app
        </Link>
      </div>
    </div>
  );
};

export default InstallPage;
