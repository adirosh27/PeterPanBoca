export type Birthday = {
  name: string;
  month: number;
  day: number;
};

// Shared by the calendar page and the home page "this week" section.
export const birthdays: Birthday[] = [
  { name: 'Oren Benvenisti', month: 8, day: 30 },
  { name: 'Eyal Bishri', month: 12, day: 10 },
  { name: 'Ron Dickson', month: 11, day: 1 },
  { name: 'Yossi Chaham', month: 10, day: 29 },
  { name: 'Ofer Gilady', month: 1, day: 21 },
  { name: 'Adir Hazan', month: 10, day: 27 },
  { name: 'Nadav Houri', month: 5, day: 13 },
  { name: 'Daniel Kern', month: 3, day: 3 },
  { name: 'Avi Levi', month: 7, day: 8 },
  { name: 'Moshe Marcu', month: 12, day: 8 },
  { name: 'Steven (Shuly) Michaels', month: 12, day: 3 },
  { name: 'Tal Shaked', month: 7, day: 25 },
  { name: 'Sagie Shanun', month: 2, day: 21 },
  { name: 'Momy Shoshan', month: 1, day: 3 },
  { name: 'Lior Tamir', month: 12, day: 6 },
  { name: 'Amit Tirosh', month: 12, day: 15 },
  { name: 'Roee Vulkan', month: 10, day: 6 },
  { name: 'Roei Wagner', month: 7, day: 21 },
  { name: 'Shay Zaidenberg', month: 12, day: 24 },
  { name: 'Shalom Sapir', month: 12, day: 24 },
  { name: 'Dudi Amsalem', month: 6, day: 29 },
  { name: 'Shalom Moldavski', month: 9, day: 17 },
  { name: 'Itamar Ankorion', month: 10, day: 4 },
  { name: 'Safi Bar', month: 2, day: 23 },
  { name: 'Ori Feigin', month: 5, day: 6 },
  { name: 'Sahar Aviani', month: 7, day: 12 },
  { name: 'Ram Almog', month: 9, day: 14 },
];

export type WeekBirthday = Birthday & {
  /** The actual calendar date this birthday falls on in the current week. */
  date: Date;
};

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Birthdays falling in the Sunday-Saturday week containing `now`, in date order.
 *
 * Walks the seven real dates of the week rather than comparing month/day ranges,
 * so a week straddling a month or year boundary (e.g. Dec 28 - Jan 3) works.
 */
export function getWeekBirthdays(now: Date = new Date()): WeekBirthday[] {
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );

  const result: WeekBirthday[] = [];
  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + offset
    );
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const birthday of birthdays) {
      if (birthday.month === month && birthday.day === day) {
        result.push({ ...birthday, date });
      }
    }
  }

  return result;
}
