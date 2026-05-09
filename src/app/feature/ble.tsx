import { Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import { BleManager, type Device, type State } from 'react-native-ble-plx';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STATE_DESCRIPTIONS: Record<State | string, string> = {
  PoweredOn: 'Adapter is on and ready to scan.',
  PoweredOff: 'Adapter is off in system settings.',
  Resetting: 'Adapter is resetting.',
  Unauthorized: 'App is not authorized to use Bluetooth.',
  Unsupported: 'This device does not support BLE.',
  Unknown: 'Adapter state is not yet known.',
};

type Discovered = {
  id: string;
  name: string | null;
  rssi: number | null;
  lastSeenAt: number;
};

async function requestAndroidBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const apiLevel = parseInt(String(Platform.Version), 10);
  if (apiLevel < 31) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);
  return (
    result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
      PermissionsAndroid.RESULTS.GRANTED
  );
}

export default function BleScreen() {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const managerRef = useRef<BleManager | null>(null);
  const [bleState, setBleState] = useState<State | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(Platform.OS === 'ios');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Map<string, Discovered>>(() => new Map());
  const theme = useTheme();

  useEffect(() => {
    if (!isNative) return;
    const manager = new BleManager();
    managerRef.current = manager;
    const subscription = manager.onStateChange((next) => setBleState(next), true);
    return () => {
      subscription.remove();
      manager.stopDeviceScan();
      manager.destroy();
      managerRef.current = null;
    };
  }, [isNative]);

  const upsertDevice = useCallback((device: Device) => {
    setDevices((prev) => {
      const next = new Map(prev);
      next.set(device.id, {
        id: device.id,
        name: device.name ?? device.localName ?? null,
        rssi: device.rssi,
        lastSeenAt: Date.now(),
      });
      return next;
    });
  }, []);

  const startScan = useCallback(async () => {
    const manager = managerRef.current;
    if (!manager) return;
    const granted = await requestAndroidBlePermissions();
    setPermissionGranted(granted);
    if (!granted) {
      setScanError('Bluetooth permissions were denied.');
      return;
    }
    setScanError(null);
    setDevices(new Map());
    setIsScanning(true);
    manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        setScanError(error.message);
        setIsScanning(false);
        return;
      }
      if (device) upsertDevice(device);
    });
  }, [upsertDevice]);

  const stopScan = useCallback(() => {
    managerRef.current?.stopDeviceScan();
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      managerRef.current?.stopDeviceScan();
    };
  }, []);

  const sortedDevices = useMemo(() => {
    return Array.from(devices.values()).sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999));
  }, [devices]);

  if (!isNative) {
    return (
      <>
        <Stack.Screen options={{ title: 'BLE Scan' }} />
        <ScreenContainer>
          <UnsupportedState reason="Bluetooth Low Energy is only available on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  const adapterReady = bleState === 'PoweredOn';
  const canScan = adapterReady && permissionGranted;

  return (
    <>
      <Stack.Screen options={{ title: 'BLE Scan' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Adapter</ThemedText>
          <DataRow label="State" value={bleState} mono />
          <DataRow
            label="Description"
            value={bleState == null ? null : STATE_DESCRIPTIONS[bleState]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Scan</ThemedText>
          <DataRow label="Scanning" value={isScanning} />
          <DataRow label="Devices found" value={devices.size} />
          <DataRow label="Last error" value={scanError} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          {!isScanning ? (
            <ActionButton
              category="wireless"
              label="Start scan"
              subtitle={
                adapterReady
                  ? 'List nearby BLE devices for as long as the screen is open.'
                  : 'Enable Bluetooth in system settings before scanning.'
              }
              disabled={!adapterReady}
              onPress={startScan}
            />
          ) : (
            <ActionButton
              category="wireless"
              variant="secondary"
              label="Stop scan"
              onPress={stopScan}
            />
          )}
          {!canScan && Platform.OS === 'android' ? (
            <ActionButton
              category="wireless"
              variant="secondary"
              label="Request permissions"
              subtitle="Grant BLUETOOTH_SCAN and BLUETOOTH_CONNECT (Android 12+)."
              onPress={async () => {
                const granted = await requestAndroidBlePermissions();
                setPermissionGranted(granted);
              }}
            />
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Nearby devices</ThemedText>
          {sortedDevices.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              {isScanning ? 'Listening for advertisements…' : 'No devices yet. Start a scan.'}
            </ThemedText>
          ) : (
            <View
              style={[styles.list, { borderColor: theme.backgroundSelected }]}
              accessibilityRole="list">
              {sortedDevices.map((device) => (
                <View
                  key={device.id}
                  style={[styles.listRow, { borderBottomColor: theme.backgroundSelected }]}>
                  <View style={styles.deviceText}>
                    <ThemedText type="default" numberOfLines={1}>
                      {device.name ?? '(unnamed)'}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      numberOfLines={1}>
                      {device.id}
                    </ThemedText>
                  </View>
                  <ThemedText type="code">
                    {device.rssi != null ? `${device.rssi} dBm` : '—'}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
  list: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  deviceText: {
    flexShrink: 1,
    gap: Spacing.half,
  },
});
