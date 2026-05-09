import { Pedometer } from 'expo-sensors';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';

export default function PedometerScreen() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let cancelled = false;
    let watch: { remove: () => void } | null = null;

    async function start() {
      const ok = await Pedometer.isAvailableAsync().catch(() => false);
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (!cancelled) setToday(result.steps);
      } catch {}

      watch = Pedometer.watchStepCount((result) => {
        if (!cancelled) setSteps(result.steps);
      });
    }

    start();

    return () => {
      cancelled = true;
      watch?.remove();
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Pedometer' }} />
        <ScreenContainer>
          <UnsupportedState reason="The pedometer is not exposed on the web." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Pedometer' }} />
      <ScreenContainer scroll>
        {available === false ? (
          <UnsupportedState reason="No pedometer hardware available on this device." />
        ) : (
          <>
            <View style={styles.section}>
              <ThemedText type="subtitle">Today</ThemedText>
              <DataRow label="Steps since midnight" value={today} />
            </View>
            <View style={styles.section}>
              <ThemedText type="subtitle">Live</ThemedText>
              <DataRow label="Steps since opened" value={steps} />
            </View>
          </>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
