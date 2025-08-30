import { startOfMonth, endOfMonth, format } from "date-fns";

/**
 * Returns the start and end dates of the given month
 * formatted as "YYYY-MM-DD" (date-only, no time).
 */
export const monthRangeDateOnly = (d = new Date()) => ({
  from: format(startOfMonth(d), "yyyy-MM-dd"), // e.g. "2025-08-01"
  to: format(endOfMonth(d), "yyyy-MM-dd"),     // e.g. "2025-08-31"
});
