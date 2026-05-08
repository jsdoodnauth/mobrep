# Liquid Glass Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `NativeTabs` with a custom tab bar that shows liquid glass pills on iOS 26+, a blurred frosted-glass bar on Android, and leaves the web tab bar unchanged.

**Architecture:** Three platform-specific files resolved automatically by React Native's file resolver: `app-tabs.ios.tsx` (new, `GlassContainer` + `GlassView` from `expo-glass-effect`), `app-tabs.tsx` (updated, `BlurView` from `@react-native-community/blur`), `app-tabs.web.tsx` (untouched). Both native files switch from `expo-router/unstable-native-tabs` to `expo-router/ui` (`Tabs`/`TabList`/`TabTrigger`/`TabSlot`) so routing behaviour is identical across platforms.

**Tech Stack:** `expo-glass-effect` (already installed), `@react-native-community/blur` (to install), `expo-router/ui`, `expo-image`, `react-native-safe-area-context`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/app-tabs.ios.tsx` | Create | iOS liquid glass tab bar |
| `src/components/app-tabs.tsx` | Replace | Android blur tab bar |
| `src/components/app-tabs.web.tsx` | No change | Web tab bar |
| `package.json` / `package-lock.json` | Auto-updated | Add `@react-native-community/blur` |

---

## Task 1: Install `@react-native-community/blur`

**Files:**
- Auto-modified: `package.json`, `package-lock.json`

- [ ] **Step 1: Install the package via Expo's install tool** (ensures a compatible version)

```bash
npx expo install @react-native-community/blur
```

Expected output: package added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify the install**

```bash
npx expo install --check
```

Expected: no peer dependency warnings for `@react-native-community/blur`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @react-native-community/blur"
```

---

## Task 2: Create the iOS liquid glass tab bar

**Files:**
- Create: `src/components/app-tabs.ios.tsx`

This file is picked up automatically on iOS instead of `app-tabs.tsx` due to React Native's `.ios.tsx` platform resolution. It replaces `NativeTabs` with `expo-router/ui` primitives and wraps each tab button in a `GlassView` inside a shared `GlassContainer`.

- [ ] **Step 1: Create `src/components/app-tabs.ios.tsx`**

```tsx
import { GlassContainer, GlassView } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GlassTabButtonProps = TabTriggerSlotProps & {
  icon: ReturnType<typeof require>;
  label: string;
};

const GlassTabButton = forwardRef<View, GlassTabButtonProps>(
  ({ icon, label, isFocused, onPress, onLongPress, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';
    const theme = useTheme();

    return (
      <GlassView
        ref={ref}
        glassEffectStyle={isFocused ? 'regular' : 'clear'}
        isInteractive
        colorScheme={scheme}
        style={styles.glassButton}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.buttonInner}
          {...props}
        >
          <Image
            source={icon}
            style={styles.icon}
            tintColor={isFocused ? theme.text : theme.textSecondary}
            contentFit="contain"
          />
          <ThemedText
            type="small"
            themeColor={isFocused ? 'text' : 'textSecondary'}
            style={styles.label}
          >
            {label}
          </ThemedText>
        </Pressable>
      </GlassView>
    );
  }
);

GlassTabButton.displayName = 'GlassTabButton';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <GlassContainer
          spacing={8}
          style={[styles.tabBar, { paddingBottom: insets.bottom + Spacing.two }]}
        >
          <TabTrigger name="index" href="/" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/home.png')}
              label="Home"
            />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Explore"
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Settings"
            />
          </TabTrigger>
        </GlassContainer>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  glassButton: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
    flex: 1,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    gap: Spacing.half,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/app-tabs.ios.tsx
git commit -m "feat: add iOS liquid glass tab bar"
```

---

## Task 3: Update the Android tab bar

**Files:**
- Modify: `src/components/app-tabs.tsx` (full replacement)

This replaces the `NativeTabs` implementation with `expo-router/ui` + `BlurView`. A single `BlurView` fills the bar background; each button is a `Pressable` with a `ThemedView` active-state pill.

- [ ] **Step 1: Replace `src/components/app-tabs.tsx` entirely**

