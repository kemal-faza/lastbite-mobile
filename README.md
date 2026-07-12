# LastBite Mobile

Mobile application for LastBite, a food surplus marketplace connecting merchants with customers to reduce food waste.

## Tech Stack

- **Framework:** Expo SDK 57 / React Native 0.86
- **Routing:** Expo Router (file-based)
- **Navigation:** Bottom tabs (customer) + Drawer (merchant)
- **State Management:** TanStack Query v5 (server) + Zustand v5 (client)
- **Styling:** Nativewind v4
- **UI Primitives:** React Native Reusables (@rn-primitives)
- **Icons:** @expo/vector-icons (MaterialCommunityIcons)
- **API:** Custom fetch wrapper with AsyncStorage token management
- **Testing:** Jest + ts-jest + @testing-library/react-native

## Related Repositories

This mobile app is part of the LastBite ecosystem. Other repositories:

- **[lastbite-nextjs](https://github.com/kemal-faza/lastbite-nextjs)** — Web frontend (Next.js), admin panel for platform management
- **[lastbite-backend](https://github.com/kemal-faza/lastbite-backend)** — Backend API (Node.js + Express + Prisma + PostgreSQL)
- **[lastbite-prototype](https://github.com/kemal-faza/lastbite-prototype)** — Design prototype, mockups, and early-stage wireframes

## Prerequisites

- Node.js 20+
- Android Studio or Xcode
- Backend service running at `http://localhost:4000`

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Google Maps API key is only required for Android. iOS uses Apple Maps.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run on Android (ensure emulator is running)
npm run android

# Run on iOS
npm run ios
```

## Development

```bash
# Start development server
npx expo start

# Run tests
npm test

# Type check
npx tsc --noEmit

# Regenerate native projects (after adding native modules)
npx expo prebuild --clean
```

## Project Structure

```
lasbite-mobile/
├── app/                     # Routes (Expo Router)
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── api/             # API clients
│   │   └── utils/           # Utility functions
│   ├── stores/              # Zustand stores
│   └── theme/               # Design tokens
├── app.config.js            # Expo configuration
├── tailwind.config.js       # Tailwind configuration
└── jest.config.js           # Test configuration
```


