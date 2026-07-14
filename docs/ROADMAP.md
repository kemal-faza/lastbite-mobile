# ROADMAP — Sub-spek Porting Next.js ke Mobile

**Induk:** Porting fitur dari `lastbite-nextjs` (Next.js + shadcn) ke `lasbite-mobile` (Expo/React Native)

---

## Progress

| Status | Count |
|--------|-------|
| Done | 4 (Sub-spek 0, Sub-spek 1, Sub-spek 2, Sub-spek 3) |
| Not started | 4 (Sub-spek 4–7) |

---

## Sub-spek 0: Foundation Porting (DONE)

**Tanggal:** 2026-07-10
**Spec:** `docs/superpowers/specs/2026-07-10-foundation-porting-design.md`
**Plan:** `docs/superpowers/plans/2026-07-10-foundation-porting-implementation.md`

**Yang sudah ada:**
- 5 hooks: `useGeolocation`, `useDebounce`, `useRequireAuth`, `useHasPurchaseHistory`, `useNotifications`
- 3 API stubs: `notifications.ts`, `wishlist.ts`, `analytics.ts`
- API extensions: `ProductFilters`, Mitra CRUD, `hasPurchaseHistory`
- `expo-location` installed + permissions
- 72 tests (31 existing + 41 new)
- ADR-0001 (porting principles), ADR-0002 (wishlist state)

---

## Sub-spek 1: Mitra Dashboard + Registration (DONE)

**Tanggal:** 2026-07-12

**Arsitektur Update:**
- Mekanisme update data tidak menggunakan polling timer. Menggunakan kombinasi **FCM Silent Push** + **Refresh on Focus** (AppState listener) + **Pull-to-Refresh** (React Query staleTime 10s sebagai anti-spam).

**Yang sudah ada:**
- Dashboard stats cards (`DashboardStatsCard`, `useMitraStats`)
- Analytics tab (`app/(mitra)/analytics.tsx`) menggunakan stub `analytics.ts` dari sub-spek 0
- `MITRA_NOT_FOUND` state dengan tombol CTA daftar
- Registration form lengkap: nama, deskripsi, foto (`expo-image-picker`), lokasi (`MapPinPicker` dengan auto-fill GPS + geser pin)
- `useRefreshOnFocus` hook — refetch data saat app kembali ke foreground
- `useNotificationResponder` hook — invalidate query saat FCM silent push diterima
- Firebase FCM V1 credentials terkonfigurasi (google-services.json + EAS upload)
- 108 tests (25 suites)

**Commits:**
- `3849b8a` feat: sub-spek 1 mitra dashboard + registration
- `ca6cd0a` chore: clean up throwaway files and ignore firebase configs
- `cc11612` chore: update native configs from expo-notifications plugin

**Files baru:**
- `src/lib/api/mitra-stats.ts`
- `src/components/DashboardStatsCard.tsx`
- `src/components/MapPinPicker.tsx`
- `src/hooks/useRefreshOnFocus.ts`
- `src/hooks/useNotificationResponder.ts`
- `app/(mitra)/analytics.tsx`
- `app/(mitra)/register.tsx`
- `eas.json`

**Depends on:** Sub-spek 0, backend `/mitra/stats`, `/analytics/*`, `/mitra/register`

---

## Sub-spek 2: Mitra Product Management (DONE)

**Tanggal:** 2026-07-13
**Spec:** `docs/superpowers/specs/2026-07-13-mitra-product-management-design.md`
**Plan:** `docs/superpowers/plans/2026-07-13-mitra-product-management-implementation.md`

**Yang sudah ada:**
- Product form lengkap (`ProductForm.tsx`) — name, price, stock, category, expiry, image
- Expiry date picker (`ExpiryPicker.tsx`)
- Image upload via `expo-image-picker` (take photo / gallery) dengan FormData
- Add product (`app/(mitra)/products/add.tsx`)
- Edit product (`app/(mitra)/products/[id]/edit.tsx`) — pre-populate form
- Detail product (`app/(mitra)/products/[id].tsx`)
- List product dengan swipe-to-edit/delete (`app/(mitra)/products.tsx`)
- Delete product dengan konfirmasi
- API: `createMitraProduct`, `updateMitraProduct`, `deleteMitraProduct`

