# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

**Mobile Report** is a device feature explorer built to learn Expo SDK capabilities. The app reports on the live status and data of device hardware and connectivity features — Wi-Fi, cellular, sensors (accelerometer, gyroscope, barometer, etc.), battery, and more. Each feature gets its own screen showing real-time readings and metadata. The goal is to systematically surface everything Expo exposes from the underlying device, making it a hands-on reference for what the SDK can and cannot do.

A canonical list of target libraries with categories is in `docs/notes/expo-sdk-library.md`. The phased rollout plan is in `docs/implementation-plan.md`. The visual / structural rules screens must follow are in `docs/design-system.md`.

New features follow this pattern: one screen per device capability, live data display, clear labels, and an honest `UnsupportedState` fallback when the platform doesn't support the feature. Prefer Expo SDK packages first; reach for community packages only when the SDK lacks adequate support.

## Commands

```bash
npm start              # Start Metro for an existing dev client (all platforms)
npm run android        # Build + install the Android dev client (npx expo run:android)
npm run ios            # Build + install the iOS dev client (npx expo run:ios — macOS only)
npm run androidexpo    # Start Metro and target Android in Expo Go
npm run iosexpo        # Start Metro and target iOS in Expo Go
npm run web            # Start with web target
npm run lint           # Run expo lint
npm test               # Run jest
npm run reset-project  # Move starter code to app-example/, reset to blank app/
```

**Dev client vs Expo Go.** Phases 1–3 ran in Expo Go. Phase 4b adds third-party native modules (`react-native-device-info`, `react-native-permissions`, `react-native-bluetooth-state-manager`, `react-native-volume-manager`, `react-native-shake`, `react-native-mmkv`) that are **not** bundled in Expo Go, so the project now requires a custom dev client to run those screens. Build it once with `npm run android` (Windows-friendly) or `npm run ios` (macOS only — Windows users should use `eas build --profile development --platform ios` instead). The `expo-dev-client` package is already installed; `npm start` connects to whichever dev client is on the simulator/device. The `*expo` scripts still launch Expo Go for screens that don't depend on third-party natives.

## Architecture

**Expo Router with file-based routing.** `src/app/` maps directly to routes. The root `_layout.tsx` mounts a single `Stack` (no tab bar) wrapped in `ThemeProvider`. The home screen (`index.tsx`) is a tile grid; detail screens live under `src/app/feature/<id>.tsx` and use the Stack header for back navigation.

**Path aliases** — `@/*` resolves to `src/*` and `@/assets/*` resolves to `assets/*` (configured in `tsconfig.json`).

**Platform-specific files** — `.web.tsx` shadows `.tsx` on web. The pair currently in use:
- `src/hooks/use-color-scheme.ts` (native) vs `use-color-scheme.web.ts`

### Theming (`src/constants/theme.ts`)

- `Colors` — light/dark token map (`text`, `background`, `backgroundElement`, `backgroundSelected`, `textSecondary`).
- `CategoryPalette` — pastel hue per feature category (`bg` / `fg` / `accent`, light + dark variants). Read with `getCategoryPalette(category)` to pick the active scheme.
- `CategoryMeta` — display label per category id, in registry display order.
- `Fonts` — platform-selected font family map (`sans`, `serif`, `rounded`, `mono`).
- `Spacing` — named scale (`half`=2, `one`=4, `two`=8, `three`=16, `four`=24, `five`=32, `six`=64).
- `MaxContentWidth = 800` — clamp for tablets/web.
- `global.css` is imported here to ensure web font CSS variables load.

### Hooks

`useTheme()` (`src/hooks/use-theme.ts`) returns the active `Colors` palette. **Always** use this in components — never read `useColorScheme` directly.

### Themed primitives

`ThemedText` and `ThemedView` (`src/components/`) call `useTheme()` internally. Pass a `type` prop on `ThemedText` for typography variants (`default`, `title`, `subtitle`, `small`, `smallBold`, `link`, `linkPrimary`, `code`) or `themeColor` to override the color token. Don't inline `fontSize` / `fontWeight` — pick a variant.

### Shared UI primitives

All composed of `ThemedText` + `ThemedView`. Reuse rather than rebuilding.
- `FeatureTile` — square pastel card on the home grid; navigates on press.
- `CategorySection` — section header + 2-column tile grid.
- `ScreenContainer` — safe-area + scroll wrapper for every detail screen.
- `DataRow` — label/value row used to display device data.
- `UnsupportedState` — fallback for wrong-platform or unavailable features.
- `ActionButton` — pastel-accent Pressable used by hardware-trigger screens (haptics, keep-awake, brightness, orientation, screen-capture, status-bar, system-ui, navigation-bar).

See `docs/design-system.md` for the full primitive contract.

### Reusable hooks

- `useTheme()` (`src/hooks/use-theme.ts`) — active `Colors` palette.
- `useCategoryPalette(category)` — active pastel triple `{bg, fg, accent}` for a given category.
- `useAsyncData(fetcher, deps)` — one-shot fetch with `refresh` and unmount safety. Used by data-only screens.
- `useSensorStream(sensor, intervalMs)` — subscribes to any expo-sensors-style stream, gates on `isAvailableAsync`, tears down on unmount. Used by every sensor screen.

### Formatting helpers

`src/lib/format.ts` — `formatBytes`, `formatDuration`, `formatPercent`, `formatDate`, `formatNumber`. Use these so values render consistently across screens; unit-tested.

### Feature registry (`src/constants/features.ts`)

A typed array listing every SDK library to be exposed. Each entry has `id`, `title`, `description`, `category`, `route`, `status` (`'ready'` | `'planned'`), optional `requiresInstall` and `platforms`. The home screen is generated from this registry; tiles whose `status` is `'planned'` render disabled with a "Coming soon" pill.

To add a new feature: append a registry entry, flip `status` to `'ready'`, and create `src/app/feature/<id>.tsx`. Use `device.tsx` as the canonical template.

### Detail-screen template — `src/app/feature/device.tsx`

Each feature screen sets `<Stack.Screen options={{ title }} />`, wraps content in `<ScreenContainer scroll>`, fetches data into `useState`, renders `DataRow`s, and falls back to `<UnsupportedState />` when the platform check fails. Three flavors exist (read-only, hardware trigger, live stream) — see `docs/design-system.md` §3.2.

### Animations

`react-native-reanimated` and `react-native-worklets` are installed but mostly unused in Phase 1. Phase 3 adds tile press scale + haptic feedback per the implementation plan.

### Testing

`jest-expo` preset with `@testing-library/react-native`. Run with `npm test`.

**Tests must live in `src/__tests__/` — never inside `src/app/`.** Expo Router's `require.context` walks every file under `src/app/` as a route, so a test there pulls `@testing-library/react-native` into the device bundle and crashes Metro. `metro.config.js` blockList is a safety net but the convention is the contract.

Coverage focuses on the registry helpers, hooks, and component rendering — not snapshot-heavy.

### Enabled experiments (`app.json`)

- `typedRoutes` — typed `href` for Expo Router. Routes must be statically analyzable; prefer explicit per-feature files (`feature/device.tsx`) over dynamic `[name].tsx`.
- `reactCompiler` — React Compiler. Don't add manual `useMemo`/`useCallback` unless profiling demands it.
