'use client';

import { useState, useEffect } from 'react';

const THEMES = {
  'neverland-night': {
    name: 'Neverland Night',
    icon: '🌙',
    bodyStyle: { backgroundColor: '#1e1b4b', color: '#f8fafc', minHeight: '100vh' },
    heroStyle: { background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)', color: '#ffffff' },
    cardStyle: { backgroundColor: '#334155', border: '3px solid #facc15', color: '#f8fafc' },
    buttonStyle: { backgroundColor: '#facc15', color: '#000000', fontWeight: 'bold' }
  },
  'skull-rock-shores': {
    name: 'Skull Rock Shores', 
    icon: '🏴‍☠️',
    bodyStyle: { backgroundColor: '#fbbf24', color: '#92400e', minHeight: '100vh' },
    heroStyle: { background: 'linear-gradient(135deg, #92400e 0%, #374151 100%)', color: '#fbbf24' },
    cardStyle: { backgroundColor: '#fed7aa', border: '4px solid #92400e', color: '#92400e', transform: 'rotate(1deg)' },
    buttonStyle: { backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase' as const }
  },
  'pixie-dust-pastels': {
    name: 'Pixie Dust Pastels',
    icon: '🧚‍♀️',
    bodyStyle: { background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ede9fe 100%)', color: '#7c3aed', minHeight: '100vh' },
    heroStyle: { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)', color: '#ffffff' },
    cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #ec4899', borderRadius: '20px', color: '#7c3aed', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)' },
    buttonStyle: { background: 'linear-gradient(45deg, #ec4899, #8b5cf6)', color: '#ffffff', borderRadius: '25px' }
  },
  'lost-boys-scrapbook': {
    name: 'Lost Boys Scrapbook',
    icon: '📖', 
    bodyStyle: { backgroundColor: '#fef3c7', color: '#92400e', minHeight: '100vh' },
    heroStyle: { background: 'linear-gradient(135deg, #15803d 0%, #ca8a04 100%)', color: '#fef3c7' },
    cardStyle: { backgroundColor: '#fffbeb', border: '3px dashed #92400e', color: '#92400e', transform: 'rotate(-1deg)' },
    buttonStyle: { backgroundColor: '#ea580c', color: '#ffffff', borderRadius: '25px', transform: 'rotate(2deg)' }
  },
  'captain-hooks-log': {
    name: "Captain Hook's Log",
    icon: '⚓',
    bodyStyle: { backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' },
    heroStyle: { background: 'linear-gradient(135deg, #1e40af 0%, #374151 100%)', color: '#f8fafc' },
    cardStyle: { backgroundColor: '#f8fafc', border: '3px solid #ca8a04', color: '#1f2937', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' },
    buttonStyle: { background: 'linear-gradient(45deg, #ca8a04, #92400e)', color: '#ffffff', textTransform: 'uppercase' as const, letterSpacing: '1px' }
  }
};

type ThemeKey = keyof typeof THEMES;

export default function SimpleThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('captain-hooks-log');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('simple-theme') as ThemeKey;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to Captain Hook's Log
      setCurrentTheme('captain-hooks-log');
      applyTheme('captain-hooks-log');
    }
  }, []);

  const applyTheme = (themeKey: ThemeKey) => {
    const theme = THEMES[themeKey];
    
    // Apply to body
    Object.assign(document.body.style, theme.bodyStyle);
    
    // Apply to hero sections
    const heroElements = document.querySelectorAll('[data-hero]');
    heroElements.forEach((el: any) => {
      Object.assign(el.style, theme.heroStyle);
    });
    
    // Apply to cards
    const cardElements = document.querySelectorAll('[data-card]');
    cardElements.forEach((el: any) => {
      Object.assign(el.style, theme.cardStyle);
    });
    
    // Apply to buttons
    const buttonElements = document.querySelectorAll('[data-button]');
    buttonElements.forEach((el: any) => {
      Object.assign(el.style, theme.buttonStyle);
    });
    
    // Store theme data globally for components to access
    (window as any).currentTheme = themeKey;
    (window as any).currentThemeData = theme;
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: themeKey, data: theme } }));
  };

  const changeTheme = (themeKey: ThemeKey) => {
    setCurrentTheme(themeKey);
    localStorage.setItem('simple-theme', themeKey);
    applyTheme(themeKey);
    setIsOpen(false);
  };

  const theme = THEMES[currentTheme];

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: '50px',
          padding: '15px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        <span style={{ fontSize: '24px' }}>{theme.icon}</span>
        <span>{theme.name}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ⬇️
        </span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '70px',
              right: '0',
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              border: '2px solid #e5e7eb',
              minWidth: '300px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                🎨 Choose Your Peter Pan Theme
              </h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                Each theme completely transforms the website!
              </p>
            </div>
            
            {Object.entries(THEMES).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => changeTheme(key as ThemeKey)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  border: 'none',
                  backgroundColor: currentTheme === key ? '#dbeafe' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== key) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== key) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <span style={{ fontSize: '28px' }}>{themeData.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: currentTheme === key ? '#2563eb' : '#1f2937',
                    fontSize: '16px'
                  }}>
                    {themeData.name}
                  </div>
                  {currentTheme === key && (
                    <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '3px' }}>
                      ✓ Currently Active
                    </div>
                  )}
                </div>
              </button>
            ))}
            
            <div style={{ padding: '15px', textAlign: 'center', backgroundColor: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
              ✨ Themes change instantly - try them all!
            </div>
          </div>

          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              zIndex: -1
            }}
          />
        </>
      )}
    </div>
  );
}