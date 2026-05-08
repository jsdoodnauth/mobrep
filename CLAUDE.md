# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

**Mobile Report** is a device feature explorer built to learn Expo SDK capabilities. The app reports on the live status and data of device hardware and connectivity features — things like Wi-Fi, Bluetooth, mobile data, and sensors (accelerometer x/y/z, gyroscope, barometer, etc.). Each feature gets its own screen showing real-time readings and metadata. The goal is to systematically surface everything Expo exposes from the underlying device, making it a hands-on reference for what the SDK can and cannot do.

New features should follow this pattern: one screen per device capability, live data display, clear labels showing what the value means, and an honest fallback when the platform doesn't support the feature. Prefer Expo SDK packages first, but use community npm packages when the Expo SDK lacks adequate support for a capability.

## Commands

```bash
npm start              # Start Expo dev server (all platforms)
npm run android        # Start with Android target
npm run ios            # Start with iOS target
npm run web            # Start with web target
npm run lint           # Run expo lint
npm run reset-project  # Move starter code to app-example/, reset to blank app/
```

## Architecture

**Expo Router with file-based routing** — `src/app/` maps directly to routes. `_layout.tsx` wraps all tabs in `ThemeProvider` and renders `AnimatedSplashOverlay` + `AppTabs`.

**Path aliases** — `@/*` resolves to `src/*` and `@/assets/*` resolves to `assets/*` (configured in `tsconfig.json`).

**Platform-specific files** — `.web.tsx` files shadow their `.tsx` counterparts on web. Key pairs:
- `src/components/app-tabs.tsx` (native, uses `expo-router/unstable-native-tabs` `NativeTabs`) vs `app-tabs.web.tsx` (web, uses `expo-router/ui` `Tabs`/`TabList`/`TabTrigger`)
- `src/components/animated-icon.tsx` vs `animated-icon.web.tsx`
- `src/hooks/use-color-scheme.ts` vs `use-color-scheme.web.ts`

**Theming system** (`src/constants/theme.ts`):
- `Colors` — light/dark token map (`text`, `background`, `backgroundElement`, `backgroundSelected`, `textSecondary`)
- `Fonts` — platform-selected font family map (`sans`, `serif`, `rounded`, `mono`)
- `Spacing` — named scale (`half`=2, `one`=4, `two`=8, `three`=16, `four`=24, `five`=32, `six`=64)
- `BottomTabInset`, `MaxContentWidth` — layout constants
- `global.css` is imported here to ensure it loads

**`useTheme()` hook** (`src/hooks/use-theme.ts`) — returns the active `Colors` palette. Use this in components instead of reading `useColorScheme` directly.

**Themed primitives** — `ThemedText` and `ThemedView` call `useTheme()` internally. Pass a `type` prop for typography variants (`default`, `title`, `subtitle`, `small`, `smallBold`, `link`, `linkPrimary`, `code`) or `themeColor` to override the color token.

**Animations** — `src/components/animated-icon.tsx` uses `react-native-reanimated` `Keyframe` animations. The splash overlay uses `react-native-worklets` `scheduleOnRN` to bridge the worklet callback back to the RN thread.

**Enabled experiments** (`app.json`): `typedRoutes` (typed `href` for Expo Router) and `reactCompiler`.
