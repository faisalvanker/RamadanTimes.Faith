# Ramadan Times

**Ramadan Times** ([ramadantimes.faith](https://www.ramadantimes.faith)) is an offline-capable Progressive Web App (PWA) designed to help Muslims across South Africa and neighbouring regions track daily Suhoor, Iftar, and salah times throughout the blessed month of Ramadan.

## Features

- **340+ Cities & Towns:** Supports over 340 locations across South Africa, Southern Africa, and major international cities.
- **Hanafi & Shafi'i Asr Support:** Easily toggle between Hanafi and Shafi'i Asr calculation times in Preferences.
- **Live Prayer Window & Countdown:** Highlights the current prayer window (`Suhoor → Fajr → Sunrise → Zohr → Asr → Iftar → Esha`) and displays a live countdown to the upcoming prayer.
- **Full 30-Day Timetable:** Browse or swipe through all 30 days of Ramadan with highlighted Suhoor and Magrib times and a quick **Go to Today** shortcut.
- **Daily Duas:** Includes a daily Ramadan Dua for each of the 30 days, alongside Duas for fasting (Suhoor) and breaking fast (Iftar).
- **Ramadan Progress & Key Dates:** Tracks percentage completion of Ramadan, the current Ashra (Mercy, Forgiveness, Refuge from Hellfire), Laylat al-Qadr odd nights, and upcoming Islamic calendar dates.
- **Tasbeeh Counter:** Simple, persistent digital Tasbeeh counter with haptic feedback.
- **100% Offline PWA:** Works completely offline once installed or visited, with automatic update notifications when new timetables are published.

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) + [Quasar Framework v2](https://quasar.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) (`@quasar/app-vite`)
- **PWA / Offline Caching:** [Workbox](https://developer.chrome.com/docs/workbox/) (`GenerateSW`)

## Getting Started

### 1. Install Dependencies

```bash
yarn install
# or
npm install
```

### 2. Run in Development Mode

```bash
npx quasar dev
```

The development server will start at `http://localhost:9000/` with Hot Module Replacement (HMR).

### 3. Build for Production (PWA)

```bash
npx quasar build -m pwa
```

The production-ready PWA bundle and Service Worker will be generated in `dist/pwa/`.

## Annual Ramadan Update Checklist

All dates and timetables follow local South African moon sighting and are configured in two places:

1. **Update CSV Data Files (`public/statics/data/`):**
   - Replace the city timetable files in `public/statics/data/city/*.csv` (note: files have a `.csv` extension for legacy compatibility and contain JSON arrays).
   - Update the upcoming Islamic dates in `public/statics/data/info.csv`.
2. **Update Annual Config (`src/constants/appConfig.js`):**
   - Update `RAMADAN_CONFIG.HIJRI_YEAR` (e.g. `"1447"`) and `RAMADAN_CONFIG.START_DATE`.
3. **Bump App Version (`package.json`):**
   - Increment `"version"` in `package.json` (automatically displayed in the navigation drawer).
