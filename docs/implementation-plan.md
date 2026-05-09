# Mobile Report — Phased Implementation Plan

## Context

**Mobile Report** is a learning app that systematically exposes Expo SDK device capabilities. Each library from `docs/notes/expo-sdk-library.md` (Sensors, Device Info, Hardware, Location & Motion, Audio, System UI, Privacy, Network) gets its own screen showing live data, hardware triggers, or an honest fallback when unsupported.

The current scaffold is two placeholder tabs (Home + Explore) with `NativeTabs` + iOS glass effect, no detail screens, and unused pastel/animation infrastructure. This plan replaces the tab shell with a single Stack rooted at a tile-grid home, establishes a reusable feature-screen template, and lays out a 3-phase rollout so each iteration just adds tiles + screens to a stable foundation.

**Decisions locked in:**
- Home is one scroll page grouped by **category sections**, with **2-column square pastel tiles** under each header.
- Navigation is a single **Stack** (drop tabs entirely). Back button comes from the Stack header.
- **Per-category pastel** palette — each category has a hue (light + dark variants).
- **3 phases:** foundation + 1 example feature → expand to all SDKs → polish.

---

## Phase 1 — Foundation + Device Info screen (the template)

### 1.1 Routing — replace tabs with a Stack root

**Modify `src/app/_layout.tsx`** — keep `ThemeProvider` wiring; replace `<AppTabs />` with `<Stack>` from `expo-router`.

`screenOptions` defaults:
- `headerStyle: { backgroundColor: theme.background }`, `headerTintColor: theme.text`
- `headerTitleStyle: { fontFamily: Fonts.rounded, fontWeight: '600' }`
- `headerBackButtonDisplayMode: 'minimal'` (iOS — no long parent title)
- `contentStyle: { backgroundColor: theme.background }`
- `animation: 'slide_from_right'`, `animationDuration: 220`

Per-screen:
- `index` → `{ title: 'Mobile Report', headerLargeTitle: true }`
- Detail screens set their own `<Stack.Screen options={{ title }} />` from the registry.

**Delete:** `src/components/app-tabs.tsx`, `src/components/app-tabs.ios.tsx`, `src/app/explore.tsx`. Preserve `themed-text.tsx`, `themed-view.tsx`, `use-theme.ts`, `use-color-scheme.*`.

### 1.2 Theme extension — pastel category palette

**Modify `src/constants/theme.ts`** — add a sibling export, do NOT touch existing `Colors`.

```ts
export type CategoryId = 'sensors'|'device-info'|'hardware'|'location-motion'|'audio-media'|'system-display'|'privacy'|'network';
export const CategoryPalette: Record<CategoryId, { light: { bg: string; fg: string; accent: string }, dark: {...} }>
export const CategoryMeta: Record<CategoryId, { label: string }>
```

| Category | Light bg / fg / accent | Dark bg / fg / accent |
|---|---|---|
| sensors | `#FFE8D6` / `#3D2914` / `#C97B3F` | `#3A2A1E` / `#FFE8D6` / `#E8A86F` |
| device-info | `#E0F2FE` / `#0C2A3E` / `#3F88C5` | `#1B2C3A` / `#E0F2FE` / `#7AB8E8` |
| hardware | `#FCE7F3` / `#3F1F36` / `#C75B96` | `#3A1F2E` / `#FCE7F3` / `#E892C0` |
| location-motion | `#DCFCE7` / `#14361F` / `#4FA467` | `#1C3024` / `#DCFCE7` / `#86D49E` |
| audio-media | `#EDE9FE` / `#2A1F47` / `#7C5FC9` | `#28223D` / `#EDE9FE` / `#A78BE8` |
| system-display | `#F1F5F9` / `#1E293B` / `#64748B` | `#252A33` / `#F1F5F9` / `#94A3B8` |
| privacy | `#FEF3C7` / `#3B2A0A` / `#B88534` | `#332A14` / `#FEF3C7` / `#E0BC6F` |
| network | `#CFFAFE` / `#0F3033` / `#3FA0A8` | `#1A2D30` / `#CFFAFE` / `#7FCFD4` |