**Commits:**
- `6444ad0` feat(mitra): add swipe-to-edit/delete and tap-to-detail to products list
- `378fe4d` feat(mitra): implement product detail screen (Task 6)
- `0619f63` feat(mitra): add edit product screen at products/[id]/edit
- `052c5e0` feat(mitra): replace add product screen with ProductForm + FormData upload
- `5bd0b88` feat(mitra): add ExpiryPicker component with tests
- `d9b3622` feat(api): extend mitra product mutations with FormData support

**Depends on:** Sub-spek 0, backend `/mitra/products` CRUD, `expo-image-picker`

---

## Sub-spek 3: Mitra Orders (DONE)

**Tanggal:** 2026-07-14
**Spec:** `docs/superpowers/specs/2026-07-13-mitra-orders-design.md`
**Plan:** `docs/superpowers/plans/2026-07-13-mitra-orders-implementation.md`

**Arsitektur Update:**
- Orders menggunakan **Stack layout** murni (bukan Drawer langsung) agar tombol back emulator kembali ke daftar pesanan, bukan dashboard.
- Dev mock: `__DEV__` mode bypasses API, menggunakan data mock dari `mitra-orders.mock.ts` (6 sample orders, semua status).
- Dev login: tombol "Masuk sebagai Mitra (Dev)" di halaman login untuk testing tanpa backend.

**Yang sudah ada:**
- `updateMitraOrderStatus()` API + `useUpdateOrderStatus()` mutation hook dengan query invalidation (`mitra-orders` + `mitra-stats`)
- `MitraOrderCard` reusable component — badge status, buyer info, conditional action button, error handling
- List screen dengan custom Top Tabs: **Aktif** (PENDING/PROCESSED/READY, sorted by urgency) dan **Riwayat** (PICKED_UP/CANCELLED)
- Pull-to-refresh + Refresh on Focus + Loading/Empty states
- Detail screen (`app/(mitra)/orders/[id].tsx`) — Kode Pickup, buyer info, items list, sticky action button
- Stack layout navigation (`app/(mitra)/orders/_layout.tsx`) — tombol back ke daftar pesanan
- 138 tests (18 baru + 120 existing), 0 failures

**Commits:**
- `a160d4c` fix: replace @react-navigation/drawer import with expo-router/drawer for SDK 56 compat
- `04e67f4` fix: convert orders to Stack layout for proper back navigation
- `a3d834b` feat: create Mitra order detail screen
- `003197a` feat: implement active/history tabs in mitra orders screen
- `c42ccad` fix: address code review issues — named export, error handling, type safety, test coverage
- `9928c5e` fix: show order ID instead of pickup code in MitraOrderCard header
- `6defc2c` feat: create MitraOrderCard component
- `fc3c800` fix: add invalidation assertions to useUpdateOrderStatus test
- `3d7e9fe` fix: add mitra-stats invalidation to useUpdateOrderStatus
- `2d322ba` feat: add useUpdateOrderStatus mutation

**Files created/dimodifikasi:**
- `src/lib/api/mitra-orders.mock.ts` — mock data (6 sample orders)
- `src/components/MitraOrderCard.tsx` — reusable order card
- `app/(mitra)/orders/_layout.tsx` — Stack layout
- `app/(mitra)/orders/index.tsx` — list screen with tabs
- `app/(mitra)/orders/[id].tsx` — detail screen
- `src/hooks/useMitra.ts` — +`useUpdateOrderStatus`
- `src/lib/api/mitra.ts` — +`updateMitraOrderStatus`, dev mock bypass
- `app/(mitra)/_layout.tsx` — drawer config update (headerShown: false untuk orders)
- `app/(auth)/login.tsx` — dev login button

**Depends on:** Sub-spek 0, backend `/mitra/orders`

---

## Sub-spek 4: Product Detail + AI Recommendation (IN PROGRESS)

