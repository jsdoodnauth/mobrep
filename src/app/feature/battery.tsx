import * as Battery from 'expo-battery';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

const BATTERY_STATE_LABELS: Record<Battery.BatteryState, string> = {
  [Battery.BatteryState.UNKNOWN]: 'Unknown',
  [Battery.BatteryState.UNPLUGGED]: 'Unplugged',
  [Battery.BatteryState.CHARGING]: 'Charging',
  [Battery.BatteryState.FULL]: 'Full',
};

type BatterySnapshot = {
  level: number | null;
  state: Battery.BatteryState | null;
  lowPower: boolean | null;
};

export default function BatteryScreen() {
  const [snapshot, setSnapshot] = useState<BatterySnapshot>({
    level: null,
    state: null,
    lowPower: null,
  });

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let cancelled = false;

    async function refresh() {
      const [level, state, lowPower] = await Promise.all([
        Battery.getBatteryLevelAsync().catch(() => null),
        Battery.getBatteryStateAsync().catch(() => null),
        Battery.isLowPowerModeEnabledAsync().catch(() => null),
      ]);
      if (cancelled) return;
      setSnapshot({ level, state, lowPower });
    }

    refresh();

    const subs = [
      Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setSnapshot((prev) => ({ ...prev, level: batteryLevel }));
      }),
      Battery.addBatteryStateListener(({ batteryState }) => {
        setSnapshot((prev) => ({ ...prev, state: batteryState }));
      }),
      Battery.addLowPowerModeListener(({ lowPowerMode }) => {
        setSnapshot((prev) => ({ ...prev, lowPower: lowPowerMode }));
      }),
    ];

    return () => {
      cancelled = true;
      subs.forEach((sub) => sub.remove());
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Battery' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-battery does not expose readings on the web." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Battery' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Power</ThemedText>
          <DataRow
            label="Level"
            value={snapshot.level == null ? null : formatPercent(snapshot.level, 0)}
          />
          <DataRow
            label="State"
            value={snapshot.state == null ? null : BATTERY_STATE_LABELS[snapshot.state]}
          />
          <DataRow label="Low power mode" value={snapshot.lowPower} />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
