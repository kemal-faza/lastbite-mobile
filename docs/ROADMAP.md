# ROADMAP — Sub-spek Porting Next.js ke Mobile

**Induk:** Porting fitur dari `lastbite-nextjs` (Next.js + shadcn) ke `lasbite-mobile` (Expo/React Native)

---

## Progress

| Status | Count |
|--------|-------|
| Done | 2 (Sub-spek 0, Sub-spek 1) |
| Not started | 6 (Sub-spek 2–7) |

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

## Sub-spek 2: Mitra Product Management (NOT STARTED)

**Scope:**
- Add product form lengkap (name, price, stock, category, expiry, image)
- Edit product (pre-populate form, update via `updateMitraProduct`)
- Image upload via `expo-image-picker` (take photo / gallery)
- Category dropdown / picker
- Expiry date picker
- Delete product dengan konfirmasi

**Depends on:** Sub-spek 0, backend `/mitra/products` CRUD, `expo-image-picker` (already installed)

**Files likely touched:**
- `app/(mitra)/products.tsx` — extend
- New: `app/(mitra)/product/new.tsx`
- New: `app/(mitra)/product/[id]/edit.tsx`
- New: `src/components/ProductForm.tsx`
- New: `src/components/ExpiryPicker.tsx`

---

## Sub-spek 3: Mitra Orders (NOT STARTED)

**Scope:**
- Order list dengan sections (PENDING, PROCESSED, READY, PICKED_UP, CANCELLED)
- Detail order: buyer info, items, pickup code
- Status transition buttons (Process, Ready, Cancel)
- `confirmPickup` flow untuk Food Saver
- Pull-to-refresh

**Depends on:** Sub-spek 0, backend `/mitra/orders`

**Files likely touched:**
- New: `app/(mitra)/orders/[id].tsx`
- `src/lib/api/mitra.ts` — already has `getMitraOrders`, `MitraOrder` type
- New: `src/components/OrderStatusBadge.tsx`

---

## Sub-spek 4: Product Detail + AI Recommendation (NOT STARTED)

**Scope:**
- Trust badge row (halal, freshness guarantee, food safety)
- Discount percentage overlay di hero image
- Queue indicator (stock rendah / tinggi)
- AI Recommendation section ("Rekomendasi untukmu") — gated by `useHasPurchaseHistory`
- Stock state handling (habis, tersisa X, normal)
- "Petunjuk Arah" — sudah ada via `Linking.openURL`

**Depends on:** Sub-spek 0, backend `/products/:id`, AI recommendation endpoint

**Files likely touched:**
- `app/(food-saver)/product/[id].tsx` — extend
- New: `src/components/TrustBadgeRow.tsx`
- New: `src/components/AIRecommendation.tsx`
- New: `src/components/StockIndicator.tsx`

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
Sub-spek 0 ✓ → Sub-spek 1 (Mitra Dashboard) → Sub-spek 2 (Product Mgmt)
              → Sub-spek 3 (Mitra Orders)     → Sub-spek 5 (Cart+Checkout) → Sub-spek 6 (Confirm+Review)
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
