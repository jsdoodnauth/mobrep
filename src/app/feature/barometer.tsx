import { Barometer } from 'expo-sensors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

type BarometerSample = { pressure: number; relativeAltitude?: number };

export default function BarometerScreen() {
  const { data, available } = useSensorStream<BarometerSample>(Barometer, 200);

  return (
    <>
      <Stack.Screen options={{ title: 'Barometer' }} />
      <ScreenContainer scroll>
        {available === false ? (
          <UnsupportedState reason="The barometer is not available on this device." />
        ) : (
          <View style={styles.section}>
            <ThemedText type="subtitle">Atmosphere</ThemedText>
            <DataRow label="Pressure (hPa)" value={formatNumber(data?.pressure, 2)} mono />
            <DataRow
              label="Relative altitude (m)"
              value={
                data?.relativeAltitude == null ? null : formatNumber(data.relativeAltitude, 2)
              }
              mono
            />
          </View>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
