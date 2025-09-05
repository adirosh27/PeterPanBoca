'use client';

import { useEffect } from 'react';

const CAPTAIN_HOOK_THEME = {
  bodyStyle: { backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' },
  heroStyle: { background: 'linear-gradient(135deg, #1e40af 0%, #374151 100%)', color: '#f8fafc' },
  cardStyle: { backgroundColor: '#f8fafc', border: '3px solid #ca8a04', color: '#1f2937', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' },
  buttonStyle: { background: 'linear-gradient(45deg, #ca8a04, #92400e)', color: '#ffffff', textTransform: 'uppercase' as const, letterSpacing: '1px' }
};

export default function ThemeApplier() {
  useEffect(() => {
    const applyTheme = () => {
      // Apply to body
      Object.assign(document.body.style, CAPTAIN_HOOK_THEME.bodyStyle);
      
      // Apply to hero sections
      const heroElements = document.querySelectorAll('[data-hero]');
      heroElements.forEach((el: any) => {
        Object.assign(el.style, CAPTAIN_HOOK_THEME.heroStyle);
      });
      
      // Apply to cards
      const cardElements = document.querySelectorAll('[data-card]');
      cardElements.forEach((el: any) => {
        Object.assign(el.style, CAPTAIN_HOOK_THEME.cardStyle);
      });
      
      // Apply to buttons
      const buttonElements = document.querySelectorAll('[data-button]');
      buttonElements.forEach((el: any) => {
        Object.assign(el.style, CAPTAIN_HOOK_THEME.buttonStyle);
      });
      
      // Store theme data globally for components to access
      (window as any).currentTheme = 'captain-hooks-log';
      (window as any).currentThemeData = CAPTAIN_HOOK_THEME;
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'captain-hooks-log', data: CAPTAIN_HOOK_THEME } }));
    };

    // Apply theme immediately
    applyTheme();
    
    // Apply theme periodically to catch navigation changes
    const interval = setInterval(applyTheme, 500);
    
    // Apply theme on route changes
    const handleRouteChange = () => {
      setTimeout(applyTheme, 100);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything visible
}