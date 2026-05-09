import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ErrorState, LoadingState, UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/use-async-data';
import { formatBytes, formatPercent } from '@/lib/format';

const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

type Snapshot = {
  uniqueId: string;
  androidId: string | null;
  instanceId: string | null;
  totalDisk: number;
  freeDisk: number;
  totalMemory: number;
  usedMemory: number;
  maxMemory: number | null;
  power: {
    batteryLevel: number | null;
    batteryState: string | null;
    lowPowerMode: boolean | null;
  };
  pinOrFingerprintSet: boolean;
  isEmulator: boolean;
  cameraPresent: boolean | null;
  abis: string[];
  abis32: string[];
  abis64: string[];
  bootloader: string | null;
  fingerprint: string | null;
  hardware: string | null;
  securityPatch: string | null;
};

async function loadSnapshot(): Promise<Snapshot> {
  const [
    uniqueId,
    androidId,
    instanceId,
    totalDisk,
    freeDisk,
    totalMemory,
    usedMemory,
    maxMemory,
    power,
    pinOrFingerprintSet,
    isEmulator,
    cameraPresent,
    abis,
    abis32,
    abis64,
    bootloader,
    fingerprint,
    hardware,
    securityPatch,
  ] = await Promise.all([
    DeviceInfo.getUniqueId(),
    isAndroid ? DeviceInfo.getAndroidId().catch(() => null) : Promise.resolve(null),
    isAndroid ? DeviceInfo.getInstanceId().catch(() => null) : Promise.resolve(null),
    DeviceInfo.getTotalDiskCapacity(),
    DeviceInfo.getFreeDiskStorage(),
    DeviceInfo.getTotalMemory(),
    DeviceInfo.getUsedMemory(),
    isAndroid ? DeviceInfo.getMaxMemory().catch(() => null) : Promise.resolve(null),
    DeviceInfo.getPowerState().catch(() => ({})),
    DeviceInfo.isPinOrFingerprintSet(),
    DeviceInfo.isEmulator(),
    isAndroid ? DeviceInfo.isCameraPresent().catch(() => null) : Promise.resolve(null),
    DeviceInfo.supportedAbis().catch(() => []),
    DeviceInfo.supported32BitAbis().catch(() => []),
    DeviceInfo.supported64BitAbis().catch(() => []),
    isAndroid ? DeviceInfo.getBootloader().catch(() => null) : Promise.resolve(null),
    isAndroid ? DeviceInfo.getFingerprint().catch(() => null) : Promise.resolve(null),
    isAndroid ? DeviceInfo.getHardware().catch(() => null) : Promise.resolve(null),
    isAndroid ? DeviceInfo.getSecurityPatch().catch(() => null) : Promise.resolve(null),
  ]);

  const powerState = power as Partial<{
    batteryLevel: number;
    batteryState: string;
    lowPowerMode: boolean;
  }>;

  return {
    uniqueId,
    androidId,
    instanceId,
    totalDisk,
    freeDisk,
    totalMemory,
    usedMemory,
    maxMemory,
    power: {
      batteryLevel: powerState.batteryLevel ?? null,
      batteryState: powerState.batteryState ?? null,
      lowPowerMode: powerState.lowPowerMode ?? null,
    },
    pinOrFingerprintSet,
    isEmulator,
    cameraPresent,
    abis,
    abis32,
    abis64,
    bootloader,
    fingerprint,
    hardware,
    securityPatch,
  };
}

export default function DeviceInfoScreen() {
  const { data, loading, error, refresh } = useAsyncData(loadSnapshot);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Device Info' }} />
        <ScreenContainer>
          <UnsupportedState reason="react-native-device-info exposes no useful data on the web." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Device Info' }} />
      <ScreenContainer scroll refreshing={loading} onRefresh={refresh}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Library</ThemedText>
          <DataRow label="Package" value="react-native-device-info" mono />
          <DataRow label="Device model" value={DeviceInfo.getDeviceId()} mono />
          <DataRow label="Readable version" value={DeviceInfo.getReadableVersion()} mono />
          <DataRow label="User agent" value={DeviceInfo.getUserAgentSync?.() ?? null} />
        </View>

        {error ? (
          <ErrorState message={error.message} />
        ) : loading && data == null ? (
          <LoadingState />
        ) : data ? (
          <>
            <View style={styles.section}>
              <ThemedText type="subtitle">Identifiers</ThemedText>
              <DataRow label="Unique ID" value={data.uniqueId} mono />
              {isAndroid ? <DataRow label="Android ID" value={data.androidId} mono /> : null}
              {isAndroid ? <DataRow label="Instance ID" value={data.instanceId} mono /> : null}
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Storage</ThemedText>
              <DataRow label="Total disk" value={formatBytes(data.totalDisk)} />
              <DataRow label="Free disk" value={formatBytes(data.freeDisk)} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Memory</ThemedText>
              <DataRow label="Total memory" value={formatBytes(data.totalMemory)} />
              <DataRow label="Used memory" value={formatBytes(data.usedMemory)} />
              {isAndroid ? (
                <DataRow label="Max heap (JVM)" value={formatBytes(data.maxMemory)} />
              ) : null}
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Power</ThemedText>
              <DataRow
                label="Battery level"
                value={
                  data.power.batteryLevel == null
                    ? null
                    : formatPercent(data.power.batteryLevel, 0)
                }
              />
              <DataRow label="Battery state" value={data.power.batteryState} />
              <DataRow label="Low power mode" value={data.power.lowPowerMode} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Capabilities</ThemedText>
              <DataRow label="PIN or fingerprint set" value={data.pinOrFingerprintSet} />
              <DataRow label="Emulator" value={data.isEmulator} />
              <DataRow label="Notch" value={DeviceInfo.hasNotch()} />
              {isIOS ? (
                <DataRow label="Dynamic Island" value={DeviceInfo.hasDynamicIsland()} />
              ) : null}
              {isAndroid ? <DataRow label="Camera present" value={data.cameraPresent} /> : null}
              <DataRow label="Tablet" value={DeviceInfo.isTablet()} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">CPU ABIs</ThemedText>
              <DataRow
                label="Supported"
                value={data.abis.length === 0 ? null : data.abis.join(', ')}
                mono
              />
              <DataRow
                label="64-bit"
                value={data.abis64.length === 0 ? null : data.abis64.join(', ')}
                mono
              />
              <DataRow
                label="32-bit"
                value={data.abis32.length === 0 ? null : data.abis32.join(', ')}
                mono
              />
            </View>

            {isAndroid ? (
              <View style={styles.section}>
                <ThemedText type="subtitle">Android build</ThemedText>
                <DataRow label="Bootloader" value={data.bootloader} mono />
                <DataRow label="Fingerprint" value={data.fingerprint} mono />
                <DataRow label="Hardware" value={data.hardware} mono />
                <DataRow label="Security patch" value={data.securityPatch} />
              </View>
            ) : null}
          </>
        ) : null}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
