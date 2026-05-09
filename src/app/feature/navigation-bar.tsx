import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

type State = {
  visibility: NavigationBar.NavigationBarVisibility | null;
  buttonStyle: NavigationBar.NavigationBarButtonStyle | null;
  behavior: NavigationBar.NavigationBarBehavior | null;
};

export default function NavigationBarScreen() {
  const [state, setState] = useState<State>({
    visibility: null,
    buttonStyle: null,
    behavior: null,
  });

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let cancelled = false;

    async function refresh() {
      const [visibility, behavior] = await Promise.all([
        NavigationBar.getVisibilityAsync().catch(() => null),
        NavigationBar.getBehaviorAsync().catch(() => null),
      ]);
      if (cancelled) return;
      setState((prev) => ({ ...prev, visibility, behavior }));
    }
    refresh();

    const sub = NavigationBar.addVisibilityListener(({ visibility }) => {
      setState((prev) => ({ ...prev, visibility }));
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  if (Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Navigation Bar' }} />
        <ScreenContainer>
          <UnsupportedState reason="The system navigation bar only exists on Android." />
        </ScreenContainer>
      </>
    );
  }

  const apply = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch {}
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Navigation Bar' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Current</ThemedText>
          <DataRow label="Visibility" value={state.visibility} />
          <DataRow label="Button style" value={state.buttonStyle} />
          <DataRow label="Behavior" value={state.behavior} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Visibility</ThemedText>
          <ActionButton
            category="system-display"
            label="Show"
            onPress={() => apply(() => NavigationBar.setVisibilityAsync('visible'))}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Hide"
            onPress={() => apply(() => NavigationBar.setVisibilityAsync('hidden'))}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Button style</ThemedText>
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Light icons"
            onPress={async () => {
              await apply(() => NavigationBar.setButtonStyleAsync('light'));
              setState((prev) => ({ ...prev, buttonStyle: 'light' }));
            }}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Dark icons"
            onPress={async () => {
              await apply(() => NavigationBar.setButtonStyleAsync('dark'));
              setState((prev) => ({ ...prev, buttonStyle: 'dark' }));
            }}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Behavior</ThemedText>
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Overlay swipe"
            onPress={async () => {
              await apply(() => NavigationBar.setBehaviorAsync('overlay-swipe'));
              setState((prev) => ({ ...prev, behavior: 'overlay-swipe' }));
            }}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Inset swipe"
            onPress={async () => {
              await apply(() => NavigationBar.setBehaviorAsync('inset-swipe'));
              setState((prev) => ({ ...prev, behavior: 'inset-swipe' }));
            }}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
