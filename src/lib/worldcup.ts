// Participating teams in the 2026 FIFA World Cup (Canada / Mexico / USA)
// Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams
//
// winChance = estimated chance (in %) to win the tournament.
// Updated as of the Round of 16 (July 6, 2026): eliminated teams are set to 0
// and marked `eliminated: true`; the remaining teams' chances are rescaled
// (from the original pre-tournament bookmaker odds) so they sum to ~100%.
// Update these numbers as the tournament progresses / based on results.

export interface WorldCupTeam {
  code: string; // unique short code, used as the vote option id
  name: string; // English name
  nameHe: string; // Hebrew name
  flag: string; // flag emoji
  confederation: 'AFC' | 'CAF' | 'CONCACAF' | 'CONMEBOL' | 'OFC' | 'UEFA';
  winChance: number; // estimated % chance to win the title
  eliminated?: boolean; // true once the team is out of the tournament
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
  // AFC (9) - all eliminated by the Round of 16
  { code: 'AUS', name: 'Australia', nameHe: 'אוסטרליה', flag: '🇦🇺', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'IRN', name: 'Iran', nameHe: 'איראן', flag: '🇮🇷', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'IRQ', name: 'Iraq', nameHe: 'עיראק', flag: '🇮🇶', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'JPN', name: 'Japan', nameHe: 'יפן', flag: '🇯🇵', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'JOR', name: 'Jordan', nameHe: 'ירדן', flag: '🇯🇴', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'QAT', name: 'Qatar', nameHe: 'קטאר', flag: '🇶🇦', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'KSA', name: 'Saudi Arabia', nameHe: 'ערב הסעודית', flag: '🇸🇦', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'KOR', name: 'South Korea', nameHe: 'דרום קוריאה', flag: '🇰🇷', confederation: 'AFC', winChance: 0, eliminated: true },
  { code: 'UZB', name: 'Uzbekistan', nameHe: 'אוזבקיסטן', flag: '🇺🇿', confederation: 'AFC', winChance: 0, eliminated: true },

  // CAF (10) - Egypt and Morocco still alive
  { code: 'ALG', name: 'Algeria', nameHe: "אלג'יריה", flag: '🇩🇿', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'CPV', name: 'Cape Verde', nameHe: 'כף ורדה', flag: '🇨🇻', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'COD', name: 'DR Congo', nameHe: 'קונגו', flag: '🇨🇩', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'EGY', name: 'Egypt', nameHe: 'מצרים', flag: '🇪🇬', confederation: 'CAF', winChance: 0.5 },
  { code: 'GHA', name: 'Ghana', nameHe: 'גאנה', flag: '🇬🇭', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'CIV', name: 'Ivory Coast', nameHe: 'חוף השנהב', flag: '🇨🇮', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'MAR', name: 'Morocco', nameHe: 'מרוקו', flag: '🇲🇦', confederation: 'CAF', winChance: 2.5 },
  { code: 'SEN', name: 'Senegal', nameHe: 'סנגל', flag: '🇸🇳', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'RSA', name: 'South Africa', nameHe: 'דרום אפריקה', flag: '🇿🇦', confederation: 'CAF', winChance: 0, eliminated: true },
  { code: 'TUN', name: 'Tunisia', nameHe: 'תוניסיה', flag: '🇹🇳', confederation: 'CAF', winChance: 0, eliminated: true },

  // CONCACAF (6) - hosts: Canada, Mexico, USA - all eliminated (USA lost in the Round of 16)
  { code: 'CAN', name: 'Canada', nameHe: 'קנדה', flag: '🇨🇦', confederation: 'CONCACAF', winChance: 0, eliminated: true },
  { code: 'CUW', name: 'Curaçao', nameHe: 'קוראסאו', flag: '🇨🇼', confederation: 'CONCACAF', winChance: 0, eliminated: true },
  { code: 'HAI', name: 'Haiti', nameHe: 'האיטי', flag: '🇭🇹', confederation: 'CONCACAF', winChance: 0, eliminated: true },
  { code: 'MEX', name: 'Mexico', nameHe: 'מקסיקו', flag: '🇲🇽', confederation: 'CONCACAF', winChance: 0, eliminated: true },
  { code: 'PAN', name: 'Panama', nameHe: 'פנמה', flag: '🇵🇦', confederation: 'CONCACAF', winChance: 0, eliminated: true },
  { code: 'USA', name: 'United States', nameHe: 'ארצות הברית', flag: '🇺🇸', confederation: 'CONCACAF', winChance: 0, eliminated: true },

