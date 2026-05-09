# Phase 4 — External Library Integrations

## Context

Phases 1–3 covered the Expo SDK surface (29 ready screens, 8 categories). Phase 4 expands the explorer to **non-Expo-SDK libraries** so the app can also report on features Expo doesn't expose: comprehensive device IDs (RAM/disk/ABIs), unified permissions, Bluetooth adapter state, system volume, shake detection, fast key/value storage, plus deep-dive wireless (BLE/NFC/WiFi-scan).

**Constraint:** keep iterating in **Expo Go** as long as possible. Most third-party native modules are **not** bundled in Expo Go and require a custom dev client (`npx expo run:*` or `eas build --profile development`). Among the targets only `@react-native-async-storage/async-storage` and the already-integrated `@react-native-community/netinfo` work in Expo Go. Phase 4 is therefore split into three sub-phases: 4a stays Expo-Go-compatible, 4b/4c are gated on a one-time dev-client cutover.

**Decisions locked in:**
- Indicator: a small **corner dot** (filled circle, `palette.accent`) absolute-positioned in the top-right of any tile whose `Feature.external === true`. A one-line legend on the home screen explains it.
- Categories: add **two new** pastel palettes — `wireless` and `storage` — alongside the existing 8.
- Scope: the 6 listed in `docs/notes/expo-sdk-library.md` + 3 safe additions (`react-native-volume-manager`, `react-native-shake`, `react-native-mmkv`) + 3 deep-wireless (`react-native-ble-plx`, `react-native-nfc-manager`, `react-native-wifi-reborn`).
- Phasing: **4a / 4b / 4c**, mirroring the Phase 1/2/3 cadence.

---

## Phase 4a — Foundation (stays in Expo Go)

Goal: ship the visual + registry plumbing for external tiles, register every upcoming external feature as `planned`, and land the one external tile that already works in Expo Go (`async-storage`).

### 4a.1 Registry — extend `Feature`

`src/constants/features.ts` (current type at L36–47):

```ts
export type Feature = {
  id: FeatureId;
  title: string;
  description: string;
  category: CategoryId;
  route: `/feature/${FeatureId}`;
  status: 'ready' | 'planned';
  requiresInstall?: boolean;
  platforms?: readonly FeaturePlatform[];
  /** True if backed by a non-Expo-SDK package. Renders an indicator dot on the tile. */
  external?: boolean;
  /** npm package name, used by the detail screen header subtitle and legend tooltips. */
  package?: string;
};
```

Append new `FeatureId` literals: `async-storage`, `device-info`, `permissions`, `bluetooth-state`, `volume-manager`, `shake`, `mmkv`, `system-info`, `ble`, `nfc`, `wifi-scan`.

Retrofit the existing `netinfo` entry (L301–308) with `external: true, package: '@react-native-community/netinfo'` — it already ships from a third-party package; the dot just becomes visible.

### 4a.2 Theme — add `wireless` and `storage` palettes

`src/constants/theme.ts` — extend `CategoryId`, `CategoryPalette`, `CategoryMeta`, and `CategoryDisplayOrder`. Hexes calibrated for WCAG AA `fg`-on-`bg` ≥ 4.5:1 (verify in 4a verification step):

| Category | Light bg / fg / accent | Dark bg / fg / accent |
|---|---|---|
| wireless | `#E0E7FF` / `#1E1B4B` / `#5B6BC9` | `#1F1F3A` / `#E0E7FF` / `#94A3FF` |
| storage  | `#F5F0E1` / `#3B2F14` / `#A38442` | `#2E281A` / `#F5F0E1` / `#D4B872` |

Display order: `... privacy, network, wireless, storage` (append at the end so the existing 8 keep their position).

### 4a.3 Tile indicator — corner dot

`src/components/feature-tile.tsx` (current pill block at L67–73):

