import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { VolumeManager } from 'react-native-volume-manager';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

const RINGER_LABELS: Record<number, string> = {
  0: 'Silent',
  1: 'Vibrate',
  2: 'Normal',
};

function ringerNumberToLabel(mode: number | undefined | null): string | null {
  if (mode == null) return null;
  return RINGER_LABELS[mode] ?? `Mode ${mode}`;
}

export default function VolumeManagerScreen() {
  const [volume, setVolume] = useState<number | null>(null);
  const [ringer, setRinger] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    let cancelled = false;

    VolumeManager.getVolume()
      .then((result) => {
        if (cancelled) return;
        setVolume(result?.volume ?? null);
      })
      .catch(() => undefined);

    const volumeSub = VolumeManager.addVolumeListener((result) => {
      setVolume(result.volume);
    });

    let ringerSub: { remove: () => void } | null = null;
    if (Platform.OS === 'android') {
      VolumeManager.getRingerMode()
        .then((mode) => {
          if (cancelled) return;
          setRinger(ringerNumberToLabel(mode));
        })
        .catch(() => undefined);
      ringerSub = VolumeManager.addRingerListener((event) => {
        setRinger(event.mode);
      });
    }

    return () => {
      cancelled = true;
      volumeSub.remove();
      ringerSub?.remove();
    };
  }, []);

  const adjustVolume = useCallback((delta: number) => {
    setVolume((current) => {
      const base = current ?? 0;
      const next = Math.min(1, Math.max(0, base + delta));
      VolumeManager.setVolume(next).catch(() => undefined);
      return next;
    });
  }, []);

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Volume' }} />
        <ScreenContainer>
          <UnsupportedState reason="System volume is only readable on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Volume' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">System volume</ThemedText>
          <DataRow
            label="Level"
            value={volume == null ? null : formatPercent(volume, 0)}
          />
          <DataRow
            label="Raw"
            value={volume == null ? null : volume.toFixed(3)}
            mono
          />
          {Platform.OS === 'android' ? (
            <DataRow label="Ringer mode" value={ringer} />
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          <ActionButton
            category="audio-media"
            label="Volume +10%"
            onPress={() => adjustVolume(0.1)}
          />
          <ActionButton
            category="audio-media"
            variant="secondary"
            label="Volume −10%"
            onPress={() => adjustVolume(-0.1)}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
