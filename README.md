# Agatigito — app

"Never travel alone." A ride-share marketplace for Rwanda: riders book seats, drivers post trips, admin reviews driver documents and rider reports, plus community "vibes" posts, parcels, tours, and corporate commute programs.

This folder turns the original Claude-artifact prototype into a real project you can push to GitHub and build into an installable Android APK.

## What changed from the prototype

- **`window.storage`** (Claude.ai-only) is now backed by real `localStorage` via `src/lib/storage.js`. Everything that called `window.storage.get/set(...)` in `App.jsx` works unmodified.
- **Destination search** (`src/components/DestinationAutocomplete.jsx`) uses real Google Places Autocomplete when a Maps API key is set, and degrades to a plain text field otherwise.
- **Route + fare estimate** (`src/components/RouteMap.jsx`) draws the real driving route between two points and feeds real road distance into the existing Fair Price calculator, instead of the straight-line fallback.
- **Live tracking** (`src/components/LiveTrackingMap.jsx`) lets a driver broadcast GPS location during an "en route" trip; riders and admin see it on a map. **Read the PRODUCTION NOTE at the top of that file** — it currently syncs through `localStorage`, which only works same-device. Cross-device tracking needs a small backend (see the note for exactly what to swap in).
- **Vibes photo/video** (`src/components/VibeMediaCapture.jsx`) lets someone attach a photo or a short (≤15s) video to a community vibe post, using the device's own camera app.

## Running it locally

```bash
npm install
cp .env.example .env      # then paste in your Google Maps API key
npm run dev
```

Open the printed local URL. On your phone, use the "Network" URL Vite prints (same Wi-Fi) to test camera/location features, since browsers restrict those on non-HTTPS/non-localhost origins otherwise.

## Google Maps setup

The app needs one API key with these enabled: **Maps SDK for Android**, **Places API**, **Directions API**, **Distance Matrix API**, **Geocoding API**. Get one at [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials. Put it in `.env` as `VITE_GOOGLE_MAPS_API_KEY=...` for local dev, and in a GitHub Actions secret (see below) for CI builds. Restrict the key to your app's package name once you have one, so a leaked key can't be abused.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Agatigito: real project scaffold, maps, camera, tracking"
git branch -M main
git remote add origin https://github.com/<your-username>/agatigito-app.git
git push -u origin main
```

Then in your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**, name it `VITE_GOOGLE_MAPS_API_KEY`, and paste your key. This lets the automated APK build (below) bake the key in without it ever being committed to the repo.

## Getting an APK (no Android Studio required)

Once pushed, GitHub Actions (`.github/workflows/build-apk.yml`) builds a debug APK automatically on every push to `main`. To get it:

1. Go to your repo's **Actions** tab.
2. Open the latest **Build Android APK** run.
3. Scroll to **Artifacts** and download `agatigito-debug-apk`.
4. Unzip it, and you'll have `app-debug.apk` — transfer it to an Android phone (email, USB, Google Drive) and open it to install (you'll need to allow "install from unknown sources" once, since it isn't from the Play Store).

This is a **debug** build, good for testing on real devices. Before a public release you'd want a signed release build — Capacitor's own docs have a short guide: [capacitorjs.com/docs/android/deploying-to-google-play](https://capacitorjs.com/docs/android/deploying-to-google-play).

### Building the APK on your own machine instead

If you'd rather build locally (needs Android Studio + its SDK installed):

```bash
npm run build
npx cap add android      # first time only
npx cap sync android
npx cap open android      # opens Android Studio — Build → Build APK(s)
```

## What's still a prototype, not production

Search the codebase for `PRODUCTION NOTE` — each one flags something that works for a demo but needs a real backend before real users rely on it:
- Live location tracking is same-device only until it's backed by a server (see `LiveTrackingMap.jsx`).
- Vibe photos/videos live in memory/localStorage, not real object storage (see `VibeMediaCapture.jsx`).
- Payments, OTP verification, and the admin PIN are all simulated — no real Mobile Money, SMS gateway, or staff auth system is wired up.
- There is no shared backend at all yet — every device has its own local profile, trips, and vibes. Multi-device sync (the same account on two phones, or two people seeing the same trip) needs a real API + database.