  // CONMEBOL (6) - Argentina and Colombia still alive
  { code: 'ARG', name: 'Argentina', nameHe: 'ארגנטינה', flag: '🇦🇷', confederation: 'CONMEBOL', winChance: 18.0 },
  { code: 'BRA', name: 'Brazil', nameHe: 'ברזיל', flag: '🇧🇷', confederation: 'CONMEBOL', winChance: 0, eliminated: true },
  { code: 'COL', name: 'Colombia', nameHe: 'קולומביה', flag: '🇨🇴', confederation: 'CONMEBOL', winChance: 2.5 },
  { code: 'ECU', name: 'Ecuador', nameHe: 'אקוודור', flag: '🇪🇨', confederation: 'CONMEBOL', winChance: 0, eliminated: true },
  { code: 'PAR', name: 'Paraguay', nameHe: 'פרגוואי', flag: '🇵🇾', confederation: 'CONMEBOL', winChance: 0, eliminated: true },
  { code: 'URU', name: 'Uruguay', nameHe: 'אורוגוואי', flag: '🇺🇾', confederation: 'CONMEBOL', winChance: 0, eliminated: true },

  // OFC (1) - eliminated
  { code: 'NZL', name: 'New Zealand', nameHe: 'ניו זילנד', flag: '🇳🇿', confederation: 'OFC', winChance: 0, eliminated: true },

  // UEFA (16) - Belgium, England, France, Norway, Spain, Switzerland still alive
  { code: 'AUT', name: 'Austria', nameHe: 'אוסטריה', flag: '🇦🇹', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'BEL', name: 'Belgium', nameHe: 'בלגיה', flag: '🇧🇪', confederation: 'UEFA', winChance: 4.9 },
  { code: 'BIH', name: 'Bosnia and Herzegovina', nameHe: 'בוסניה והרצגובינה', flag: '🇧🇦', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'CRO', name: 'Croatia', nameHe: 'קרואטיה', flag: '🇭🇷', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'CZE', name: 'Czech Republic', nameHe: "צ'כיה", flag: '🇨🇿', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'ENG', name: 'England', nameHe: 'אנגליה', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', winChance: 19.7 },
  { code: 'FRA', name: 'France', nameHe: 'צרפת', flag: '🇫🇷', confederation: 'UEFA', winChance: 23.0 },
  { code: 'GER', name: 'Germany', nameHe: 'גרמניה', flag: '🇩🇪', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'NED', name: 'Netherlands', nameHe: 'הולנד', flag: '🇳🇱', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'NOR', name: 'Norway', nameHe: 'נורווגיה', flag: '🇳🇴', confederation: 'UEFA', winChance: 1.1 },
  { code: 'POR', name: 'Portugal', nameHe: 'פורטוגל', flag: '🇵🇹', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'SCO', name: 'Scotland', nameHe: 'סקוטלנד', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'ESP', name: 'Spain', nameHe: 'ספרד', flag: '🇪🇸', confederation: 'UEFA', winChance: 26.2 },
  { code: 'SWE', name: 'Sweden', nameHe: 'שוודיה', flag: '🇸🇪', confederation: 'UEFA', winChance: 0, eliminated: true },
  { code: 'SUI', name: 'Switzerland', nameHe: 'שווייץ', flag: '🇨🇭', confederation: 'UEFA', winChance: 1.6 },
  { code: 'TUR', name: 'Turkey', nameHe: 'טורקיה', flag: '🇹🇷', confederation: 'UEFA', winChance: 0, eliminated: true },
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
