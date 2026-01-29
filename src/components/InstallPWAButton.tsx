import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWAButton: React.FC = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    const wasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Navigate to install page for iOS or manual instructions
      navigate('/install');
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if installed or dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '0.875rem',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
      transition: 'all 0.3s ease',
    },
    iconOnly: {
      width: '56px',
      height: '56px',
      padding: '0',
      justifyContent: 'center',
      borderRadius: '50%',
    },
    dismissBtn: {
      position: 'absolute' as const,
      top: '-8px',
      right: '-8px',
      width: '24px',
      height: '24px',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    tooltip: {
      position: 'absolute' as const,
      bottom: '100%',
      right: '0',
      marginBottom: '8px',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap' as const,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    tooltipArrow: {
      position: 'absolute' as const,
      bottom: '-6px',
      right: '24px',
      width: '0',
      height: '0',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #1e293b',
    },
  };

  const getTooltipText = () => {
    if (isIOS) return 'Instalar no iPhone/iPad';
    if (deferredPrompt) return 'Instalar app';
    return 'Instalar no seu dispositivo';
  };

  const getDeviceIcon = () => {
    // Download/install icon
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    );
  };

  return (
    <div 
      style={styles.container} 
      className="no-print"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div style={styles.tooltip}>
          {getTooltipText()}
          <div style={styles.tooltipArrow}></div>
        </div>
      )}
      
      <button
        onClick={handleInstall}
        style={{ ...styles.button, ...styles.iconOnly }}
        aria-label="Instalar app"
      >
        {getDeviceIcon()}
      </button>
      
      <button
        onClick={handleDismiss}
        style={styles.dismissBtn}
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  );
};

export default InstallPWAButton;
