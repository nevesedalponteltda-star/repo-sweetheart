import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import proinvoiceLogo from '@/src/assets/proinvoice-logo.png';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc'
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50
  },
  headerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none'
  },
  logoImg: {
    height: '40px',
    width: 'auto'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em'
  },
  navLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'color 0.2s',
    padding: '0.25rem 0'
  },
  navLinkActive: {
    color: '#2563eb',
    borderBottom: '2px solid #2563eb'
  },
  userMenu: {
    position: 'relative' as const
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #eff6ff, #f3f4f6)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#2563eb',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  dropdown: {
    position: 'absolute' as const,
    right: 0,
    top: '100%',
    marginTop: '0.5rem',
    width: '200px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    padding: '0.5rem 0',
    opacity: 0,
    visibility: 'hidden' as const,
    transition: 'all 0.2s'
  },
  dropdownVisible: {
    opacity: 1,
    visibility: 'visible' as const
  },
  dropdownEmail: {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb'
  },
  logoutBtn: {
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500
  },
  main: {
    flexGrow: 1,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    width: '100%'
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '2.5rem 0',
    textAlign: 'center' as const
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '0.625rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3em'
  }
};

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
    <div style={styles.wrapper}>
      <header style={styles.header} className="no-print">
        <div style={styles.headerInner}>
          <Link to="/" style={styles.logo}>
            <img src={proinvoiceLogo} alt="ProInvoice" style={styles.logoImg} />
          </Link>

          <nav style={styles.nav}>
            <Link 
              to="/" 
              style={{
                ...styles.navLink,
                ...(isActive('/') ? styles.navLinkActive : {})
              }}
            >
              Minhas Faturas
            </Link>
            <Link 
              to="/clients" 
              style={{
                ...styles.navLink,
                ...(isActive('/clients') ? styles.navLinkActive : {})
              }}
            >
              Clientes
            </Link>
            <Link 
              to="/settings" 
              style={{
                ...styles.navLink,
                ...(isActive('/settings') ? styles.navLinkActive : {})
              }}
            >
              Configurações
            </Link>

            <div 
              style={styles.userMenu}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div style={styles.avatar}>
                {getInitials()}
              </div>
              <div style={{
                ...styles.dropdown,
                ...(menuOpen ? styles.dropdownVisible : {})
              }}>
                <div style={styles.dropdownEmail}>
                  {user?.email}
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Sair
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main style={styles.main}>{children}</main>

      <footer style={styles.footer} className="no-print">
        <p style={styles.footerText}>
          &copy; {new Date().getFullYear()} ProInvoice System &bull; Sistema de Cobrança Profissional
        </p>
      </footer>
    </div>
  );
};

export default Layout;
