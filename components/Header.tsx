
import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="no-print bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            P
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            Pro<span className="text-blue-600">Invoice</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-10 text-xs font-black uppercase tracking-widest text-gray-400">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1 transition-all">Minhas Faturas</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Clientes</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Configurações</a>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm">
            JD
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
