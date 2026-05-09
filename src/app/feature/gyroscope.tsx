import { Gyroscope } from 'expo-sensors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

export default function GyroscopeScreen() {
  const { data, available } = useSensorStream<{ x: number; y: number; z: number }>(
    Gyroscope,
    100,
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Gyroscope' }} />
      <ScreenContainer scroll>
        {available === false ? (
          <UnsupportedState reason="Gyroscope is not available on this device." />
        ) : (
          <View style={styles.section}>
            <ThemedText type="subtitle">Rotation rate (rad/s)</ThemedText>
            <DataRow label="X" value={formatNumber(data?.x, 3)} mono />
            <DataRow label="Y" value={formatNumber(data?.y, 3)} mono />
            <DataRow label="Z" value={formatNumber(data?.z, 3)} mono />
          </View>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
