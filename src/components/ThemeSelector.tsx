'use client';

import { useState, useEffect } from 'react';

const themes = [
  { 
    id: 'neverland-night', 
    name: 'Neverland Night', 
    description: 'Dark mystical adventure',
    icon: '🌙',
    cssFile: null // Default theme
  },
  { 
    id: 'skull-rock-shores', 
    name: 'Skull Rock Shores', 
    description: 'Rugged pirate adventure',
    icon: '🏴‍☠️',
    cssFile: '/themes/skull-rock-shores.css'
  },
  { 
    id: 'pixie-dust-pastels', 
    name: 'Pixie Dust Pastels', 
    description: 'Whimsical fairy magic',
    icon: '🧚‍♀️',
    cssFile: '/themes/pixie-dust-pastels.css'
  },
  { 
    id: 'lost-boys-scrapbook', 
    name: 'Lost Boys Scrapbook', 
    description: 'Playful handcrafted adventure',
    icon: '📖',
    cssFile: '/themes/lost-boys-scrapbook.css'
  },
  { 
    id: 'captain-hooks-log', 
    name: "Captain Hook's Log", 
    description: 'Elegant maritime sophistication',
    icon: '⚓',
    cssFile: '/themes/captain-hooks-log.css'
  }
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('neverland-night');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('peter-pan-theme') || 'neverland-night';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply default theme on first load
    if (typeof window !== 'undefined') {
      document.body.classList.add('theme-neverland-night');
    }
  }, []);

  const applyTheme = (themeId: string) => {
    // Remove existing theme stylesheets
    const existingThemeLinks = document.querySelectorAll('link[data-theme]');
    existingThemeLinks.forEach(link => link.remove());

    // Add new theme stylesheet if not default
    const theme = themes.find(t => t.id === themeId);
    if (theme && theme.cssFile) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = theme.cssFile;
      link.setAttribute('data-theme', themeId);
      document.head.appendChild(link);
    }

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\S+/g, '');
    document.body.classList.add(`theme-${themeId}`);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('peter-pan-theme', themeId);
    applyTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 border-2 border-primary-200"
          title="Change Theme"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{currentThemeData?.icon}</span>
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl border-2 border-gray-200 min-w-64 max-w-sm overflow-hidden">
            <div className="p-4 border-b bg-primary-50">
              <h3 className="font-display font-bold text-primary-800 text-lg">Choose Your Adventure</h3>
              <p className="text-sm text-gray-600">Select a Peter Pan theme</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    currentTheme === theme.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">{theme.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{theme.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                      {currentTheme === theme.id && (
                        <span className="text-xs text-primary-600 font-medium mt-2 block">✓ Current Theme</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">Changes apply instantly</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}