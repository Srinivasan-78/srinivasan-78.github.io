/* Counts that appear as words in body copy.

   The home page already carried one of these that had gone stale — a
   line reading "11 builds" while lib/projects.ts held 12 — and the fix
   there was to count the array instead of typing the number. The same
   drift is waiting in every sentence that opens with a spelled-out
   count of a list rendered further down, so those read through here.

   Falls back to digits above twenty: a sentence that needs to say
   "twenty-three" is long past the point where the word reads better
   than the numeral. */
const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

export function numberWord(n: number): string {
  return WORDS[n] ?? String(n);
}

/* Capitalised, for the start of a sentence or a heading. */
export function NumberWord(n: number): string {
  const w = numberWord(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}
