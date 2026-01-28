import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import proinvoiceLogo from '@/src/assets/proinvoice-logo.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={proinvoiceLogo} alt="ProInvoice" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Pro<span className="text-blue-600">Invoice</span>
          </h1>
          <p className="text-gray-500 mt-2">Instale o app no seu dispositivo</p>
        </div>

        <div className="card p-8 space-y-6">
          {isInstalled ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">App Instalado!</h2>
              <p className="text-gray-500 text-sm mb-6">
                O ProInvoice já está instalado no seu dispositivo.
              </p>
              <Link to="/" className="btn-primary inline-block">
                Abrir App
              </Link>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 text-center">Instalar no iPhone/iPad</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <p>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta) na barra do Safari</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <p>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <p>Toque em <strong>"Adicionar"</strong> no canto superior direito</p>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Pronto para instalar!</h2>
              <p className="text-gray-500 text-sm">
                Instale o ProInvoice para acesso rápido e funcionamento offline.
              </p>
              <button onClick={handleInstall} className="btn-primary w-full">
                Instalar Agora
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Instalar no Android</h2>
              <p className="text-gray-500 text-sm">
                Abra o menu do navegador (três pontos) e selecione "Instalar app" ou "Adicionar à tela inicial".
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Benefícios do app:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Acesso rápido pela tela inicial
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Funciona offline
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Interface otimizada para mobile
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Carregamento mais rápido
              </li>
            </ul>
          </div>

          <Link to="/" className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
            ← Voltar para o app
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstallPage;
