'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const THEMES = {
  'neverland-night': {
    name: 'Neverland Night',
    icon: '🌙',
    headerStyle: { backgroundColor: '#1e1b4b', borderBottom: '3px solid #facc15' },
    linkColor: '#f8fafc',
    activeColor: '#facc15',
    hoverColor: '#facc15'
  },
  'skull-rock-shores': {
    name: 'Skull Rock Shores', 
    icon: '🏴‍☠️',
    headerStyle: { backgroundColor: '#92400e', borderBottom: '3px solid #fbbf24' },
    linkColor: '#fbbf24',
    activeColor: '#ffffff',
    hoverColor: '#ffffff'
  },
  'pixie-dust-pastels': {
    name: 'Pixie Dust Pastels',
    icon: '🧚‍♀️',
    headerStyle: { background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)', borderBottom: '3px solid #ffffff' },
    linkColor: '#ffffff',
    activeColor: '#fef3c7',
    hoverColor: '#fef3c7'
  },
  'lost-boys-scrapbook': {
    name: 'Lost Boys Scrapbook',
    icon: '📖', 
    headerStyle: { backgroundColor: '#ca8a04', borderBottom: '3px solid #92400e' },
    linkColor: '#fef3c7',
    activeColor: '#ffffff',
    hoverColor: '#ffffff'
  },
  'captain-hooks-log': {
    name: "Captain Hook's Log",
    icon: '⚓',
    headerStyle: { backgroundColor: '#1e5631', borderBottom: '3px solid #fde047' },
    linkColor: '#f0fdf4',
    activeColor: '#fde047',
    hoverColor: '#fde047'
  }
};

