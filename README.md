# LastBite Mobile

Aplikasi mobile LastBite dibangun dengan Expo + React Native.

## Prasyarat
- Node.js 20+
- Android emulator atau device
- Backend `lastbite-backend` berjalan di `http://localhost:4000`

## Setup
```bash
npm install
```

## Jalankan
```bash
npm run android
```

## Struktur
- `app/` — layar dan routing (Expo Router)
- `src/components/` — komponen UI
- `src/lib/api/` — API client
- `src/hooks/` — custom hooks
- `src/stores/` — Zustand stores
