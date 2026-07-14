# LastBite Mobile — AGENTS.md

Expo SDK 57 / React Native 0.86 / React 19 / Expo Router (file-based routing).

## Navigation Architecture

- `app/(food-saver)/_layout.tsx` — **`<Stack>`** parent (passthrough, only renders `(tabs)`). TopBar (logo + notif bell) lives here — persistent across all food-saver screens.
- `app/(food-saver)/(tabs)/_layout.tsx` — **`<Tabs>`** with 5 tab screens + 6 hidden screens (`href: null`): product/[id], checkout, order/[id], order/confirm/[id], wishlist, notifications. Tab bar is persistent.
- Mitra uses drawer navigation (`app/(mitra)/_layout.tsx` -> Drawer) — no restructure needed.
- **Override ADR-0001 principle #4:** Hidden screens use `Tabs.Screen` with `href: null` (not Stack.Screen children). Reason: tab bar persistence for e-commerce UX (see ADR-0003).

## State Management

- **Zustand** (`src/stores/authStore.ts`) — auth state only. `setUser`, `logout`.
- **TanStack Query** (`@tanstack/react-query`) — all server state. Query key convention: `['cart']`, `['orders']`, `['order', id]`, `['products']`, `['mitra-products']`, `['mitra-orders']`, `['mitra-stats']`.
- Mutations must invalidate queries on success: `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })`.

## API Layer Pattern — CRITICAL

**Normalize data shape in API client files.** Backend returns nested shapes; mobile expects flat.

- Cart: `src/lib/api/cart.ts` — `mapCartItem(raw)` flattens `item.product.*` → `CartItem`
- Orders: `src/lib/api/orders.ts` — `mapOrder(raw)` maps `totalAmount` → `total`, passes through buyer info
- Every new API function should follow this pattern: fetch with `Raw*` type, map via helper, return typed shape

**Failure to normalize** = `item.price is undefined` / `item.total is undefined` runtime crashes.

**401 auto-handling:** `src/lib/api/client.ts` `apiFetch` — when backend returns 401 TOKEN_EXPIRED/UNAUTHORIZED, auto-clear tokens + Zustand logout. Components subscribed to `isAuthenticated` re-render and show login gate.

## Dev Login

`app/(auth)/login.tsx` — 2 dev buttons in `{__DEV__ && }` block that call real `login()` API:
- **Food Saver:** `foodsaver@lastbite.id` / `foodsaver123`
- **Mitra:** `dapurbuani@lastbite.id` / `password123`

These call `login(email, password)` from `src/lib/api/auth.ts` (real API, real JWT tokens stored in AsyncStorage). Do NOT bypass with `setUser()` only.

## Toast System

- `src/contexts/ToastContext.tsx` — `ToastProvider` wraps root layout; `useToast()` hook returns `showToast(message)`.
- Visual: `src/components/Toast.tsx` — Sonner-style, positioned `top-14`, auto-dismiss 2500ms, check-circle icon.
- Used in product detail after `addToCart`, in checkout after `createOrder`.

## Cart Architecture

- `src/hooks/useCart.ts` — returns `{ cart, addItem, updateItem, removeItem }`. All mutations invalidate `['cart']`.
- Cart screen groups items by `item.storeName` (per-store sections), each with own Checkout button → `/checkout?storeName=X`.
- Delete via Swipeable (swipe left) + Alert confirmation, not visible buttons.
- Cart badge in `(tabs)/_layout.tsx` reads `useCart(isAuthenticated)`, shows item count.

**Always use the hook's mutations** for cache invalidation. Direct API calls (e.g. `addToCart(product.id)` in product detail) must also call `queryClient.invalidateQueries({ queryKey: ['cart'] })`.

## Image Assets

Placeholder image: `src/assets/placeholder.png` — referenced via `@/assets/placeholder.png`.
NEVER use relative path `../../assets/` — they break when files move.

## Styling

- **NativeWind v4** (`className` on all components, tailwind-style classes).
- `@/theme/tokens` exports color tokens. `@/theme` also available.
- **Icons:** `@expo/vector-icons` / `MaterialCommunityIcons`.

## Testing

**Use Jest** (`npm test` / `jest`), NOT Bun. Bun segfaults on JSX test files (pre-existing).

Key test patterns:
- Mock at `apiFetch` boundary, not network: `jest.mock('src/lib/api/client')`
- Wrap component in `QueryClientProvider` if it uses TanStack Query hooks
- Wrap in `ToastProvider` if it uses `useToast`
- Mock `@expo/vector-icons`, `expo-image`, `expo-router` at test file level
- API normalization tests in `tests/unit/` (e.g. `cartNormalization.test.ts`, `orderNormalization.test.ts`)
- Component tests in `tests/components/`
- Screen tests in `tests/screens/`

`jest.config.js` moduleNameMapper order matters:
1. Image assets via `@/` must match FIRST: `'^@/(.*)\\.(png|jpg|jpeg|gif|svg|webp)$'`
2. Then TypeScript modules: `'^@/(.*)$'`
(If reversed, PNG files fail to parse)

## Backend

- `lastbite-backend` at sibling directory, Express + Prisma, requires separate `npm run dev`.
- Seed accounts include 8 products across 5 Mitra stores + Food Saver test account.
- Run `npm run db:seed` to reset test data.
