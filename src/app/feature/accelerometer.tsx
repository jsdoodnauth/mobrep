import { Accelerometer } from 'expo-sensors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

export default function AccelerometerScreen() {
  const { data, available } = useSensorStream<{ x: number; y: number; z: number }>(
    Accelerometer,
    100,
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Accelerometer' }} />
      <ScreenContainer scroll>
        {available === false ? (
          <UnsupportedState reason="Accelerometer is not available on this device." />
        ) : (
          <View style={styles.section}>
            <ThemedText type="subtitle">Acceleration (g)</ThemedText>
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
