// Participating teams in the 2026 FIFA World Cup (Canada / Mexico / USA)
// Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams
//
// winChance = estimated chance (in %) to win the tournament.
// These are PRE-TOURNAMENT estimates based on bookmaker title odds.
// Update these numbers as the tournament progresses / based on results.

export interface WorldCupTeam {
  code: string; // unique short code, used as the vote option id
  name: string; // English name
  nameHe: string; // Hebrew name
  flag: string; // flag emoji
  confederation: 'AFC' | 'CAF' | 'CONCACAF' | 'CONMEBOL' | 'OFC' | 'UEFA';
  winChance: number; // estimated % chance to win the title
}

export const confederationNamesHe: Record<WorldCupTeam['confederation'], string> = {
  AFC: 'אסיה (AFC)',
  CAF: 'אפריקה (CAF)',
  CONCACAF: 'צפון ומרכז אמריקה (CONCACAF)',
  CONMEBOL: 'דרום אמריקה (CONMEBOL)',
  OFC: 'אוקיאניה (OFC)',
  UEFA: 'אירופה (UEFA)',
};

export const worldCupTeams: WorldCupTeam[] = [
  // AFC (9)
  { code: 'AUS', name: 'Australia', nameHe: 'אוסטרליה', flag: '🇦🇺', confederation: 'AFC', winChance: 0.2 },
  { code: 'IRN', name: 'Iran', nameHe: 'איראן', flag: '🇮🇷', confederation: 'AFC', winChance: 0.15 },
  { code: 'IRQ', name: 'Iraq', nameHe: 'עיראק', flag: '🇮🇶', confederation: 'AFC', winChance: 0.05 },
  { code: 'JPN', name: 'Japan', nameHe: 'יפן', flag: '🇯🇵', confederation: 'AFC', winChance: 0.8 },
  { code: 'JOR', name: 'Jordan', nameHe: 'ירדן', flag: '🇯🇴', confederation: 'AFC', winChance: 0.05 },
  { code: 'QAT', name: 'Qatar', nameHe: 'קטאר', flag: '🇶🇦', confederation: 'AFC', winChance: 0.1 },
  { code: 'KSA', name: 'Saudi Arabia', nameHe: 'ערב הסעודית', flag: '🇸🇦', confederation: 'AFC', winChance: 0.1 },
  { code: 'KOR', name: 'South Korea', nameHe: 'דרום קוריאה', flag: '🇰🇷', confederation: 'AFC', winChance: 0.6 },
  { code: 'UZB', name: 'Uzbekistan', nameHe: 'אוזבקיסטן', flag: '🇺🇿', confederation: 'AFC', winChance: 0.05 },

  // CAF (10)
  { code: 'ALG', name: 'Algeria', nameHe: "אלג'יריה", flag: '🇩🇿', confederation: 'CAF', winChance: 0.25 },
  { code: 'CPV', name: 'Cape Verde', nameHe: 'כף ורדה', flag: '🇨🇻', confederation: 'CAF', winChance: 0.03 },
  { code: 'COD', name: 'DR Congo', nameHe: 'קונגו', flag: '🇨🇩', confederation: 'CAF', winChance: 0.1 },
  { code: 'EGY', name: 'Egypt', nameHe: 'מצרים', flag: '🇪🇬', confederation: 'CAF', winChance: 0.3 },
  { code: 'GHA', name: 'Ghana', nameHe: 'גאנה', flag: '🇬🇭', confederation: 'CAF', winChance: 0.2 },
  { code: 'CIV', name: 'Ivory Coast', nameHe: 'חוף השנהב', flag: '🇨🇮', confederation: 'CAF', winChance: 0.3 },
  { code: 'MAR', name: 'Morocco', nameHe: 'מרוקו', flag: '🇲🇦', confederation: 'CAF', winChance: 1.5 },
  { code: 'SEN', name: 'Senegal', nameHe: 'סנגל', flag: '🇸🇳', confederation: 'CAF', winChance: 0.6 },
  { code: 'RSA', name: 'South Africa', nameHe: 'דרום אפריקה', flag: '🇿🇦', confederation: 'CAF', winChance: 0.1 },
  { code: 'TUN', name: 'Tunisia', nameHe: 'תוניסיה', flag: '🇹🇳', confederation: 'CAF', winChance: 0.15 },

  // CONCACAF (6) - hosts: Canada, Mexico, USA
  { code: 'CAN', name: 'Canada', nameHe: 'קנדה', flag: '🇨🇦', confederation: 'CONCACAF', winChance: 0.3 },
  { code: 'CUW', name: 'Curaçao', nameHe: 'קוראסאו', flag: '🇨🇼', confederation: 'CONCACAF', winChance: 0.02 },
  { code: 'HAI', name: 'Haiti', nameHe: 'האיטי', flag: '🇭🇹', confederation: 'CONCACAF', winChance: 0.03 },
  { code: 'MEX', name: 'Mexico', nameHe: 'מקסיקו', flag: '🇲🇽', confederation: 'CONCACAF', winChance: 1 },
  { code: 'PAN', name: 'Panama', nameHe: 'פנמה', flag: '🇵🇦', confederation: 'CONCACAF', winChance: 0.05 },
  { code: 'USA', name: 'United States', nameHe: 'ארצות הברית', flag: '🇺🇸', confederation: 'CONCACAF', winChance: 1.2 },

  // CONMEBOL (6)
  { code: 'ARG', name: 'Argentina', nameHe: 'ארגנטינה', flag: '🇦🇷', confederation: 'CONMEBOL', winChance: 11 },
  { code: 'BRA', name: 'Brazil', nameHe: 'ברזיל', flag: '🇧🇷', confederation: 'CONMEBOL', winChance: 10 },
  { code: 'COL', name: 'Colombia', nameHe: 'קולומביה', flag: '🇨🇴', confederation: 'CONMEBOL', winChance: 1.5 },
  { code: 'ECU', name: 'Ecuador', nameHe: 'אקוודור', flag: '🇪🇨', confederation: 'CONMEBOL', winChance: 0.5 },
  { code: 'PAR', name: 'Paraguay', nameHe: 'פרגוואי', flag: '🇵🇾', confederation: 'CONMEBOL', winChance: 0.2 },
  { code: 'URU', name: 'Uruguay', nameHe: 'אורוגוואי', flag: '🇺🇾', confederation: 'CONMEBOL', winChance: 2 },

  // OFC (1)
  { code: 'NZL', name: 'New Zealand', nameHe: 'ניו זילנד', flag: '🇳🇿', confederation: 'OFC', winChance: 0.03 },

  // UEFA (16)
  { code: 'AUT', name: 'Austria', nameHe: 'אוסטריה', flag: '🇦🇹', confederation: 'UEFA', winChance: 0.5 },
  { code: 'BEL', name: 'Belgium', nameHe: 'בלגיה', flag: '🇧🇪', confederation: 'UEFA', winChance: 3 },
  { code: 'BIH', name: 'Bosnia and Herzegovina', nameHe: 'בוסניה והרצגובינה', flag: '🇧🇦', confederation: 'UEFA', winChance: 0.1 },
  { code: 'CRO', name: 'Croatia', nameHe: 'קרואטיה', flag: '🇭🇷', confederation: 'UEFA', winChance: 2 },
  { code: 'CZE', name: 'Czech Republic', nameHe: "צ'כיה", flag: '🇨🇿', confederation: 'UEFA', winChance: 0.15 },
  { code: 'ENG', name: 'England', nameHe: 'אנגליה', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', winChance: 12 },
  { code: 'FRA', name: 'France', nameHe: 'צרפת', flag: '🇫🇷', confederation: 'UEFA', winChance: 14 },
  { code: 'GER', name: 'Germany', nameHe: 'גרמניה', flag: '🇩🇪', confederation: 'UEFA', winChance: 6 },
  { code: 'NED', name: 'Netherlands', nameHe: 'הולנד', flag: '🇳🇱', confederation: 'UEFA', winChance: 5 },
  { code: 'NOR', name: 'Norway', nameHe: 'נורווגיה', flag: '🇳🇴', confederation: 'UEFA', winChance: 0.7 },
  { code: 'POR', name: 'Portugal', nameHe: 'פורטוגל', flag: '🇵🇹', confederation: 'UEFA', winChance: 7 },
  { code: 'SCO', name: 'Scotland', nameHe: 'סקוטלנד', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', winChance: 0.1 },
  { code: 'ESP', name: 'Spain', nameHe: 'ספרד', flag: '🇪🇸', confederation: 'UEFA', winChance: 16 },
  { code: 'SWE', name: 'Sweden', nameHe: 'שוודיה', flag: '🇸🇪', confederation: 'UEFA', winChance: 0.4 },
  { code: 'SUI', name: 'Switzerland', nameHe: 'שווייץ', flag: '🇨🇭', confederation: 'UEFA', winChance: 1 },
  { code: 'TUR', name: 'Turkey', nameHe: 'טורקיה', flag: '🇹🇷', confederation: 'UEFA', winChance: 0.5 },
];

export const worldCupTeamsByCode: Record<string, WorldCupTeam> = Object.fromEntries(
  worldCupTeams.map((team) => [team.code, team])
);

// Format a win-chance value for display (e.g. 16 -> "16%", 0.3 -> "<1%")
export function formatWinChance(chance: number): string {
  if (chance >= 1) {
    return `${Number.isInteger(chance) ? chance : chance.toFixed(1)}%`;
  }
  return '<1%';
}

// Order used for grouping teams in the UI dropdown
export const confederationOrder: WorldCupTeam['confederation'][] = [
  'CONMEBOL',
  'UEFA',
  'CONCACAF',
  'AFC',
  'CAF',
  'OFC',
];
