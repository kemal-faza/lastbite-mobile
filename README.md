# LastBite Mobile

Aplikasi mobile marketplace **Makanan Surplus** (food surplus) yang menghubungkan **Mitra** (penjual) dengan **Food Saver** (pembeli). Dibangun dengan Expo SDK 57 + React Native 0.86.

Makanan surplus adalah makanan layak konsumsi yang masih fresh namun akan segera kadaluwarsa — dijual dengan harga diskon untuk mengurangi *food waste*. Pengguna bisa menemukan produk terdekat, memesan, dan mengambil langsung di toko.

> **Backend:** [lastbite-backend](https://github.com/kemalm/lastbite-backend) (berjalan di `http://localhost:4000`)

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Domain Language](#domain-language)
- [Prasyarat](#prasyarat)
- [Setup](#setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Testing](#testing)
- [Struktur Proyek](#struktur-proyek)
- [Rute Utama](#rute-utama)
- [Konvensi Kode](#konvensi-kode)
- [Design System](#design-system)
- [Migrasi & Prebuild](#migrasi--prebuild)
- [Catatan Penting](#catatan-penting)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Expo SDK 57 (React Native 0.86) |
| **Routing** | Expo Router (file-based, `app/`) |
| **Navigation** | Bottom tabs (Food Saver) + Drawer (Mitra) |
| **State (server)** | TanStack Query v5 |
| **State (client)** | Zustand v5 |
| **Styling** | Nativewind v4 + TailwindCSS v3 |
| **UI Primitives** | @rn-primitives (dialog, label, portal, slot) |
| **Icons** | @expo/vector-icons (MaterialCommunityIcons) |
| **Forms** | react-hook-form + zod |
| **Maps** | react-native-maps (dormant — redirect ke Google Maps via `Linking.openURL`) |
| **Bottom Sheet** | @gorhom/bottom-sheet |
| **API Client** | Custom `fetch` wrapper + AsyncStorage token management |
| **Testing** | Jest + ts-jest + @testing-library/react-native |
| **TypeScript** | ~5.3.3 |
| **Path Alias** | `@/` → `src/` |

---

## Arsitektur

```
                   ┌──────────────────┐
                   │   Expo Router     │
                   │  (app/ route)     │
                   └──────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
   ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
   │  Food Saver  │ │   Mitra    │ │   Auth     │
   │ (bottom tab) │ │  (drawer)  │ │ (no nav)   │
   └──────┬──────┘ └─────┬──────┘ └─────┬──────┘
          │              │              │
   ┌──────▼──────────────▼──────────────▼──────┐
   │            Custom Components               │
   │      (src/components/)                     │
   └──────┬─────────────────────────────────────┘
          │
   ┌──────▼─────────────────────────────────────┐
   │              Custom Hooks                   │
   │   (src/hooks/ — TanStack Query + Zustand)  │
   └──────┬─────────────────────────────────────┘
          │
   ┌──────▼─────────────────────────────────────┐
   │           API Layer                         │
   │   (src/lib/api/ — fetch wrapper + clients)  │
   └─────────────────────────────────────────────┘
```

### State Management

- **Server state** (products, orders, cart): TanStack Query — data selalu dari backend, auto-caching + invalidation.
- **Client state** (auth): Zustand store (`authStore`) — token + user info, di-persist ke AsyncStorage.
- **No dual source of truth:** Semua data mutabel via backend, hanya auth yang client-side.

---

## Domain Language

Proyek ini menggunakan istilah Bahasa Indonesia yang konsisten:

| Istilah | Makna | Contoh Penggunaan |
|---------|-------|------------------|
| **Food Saver** | Pembeli (bukan buyer/customer) | Nav tab: Beranda, Cari, Keranjang, Pesanan, Profil |
| **Mitra** | Penjual (bukan seller/merchant) | Nav drawer: Ringkasan, Produk, Pesanan Masuk |
| **Makanan Surplus** | Makanan layak konsumsi yang akan kadaluwarsa | Produk dengan diskon karena mendekati expiry |
| **Keranjang** | Cart / shopping bag | `useCart` hook, halaman keranjang |
| **Pesanan** | Order | Status: PENDING, PROCESSED, READY, PICKED_UP, CANCELLED |
| **Kode Pickup** | Kode unik format `LAST-XXXX` untuk mengambil pesanan | Food Saver confirm via button |
| **Dampak** | Impact / statistik (makanan terselamatkan, CO2 reduction) | Halaman profil |

---

## Prasyarat

- **Node.js** 20+
- **npm** 10+
- **Android Studio** (untuk emulator Android) atau **Xcode** (untuk iOS simulator)
- **Backend** `lastbite-backend` berjalan di `http://localhost:4000`
- **Env file** `.env` dengan isi (copy dari `.env.example`):

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

> Google Maps API key hanya diperlukan untuk Android. iOS menggunakan Apple Maps (tanpa key).

---

## Setup

```bash
# 1. Clone
git clone <repo-url>
cd lasbite-mobile

# 2. Install dependencies
npm install

# 3. Copy env
cp .env.example .env
# Edit .env sesuai konfigurasi backend

# 4. (Jika pertama kali atau ada perubahan native module)
npx expo prebuild --clean
```

---

## Menjalankan Aplikasi

### Android

```bash
# Pastikan emulator Android berjalan atau device terhubung via ADB
npm run android
```

### iOS

```bash
npm run ios
```

### Development Build

Proyek ini menggunakan **expo-dev-client** (bukan Expo Go). Setelah `prebuild`, development build harus di-install ke emulator/device:

```bash
npx expo run:android    # build + install ke emulator
npx expo run:ios        # build + install ke iOS simulator
```

Untuk hot-reload setelah development build berjalan:

```bash
npx expo start
```

---

## Testing

```bash
# Semua test
npm test

# Test file spesifik
npx jest --no-coverage src/hooks/__tests__/useProducts.test.tsx

# Type check
npx tsc --noEmit
```

Target: **~76 tests** (bervariasi tergantung jumlah test baru), **0 fail**.

---

## Struktur Proyek

```
lasbite-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (food-saver)/             #   Food Saver bottom tabs
│   ├── (mitra)/                  #   Mitra drawer navigation
│   ├── (auth)/                   #   Login, Register, Verify OTP
│   └── _layout.tsx               #   Root layout (providers, gesture handler)
├── src/
│   ├── components/               # Komponen UI reusable
│   │   ├── ProductCard.tsx       #   Kartu produk (baris, grid, dll)
│   │   ├── CategoryFilter.tsx    #   Filter kategori horizontal
│   │   ├── SortPills.tsx         #   Sort pills (Relevansi, Termurah, dll)
│   │   ├── FilterModal.tsx       #   Bottom sheet filter (jarak, harga, expiry)
│   │   ├── TopBar.tsx            #   Top bar navigasi
│   │   ├── CountdownTimer.tsx    #   Countdown real-time
│   │   ├── SkeletonCard.tsx      #   Skeleton loading
│   │   ├── EmptyState.tsx        #   Empty state component
│   │   └── ...                   #   Lainnya
│   ├── hooks/                    # Custom hooks
│   │   ├── useProducts.ts        #   Fetch produk (TanStack Query)
│   │   ├── useGeolocation.ts     #   Geolokasi (expo-location)
│   │   ├── useDebounce.ts        #   Debounce generic
│   │   ├── useRequireAuth.ts     #   Auth guard hook + component
│   │   ├── useNotifications.ts   #   Notifikasi (polling 30s)
│   │   ├── useCart.ts            #   Keranjang (TanStack Query)
│   │   └── ...
│   ├── lib/
│   │   ├── api/                  # API clients
│   │   │   ├── client.ts         #   Fetch wrapper + token management
│   │   │   ├── products.ts       #   Product endpoints + filters
│   │   │   ├── orders.ts         #   Order endpoints
│   │   │   ├── mitra.ts          #   Mitra endpoints + CRUD
│   │   │   ├── notifications.ts  #   STUB: notifikasi
│   │   │   ├── wishlist.ts       #   STUB: wishlist
│   │   │   └── analytics.ts      #   STUB: analytics
│   │   └── utils/
│   │       ├── formatExpiry.ts   #   Format expiry "2 jam" / "45 menit"
│   │       └── formatDistance.ts #   Format jarak "120m" / "1.5 km"
│   ├── stores/                   # Zustand stores
│   │   └── authStore.ts          #   Auth state (user, token, isAuthenticated)
│   └── theme/
│       ├── tokens.ts             #   Design tokens (colors, typography, spacing)
│       └── __tests__/
│           └── tokens.test.ts    #   Token consistency tests
├── tests/                        # Integration test files
│   └── unit/
│       ├── cartRules.test.ts
│       └── components/
├── docs/                         # Dokumentasi
│   ├── ROADMAP.md                #   Roadmap pengembangan (7 sub-spek)
│   ├── adr/                      #   Architecture Decision Records
│   └── superpowers/
│       ├── specs/                #   Spesifikasi fitur
│       └── plans/                #   Implementation plans
├── app.config.js                 # Expo config (plugins, permissions, maps)
├── tailwind.config.js            # Tailwind custom tokens
├── jest.config.js                # Jest config (ts-jest, path alias)
└── jest.setup.js                 # Jest mocks (expo-location, expo-router, dll)
```

---

## Rute Utama

| Route | Grup | Navigasi | Deskripsi |
|-------|------|----------|-----------|
| `/index` | Food Saver | Bottom tab | Home — grid produk 2-kolom, sort, category filter |
| `/search` | Food Saver | Bottom tab | Pencarian produk 1-kolom |
| `/cart` | Food Saver | Bottom tab | Keranjang (auth-gated) |
| `/product/[id]` | Food Saver | Stack | Detail produk (hero image, trust badges, review) |
| `/checkout` | Food Saver | Stack | Checkout flow |
| `/order/confirm/[id]` | Food Saver | Stack | Konfirmasi pickup |
| `/mitra/index` | Mitra | Drawer | Dashboard mitra (stats, ringkasan) |
| `/mitra/products` | Mitra | Drawer | Manajemen produk |
| `/login` | Auth | Modal | Login page |
| `/register` | Auth | Modal | Register page |

---

## Konvensi Kode

### Impor

Gunakan path alias `@/` untuk file di `src/`:

```typescript
// ✅ Benar
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { colors } from '@/theme';

// ❌ Salah
import { useProducts } from '../../hooks/useProducts';
```

### Testing (TDD)

- **Test first** — tulis test sebelum implementasi (RED → GREEN → REFACTOR)
- Test file colocated di `__tests__/` atau berdampingan dengan `*.test.ts`
- Semua test harus pass sebelum commit

### Routing

- Food Saver: bottom tabs (`app/(food-saver)/`)
- Mitra: drawer (`app/(mitra)/`)
- Auth: stack tanpa tab (`app/(auth)/`)

### State

- Server data: TanStack Query (`useQuery`, `useMutation`)
- Client data (auth): Zustand (`authStore`)
- Jangan port `CartContext` / `AuthContext` dari Next.js

---

## Design System

Design tokens didefinisikan di `src/theme/tokens.ts` dan dicerminkan di `tailwind.config.js`:

| Token | Value | Penggunaan |
|-------|-------|------------|
| `primary` | `#11676a` | Tombol, nav aktif |
| `secondary` | `#dda63a` | Harga diskon, aksen kuning |
| `background` | `#f5f0e4` | Background halaman (cream) |
| `destructive` | `#c2382e` | Harga coret, stok habis, error |
| `surface` | `#ffffff` | Card background, modal |

Nativewind class `bg-background`, `text-primary`, `text-secondary` dst. semuanya resolve ke token ini.

---

## Migrasi & Prebuild

Saat menambah **expo module baru** (expo-location, expo-notifications, dll):

```bash
# 1. Install dengan versi yang cocok SDK
npx expo install <package>

# 2. Update app.config.js (plugin + permissions)

# 3. Regenerasi native project
npx expo prebuild --clean

# 4. Rebuild
npm run android
```

**Jangan lupa restart backend** jika ada perubahan di validator atau service backend.

---

## Catatan Penting

- **`expo-image` tidak support `className`** — wrapper dengan `<View>` untuk styling.
- **`space-x` / `space-y` tidak bekerja di React Native** — pakai `gap`.
- **`gap` + percentage widths (`w-1/2`) cause overflow** — pakai `w-[48%]` + `justify-between`.
- **Google Maps on Android perlu API key** — di set di `.env`, dibaca di `app.config.js`.
- **Maps tidak dirender inline** — semua navigasi ke maps via `Linking.openURL` redirect.
- **ADRs** di `docs/adr/` berisi keputusan arsitektur yang sudah disepakati.

---

## Roadmap

Lihat `docs/ROADMAP.md` untuk 7 sub-spek pengembangan berikutnya:

1. Mitra Dashboard + Registration
2. Mitra Product Management
3. Mitra Orders
4. Product Detail + AI Recommendation
5. Cart + Checkout
6. Order Confirm + Review
7. Wishlist + Notifications + Search + Profile

Sub-spek 0 (Foundation) sudah selesai: 5 hooks, 3 API stubs, ADR, 72+ tests.

---

## Lisensi

Hak cipta LastBite. Penggunaan internal.
