import { DeviceMotion, type DeviceMotionMeasurement } from 'expo-sensors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useSensorStream } from '@/hooks/use-sensor-stream';
import { formatNumber } from '@/lib/format';

export default function DeviceMotionScreen() {
  const { data, available } = useSensorStream<DeviceMotionMeasurement>(DeviceMotion, 100);

  if (available === false) {
    return (
      <>
        <Stack.Screen options={{ title: 'Device Motion' }} />
        <ScreenContainer>
          <UnsupportedState reason="Device motion is not available on this device." />
        </ScreenContainer>
      </>
    );
  }

  const acceleration = data?.acceleration;
  const accWithGravity = data?.accelerationIncludingGravity;
  const rotation = data?.rotation;
  const rotationRate = data?.rotationRate;

  return (
    <>
      <Stack.Screen options={{ title: 'Device Motion' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Acceleration (m/s²)</ThemedText>
          <DataRow label="X" value={formatNumber(acceleration?.x, 3)} mono />
          <DataRow label="Y" value={formatNumber(acceleration?.y, 3)} mono />
          <DataRow label="Z" value={formatNumber(acceleration?.z, 3)} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">With gravity</ThemedText>
          <DataRow label="X" value={formatNumber(accWithGravity?.x, 3)} mono />
          <DataRow label="Y" value={formatNumber(accWithGravity?.y, 3)} mono />
          <DataRow label="Z" value={formatNumber(accWithGravity?.z, 3)} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Rotation (rad)</ThemedText>
          <DataRow label="Alpha" value={formatNumber(rotation?.alpha, 3)} mono />
          <DataRow label="Beta" value={formatNumber(rotation?.beta, 3)} mono />
          <DataRow label="Gamma" value={formatNumber(rotation?.gamma, 3)} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Rotation rate (rad/s)</ThemedText>
          <DataRow label="Alpha" value={formatNumber(rotationRate?.alpha, 3)} mono />
          <DataRow label="Beta" value={formatNumber(rotationRate?.beta, 3)} mono />
          <DataRow label="Gamma" value={formatNumber(rotationRate?.gamma, 3)} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Orientation</ThemedText>
          <DataRow label="Orientation" value={data?.orientation ?? null} />
          <DataRow label="Sample interval (ms)" value={formatNumber(data?.interval, 1)} />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
