// Participating teams in the 2026 FIFA World Cup (Canada / Mexico / USA)
// Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams

export interface WorldCupTeam {
  code: string; // unique short code, used as the vote option id
  name: string; // English name
  nameHe: string; // Hebrew name
  flag: string; // flag emoji
  confederation: 'AFC' | 'CAF' | 'CONCACAF' | 'CONMEBOL' | 'OFC' | 'UEFA';
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
  { code: 'AUS', name: 'Australia', nameHe: 'אוסטרליה', flag: '🇦🇺', confederation: 'AFC' },
  { code: 'IRN', name: 'Iran', nameHe: 'איראן', flag: '🇮🇷', confederation: 'AFC' },
  { code: 'IRQ', name: 'Iraq', nameHe: 'עיראק', flag: '🇮🇶', confederation: 'AFC' },
  { code: 'JPN', name: 'Japan', nameHe: 'יפן', flag: '🇯🇵', confederation: 'AFC' },
  { code: 'JOR', name: 'Jordan', nameHe: 'ירדן', flag: '🇯🇴', confederation: 'AFC' },
  { code: 'QAT', name: 'Qatar', nameHe: 'קטאר', flag: '🇶🇦', confederation: 'AFC' },
  { code: 'KSA', name: 'Saudi Arabia', nameHe: 'ערב הסעודית', flag: '🇸🇦', confederation: 'AFC' },
  { code: 'KOR', name: 'South Korea', nameHe: 'דרום קוריאה', flag: '🇰🇷', confederation: 'AFC' },
  { code: 'UZB', name: 'Uzbekistan', nameHe: 'אוזבקיסטן', flag: '🇺🇿', confederation: 'AFC' },

  // CAF (10)
  { code: 'ALG', name: 'Algeria', nameHe: "אלג'יריה", flag: '🇩🇿', confederation: 'CAF' },
  { code: 'CPV', name: 'Cape Verde', nameHe: 'כף ורדה', flag: '🇨🇻', confederation: 'CAF' },
  { code: 'COD', name: 'DR Congo', nameHe: 'קונגו', flag: '🇨🇩', confederation: 'CAF' },
  { code: 'EGY', name: 'Egypt', nameHe: 'מצרים', flag: '🇪🇬', confederation: 'CAF' },
  { code: 'GHA', name: 'Ghana', nameHe: 'גאנה', flag: '🇬🇭', confederation: 'CAF' },
  { code: 'CIV', name: 'Ivory Coast', nameHe: 'חוף השנהב', flag: '🇨🇮', confederation: 'CAF' },
  { code: 'MAR', name: 'Morocco', nameHe: 'מרוקו', flag: '🇲🇦', confederation: 'CAF' },
  { code: 'SEN', name: 'Senegal', nameHe: 'סנגל', flag: '🇸🇳', confederation: 'CAF' },
  { code: 'RSA', name: 'South Africa', nameHe: 'דרום אפריקה', flag: '🇿🇦', confederation: 'CAF' },
  { code: 'TUN', name: 'Tunisia', nameHe: 'תוניסיה', flag: '🇹🇳', confederation: 'CAF' },

  // CONCACAF (6) - hosts: Canada, Mexico, USA
  { code: 'CAN', name: 'Canada', nameHe: 'קנדה', flag: '🇨🇦', confederation: 'CONCACAF' },
  { code: 'CUW', name: 'Curaçao', nameHe: 'קוראסאו', flag: '🇨🇼', confederation: 'CONCACAF' },
  { code: 'HAI', name: 'Haiti', nameHe: 'האיטי', flag: '🇭🇹', confederation: 'CONCACAF' },
  { code: 'MEX', name: 'Mexico', nameHe: 'מקסיקו', flag: '🇲🇽', confederation: 'CONCACAF' },
  { code: 'PAN', name: 'Panama', nameHe: 'פנמה', flag: '🇵🇦', confederation: 'CONCACAF' },
  { code: 'USA', name: 'United States', nameHe: 'ארצות הברית', flag: '🇺🇸', confederation: 'CONCACAF' },

