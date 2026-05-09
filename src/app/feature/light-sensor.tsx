import { LightSensor } from 'expo-sensors';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

export default function LightSensorScreen() {
  const { data, available } = useSensorStream<{ illuminance: number }>(LightSensor, 200);

  if (Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Light Sensor' }} />
        <ScreenContainer>
          <UnsupportedState reason="The ambient light sensor is only exposed on Android." />
        </ScreenContainer>
      </>
    );
  }

  if (available === false) {
    return (
      <>
        <Stack.Screen options={{ title: 'Light Sensor' }} />
        <ScreenContainer>
          <UnsupportedState reason="No light sensor on this Android device." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Light Sensor' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Ambient light</ThemedText>
          <DataRow
            label="Illuminance (lux)"
            value={formatNumber(data?.illuminance, 2)}
            mono
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
