import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import proinvoiceLogo from '@/src/assets/proinvoice-logo.png';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={proinvoiceLogo} alt="ProInvoice" className="h-10 w-auto" />
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              Pro<span className="text-blue-600">Invoice</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10 text-xs font-black uppercase tracking-widest text-gray-400">
            <Link
              to="/"
              className={`transition-all ${
                isActive('/') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'hover:text-gray-900'
              }`}
            >
              Minhas Faturas
            </Link>
            <Link
              to="/clients"
              className={`transition-all ${
                isActive('/clients') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'hover:text-gray-900'
              }`}
            >
              Clientes
            </Link>
            <Link
              to="/settings"
              className={`transition-all ${
                isActive('/settings') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'hover:text-gray-900'
              }`}
            >
              Configurações
            </Link>

            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm cursor-pointer">
                {getInitials()}
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">{children}</main>

      <footer className="no-print bg-white border-t border-gray-100 py-10 text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} ProInvoice System &bull; Sistema de Cobrança Profissional
        </p>
      </footer>
    </div>
  );
};

export default Layout;
