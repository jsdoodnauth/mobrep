# Mobile Report — Design System

This document captures the visual and structural rules for the app. It is a living reference; update it whenever a primitive, token, or pattern changes.

The audience is anyone (human or agent) building or modifying a feature screen.

---

## 1. Tokens

All design tokens live in `src/constants/theme.ts`. Components must read tokens through `useTheme()` (for colors) or import constants directly (for `Spacing`, `Fonts`, `MaxContentWidth`).

### 1.1 Colors

Two palettes — `light` and `dark` — keyed by `ThemeColor`:

| Token | Light | Dark | Use |
|---|---|---|---|
| `text` | `#000000` | `#ffffff` | Default body text |
| `background` | `#ffffff` | `#000000` | Screen background |
| `backgroundElement` | `#F0F0F3` | `#212225` | Cards, neutral surfaces |
| `backgroundSelected` | `#E0E1E6` | `#2E3135` | Hairline borders, pressed states |
| `textSecondary` | `#60646C` | `#B0B4BA` | Secondary labels, captions |

Read with `useTheme()`. Override on a primitive with `themeColor="textSecondary"`.

### 1.2 Category pastel palette

Each feature category has a dedicated pastel hue with `bg` / `fg` / `accent` triplets in light and dark mode. Used by `FeatureTile`, `CategorySection` headers, and accent buttons (`ActionButton` in Phase 2).

| Category | Light bg / fg / accent | Dark bg / fg / accent |
|---|---|---|
| `sensors` | `#FFE8D6` / `#3D2914` / `#C97B3F` | `#3A2A1E` / `#FFE8D6` / `#E8A86F` |
| `device-info` | `#E0F2FE` / `#0C2A3E` / `#3F88C5` | `#1B2C3A` / `#E0F2FE` / `#7AB8E8` |
| `hardware` | `#FCE7F3` / `#3F1F36` / `#C75B96` | `#3A1F2E` / `#FCE7F3` / `#E892C0` |
| `location-motion` | `#DCFCE7` / `#14361F` / `#4FA467` | `#1C3024` / `#DCFCE7` / `#86D49E` |
| `audio-media` | `#EDE9FE` / `#2A1F47` / `#7C5FC9` | `#28223D` / `#EDE9FE` / `#A78BE8` |
| `system-display` | `#F1F5F9` / `#1E293B` / `#64748B` | `#252A33` / `#F1F5F9` / `#94A3B8` |
| `privacy` | `#FEF3C7` / `#3B2A0A` / `#B88534` | `#332A14` / `#FEF3C7` / `#E0BC6F` |
| `network` | `#CFFAFE` / `#0F3033` / `#3FA0A8` | `#1A2D30` / `#CFFAFE` / `#7FCFD4` |

`bg` is a pastel surface, `fg` is the readable text color on that surface (≥4.5:1 contrast targeted), `accent` is the saturated companion used for icons, headers, and action buttons. Use `getCategoryPalette(category)` to pull the active variant for the current color scheme.

### 1.3 Typography

`ThemedText` exposes one prop, `type`, that maps to a typography variant. Do not set `fontSize` / `fontWeight` directly — pick a variant.

| Variant | Size / line / weight | Use |
|---|---|---|
| `default` | 16 / 24 / 500 | Body and tile titles |
| `title` | 48 / 52 / 600 | Screen-level hero titles only |
| `subtitle` | 32 / 44 / 600 | Section headers (`CategorySection`) |
| `small` | 14 / 20 / 500 | Captions, descriptions, secondary labels |
| `smallBold` | 14 / 20 / 700 | Emphasized small text |
| `link` | 14 / 30 / — | Tertiary text-only links |
| `linkPrimary` | 14 / 30 / — | Tertiary links in brand blue (hardcoded `#3c87f7`) |
| `code` | 12 / mono / 500–700 | Inline / value-row monospace |

Use `themeColor="textSecondary"` for dimmed text rather than reaching for a hex.

### 1.4 Fonts

`Fonts` is platform-selected. iOS uses SF system designs (`ui-rounded`, `ui-monospace`, …); Android uses generic family names; web reads CSS variables from `global.css`. Reach for `Fonts.rounded` for headers, `Fonts.mono` for code/values. Body text inherits the platform default.

### 1.5 Spacing

A 4-pixel base scale. Use these names; do not hard-code pixels.

`half=2, one=4, two=8, three=16, four=24, five=32, six=64`

Default vertical rhythm inside a screen is `gap: Spacing.three` (16px). Tile grids use `gap: Spacing.three` between rows and columns. Detail-row spacing inside `DataRow` is `Spacing.two` vertical padding.

### 1.6 Layout constants

- `MaxContentWidth = 800` — clamp wide screens (web, tablets) so reading length stays sane.
- `BottomTabInset` — legacy tab inset (50 iOS / 80 Android). Phase 1 drops the tab bar; this constant remains in the file but is no longer used by app screens.

---

## 2. Primitives

Reusable building blocks under `src/components/`. Compose feature screens out of these — do not roll new layout one-off.

### 2.1 `ThemedText` / `ThemedView`

