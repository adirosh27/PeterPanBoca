// Member email list — SERVER-SIDE ONLY.
// Do not import this file from a 'use client' component: it would ship
// every member's email address to the browser. Use it from API routes,
// server components, or scripts only.
// Names match `teamMembers` in ./members.ts.

export interface MemberEmail {
  name: string;
  email: string;
  active: boolean;
}

export const memberEmails: MemberEmail[] = [
  { name: 'אדיר חזן', email: 'adir.hazan@gmail.com', active: true },
  { name: 'עמית תירוש', email: 'tiroshfamily@gmail.com', active: true },
  { name: 'אבי לוי', email: 'avilevi.la@gmail.com', active: true },
  { name: 'דני קרן', email: 'daniel@skylerinvestments.com', active: true },
  { name: 'דודי אמסלם', email: '18david@gmail.com', active: true },
  { name: 'ליאור טמיר', email: 'liortamir7@gmail.com', active: true },
  { name: 'מומי שושן', email: 'manny@skyinremodeling.com', active: true },
  { name: 'משה מרקו', email: 'marc812@gmail.com', active: true },
  { name: 'נדב חורי', email: 'nadavhouri@gmail.com', active: true },
  { name: 'עופר גלעדי', email: 'ogiladi@zahav.net.il', active: true },
  { name: 'אורן בנבנישתי', email: 'orenbnv@gmail.com', active: true },
  { name: 'רם אלמוג', email: 'ramalmog@yahoo.com', active: true },
  { name: 'רועי וגנר', email: 'royvagner@gmail.com', active: true },
  { name: 'רון דיקסון', email: 'ron1dick@gmail.com', active: true },
  { name: 'אורי פייגין', email: 'orfaigin@gmail.com', active: true },
  { name: 'סהר אביאני', email: 'sahar.aviani@gmail.com', active: true },
  { name: 'ספי בר', email: 'sefibar90@gmail.com', active: true },
  { name: 'שלום מולדבסקי', email: 'shalomoki@gmail.com', active: true },
  { name: 'שלום ספיר', email: 'shalomsapir@gmail.com', active: true },
  { name: 'שי זיידנברג', email: 'zaidenberg@gmail.com', active: true },
  { name: 'שולי מייקלס', email: 'shulymichaels@gmail.com', active: true },
  { name: 'טל שקד', email: 'tal.shaked81@gmail.com', active: true },
  { name: 'יוסי חכם', email: 'yossichaham@gmail.com', active: true },
  { name: 'יוסי עוז־סיני', email: 'yuzsinay@aol.com', active: true },
  { name: 'אייל בישרי', email: 'eyal.bishri@gmail.com', active: true },
  { name: 'רועי וולקן', email: 'vulkanr@gmail.com', active: true },
  { name: 'איתמר אנקוריון', email: 'itamar.ankorion@gmail.com', active: true },
];

/** Emails of currently active members. */
export function getActiveMemberEmails(): string[] {
  return memberEmails.filter((m) => m.active).map((m) => m.email);
}

/** Look up a member's email by their Hebrew name (as in members.ts). */
export function getMemberEmail(name: string): string | undefined {
  return memberEmails.find((m) => m.name === name)?.email;
}