```tsx
import { BlurView } from '@react-native-community/blur';
import { Image } from 'expo-image';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BAR_RADIUS = 24;

type AndroidTabButtonProps = TabTriggerSlotProps & {
  icon: ReturnType<typeof require>;
  label: string;
};

const AndroidTabButton = forwardRef<View, AndroidTabButtonProps>(
  ({ icon, label, isFocused, onPress, onLongPress, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.buttonOuter}
        {...props}
      >
        <ThemedView
          type={isFocused ? 'backgroundSelected' : undefined}
          style={[
            styles.buttonInner,
            !isFocused && { backgroundColor: 'transparent' },
          ]}
        >
          <Image
            source={icon}
            style={styles.icon}
            tintColor={isFocused ? theme.text : theme.textSecondary}
            contentFit="contain"
          />
          <ThemedText
            type="small"
            themeColor={isFocused ? 'text' : 'textSecondary'}
            style={styles.label}
          >
            {label}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }
);

AndroidTabButton.displayName = 'AndroidTabButton';

const AndroidTabBar = forwardRef<View, ViewProps>(({ children, style, ...props }, ref) => {
  const colorScheme = useColorScheme();
  const blurType = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <View ref={ref} style={[styles.tabBar, style]} {...props}>
      <BlurView
        style={[StyleSheet.absoluteFill, styles.blur]}
        blurType={blurType}
        blurAmount={20}
        reducedTransparencyFallbackColor={colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0'}
      />
      {children}
    </View>
  );
});

AndroidTabBar.displayName = 'AndroidTabBar';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <AndroidTabBar
          style={{ paddingBottom: insets.bottom + Spacing.two }}
        >
          <TabTrigger name="index" href="/" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/home.png')}
              label="Home"
            />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Explore"
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Settings"
            />
          </TabTrigger>
        </AndroidTabBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: BAR_RADIUS,
  },
  buttonOuter: {
    flex: 1,
    alignItems: 'center',
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.four,
    width: '100%',
    gap: Spacing.half,
  },
  buttonInnerActive: {
    borderRadius: Spacing.four,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/app-tabs.tsx
git commit -m "feat: add Android blur tab bar, replace NativeTabs"
```

---

## Task 4: Verify TypeScript compiles cleanly

**Files:**
- Read-only check

- [ ] **Step 1: Run the TypeScript compiler**

```bash
npx tsc --noEmit
```

Expected: no errors. Common issues to watch for:
- `GlassTabButton` / `AndroidTabButton` ref type mismatch — ensure `forwardRef<View, ...>` matches the `ref` prop type from `TabTriggerSlotProps`
- `isFocused` missing from props spread — it comes from `TabTriggerSlotProps`, don't spread it onto native `Pressable` (destructure it out explicitly as shown in the code above)

- [ ] **Step 2: Fix any type errors, then commit if changes were needed**

```bash
git add src/components/app-tabs.ios.tsx src/components/app-tabs.tsx
git commit -m "fix: resolve TypeScript errors in tab bar components"
```

Skip this step if Step 1 produced no errors.

---

## Task 5: Smoke-test on device / simulator

**Files:**
- No code changes — verification only

- [ ] **Step 1: Start the dev server**

```bash
npm start
```

- [ ] **Step 2: Open on iOS simulator (or device running iOS 26+)**

Press `i` in the Expo CLI terminal.

Check:
- Three tabs render: Home, Explore, Settings
- Tab bar floats above content at the bottom
- Active tab pill shows `glassEffectStyle="regular"` (more opaque)
- Inactive tab pills show `glassEffectStyle="clear"` (lighter)
- Tapping a tab navigates to the correct screen
- Home indicator is not obscured (safe area padding is applied)
- Content on screens is not hidden behind the tab bar

- [ ] **Step 3: Open on Android emulator**

Press `a` in the Expo CLI terminal.

Check:
- Three tabs render: Home, Explore, Settings
- `BlurView` creates a frosted background behind the whole bar
- Active tab shows `backgroundSelected` pill
- Tapping navigates correctly
- Content not hidden behind the tab bar

- [ ] **Step 4: Open on web**

Press `w` in the Expo CLI terminal.

Check:
- Web tab bar is visually unchanged (same as before this feature)
- Navigation works

- [ ] **Step 5: Commit a note if any visual tweaks were needed**

If you adjusted padding, `spacing`, or colours during testing, commit those changes:

```bash
git add src/components/app-tabs.ios.tsx src/components/app-tabs.tsx
git commit -m "fix: visual tweaks to tab bar after device testing"
```