Hexes calibrated for WCAG AA `fg`-on-`bg` contrast ≥4.5:1; verify in Phase 3.

### 1.3 Feature registry — `src/constants/features.ts` (NEW)

Static literal array (typedRoutes-friendly):

```ts
type Feature = {
  id: FeatureId;                       // 'device' | 'battery' | 'accelerometer' | ...
  title: string;                       // "Device"
  description: string;                 // 6–10 words for tile body
  category: CategoryId;
  route: `/feature/${FeatureId}`;
  status: 'ready' | 'planned';         // 'planned' = tile renders disabled, no screen yet
  requiresInstall?: boolean;           // package not in package.json yet
  platforms?: Array<'ios'|'android'|'web'>;
};
```

Phase 1 populates ~25 entries from the SDK doc. Only `device` is `status: 'ready'`. Helper: `getFeaturesByCategory()` → `[CategoryId, Feature[]][]` in display order.

### 1.4 Shared components (all use `ThemedView`/`ThemedText` internally)

- **`src/components/feature-tile.tsx`** — `<FeatureTile feature={Feature} />`. Square (`aspectRatio: 1`, width = `(screenWidth - 3*Spacing.three) / 2`). Pastel from `CategoryPalette[feature.category][scheme]`. Title (`default` weight, `palette.fg`), description (`small`, `fg` @ 70% opacity). "Coming soon" pill if `status: 'planned'`. `Pressable` `disabled` when planned. `borderRadius: Spacing.three`. Press → `router.push(feature.route)`.
- **`src/components/category-section.tsx`** — `<CategorySection category={CategoryId} features={Feature[]} />`. Header (`subtitle` + 4px-wide `palette.accent` bar to its left) + flex-wrap row of tiles, `gap: Spacing.three`.
- **`src/components/screen-container.tsx`** — `<ScreenContainer scroll? refreshing? onRefresh?>`. `SafeAreaView` + optional `ScrollView`, `padding: Spacing.three, gap: Spacing.three, maxWidth: MaxContentWidth, alignSelf: 'center'`.
- **`src/components/data-row.tsx`** — `<DataRow label value mono?>`. Two-column row: `label` (`small`, `textSecondary`), `value` (`default` or `code`). Hairline border (`backgroundSelected`). Renders `—` for null/undefined.
- **`src/components/unsupported-state.tsx`** — `<UnsupportedState reason />`. Centered icon + `subtitle` + `small` reason text.

### 1.5 Home — rewrite `src/app/index.tsx`

`ScrollView` mapping `getFeaturesByCategory()` → `<CategorySection>`. Drop existing hero. Clamp to `MaxContentWidth`.

### 1.6 Detail-screen template — `src/app/feature/device.tsx` (NEW)

**Decision: explicit per-feature files under `src/app/feature/`** (not `[name].tsx`). Reasons:
1. `typedRoutes` produces statically-known string-literal routes for `router.push`.
2. Each library has a different shape (event subscription vs one-shot fetch vs trigger button).
3. Native imports stay file-local — no runtime gating.

`device.tsx` outline:
1. `<Stack.Screen options={{ title: 'Device' }} />`
2. `useEffect` fetches `Device.*` async props (`getDeviceTypeAsync`, `getMaxMemoryAsync`, `getUptimeAsync`, `isRootedExperimentalAsync`) alongside sync (`brand`, `modelName`, `osName`, `osVersion`, `deviceYearClass`, `isDevice`, `totalMemory`).
3. `<ScreenContainer scroll>` containing grouped `<DataRow>`s.
4. On web: short-circuit to `<UnsupportedState reason="..." />` based on null fields.

To add a new feature in Phase 2: copy this file, rename, swap import + data block + DataRows.

### 1.7 Tile / detail unsupported visuals

