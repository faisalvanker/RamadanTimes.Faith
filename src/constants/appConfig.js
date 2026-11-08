import axios from "axios";
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
  CONFIG: "statics/data/config.json",
  CITIES_LIST: "statics/data/cities.csv",
  INFO_LIST: "statics/data/info.csv",
  SIGNIFICANT_DATES_LIST: "statics/data/significant_dates.csv",
  ISLAMIC_MONTHS_LIST: "statics/data/islamic_months.csv",
  cityTimetable: (cityName) =>
    `statics/data/city/${cityName}.csv?v=${APP_VERSION}`,
  dailyDua: (dayNumber) => `statics/data/dua/${dayNumber}.csv`,
};

/**
 * Annual Ramadan settings (the only config values to update each year):
 * - HIJRI_YEAR: Current/Upcoming Islamic Hijri year
 * - START_DATE: 1st of Ramadan (Month is 0-indexed: 0 = Jan, 1 = Feb, etc.)
 * - TOTAL_DAYS: 30 (change to 29 if Shawwal moon is sighted on the 29th night)
 */
export const RAMADAN_CONFIG = {
  // --- Update Annually ---
  HIJRI_YEAR: "1448",
  START_DATE: new Date(2027, 1, 9), // 09 Feb 2027

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
 * Parses an ISO "YYYY-MM-DD" date string into a local Date at midnight (00:00:00).
 */
export function parseIsoDateLocal(isoStr) {
  if (!isoStr || typeof isoStr !== "string") return RAMADAN_CONFIG.START_DATE;
  const parts = isoStr.trim().split(/[-/]/).map(Number);
  if (parts.length === 3 && !parts.some(Number.isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return RAMADAN_CONFIG.START_DATE;
}

let configPromise = null;

/**
 * Loads public/statics/data/config.json so annual changes do not require rebuilding the app.
 * Falls back to RAMADAN_CONFIG defaults if offline.
 */
export function fetchAnnualConfig(forceRefresh = false) {
  if (!configPromise || forceRefresh) {
    configPromise = axios
      .get(`${DATA_PATHS.CONFIG}?t=${Date.now()}`)
      .then((res) => {
        const data = res.data;
        if (data && typeof data === "object") {
          if (data.hijriYear) {
            RAMADAN_CONFIG.HIJRI_YEAR = String(data.hijriYear);
          }
          if (data.startDate) {
            RAMADAN_CONFIG.START_DATE = parseIsoDateLocal(data.startDate);
          }
          if (data.totalDays) {
            RAMADAN_CONFIG.TOTAL_DAYS = Number(data.totalDays);
          }
        }
        return RAMADAN_CONFIG;
      })
      .catch(() => RAMADAN_CONFIG);
  }
  return configPromise;
}

/**
 * Parses a date string from a legacy city CSV (e.g. "09-Feb-2027") into a local Date at midnight.
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

/**
 * Returns the Asr time based on Hanafi / Shafi selection.
 */
export function getAsrTime(item, method) {
  if (!item) return "";
  return method === ASR_METHODS.HANAFI ? item.ASRH : item.ASRS;
}

/**
 * Returns the Esha time based on Hanafi / Shafi selection (with fallback to item.ESHA).
 */
export function getEshaTime(item, method) {
  if (!item) return "";
  if (method === ASR_METHODS.HANAFI) {
    return item.ESHAH || item.ESHA || "";
  }
  return item.ESHAS || item.ESHA || "";
}

/**
 * Calculates fasting duration string ("X Hrs and Y Min") between Suhoor (SERI) and Magrib (IFTAR).
 */
export function calculateDuration(seriTime, iftarTime) {
  if (!seriTime || !iftarTime) return "";
  const [sH, sM] = seriTime.split(":").map(Number);
  const [iH, iM] = iftarTime.split(":").map(Number);
  const totalMins = iH * 60 + iM - (sH * 60 + sM);
  if (Number.isNaN(totalMins) || totalMins <= 0) return "";
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hrs} Hrs and ${mins} Min`;
}

/**
 * Returns true if today's date falls within the configured Ramadan window.
 */
export function isCurrentlyRamadan(
  currentDate = getTodayMidnight(),
  ramadanStart = RAMADAN_CONFIG.START_DATE,
  totalRamadanDays = RAMADAN_CONFIG.TOTAL_DAYS
) {
  const diff = date.getDateDiff(currentDate, ramadanStart, "days");
  return diff >= 0 && diff < totalRamadanDays;
}

/**
 * Parses either a 366-day "Perpetual Salaah Times" CSV string or a legacy 30-day JSON array.
 * Returns { posts, currentIndex, isRamadanActive, isPerpetual }.
 */
export function buildCitySchedule(
  rawData,
  currentDate = getTodayMidnight(),
  ramadanStart = RAMADAN_CONFIG.START_DATE,
  totalRamadanDays = RAMADAN_CONFIG.TOTAL_DAYS
) {
  const diffFromRamadan = date.getDateDiff(currentDate, ramadanStart, "days");
  const isRamadanActive =
    diffFromRamadan >= 0 && diffFromRamadan < totalRamadanDays;

  // Case 1: 366-day Perpetual Salaah Times CSV text
  if (typeof rawData === "string" && !rawData.trim().startsWith("[")) {
    const lines = rawData.split(/\r?\n/);
    const rowByDayMonth = new Map();
    const rawRows = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!/^\d{2}\s+[A-Za-z]{3},/.test(trimmed)) continue;
      const cols = trimmed.split(",").map((c) => c.trim());
      if (cols.length < 13) continue;

      const [dayStr, monthStr] = cols[0].split(/\s+/);
      const dayMonthKey = `${dayStr}-${monthStr}`;
      const seri = cols[1];
      const fajr = cols[2];
      const sunrise = cols[3];
      const zohr = cols[7];
      const asrs = cols[8];
      const asrh = cols[9];
      const iftar = cols[10];
      const eshas = cols[11];
      const eshah = cols[12];

      const rowObj = {
        DAY_MONTH: dayMonthKey,
        DAY_NUM: Number(dayStr),
        MONTH_STR: monthStr,
        SERI: seri,
        FAJR: fajr,
        SUNRISE: sunrise,
        ZOHR: zohr,
        ASRS: asrs,
        ASRH: asrh,
        IFTAR: iftar,
        ESHAS: eshas,
        ESHAH: eshah,
        ESHA: eshah,
        DURATION: calculateDuration(seri, iftar),
      };

      rowByDayMonth.set(dayMonthKey, rowObj);
      rawRows.push(rowObj);
    }

    if (isRamadanActive) {
      // Slice the exact 30 (or 29) days of Ramadan using real calendar dates
      const ramadanPosts = [];
      for (let i = 0; i < totalRamadanDays; i++) {
        const fastDateObj = date.addToDate(ramadanStart, { days: i });
        const key = date.formatDate(fastDateObj, "DD-MMM");
        const matched = rowByDayMonth.get(key);
        if (matched) {
          ramadanPosts.push({
            ...matched,
            FAST: i + 1,
            DATE: date.formatDate(fastDateObj, "DD-MMM-YYYY"),
            DAY_NAME: date.formatDate(fastDateObj, "dddd"),
          });
        }
      }
      return {
        posts: ramadanPosts,
        currentIndex: diffFromRamadan + 1,
        isRamadanActive: true,
        isPerpetual: true,
      };
    }

    // Outside of Ramadan: build full calendar year for currentDate's year
    const currentYear = currentDate.getFullYear();
    const isLeap =
      (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
      currentYear % 400 === 0;
    const yearPosts = [];

    for (const row of rawRows) {
      if (!isLeap && row.DAY_MONTH === "29-Feb") continue;
      const monthIdx = MONTH_MAP[row.MONTH_STR];
      const dObj = new Date(currentYear, monthIdx, row.DAY_NUM);
      yearPosts.push({
        ...row,
        FAST: yearPosts.length + 1,
        DATE: date.formatDate(dObj, "DD-MMM-YYYY"),
        DAY_NAME: date.formatDate(dObj, "dddd"),
      });
    }

    const todayFormatted = date.formatDate(currentDate, "DD-MMM-YYYY");
    const todayIndex = yearPosts.findIndex((r) => r.DATE === todayFormatted);

    return {
      posts: yearPosts,
      currentIndex: todayIndex >= 0 ? todayIndex + 1 : 1,
      isRamadanActive: false,
      isPerpetual: true,
    };
  }

  // Case 2: Legacy 30-day JSON array (or JSON string)
  const parsedArray =
    typeof rawData === "string" ? JSON.parse(rawData) : rawData;
  const posts = Array.isArray(parsedArray)
    ? parsedArray.map((item) => {
        const dObj = parseTimetableDate(item.DATE);
        return {
          ...item,
          ESHAS: item.ESHAS || item.ESHA,
          ESHAH: item.ESHAH || item.ESHA,
          DAY_NAME: date.formatDate(dObj, "dddd"),
        };
      })
    : [];

  return {
    posts,
    currentIndex: isRamadanActive ? diffFromRamadan + 1 : 1,
    isRamadanActive,
    isPerpetual: false,
  };
}
