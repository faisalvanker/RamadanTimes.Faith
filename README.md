# Ramadan Times / Salaah Times

**Ramadan Times** ([ramadantimes.faith](https://www.ramadantimes.faith)) is an offline-capable Progressive Web App (PWA) for Muslims across South Africa and neighbouring regions.

It operates seamlessly in two modes:
- **During Ramadan (`Ramadan Times`):** Tracks daily Suhoor, Iftar, and salah times across all 30 days of Ramadan, complete with Daily Duas, Ramadan Progress (`%`), Ashra stages, Laylat al-Qadr odd-night indicators, and important Islamic dates.
- **Outside of Ramadan (`Salaah Times`):** Automatically switches into a year-round perpetual Salaah timetable (`01 Jan – 31 Dec`) showing live current/upcoming salah times, countdowns, and full-year daily navigation.

## Features

- **340+ Cities & Towns:** Supports over 340 locations across South Africa, Southern Africa, and major international cities.
- **Hanafi & Shafi'i Calculation Method:** Single toggle in Preferences switches both **Asr** and **Esha** between Hanafi (`Asr (H)` / `Isha (H)`) and Shafi'i (`Asr (S)` / `Isha (S)`).
- **Live Prayer Window & Countdown:** Highlights the current prayer window (`Suhoor → Fajr → Sunrise → Zohr → Asr → Iftar/Magrib → Esha`) and displays a live countdown to the upcoming prayer.
- **Full Timetable with Touch Swipe:** Swipe left/right or use the pagination controls (`First`, `Prev`, `Next`, `Last`, and `Go to Today`) to view any day's timetable and fasting duration.
- **Daily Duas (During Ramadan):** Displays the daily Ramadan Dua alongside Duas for fasting (Suhoor) and breaking fast (Iftar).
- **Ramadan Progress & Key Dates (During Ramadan):** Tracks percentage completion of Ramadan, the current Ashra (Mercy, Forgiveness, Refuge from Hellfire), Laylat al-Qadr odd nights, and automatically calculated Islamic anniversary dates.
- **Tasbeeh Counter:** Simple, persistent digital Tasbeeh counter with haptic feedback.
- **Smart Offline PWA Caching:** Caches only the user's selected city on-demand (with a 10-day refresh window) so the app installs quickly and works offline without downloading all 340+ cities upfront.

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) + [Quasar Framework v2](https://quasar.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) (`@quasar/app-vite`)
- **PWA / Offline Caching:** [Workbox](https://developer.chrome.com/docs/workbox/) (`GenerateSW` with runtime caching)

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

Because city files use the **366-day Perpetual Salaah Times** format and `InfoTab` calculates all Islamic event dates automatically from `START_DATE`, you **do not** need to edit any `.csv` files each year:

1. **Update Annual Config (`src/constants/appConfig.js`):**
   - Update `RAMADAN_CONFIG.HIJRI_YEAR` (e.g. `"1448"`).
   - Update `RAMADAN_CONFIG.START_DATE` (e.g. `new Date(2027, 1, 9)` for `09 Feb 2027`).
   - *(Optional)* If the Shawwal moon is sighted on the 29th night, change `RAMADAN_CONFIG.TOTAL_DAYS` from `30` to `29`.
2. **Bump App Version (`package.json`):**
   - Increment `"version"` in `package.json` (automatically displayed in the navigation drawer and used to bust cached city URLs).
