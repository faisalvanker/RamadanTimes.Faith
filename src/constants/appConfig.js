import { date } from "quasar";
import pkg from "../../package.json";

export const APP_VERSION = pkg.version;

export const SHARE_URL = "https://www.ramadantimes.faith";
export const CONTACT_EMAIL_DISPLAY = "info (at) ramadantimes.faith";

export const STORAGE_KEYS = {
  CITY: "city",
  ASR_METHOD: "time",
  TASBEEH: "tasbee",
};

export const ASR_METHODS = {
  HANAFI: "Hanafi",
  SHAFI: "Shafi",
};

export const DATA_PATHS = {
  CITIES_LIST: "statics/data/cities.csv",
  INFO_LIST: "statics/data/info.csv",
  cityTimetable: (cityName) => `statics/data/city/${cityName}.csv`,
  dailyDua: (dayNumber) => `statics/data/dua/${dayNumber}.csv`,
};

/**
 * Annual Ramadan settings (the only config values to update each year alongside CSVs):
 * - HIJRI_YEAR: Current Islamic Hijri year
 * - START_DATE: Fallback start of Ramadan (also read dynamically from row 1 of city CSVs)
 */
export const RAMADAN_CONFIG = {
  // --- Update Annually ---
  HIJRI_YEAR: "1447",
  START_DATE: new Date(2026, 1, 19), // 19 Feb 2026 (Month is 0-indexed: 1 = Feb)

  // --- Fixed Constants ---
  TOTAL_DAYS: 30,
  ODD_NIGHT_INDEXES: [20, 22, 24, 26, 28],
};

export const STATIC_DUAS = {
  FASTING:
    "Allahumma Asumu Ghadallaka Faghrili Ma Qad'damtu, Wa Maa Akkhartu",
  BREAKING_FAST:
    "Allahumma Laka Sumtu Wa Bika Aamantu Wa'Alaiyka Tawakkaltu Wa Alaa Rizqika Aftartu Fataqabbal Minni",
};

const MONTH_MAP = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/**
 * Parses a date string from the city CSV (e.g. "19-Feb-2026") into a local Date at midnight.
 * Falls back to RAMADAN_CONFIG.START_DATE if invalid or empty.
 */
export function parseTimetableDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") {
    return RAMADAN_CONFIG.START_DATE;
  }
  const parts = dateStr.trim().split("-");
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = MONTH_MAP[parts[1]];
    const year = Number(parts[2]);
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime())
    ? RAMADAN_CONFIG.START_DATE
    : parsed;
}

/**
 * Returns today's local Date at midnight (00:00:00).
 */
export function getTodayMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Combines a base midnight Date with an "HH:mm" prayer time string.
 */
export function createPrayerDateTime(baseDate, prayerTime) {
  const [hours, minutes] = prayerTime.split(":").map(Number);
  return date.addToDate(baseDate, { hours, minutes });
}
