'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { themes, ThemeName } from '@/lib/themes';

export default function NewThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes[theme];

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-xl rounded-full p-4 hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
          title={`Current: ${currentTheme.name}`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-3xl">{currentTheme.icon}</span>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <>
            <div className="absolute top-20 right-0 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 min-w-72 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="font-bold text-gray-800 text-xl">🎨 Choose Your Peter Pan Adventure</h3>
                <p className="text-sm text-gray-600 mt-1">Each theme transforms the entire experience!</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {(Object.keys(themes) as ThemeName[]).map((themeKey) => {
                  const themeData = themes[themeKey];
                  const isActive = theme === themeKey;
                  
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`w-full text-left p-5 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-3xl mt-1 flex-shrink-0">{themeData.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-lg truncate ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                            {themeData.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{themeData.description}</p>
                          {isActive && (
                            <div className="flex items-center mt-3 text-blue-600">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-semibold">Currently Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="p-4 bg-gray-50 text-center border-t">
                <p className="text-xs text-gray-500">✨ Themes change colors, fonts, and entire visual style!</p>
              </div>
            </div>

            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}