export const themes = {
  'neverland-night': {
    name: 'Neverland Night',
    description: 'Dark mystical adventure',
    icon: '🌙',
    hero: {
      background: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900',
      text: 'text-white',
      accent: 'text-yellow-400',
    },
    card: {
      background: 'bg-slate-800',
      border: 'border-yellow-400 border-2',
      text: 'text-white',
      shadow: 'shadow-xl shadow-yellow-400/20',
    },
    button: {
      primary: 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold',
      secondary: 'bg-blue-700 hover:bg-blue-800 text-white',
    },
    body: 'bg-slate-900',
    font: 'font-serif',
  },
  
  'skull-rock-shores': {
    name: 'Skull Rock Shores',
    description: 'Rugged pirate adventure',
    icon: '🏴‍☠️',
    hero: {
      background: 'bg-gradient-to-br from-amber-800 via-orange-900 to-red-900',
      text: 'text-orange-100',
      accent: 'text-red-400',
    },
    card: {
      background: 'bg-amber-100',
      border: 'border-amber-800 border-4 border-dashed',
      text: 'text-amber-900',
      shadow: 'shadow-2xl shadow-amber-900/40 transform rotate-1',
    },
    button: {
      primary: 'bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider',
      secondary: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    body: 'bg-amber-50',
    font: 'font-mono',
  },

  'pixie-dust-pastels': {
    name: 'Pixie Dust Pastels',
    description: 'Whimsical fairy magic',
    icon: '🧚‍♀️',
    hero: {
      background: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400',
      text: 'text-white',
      accent: 'text-pink-200',
    },
    card: {
      background: 'bg-white/80 backdrop-blur-sm',
      border: 'border-pink-300 border-2 rounded-3xl',
      text: 'text-purple-800',
      shadow: 'shadow-xl shadow-pink-300/30',
    },
    button: {
      primary: 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full',
      secondary: 'bg-white/70 hover:bg-white/80 text-purple-700 border border-purple-300',
    },
    body: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
    font: 'font-sans',
  },

  'lost-boys-scrapbook': {
    name: 'Lost Boys Scrapbook',
    description: 'Playful handcrafted adventure',
    icon: '📖',
    hero: {
      background: 'bg-gradient-to-br from-green-700 via-yellow-600 to-orange-600',
      text: 'text-yellow-100',
      accent: 'text-orange-300',
    },
    card: {
      background: 'bg-yellow-50',
      border: 'border-green-600 border-4 border-dotted rounded-none',
      text: 'text-green-800',
      shadow: 'shadow-lg shadow-green-800/30 transform -rotate-1',
    },
    button: {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white font-bold transform rotate-1 rounded-full',
      secondary: 'bg-green-600 hover:bg-green-700 text-white',
    },
    body: 'bg-yellow-100',
    font: 'font-bold',
  },

  'captain-hooks-log': {
    name: "Captain Hook's Log",
    description: 'Elegant maritime sophistication',
    icon: '⚓',
    hero: {
      background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
      text: 'text-slate-100',
      accent: 'text-yellow-400',
    },
    card: {
      background: 'bg-slate-100',
      border: 'border-yellow-600 border-4 rounded-lg',
      text: 'text-slate-800',
      shadow: 'shadow-2xl shadow-slate-900/50',
    },
    button: {
      primary: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold uppercase tracking-wide',
      secondary: 'bg-slate-700 hover:bg-slate-800 text-white border-2 border-yellow-600',
    },
    body: 'bg-slate-900',
    font: 'font-serif',
  }
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeConfig = typeof themes[ThemeName];