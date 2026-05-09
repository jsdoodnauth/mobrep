import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

const DEVICE_TYPE_LABELS: Record<Device.DeviceType, string> = {
  [Device.DeviceType.UNKNOWN]: 'Unknown',
  [Device.DeviceType.PHONE]: 'Phone',
  [Device.DeviceType.TABLET]: 'Tablet',
  [Device.DeviceType.DESKTOP]: 'Desktop',
  [Device.DeviceType.TV]: 'TV',
};

function formatBytes(bytes: number | null | undefined) {
  if (bytes == null) return null;
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  return `${bytes} B`;
}

function formatUptime(seconds: number | null | undefined) {
  if (seconds == null) return null;
  const total = Math.floor(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

type AsyncDeviceFacts = {
  deviceType: Device.DeviceType | null;
  maxMemory: number | null;
  uptimeSeconds: number | null;
  isRooted: boolean | null;
};

export default function DeviceScreen() {
  const [facts, setFacts] = useState<AsyncDeviceFacts>({
    deviceType: null,
    maxMemory: null,
    uptimeSeconds: null,
    isRooted: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [deviceType, maxMemory, uptimeMs, isRooted] = await Promise.all([
        Device.getDeviceTypeAsync().catch(() => Device.DeviceType.UNKNOWN),
        Platform.OS === 'android' ? Device.getMaxMemoryAsync().catch(() => null) : Promise.resolve(null),
        Device.getUptimeAsync().catch(() => null),
        Device.isRootedExperimentalAsync().catch(() => null),
      ]);

      if (cancelled) return;
      setFacts({
        deviceType,
        maxMemory,
        uptimeSeconds: uptimeMs == null ? null : uptimeMs / 1000,
        isRooted,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Device' }} />
        <ScreenContainer>
          <UnsupportedState
            title="Limited on web"
            reason="expo-device exposes very little on the web platform. Run the app on iOS or Android to see device details."
          />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Device' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Identity</ThemedText>
          <DataRow label="Brand" value={Device.brand} />
          <DataRow label="Manufacturer" value={Device.manufacturer} />
          <DataRow label="Model" value={Device.modelName} />
          <DataRow label="Device name" value={Device.deviceName} />
          <DataRow
            label="Type"
            value={facts.deviceType == null ? null : DEVICE_TYPE_LABELS[facts.deviceType]}
          />
          <DataRow label="Year class" value={Device.deviceYearClass} />
          <DataRow label="Physical device" value={Device.isDevice} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Operating system</ThemedText>
          <DataRow label="OS name" value={Device.osName} />
          <DataRow label="OS version" value={Device.osVersion} />
          <DataRow label="Build ID" value={Device.osBuildId} mono />
          <DataRow label="Internal build ID" value={Device.osInternalBuildId} mono />
          {Platform.OS === 'android' ? (
            <DataRow label="API level" value={Device.platformApiLevel} />
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Memory & runtime</ThemedText>
          <DataRow label="Total memory" value={formatBytes(Device.totalMemory)} />
          {Platform.OS === 'android' ? (
            <DataRow label="Max memory" value={formatBytes(facts.maxMemory)} />
          ) : null}
          <DataRow label="Uptime" value={formatUptime(facts.uptimeSeconds)} />
          <DataRow label="Rooted (experimental)" value={facts.isRooted} />
          <DataRow
            label="CPU architectures"
            value={Device.supportedCpuArchitectures?.join(', ') ?? null}
            mono
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
});
