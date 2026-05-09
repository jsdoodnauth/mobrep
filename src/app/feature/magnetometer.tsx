import { Magnetometer } from 'expo-sensors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

export default function MagnetometerScreen() {
  const { data, available } = useSensorStream<{ x: number; y: number; z: number }>(
    Magnetometer,
    100,
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Magnetometer' }} />
      <ScreenContainer scroll>
        {available === false ? (
          <UnsupportedState reason="Magnetometer is not available on this device." />
        ) : (
          <View style={styles.section}>
            <ThemedText type="subtitle">Magnetic field (μT)</ThemedText>
            <DataRow label="X" value={formatNumber(data?.x, 2)} mono />
            <DataRow label="Y" value={formatNumber(data?.y, 2)} mono />
            <DataRow label="Z" value={formatNumber(data?.z, 2)} mono />
          </View>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