- Add a `dot` style: `position: 'absolute', top: Spacing.two, right: Spacing.two, width: 8, height: 8, borderRadius: 4, backgroundColor: palette.accent`.
- Render `{feature.external ? <View style={[styles.dot]} /> : null}` as a sibling of the `<Pressable>` content. Place it **outside** the `titleRow` so it doesn't push the `Soon` pill — both can coexist when a feature is `external && planned`.
- Accessibility: append `". External library."` to `accessibilityLabel` when `feature.external`.

### 4a.4 Legend on home screen

`src/app/index.tsx` — add a single small line under the page title (or above the first `<CategorySection>`):

```tsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
  <View style={styles.legendDot} />
  <ThemedText type="small" themeColor="textSecondary">
    Tiles with a dot are powered by external (non-Expo-SDK) libraries.
  </ThemedText>
</View>
```

`legendDot`: 6×6 circle, `Colors[scheme].textSecondary`. One row, no wrapping.

### 4a.5 First external screen — `async-storage` (works in Expo Go)

Install: `npx expo install @react-native-async-storage/async-storage`.

`src/app/feature/async-storage.tsx` — **read-only data flavor** with light triggers:
- `<Stack.Screen options={{ title: 'AsyncStorage' }} />` + `ScreenContainer`.
- Header `<DataRow>`s: package name, version (from `require('@react-native-async-storage/async-storage/package.json').version`), backend (SQLite on Android since v2 / NSUserDefaults on iOS).
- Live snapshot section — `useAsyncData`-driven: `getAllKeys()` count, sample of first 5 keys, total estimated size (sum of `getItem` lengths).
- Trigger row (`<ActionButton>`s): "Write demo key", "Delete demo key", "Clear app keys" (filters by a `mobrep:` prefix only — never call `clear()` blindly).
- Category: `storage`. `external: true, package: '@react-native-async-storage/async-storage'`.

### 4a.6 Register the 4b/4c stubs as planned

Append entries for `device-info`, `permissions`, `bluetooth-state`, `volume-manager`, `shake`, `mmkv`, `system-info`, `ble`, `nfc`, `wifi-scan` — all `status: 'planned', requiresInstall: true, external: true`. They render with both the **Soon** pill *and* the **corner dot** so the home screen previews the full Phase 4 ambition.

### 4a Critical files
- `src/constants/features.ts` (extend type + retrofit `netinfo` + 11 new entries)
- `src/constants/theme.ts` (2 new palettes + display order + meta)
- `src/components/feature-tile.tsx` (corner-dot styles + render + a11y label)
- `src/app/index.tsx` (legend row)
- `src/app/feature/async-storage.tsx` (NEW)
- `package.json` (add `@react-native-async-storage/async-storage`)

### 4a Verification
- `npm run lint` and `npm test` pass; existing tile tests assert no dot when `external !== true`, dot present when `external === true`.
- `npm start` in Expo Go on iOS + Android: home shows 10 category sections; new `Wireless` and `Storage` sections render with their pastel palettes; a small dot appears on `NetInfo`, `AsyncStorage`, and the 9 planned external tiles.
- Tap **AsyncStorage** → screen renders package version + key snapshot; demo write/delete buttons mutate state; reload preserves the demo key until "Clear app keys" is pressed.
- Web: AsyncStorage screen renders (it has a localStorage backend) **or** falls back to `<UnsupportedState>` cleanly.
- Dark mode: walk both new palettes against `Colors.dark.background` for AA contrast.

---

## Phase 4b — Dev client cutover + bulk external integration

Goal: one-time switch from Expo Go to a custom dev client, then add 7 third-party tiles in a single batch.

### 4b.1 Dev client cutover

