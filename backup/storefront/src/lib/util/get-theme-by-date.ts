import { ThemeName } from "types/theme";

/**
 * Restituisce il theme in base alla data.
 * Range usati (meteorologici):
 * - spring: 1 Mar - 31 May
 * - summer: 1 Jun - 31 Aug
 * - autumn: 1 Sep - 30 Nov
 * - winter: 1 Dec - 28/29 Feb
 */
export function getThemeByDate(date: Date = new Date()): ThemeName {
  const month = date.getMonth() + 1; // 1..12

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}