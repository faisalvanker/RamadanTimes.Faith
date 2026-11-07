# Ramadan Times / Salaah Times

**Ramadan Times** ([ramadantimes.faith](https://www.ramadantimes.faith)) is an offline-capable Progressive Web App (PWA) for Muslims across South Africa and neighbouring regions.

It operates seamlessly in two modes:
- **During Ramadan (`Ramadan Times`):** Tracks daily Suhoor, Iftar, and salah times across all 30 days of Ramadan, complete with Daily Duas, Ramadan Progress (`%`), Ashra stages, Laylat al-Qadr odd-night indicators, and important Islamic dates.
- **Outside of Ramadan (`Salaah Times`):** Automatically switches into a year-round perpetual Salaah timetable (`01 Jan – 31 Dec`) showing live current/upcoming salah times, countdowns, and full-year daily navigation.

---

## Features

- **340+ Cities & Towns:** Supports over 340 locations across South Africa, Southern Africa, and major international cities using perpetual 366-day solar prayer timetables.
- **Hanafi & Shafi'i Calculation Method:** Single toggle in Preferences switches both **Asr** and **Esha** between Hanafi (`Asr (H)` / `Isha (H)`) and Shafi'i (`Asr (S)` / `Isha (S)`).
- **Live Prayer Window & Countdown:** Highlights the current prayer window (`Suhoor → Fajr → Sunrise → Zohr → Asr → Iftar/Magrib → Esha`) and displays a live countdown to the upcoming prayer.
- **Full Timetable with Touch Swipe:** Swipe left/right or use the pagination controls (`First`, `Prev`, `Next`, `Last`, and `Go to Today`) to view any day's timetable and fasting duration.
- **Daily Duas (During Ramadan):** Displays the daily Ramadan Dua alongside Duas for fasting (Suhoor) and breaking fast (Iftar).
- **Ramadan Progress & Key Dates (During Ramadan):** Tracks percentage completion of Ramadan, the current Ashra (Mercy, Forgiveness, Refuge from Hellfire), Laylat al-Qadr odd nights, and automatically calculated Islamic anniversary dates.
- **Tasbeeh Counter:** Simple, persistent digital Tasbeeh counter with haptic feedback.
- **Smart Offline PWA Caching:** Caches only the user's selected city on-demand (with a 10-day refresh window) so the app installs quickly and works offline without downloading all 340+ cities upfront.

---

## Annual Ramadan Update Guide (What To Do Next Year)

Because all 343 city files in `public/statics/data/city/*.csv` contain **366-day perpetual solar prayer times** and `InfoTab` automatically calculates all 14 Islamic event dates from the start of Ramadan, **you never need to edit any city CSVs or `info.csv` again.**

You also **do not need to rebuild the application** each year — the annual Ramadan settings are loaded dynamically at runtime from `statics/data/config.json` using a `NetworkFirst` strategy (with cache-busting when online and automatic fallback when offline).

### Option A: Update Directly on Your Live Server (No Rebuild Needed)

1. Open `statics/data/config.json` on your web server:
   ```json
   {
     "hijriYear": "1448",
     "startDate": "2027-02-09",
     "totalDays": 30
   }
   ```
2. Update the values for the new Ramadan:
   - `"hijriYear"`: The new Islamic Hijri year (e.g. `"1448"` in 2027, `"1449"` in 2028).
   - `"startDate"`: The 1st day of Ramadan in `YYYY-MM-DD` format based on South African moon sighting (e.g. `"2027-02-09"`).
   - `"totalDays"`: Leave as `30`. If the Shawwal moon is sighted on the 29th night, change `"totalDays"` to `29` so the app switches back to normal `Salaah Times` mode on Eid morning.
3. Save the file on the server. Every user opening the app while online will immediately receive the updated dates without needing to reinstall or rebuild the app.

### Option B: Update in Git & Rebuild (If Deploying via CI/CD or Full Upload)

If you prefer to keep your Git repository in sync and deploy a fresh build:

1. Edit [`public/statics/data/config.json`](public/statics/data/config.json) with the new `hijriYear`, `startDate`, and `totalDays`.
2. *(Optional)* Update the fallback defaults in [`src/constants/appConfig.js`](src/constants/appConfig.js) (`RAMADAN_CONFIG`) and increment `"version"` in [`package.json`](package.json).
3. Run the production PWA build:
   ```bash
   npx quasar build -m pwa
   ```
4. Deploy the generated `dist/pwa/` folder to your hosting provider.

---

## Local Development & Build Commands

### 1. Install Dependencies

```bash
yarn install --ignore-engines
```

### 2. Run in Development Mode

```bash
npx quasar dev
```

Starts the local development server at `http://localhost:9000/` with Hot Module Replacement (HMR).

### 3. Build for Production (PWA)

```bash
npx quasar build -m pwa
```

Generates the production-ready PWA bundle and Service Worker inside `dist/pwa/`.