- `npx expo install expo-dev-client`.
- For local builds: `npx expo run:ios` and `npx expo run:android` once each; update `CLAUDE.md` "Commands" section to call out the new flow ("Expo Go is no longer enough from Phase 4b onward — start the dev client with `npx expo run:ios|android`").
- For team builds: `eas build --profile development --platform all` (gated on user opting in; document but don't run).

### 4b.2 Install + screens (one PR per lib, in order)

| # | Library | Category | Screen flavor | Notes |
|---|---|---|---|---|
| 1 | `react-native-device-info` | device-info | read-only | 30+ DataRows: `getUniqueId`, `getTotalDiskCapacity`, `getFreeDiskStorage`, `getTotalMemory`, `getUsedMemory`, `getSupportedAbis`, `isPinOrFingerprintSet`, `getCarrier`, `getPowerState`. No extra permissions. |
| 2 | `react-native-permissions` | privacy | read-only + triggers | One screen enumerating `PERMISSIONS.IOS.*` / `PERMISSIONS.ANDROID.*` with `check()` status per row + a "request" button per row. Acts as a unified status board across all the Expo permission surfaces from Phase 2. |
| 3 | `react-native-bluetooth-state-manager` | wireless | live stream | `getState()` snapshot + `addEventListener('change')` subscription. `DataRow`s: `state` (`PoweredOn` / `PoweredOff` / `Unauthorized` / `Unsupported` / `Unknown`); action buttons `openSettings()` (iOS) / `enable()` (Android). |
| 4 | `react-native-volume-manager` | audio-media | live stream + triggers | `getVolume()`, `addVolumeListener`, `getRingerMode` (Android). Action buttons to nudge volume ±10%. Honest `<UnsupportedState>` on web. |
| 5 | `react-native-shake` | sensors | live stream | `addListener` increments a counter `<DataRow>` "Shake events"; reset button. |
| 6 | `react-native-mmkv` | storage | read-only + triggers | Mirrors the AsyncStorage screen's structure on an MMKV instance — same metrics (key count, sample keys, total size). Lets users compare. |
| 7 | `expo-system-info` (community) | device-info | read-only, Android-only | `platforms: ['android']`. Surfaces `Build.*` and `SystemProperties` not on `expo-device`. iOS/web → `<UnsupportedState reason="Android-only system properties." />`. |

For each: install via `npx expo install <lib>`, flip the registry entry from `planned` → `ready`, drop `requiresInstall`, add the screen file under `src/app/feature/<id>.tsx`.

### 4b.3 New shared helpers (extract once 2+ screens share a need)

- If both `device-info` and `system-info` need a long flat list of `DataRow`s, extract `<DataGroup title rows>` for visual grouping. Don't pre-emptively build it — extract after the second screen lands.
- If multiple wireless screens want a "Bluetooth state" pattern (BLE in 4c reuses BT state), extract `useBluetoothState()` into `src/hooks/use-bluetooth-state.ts`.

### 4b Critical files
- `src/constants/features.ts` (flip 7 entries `planned` → `ready`, drop `requiresInstall`)
- `src/app/feature/{device-info,permissions,bluetooth-state,volume-manager,shake,mmkv,system-info}.tsx` (NEW × 7)
- `package.json` (7 new deps)
- `app.json` (`expo-dev-client` plugin if not auto-added)
- `CLAUDE.md` (note the dev-client requirement starting Phase 4b)

### 4b Verification
- Dev client installs and launches on iOS sim + Android emulator. `npx expo run:ios` and `run:android` both succeed.
- Each new tile flips active in turn, navigates, renders live data on at least one platform, and falls back via `<UnsupportedState>` on platforms it can't support (web for all of these).
- Subscriptions tear down on unmount (leave + return — no warnings, no leak).
- The "Permissions" tile correctly reflects status changes from other feature screens — open `Camera`, grant, return to `Permissions`, see camera = granted.

---

## Phase 4c — Wireless deep-dive (dev client + permission strings)

Goal: add scanning capabilities for BLE / NFC / Wi-Fi to the `wireless` category. These each need new permission strings and per-platform manifest entries; they cannot run on web and are partial on simulators (BLE on iOS sim does nothing useful).

### 4c.1 Install + screens

| Library | Category | Screen flavor | Permissions added |
|---|---|---|---|
| `react-native-ble-plx` | wireless | live stream + triggers | iOS: `NSBluetoothAlwaysUsageDescription`. Android: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `ACCESS_FINE_LOCATION` (Android < 12). Screen lists nearby devices (`BleManager.startDeviceScan` → throttle + dedupe by id) with name + RSSI; "Stop scan" button. |
| `react-native-nfc-manager` | wireless | triggers | iOS: `NFCReaderUsageDescription` + `NFCReaderUsage` capability. Android: `NFC` permission. Screen renders `isSupported()` / `isEnabled()` snapshot + "Read NFC tag" button → shows tag id, type, technologies. |
| `react-native-wifi-reborn` | wireless | live stream + triggers | Android: `ACCESS_FINE_LOCATION` (already added by Location), `ACCESS_WIFI_STATE`, `CHANGE_WIFI_STATE`. Connected SSID/BSSID/RSSI/freq via `getCurrentWifiSSID`, etc. iOS-mostly limited; clear `<UnsupportedState>` on iOS for the scan list. |

### 4c.2 Reuse `useBluetoothState`

If 4b extracted `useBluetoothState()`, BLE's screen renders an early `<UnsupportedState reason="Bluetooth is off">` whenever the hook reports anything other than `PoweredOn`. Same hook, no duplication.

### 4c Critical files
- `src/app/feature/{ble,nfc,wifi-scan}.tsx` (NEW × 3)
- `src/constants/features.ts` (flip 3 entries `planned` → `ready`)
- `app.json` — add the `infoPlist` entries (iOS) and `permissions` array (Android) for the strings above; possibly an `expo-build-properties` plugin to pin minSdk / use Frameworks.
- `package.json` (3 new deps)

### 4c Verification
- BLE: scan finds at least one nearby device on a real iOS or Android phone; stops cleanly on unmount; shows `<UnsupportedState>` on iOS sim and on web.
- NFC: a real Android phone reads an NDEF tag and renders its id/type; iOS reads after entitlement granted.
- WiFi: connected SSID/BSSID render on Android; iOS renders the connected SSID only (and shows `<UnsupportedState>` for the scan list).
- All three screens guarded by their permission state — render a "Grant access" `<ActionButton>` first, swap to data once granted (the same pattern Phase 2 established).

---

## Out of scope (call out for a hypothetical Phase 5)

- `expo-secure-store` already covers iOS Keychain / Android Keystore; a comparison tile in `storage` could be a future addition.
- `react-native-foreground-service` (Android background tasks), `react-native-immediate-phone-call`, and `react-native-keychain` were considered and dropped — overlap with Expo SDK or marginal fit for a "report" app.

---

## Aggregate critical files (across 4a/4b/4c)

- `src/constants/features.ts` — type extension + 11 new entries + retrofit `netinfo`
- `src/constants/theme.ts` — `wireless` + `storage` palettes, `CategoryMeta`, `CategoryDisplayOrder`
- `src/components/feature-tile.tsx` — corner-dot indicator
- `src/app/index.tsx` — legend row
- `src/app/feature/{async-storage,device-info,permissions,bluetooth-state,volume-manager,shake,mmkv,system-info,ble,nfc,wifi-scan}.tsx` — NEW × 11
- `app.json` — dev-client plugin (4b), permission strings (4c)
- `package.json` — 11 new deps over the three sub-phases
- `CLAUDE.md` — note dev-client requirement starting 4b
- `docs/implementation-plan.md` — append a one-paragraph "Phase 4 (separate doc)" pointer; the full plan lives in this file.

## Reused existing utilities

- `useAsyncData` (`src/hooks/use-async-data.ts`) — for one-shot reads on `async-storage`, `device-info`, `system-info`, `mmkv`.
- `useSensorStream`-style structure (`src/hooks/use-sensor-stream.ts`) is the model for new live-stream hooks (BT state, volume, shake) — copy the listener/teardown pattern, don't try to overgeneralize.
- `<DataRow>`, `<ScreenContainer>`, `<ActionButton>`, `<UnsupportedState>` — every new screen composes these; no new primitives planned.