- `status: 'planned'` → tile @ 60% opacity, "Coming soon" pill, `Pressable` disabled.
- Detail screen on unsupported `Platform.OS` (per `feature.platforms`) → `<UnsupportedState />`.

---

## Phase 2 — Expand to all SDK screens

### 2.1 Install order (one PR per batch)

1. **Data-only, no permissions:** `expo-application expo-cellular expo-network expo-localization` (battery already installed).
2. **Sensors (already installed except light/pedometer plugin needs):** Accelerometer, Gyroscope, Magnetometer, Barometer, DeviceMotion. LightSensor + Pedometer last.
3. **Triggers/state:** `expo-haptics expo-keep-awake expo-screen-orientation expo-screen-capture expo-brightness`.
4. **Display:** `expo-navigation-bar` (`expo-system-ui`, `expo-status-bar` already installed).
5. **Network detail:** `@react-native-community/netinfo`.
6. **Permission-gated batch:** `expo-camera expo-location expo-audio expo-local-authentication expo-tracking-transparency`. Each requires `app.json` plugin entries + platform strings:
   - **camera** → `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`
   - **location** → `NSLocationWhenInUseUsageDescription`; Android `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
   - **audio** → `NSMicrophoneUsageDescription`; Android `RECORD_AUDIO`
   - **local-authentication** → `NSFaceIDUsageDescription`
   - **motion (DeviceMotion + iOS Pedometer)** → `NSMotionUsageDescription`; Android Pedometer → `ACTIVITY_RECOGNITION`
   - **tracking-transparency** → `NSUserTrackingUsageDescription`

After each batch, flip relevant entries in `features.ts` from `planned` → `ready` and add the screen file.

### 2.2 Three patterns beyond Device — extract once 2–3 screens exist

- **`src/hooks/use-sensor-stream.ts`** — `useSensorStream(sensor, intervalMs) → { data, available, supported }`. Wraps `isAvailableAsync` + `setUpdateInterval` + `addListener` + cleanup. Used by Accelerometer/Gyroscope/Magnetometer/Barometer/LightSensor/DeviceMotion.
- **`src/hooks/use-permission.ts`** — Uniform wrapper around Expo `usePermissions()`-style hooks. Returns `{ status, request, granted }` so screens render a "Grant access" CTA, then swap to live data.
- **`src/hooks/use-async-data.ts`** — `useAsyncData(fn, deps) → { data, loading, error, refresh }` for one-shot reads (Cellular, Localization, Application, NetInfo snapshot).

**Hardware-trigger pattern** (Haptics, KeepAwake, Brightness, ScreenOrientation lock, LocalAuthentication): screens render `<DataRow>`s for current state + a vertical stack of `<ActionButton>`s. New `src/components/action-button.tsx` (`Pressable` w/ pastel accent bg, label + optional subtitle).

**Permission-gated pattern**: empty + "Grant access" `<ActionButton>` → swap to live data when granted.

### 2.3 Platform gaps (encode in `feature.platforms`)

- LightSensor → `['android']`
- NavigationBar → `['android']`
- TrackingTransparency → `['ios']`
- Pedometer / Brightness setBrightness → no web
- Cellular → no real data on simulators/web

Detail screens short-circuit to `<UnsupportedState>` when `Platform.OS ∉ feature.platforms`.

### 2.4 Screen build order (data → trigger → permission)

`battery → application → constants → localization → cellular → network → netinfo → status-bar → system-ui → navigation-bar → keep-awake → screen-capture → screen-orientation → brightness → haptics → accelerometer → gyroscope → magnetometer → barometer → device-motion → light-sensor → pedometer → location → camera → audio → local-authentication → tracking-transparency`.

---

## Phase 3 — Polish

- **Tile press feedback** — Reanimated `useSharedValue(1)` scale; `onPressIn` → `withTiming(0.96, 90ms)`, `onPressOut` → `withSpring(1, { damping: 14, stiffness: 220 })`. Pure transform, no layout thrash.
- **Haptics** — once `expo-haptics` lands, add `Haptics.selectionAsync()` to `FeatureTile.onPress`, `Haptics.impactAsync(Light)` to `ActionButton.onPress`. Skip on web.
- **Standardized states** — promote into `src/components/states/`: `loading-state.tsx`, `error-state.tsx`, `empty-state.tsx`, plus `unsupported-state.tsx` from Phase 1. Detail screens route through these.
- **Header back-button polish** — confirm `headerBackButtonDisplayMode: 'minimal'` (iOS), `headerBackTitleStyle`, default Android chevron is fine.
- **Accessibility** — `FeatureTile` `accessibilityRole="button"`, `accessibilityLabel="${title}. ${description}"`, `accessibilityState={{ disabled }}`, `hitSlop: 4`. `ActionButton` and `DataRow` similarly. Verify Dynamic Type / large text doesn't break tile aspect (use `aspectRatio` + flexible height).
- **Dark-mode pastel verification** — walk every `CategoryPalette[*].dark` against `Colors.dark.background`; spot-fix any pair below WCAG AA 4.5:1.

---

## Critical files

**Phase 1 modifies/creates:**
- `src/app/_layout.tsx` (rewrite — Stack root)
- `src/app/index.tsx` (rewrite — tile grid)
- `src/app/feature/device.tsx` (new — template screen)
- `src/constants/theme.ts` (extend — `CategoryPalette`, `CategoryMeta`, `CategoryId`)
- `src/constants/features.ts` (new — registry)
- `src/components/feature-tile.tsx` (new)
- `src/components/category-section.tsx` (new)
- `src/components/screen-container.tsx` (new)
- `src/components/data-row.tsx` (new)
- `src/components/unsupported-state.tsx` (new)
- **Delete:** `src/components/app-tabs.tsx`, `src/components/app-tabs.ios.tsx`, `src/app/explore.tsx`

**Reuse as-is** (do not replace): `src/components/themed-text.tsx`, `src/components/themed-view.tsx`, `src/hooks/use-theme.ts`, `src/hooks/use-color-scheme.*`, `src/constants/theme.ts` `Colors`/`Fonts`/`Spacing`/`BottomTabInset`/`MaxContentWidth`.

**Phase 2 adds:** `src/app/feature/<id>.tsx` per library, `src/hooks/use-sensor-stream.ts`, `src/hooks/use-permission.ts`, `src/hooks/use-async-data.ts`, `src/components/action-button.tsx`, `app.json` plugin entries.

**Phase 3 adds:** `src/components/states/{loading,error,empty,unsupported}-state.tsx`, Reanimated wrapper inside `feature-tile.tsx`.

---

## Verification

After **Phase 1**:
- `npm run lint` passes.
- `npm start` then iOS sim + Android emulator + web: home renders 2-column tile grid grouped by 8 category headers, each tile pastel-tinted per category, in light AND dark mode (toggle OS appearance).
- Tap the **Device** tile → detail screen opens with native back button visible in header. Back returns to home with grid scroll position intact.
- All other ~24 tiles render disabled with "Coming soon" pill and don't navigate on press.
- Web: Device screen renders an `UnsupportedState` (or partial data) without crashing.
- TypeScript: `router.push('/feature/device')` is type-checked via typedRoutes; an invalid route literal fails compile.

After **Phase 2** (run after each batch):
- New tile flips from disabled → active.
- Detail screen renders live data on iOS + Android. Permission-gated screens render "Grant access" → data after grant. Sensor screens stop emitting on unmount (verify by leaving + returning, no console warnings, no leak).
- Platform-restricted features (LightSensor on iOS, NavigationBar on iOS, TrackingTransparency on Android) render `UnsupportedState`.

After **Phase 3**:
- Tile press visibly scales (0.96) and springs back; haptic fires on iOS device.
- Dark-mode contrast spot-checked against WCAG AA across all 8 categories.
- VoiceOver / TalkBack reads each tile as `"<title>. <description>. button"` and skips disabled tiles' nav target.
