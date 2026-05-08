# Liquid Glass Navigation — Design Spec

**Date:** 2026-05-08

## Overview

Replace the existing `NativeTabs`-based navigation with a custom tab bar that applies a liquid glass effect on iOS 26+, a blurred frosted-glass fallback on Android, and leaves the existing web tab bar unchanged.

---

## File Changes

| File | Action |
|---|---|
| `src/components/app-tabs.ios.tsx` | Create — liquid glass tab bar for iOS |
| `src/components/app-tabs.tsx` | Update — replace `NativeTabs` with blur tab bar for Android |
| `src/components/app-tabs.web.tsx` | No change |
| `package.json` | Add `@react-native-community/blur` |

No changes to `src/app/_layout.tsx` or any screen files — `AppTabs` is imported by name and the platform file resolver handles the rest.

---

## iOS Tab Bar (`app-tabs.ios.tsx`)

### Routing

Uses `expo-router/ui`: `Tabs`, `TabSlot`, `TabList`, `TabTrigger` — the same primitives the web file already uses. Routing behaviour is identical to the current `NativeTabs` implementation.

### Component Tree

```
Tabs
  TabSlot                          (flex: 1, fills screen above bar)
  TabList asChild → GlassTabBar    (GlassContainer, absolute bottom, horizontal row, centered)
    TabTrigger "index" asChild → GlassTabButton
      GlassView                    (glassEffectStyle per active state, isInteractive, colorScheme)
        Pressable
          Image                    (home.png, renderingMode="template")
          ThemedText               (label, active/inactive colour)
    TabTrigger "explore" asChild → GlassTabButton
      GlassView
        Pressable
          Image                    (explore.png, renderingMode="template")
          ThemedText
```

### GlassContainer props

- `spacing={8}` — triggers the liquid merge effect between the two adjacent pills
- Absolutely positioned at the bottom of the screen
- `paddingBottom` = `useSafeAreaInsets().bottom` (clears the iOS home indicator)
- Horizontal row with an 8px gap between buttons (matching `spacing` so merge activates)

### GlassView props per button

- Active tab: `glassEffectStyle="regular"` — opaque frosted glass feel
- Inactive tab: `glassEffectStyle="clear"` — lighter, more transparent
- `isInteractive={true}` — enables native press feedback
- `colorScheme` — passed from `useColorScheme()` (`"light"` | `"dark"`)

### Active state colours

- Icon + label colour: `theme.text` when active, `theme.textSecondary` when inactive
- Colour tokens come from `useTheme()` (`src/hooks/use-theme.ts`)

---

## Android Tab Bar (`app-tabs.tsx` updated)

### Routing

Same `expo-router/ui` structure as iOS.

### Component Tree

```
Tabs
  TabSlot                          (flex: 1)
  TabList asChild → AndroidTabBar  (View, absolute bottom, centered row)
    BlurView                       (StyleSheet.absoluteFill, blurType, blurAmount={20}, borderRadius)
    TabTrigger "index" asChild → AndroidTabButton
      Pressable
        Image                      (home.png, renderingMode="template")
        ThemedText                 (label)
    TabTrigger "explore" asChild → AndroidTabButton
      Pressable
        Image                      (explore.png, renderingMode="template")
        ThemedText
```

### BlurView props

- `blurType`: `"light"` when `colorScheme === 'light'`, `"dark"` when dark
- `blurAmount={20}`
- `StyleSheet.absoluteFill` inside the container `View` — blurs the whole bar background, not per-button
- `borderRadius` matching the container pill shape

### Active state

Active button gets a `ThemedView` pill background using the `backgroundSelected` colour token. No per-button blur — single `BlurView` behind the whole bar keeps it performant.

### Safe area

`paddingBottom` = `useSafeAreaInsets().bottom`, same as iOS.

---

## Shared Details

**Icons:** `expo-image` `Image` component, sources `@/assets/images/tabIcons/home.png` and `@/assets/images/tabIcons/explore.png`, `renderingMode="template"` so tint colour is applied.

**Safe area:** Both platforms use `useSafeAreaInsets().bottom` directly rather than the `BottomTabInset` constant in `theme.ts`, which is a fixed approximation.

**Accessibility:** `isInteractive={true}` on `GlassView` provides native iOS press feedback. On Android, `Pressable` handles this. If the user has enabled Reduce Transparency on iOS, `expo-glass-effect` falls back to a plain `View` internally — no extra handling required.

**Web:** `src/components/app-tabs.web.tsx` is not modified.
