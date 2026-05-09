import * as ScreenOrientation from 'expo-screen-orientation';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const ORIENTATION_LABELS: Record<ScreenOrientation.Orientation, string> = {
  [ScreenOrientation.Orientation.UNKNOWN]: 'Unknown',
  [ScreenOrientation.Orientation.PORTRAIT_UP]: 'Portrait up',
  [ScreenOrientation.Orientation.PORTRAIT_DOWN]: 'Portrait down',
  [ScreenOrientation.Orientation.LANDSCAPE_LEFT]: 'Landscape left',
  [ScreenOrientation.Orientation.LANDSCAPE_RIGHT]: 'Landscape right',
};

const LOCK_LABELS: Record<ScreenOrientation.OrientationLock, string> = {
  [ScreenOrientation.OrientationLock.DEFAULT]: 'Default',
  [ScreenOrientation.OrientationLock.ALL]: 'All',
  [ScreenOrientation.OrientationLock.PORTRAIT]: 'Portrait',
  [ScreenOrientation.OrientationLock.PORTRAIT_UP]: 'Portrait up',
  [ScreenOrientation.OrientationLock.PORTRAIT_DOWN]: 'Portrait down',
  [ScreenOrientation.OrientationLock.LANDSCAPE]: 'Landscape',
  [ScreenOrientation.OrientationLock.LANDSCAPE_LEFT]: 'Landscape left',
  [ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT]: 'Landscape right',
  [ScreenOrientation.OrientationLock.OTHER]: 'Other',
  [ScreenOrientation.OrientationLock.UNKNOWN]: 'Unknown',
};

export default function ScreenOrientationScreen() {
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [lock, setLock] = useState<ScreenOrientation.OrientationLock | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const [o, l] = await Promise.all([
        ScreenOrientation.getOrientationAsync(),
        ScreenOrientation.getOrientationLockAsync(),
      ]);
      if (cancelled) return;
      setOrientation(o);
      setLock(l);
    }

    refresh();
    const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationInfo.orientation);
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const applyLock = async (next: ScreenOrientation.OrientationLock) => {
    await ScreenOrientation.lockAsync(next);
    setLock(next);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Screen Orientation' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Current</ThemedText>
          <DataRow
            label="Orientation"
            value={orientation == null ? null : ORIENTATION_LABELS[orientation]}
          />
          <DataRow label="Lock" value={lock == null ? null : LOCK_LABELS[lock]} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Lock</ThemedText>
          <ActionButton
            category="hardware"
            label="Portrait"
            onPress={() => applyLock(ScreenOrientation.OrientationLock.PORTRAIT_UP)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Landscape left"
            onPress={() => applyLock(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Landscape right"
            onPress={() => applyLock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="All orientations"
            onPress={() => applyLock(ScreenOrientation.OrientationLock.ALL)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Unlock"
            onPress={async () => {
              await ScreenOrientation.unlockAsync();
              setLock(ScreenOrientation.OrientationLock.DEFAULT);
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
