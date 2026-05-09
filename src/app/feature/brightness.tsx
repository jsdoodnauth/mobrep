import * as Brightness from 'expo-brightness';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

export default function BrightnessScreen() {
  const [appBrightness, setAppBrightness] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let cancelled = false;
    Brightness.getBrightnessAsync().then((value) => {
      if (!cancelled) setAppBrightness(value);
    });
    const sub = Brightness.addBrightnessListener(({ brightness }) => {
      setAppBrightness(brightness);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Brightness' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-brightness is not supported on web." />
        </ScreenContainer>
      </>
    );
  }

  const apply = async (value: number) => {
    await Brightness.setBrightnessAsync(value);
    setAppBrightness(value);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Brightness' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">App brightness</ThemedText>
          <DataRow label="Level" value={formatPercent(appBrightness)} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Set</ThemedText>
          <ActionButton category="hardware" variant="secondary" label="25%" onPress={() => apply(0.25)} />
          <ActionButton category="hardware" variant="secondary" label="50%" onPress={() => apply(0.5)} />
          <ActionButton category="hardware" variant="secondary" label="75%" onPress={() => apply(0.75)} />
          <ActionButton category="hardware" label="100%" onPress={() => apply(1)} />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