  // CONMEBOL (6)
  { code: 'ARG', name: 'Argentina', nameHe: 'ארגנטינה', flag: '🇦🇷', confederation: 'CONMEBOL' },
  { code: 'BRA', name: 'Brazil', nameHe: 'ברזיל', flag: '🇧🇷', confederation: 'CONMEBOL' },
  { code: 'COL', name: 'Colombia', nameHe: 'קולומביה', flag: '🇨🇴', confederation: 'CONMEBOL' },
  { code: 'ECU', name: 'Ecuador', nameHe: 'אקוודור', flag: '🇪🇨', confederation: 'CONMEBOL' },
  { code: 'PAR', name: 'Paraguay', nameHe: 'פרגוואי', flag: '🇵🇾', confederation: 'CONMEBOL' },
  { code: 'URU', name: 'Uruguay', nameHe: 'אורוגוואי', flag: '🇺🇾', confederation: 'CONMEBOL' },

  // OFC (1)
  { code: 'NZL', name: 'New Zealand', nameHe: 'ניו זילנד', flag: '🇳🇿', confederation: 'OFC' },

  // UEFA (16)
  { code: 'AUT', name: 'Austria', nameHe: 'אוסטריה', flag: '🇦🇹', confederation: 'UEFA' },
  { code: 'BEL', name: 'Belgium', nameHe: 'בלגיה', flag: '🇧🇪', confederation: 'UEFA' },
  { code: 'BIH', name: 'Bosnia and Herzegovina', nameHe: 'בוסניה והרצגובינה', flag: '🇧🇦', confederation: 'UEFA' },
  { code: 'CRO', name: 'Croatia', nameHe: 'קרואטיה', flag: '🇭🇷', confederation: 'UEFA' },
  { code: 'CZE', name: 'Czech Republic', nameHe: "צ'כיה", flag: '🇨🇿', confederation: 'UEFA' },
  { code: 'ENG', name: 'England', nameHe: 'אנגליה', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
  { code: 'FRA', name: 'France', nameHe: 'צרפת', flag: '🇫🇷', confederation: 'UEFA' },
  { code: 'GER', name: 'Germany', nameHe: 'גרמניה', flag: '🇩🇪', confederation: 'UEFA' },
  { code: 'NED', name: 'Netherlands', nameHe: 'הולנד', flag: '🇳🇱', confederation: 'UEFA' },
  { code: 'NOR', name: 'Norway', nameHe: 'נורווגיה', flag: '🇳🇴', confederation: 'UEFA' },
  { code: 'POR', name: 'Portugal', nameHe: 'פורטוגל', flag: '🇵🇹', confederation: 'UEFA' },
  { code: 'SCO', name: 'Scotland', nameHe: 'סקוטלנד', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
  { code: 'ESP', name: 'Spain', nameHe: 'ספרד', flag: '🇪🇸', confederation: 'UEFA' },
  { code: 'SWE', name: 'Sweden', nameHe: 'שוודיה', flag: '🇸🇪', confederation: 'UEFA' },
  { code: 'SUI', name: 'Switzerland', nameHe: 'שווייץ', flag: '🇨🇭', confederation: 'UEFA' },
  { code: 'TUR', name: 'Turkey', nameHe: 'טורקיה', flag: '🇹🇷', confederation: 'UEFA' },
];

export const worldCupTeamsByCode: Record<string, WorldCupTeam> = Object.fromEntries(
  worldCupTeams.map((team) => [team.code, team])
);

// Order used for grouping teams in the UI dropdown
export const confederationOrder: WorldCupTeam['confederation'][] = [
  'CONMEBOL',
  'UEFA',
  'CONCACAF',
  'AFC',
  'CAF',
  'OFC',
];