**Scope:**
- Trust badge row (hanya badge 'populer')
- Discount percentage di samping harga diskon
- AI Recommendation section ("Rekomendasi Untuk Kamu") — produk sejenis, gated by `useHasPurchaseHistory`
- Stock state handling (diperbesar teksnya)
- "Petunjuk Arah" — sudah ada via `Linking.openURL`
- Empty state ulasan di-refactor

**Depends on:** Sub-spek 0, backend `/products/:id`

**Files likely touched:**
- `app/(food-saver)/product/[id].tsx` — extend
- New: `src/components/ProductRecommendation.tsx`
- `src/components/ReviewList.tsx` — extend empty state

---

## Sub-spek 5: Cart + Checkout (NOT STARTED)

**Scope:**
- 2-step checkout flow (cart review → customer info form)
- Customer info form: name, phone, notes, pickup method
- Payment summary (subtotal, diskon, total)
- Cart management: add/remove/update quantity
- Empty cart state
- Checkout button → `createOrder`

**Depends on:** Sub-spek 0, backend `/cart`, `/orders`

**Files likely touched:**
- `app/(food-saver)/cart.tsx` — extend
- `app/(food-saver)/checkout.tsx` — extend
- `src/hooks/useCart.ts` — extend
- New: `src/components/CheckoutForm.tsx`

---

## Sub-spek 6: Order Confirm + Review (NOT STARTED)

**Scope:**
- Pickup screen — tampilkan pickup code, countdown timer, order details
- Confirm pickup button — verify via `confirmPickup` (alias `verifyPickup`)
- Success screen dengan efek visual (confetti / animation)
- Write review modal (rating bintang + text)
- View order history → detail screen

**Depends on:** Sub-spek 0, Sub-spek 5, backend `/orders/:id/verify-pickup`, `/reviews`

**Files likely touched:**
- `app/(food-saver)/order/confirm/[id].tsx` — extend
- New: `app/(food-saver)/order/success/[id].tsx`
- New: `src/components/ReviewModal.tsx`
- `src/lib/api/reviews.ts` — maybe extend

---

## Sub-spek 7: Wishlist + Notifications + Search + Profile (NOT STARTED)

**Scope:**
- Full wishlist page — fetch product IDs dari backend, tampilkan grid
- Stock alert subscription / unsubscribe
- Notifications list — real data via `useNotifications` hook
- Recent/trending search suggestions
- Profile edit (name, phone)
- Dynamic impact stats

**Depends on:** Sub-spek 0, backend `/wishlist`, `/notifications`, `/search`

**Files likely touched:**
- `app/(food-saver)/wishlist.tsx` — extend
- `app/(food-saver)/notifications.tsx` — extend
- `app/(food-saver)/search.tsx` — extend
- `app/(food-saver)/profile.tsx` — extend
- `src/lib/api/wishlist.ts` — swap stub to real
- `src/lib/api/notifications.ts` — swap stub to real

---

## Execution Order (Recommended)

```
Sub-spek 0 ✓ → Sub-spek 1 ✓ → Sub-spek 2 ✓ → Sub-spek 3 ✓
              → Sub-spek 5 (Cart+Checkout) → Sub-spek 6 (Confirm+Review)
              → Sub-spek 7 (Wishlist+Notif+Search+Profile)
              → Sub-spek 4 (Product Detail+AI Rec) — bisa paralel dengan yang lain
```

**Alasan:** Sub-spek 1-3 membangun fitur Mitra backend terlebih dahulu (create product, manage orders), lalu Sub-spek 5-6 membangun flow Food Saver (cart → checkout → pickup). Sub-spek 7 bisa dikerjakan paralel dengan 4.

---

## Notes

- Semua sub-spek mengacu ke **ADR-0001** (7 porting principles)
- Semua sub-spek **TIDAK** render `react-native-maps` inline — tetap redirect ke Google Maps
- Setiap sub-spek dimulai dengan spec design → TDD implementation plan → execute
- Sub-spek 0 menyediakan foundation hooks + API stubs yang akan di-import oleh semua sub-spek lainnya
