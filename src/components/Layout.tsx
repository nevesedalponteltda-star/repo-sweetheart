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
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50
  },
  headerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none'
  },
  logoImg: {
    height: '28px',
    width: 'auto'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em'
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
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #eff6ff, #f3f4f6)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#2563eb',
    cursor: 'pointer'
  },
  dropdown: {
    position: 'absolute' as const,
    right: 0,
    top: '100%',
    marginTop: '0.5rem',
    width: '180px',
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
    fontSize: '0.7rem',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  logoutBtn: {
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'left' as const,
    fontSize: '0.8rem',
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileMenu: {
    position: 'fixed' as const,
    top: '60px',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 49,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  mobileNavLink: {
    color: '#374151',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'block'
  },
  mobileNavLinkActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb'
  },
  mobileUserSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '0.75rem',
    marginTop: '0.25rem'
  },
  mobileEmail: {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  mobileLogoutBtn: {
    width: '100%',
    padding: '0.75rem 1rem',
    textAlign: 'left' as const,
    fontSize: '0.9rem',
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    borderRadius: '0.5rem'
  },
  main: {
    flexGrow: 1,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    width: '100%'
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '1.5rem 0',
    textAlign: 'center' as const
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.2em'
  }
};

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={styles.nav}>
              <Link 
                to="/" 
                style={{
                  ...styles.navLink,
                  ...(isActive('/') ? styles.navLinkActive : {})
                }}
              >
                Faturas
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
                Config
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
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button 
              style={styles.hamburger} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link 
              to="/" 
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/') ? styles.mobileNavLinkActive : {})
              }}
            >
              📄 Minhas Faturas
            </Link>
            <Link 
              to="/clients" 
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/clients') ? styles.mobileNavLinkActive : {})
              }}
            >
              👥 Clientes
            </Link>
            <Link 
              to="/settings" 
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/settings') ? styles.mobileNavLinkActive : {})
              }}
            >
              ⚙️ Configurações
            </Link>
            <div style={styles.mobileUserSection}>
              <div style={styles.mobileEmail}>{user?.email}</div>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                🚪 Sair
              </button>
            </div>
          </div>
        )}
      </header>

      <main style={styles.main}>{children}</main>

      <footer style={styles.footer} className="no-print">
        <p style={styles.footerText}>
          © {new Date().getFullYear()} ProInvoice
        </p>
      </footer>
    </div>
  );
};

export default Layout;