Theme-aware `Text` and `View`. Always prefer these over the React Native primitives so dark mode just works.

### 2.2 `FeatureTile`

`<FeatureTile feature={Feature} />`

A square pastel card representing a single feature. Pulls its color palette from `feature.category`. Renders a title and short description; shows a "Coming soon" pill if `status === 'planned'` and renders disabled. Press navigates to `feature.route`.

Geometry: `aspectRatio: 1`, width = `(screenWidth - padding*2 - gap) / 2`, `borderRadius: Spacing.three`. Padding inside is `Spacing.three`.

### 2.3 `CategorySection`

`<CategorySection category={CategoryId} features={Feature[]} />`

A section header (subtitle text + 4px accent bar in the category color) followed by a 2-column flex-wrap grid of `FeatureTile`s.

### 2.4 `ScreenContainer`

`<ScreenContainer scroll? refreshing? onRefresh?>{children}</ScreenContainer>`

The standard wrapper for every detail screen. Applies `SafeAreaView`, optional `ScrollView`, `padding: Spacing.three`, `gap: Spacing.three`, and a `MaxContentWidth` clamp. Use this rather than re-creating safe areas per screen.

### 2.5 `DataRow`

`<DataRow label="OS Version" value={osVersion} mono?>`

A two-column row: left-aligned `small` label in `textSecondary`, right-aligned value in `default` (or `code` when `mono`). Bottom hairline border in `backgroundSelected`. Renders `—` for `null` / `undefined`. Booleans render as `Yes` / `No`. Numbers pass through.

Group `DataRow`s with a `subtitle` heading above to create sections within a detail screen.

### 2.6 `UnsupportedState`

`<UnsupportedState reason="LightSensor is Android-only" />`

Centered fallback for detail screens on platforms where the underlying SDK is not available. One subtitle, one supporting `small` line. Detail screens must short-circuit to this when `Platform.OS ∉ feature.platforms`, rather than rendering empty data.

---

## 3. Screen patterns

### 3.1 Home (tile grid)

Single `ScrollView`. Maps `getFeaturesByCategory()` to one `CategorySection` per category in registry order. No header bar text — the Stack header carries the title.

### 3.2 Detail screen

Three flavors. Pick one per feature.

**Read-only data** (Device, Battery, Cellular, Localization, Network, Application, Constants) — fetch state into `useState`, render in grouped `DataRow`s.

**Hardware trigger** (Haptics, KeepAwake, ScreenOrientation, Brightness, LocalAuthentication) — render current-state `DataRow`s plus a stack of `ActionButton`s (Phase 2) that mutate state or fire a one-off effect.

**Live stream** (Accelerometer, Gyroscope, Magnetometer, Barometer, DeviceMotion, LightSensor, Pedometer) — subscribe in `useEffect`, render axis values as `DataRow`s with `mono` formatting. Always unsubscribe on unmount. Phase 2 will lift this into a `useSensorStream` hook.

Every detail screen begins with `<Stack.Screen options={{ title }} />`, wraps content in `<ScreenContainer scroll>`, and falls back to `<UnsupportedState />` when the platform is unsupported.

---

## 4. Motion

Phase 1 ships with no animation on tiles or rows. Phase 3 adds:

- **Tile press**: Reanimated scale `1 → 0.96` on press in (`withTiming`, 90ms), spring back on press out (`damping: 14, stiffness: 220`).
- **Haptics**: `Haptics.selectionAsync()` on tile press; `Haptics.impactAsync(Light)` on action buttons. Native only.

No layout animations. Color/opacity changes only.

---

## 5. States

Every detail screen must handle these states explicitly:

1. **Loading** — async fetch in flight. Phase 1: render skeleton DataRows with `—`. Phase 3: `LoadingState` with spinner.
2. **Ready** — happy path. Real values rendered.
3. **Empty** — value exists but is null/undefined. `DataRow` renders `—` automatically.
4. **Permission denied** — Phase 2: `EmptyState` with a "Grant access" `ActionButton`.
5. **Unsupported** — wrong platform. `UnsupportedState` with a specific reason.
6. **Error** — fetch failed. Phase 3: `ErrorState` with retry.

---

## 6. Accessibility

- Tiles: `accessibilityRole="button"`, `accessibilityLabel="${title}. ${description}"`, `accessibilityState={{ disabled }}`, `hitSlop: 4`.
- DataRow: `accessible`, single label combining label and rendered value.
- All pastel `fg`-on-`bg` pairs target WCAG AA 4.5:1; verified in Phase 3.
- Respect Dynamic Type / Android font scale — tiles use `aspectRatio` plus flexible height so text wraps without clipping.

---

## 7. Don'ts

- Don't read `useColorScheme` directly in components — use `useTheme()`.
- Don't hard-code colors or pixel sizes — use `Colors`, `CategoryPalette`, or `Spacing`.
- Don't add NativeWind / Tailwind / a styling DSL — the project is `StyleSheet`-only on native.
- Don't introduce a new typography variant inline. Add it to `ThemedText` if the system genuinely needs it.
- Don't render empty data when the platform is unsupported. Use `UnsupportedState`.
- Don't subscribe to a sensor without an unmount cleanup.
