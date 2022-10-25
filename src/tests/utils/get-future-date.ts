import { setYear, parseISO } from "date-fns";

/**
 * Receives "2022-02-10" and returns "2023-02-10"
 */
export function getFutureDate(date: string) {
  return setYear(parseISO(date), new Date().getFullYear() + 1);
}