type ThemeKey = keyof typeof THEMES;

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('captain-hooks-log');
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const theme = (window as any).currentTheme || 'captain-hooks-log';
      setCurrentTheme(theme);
    };

    updateTheme();
    window.addEventListener('theme-change', updateTheme);
    
    return () => window.removeEventListener('theme-change', updateTheme);
  }, []);
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const changeTheme = (themeKey: ThemeKey) => {
    const themes = {
      'neverland-night': {
        bodyStyle: { backgroundColor: '#1e1b4b', color: '#f8fafc', minHeight: '100vh' },
        heroStyle: { background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)', color: '#ffffff' },
        cardStyle: { backgroundColor: '#334155', border: '3px solid #facc15', color: '#f8fafc' },
        buttonStyle: { backgroundColor: '#facc15', color: '#000000', fontWeight: 'bold' }
      },
      'skull-rock-shores': {
        bodyStyle: { backgroundColor: '#fbbf24', color: '#92400e', minHeight: '100vh' },
        heroStyle: { background: 'linear-gradient(135deg, #92400e 0%, #374151 100%)', color: '#fbbf24' },
        cardStyle: { backgroundColor: '#fed7aa', border: '4px solid #92400e', color: '#92400e', transform: 'rotate(1deg)' },
        buttonStyle: { backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase' as const }
      },
      'pixie-dust-pastels': {
        bodyStyle: { background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ede9fe 100%)', color: '#7c3aed', minHeight: '100vh' },
        heroStyle: { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)', color: '#ffffff' },
        cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #ec4899', borderRadius: '20px', color: '#7c3aed', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)' },
        buttonStyle: { background: 'linear-gradient(45deg, #ec4899, #8b5cf6)', color: '#ffffff', borderRadius: '25px' }
      },
      'lost-boys-scrapbook': {
        bodyStyle: { backgroundColor: '#fef3c7', color: '#92400e', minHeight: '100vh' },
        heroStyle: { background: 'linear-gradient(135deg, #15803d 0%, #ca8a04 100%)', color: '#fef3c7' },
        cardStyle: { backgroundColor: '#fffbeb', border: '3px dashed #92400e', color: '#92400e', transform: 'rotate(-1deg)' },
        buttonStyle: { backgroundColor: '#ea580c', color: '#ffffff', borderRadius: '25px', transform: 'rotate(2deg)' }
      },
      'captain-hooks-log': {
        bodyStyle: { backgroundColor: '#052e16', color: '#f0fdf4', minHeight: '100vh' },
        heroStyle: { background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', color: '#f0fdf4' },
        cardStyle: { backgroundColor: '#f0fdf4', border: '3px solid #facc15', color: '#1f2937', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' },
        buttonStyle: { background: 'linear-gradient(45deg, #facc15, #eab308)', color: '#1f2937', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 'bold' }
      }
    };

    const theme = themes[themeKey];
    
    // Apply theme
    Object.assign(document.body.style, theme.bodyStyle);
    
    const heroElements = document.querySelectorAll('[data-hero]');
    heroElements.forEach((el: any) => Object.assign(el.style, theme.heroStyle));
    
    const cardElements = document.querySelectorAll('[data-card]');
    cardElements.forEach((el: any) => Object.assign(el.style, theme.cardStyle));
    
    const buttonElements = document.querySelectorAll('[data-button]');
    buttonElements.forEach((el: any) => Object.assign(el.style, theme.buttonStyle));
    
    // Update global theme
    (window as any).currentTheme = themeKey;
    (window as any).currentThemeData = theme;
    localStorage.setItem('simple-theme', themeKey);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: themeKey, data: theme } }));
    
    setCurrentTheme(themeKey);
  };

  const theme = THEMES[currentTheme];

  return (
    <header style={{ 
      ...theme.headerStyle,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    }}>
      <nav style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: isMobile ? '0.5rem 1rem' : '1rem 2rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          {/* Logo */}
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              textDecoration: 'none',
              color: theme.linkColor,
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="פיטר פן - Home"
          >
            <div style={{ 
              width: isMobile ? '45px' : '60px', 
              height: isMobile ? '45px' : '60px', 
              position: 'relative',
              animation: 'float 3s ease-in-out infinite',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${theme.activeColor}`
            }}>
              <Image
                src="/images/PP_Logo.png"
                alt="Peter Pan Logo"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <span style={{ 
              fontSize: isMobile ? '1.2rem' : '1.5rem', 
              fontWeight: 'bold',
              color: theme.linkColor,
              fontFamily: 'Pirata One, cursive'
            }}>
              פיטר פן
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'flex-end',
          }}>
            <Link 
              href="/" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              🏠 Home
            </Link>
            <Link 
              href="/galleries" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/galleries') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/galleries') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/galleries') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/galleries') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              📸 Galleries
            </Link>
            <Link 
              href="/photos" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/photos') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/photos') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/photos') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/photos') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              🖼️ תמונות
            </Link>
            <Link 
              href="/characters" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/characters') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/characters') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/characters') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/characters') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              🎭 חברים
            </Link>
            <Link 
              href="/calendar" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/calendar') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/calendar') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/calendar') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/calendar') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              📅 לוח שנה
            </Link>
            <Link 
              href="/register" 
              style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: isActive('/register') ? theme.activeColor : theme.linkColor,
                transition: 'all 0.3s ease',
                padding: '0.75rem 1.25rem',
                borderRadius: '25px',
                position: 'relative',
                background: isActive('/register') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.hoverColor;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive('/register') ? theme.activeColor : theme.linkColor;
                e.currentTarget.style.background = isActive('/register') ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onFocus={(e) => e.currentTarget.style.outline = `2px solid ${theme.activeColor}`}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              🎪 Register
            </Link>
            
          </div>
          
          {/* Mobile menu button */}
          <div style={{ display: isMobile ? 'flex' : 'none', alignItems: 'center', gap: '1rem' }}>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ 
                color: theme.linkColor,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg 
                style={{ 
                  width: '28px', 
                  height: '28px',
                  transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div style={{ 
          maxHeight: mobileMenuOpen ? '500px' : '0',
          opacity: mobileMenuOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s ease',
          marginTop: mobileMenuOpen ? '1rem' : '0',
          paddingTop: mobileMenuOpen ? '1rem' : '0',
          borderTop: mobileMenuOpen ? `2px solid ${theme.activeColor}` : 'none'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <Link 
              href="/" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              🏠 Home
            </Link>
            <Link 
              href="/galleries" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/galleries') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/galleries') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/galleries') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              📸 Galleries
            </Link>
            <Link 
              href="/photos" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/photos') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/photos') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/photos') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              🖼️ תמונות
            </Link>
            <Link 
              href="/characters" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/characters') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/characters') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/characters') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              🎭 חברים
            </Link>
            <Link 
              href="/calendar" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/calendar') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/calendar') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/calendar') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              📅 לוח שנה
            </Link>
            <Link 
              href="/register" 
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                textDecoration: 'none',
                color: isActive('/register') ? theme.activeColor : theme.linkColor,
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: isActive('/register') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive('/register') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              🎪 Register
            </Link>
            
          </div>
        </div>
      </nav>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}