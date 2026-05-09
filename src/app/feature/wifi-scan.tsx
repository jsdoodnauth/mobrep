import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import WifiManager, { type WifiEntry } from 'react-native-wifi-reborn';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Connected = {
  ssid: string | null;
  bssid: string | null;
  rssi: number | null;
  frequency: number | null;
  enabled: boolean | null;
};

const EMPTY_CONNECTED: Connected = {
  ssid: null,
  bssid: null,
  rssi: null,
  frequency: null,
  enabled: null,
};

async function safeCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function WifiScanScreen() {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const [connected, setConnected] = useState<Connected>(EMPTY_CONNECTED);
  const [networks, setNetworks] = useState<WifiEntry[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(Platform.OS !== 'android');
  const theme = useTheme();

  const refreshConnected = useCallback(async () => {
    if (!isNative) return;
    const [ssid, bssid, rssi, frequency, enabled] = await Promise.all([
      safeCall(() => WifiManager.getCurrentWifiSSID()),
      Platform.OS === 'android' ? safeCall(() => WifiManager.getBSSID()) : Promise.resolve(null),
      Platform.OS === 'android'
        ? safeCall(() => WifiManager.getCurrentSignalStrength())
        : Promise.resolve(null),
      Platform.OS === 'android'
        ? safeCall(() => WifiManager.getFrequency())
        : Promise.resolve(null),
      Platform.OS === 'android' ? safeCall(() => WifiManager.isEnabled()) : Promise.resolve(null),
    ]);
    setConnected({ ssid, bssid, rssi, frequency, enabled });
  }, [isNative]);

  useEffect(() => {
    refreshConnected();
  }, [refreshConnected]);

  const scan = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    setError(null);
    const granted = await requestLocationPermission();
    setLocationGranted(granted);
    if (!granted) {
      setError('Location permission was denied — required to scan Wi-Fi networks on Android.');
      return;
    }
    setScanning(true);
    try {
      const list = await WifiManager.loadWifiList();
      setNetworks(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setScanning(false);
    }
  }, []);

  if (!isNative) {
    return (
      <>
        <Stack.Screen options={{ title: 'WiFi Scan' }} />
        <ScreenContainer>
          <UnsupportedState reason="Wi-Fi APIs are only available on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  const sortedNetworks = networks
    ? [...networks].sort((a, b) => b.level - a.level)
    : null;

  return (
    <>
      <Stack.Screen options={{ title: 'WiFi Scan' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Connected network</ThemedText>
          <DataRow label="SSID" value={connected.ssid} />
          <DataRow label="BSSID" value={connected.bssid} mono />
          <DataRow
            label="Signal"
            value={connected.rssi != null ? `${connected.rssi} dBm` : null}
          />
          <DataRow
            label="Frequency"
            value={connected.frequency != null ? `${connected.frequency} MHz` : null}
          />
          {Platform.OS === 'android' ? (
            <DataRow label="Wi-Fi enabled" value={connected.enabled} />
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          <ActionButton
            category="wireless"
            variant="secondary"
            label="Refresh connection info"
            onPress={refreshConnected}
          />
          {Platform.OS === 'android' ? (
            <ActionButton
              category="wireless"
              label={scanning ? 'Scanning…' : 'Scan nearby networks'}
              subtitle={
                locationGranted
                  ? 'Lists nearby SSIDs with BSSID and signal strength.'
                  : 'Grant ACCESS_FINE_LOCATION to scan.'
              }
              disabled={scanning}
              onPress={scan}
            />
          ) : null}
          {error ? (
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Nearby networks</ThemedText>
          {Platform.OS === 'ios' ? (
            <ThemedText type="small" themeColor="textSecondary">
              iOS does not expose nearby Wi-Fi scans to apps. Connected SSID requires location
              permission and a configured entitlement.
            </ThemedText>
          ) : sortedNetworks == null ? (
            <ThemedText type="small" themeColor="textSecondary">
              No scan run yet. Tap “Scan nearby networks”.
            </ThemedText>
          ) : sortedNetworks.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              No networks found.
            </ThemedText>
          ) : (
            <View
              style={[styles.list, { borderColor: theme.backgroundSelected }]}
              accessibilityRole="list">
              {sortedNetworks.map((network, index) => (
                <View
                  key={`${network.BSSID}-${index}`}
                  style={[styles.listRow, { borderBottomColor: theme.backgroundSelected }]}>
                  <View style={styles.networkText}>
                    <ThemedText type="default" numberOfLines={1}>
                      {network.SSID || '(hidden)'}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                      {network.BSSID} · {network.frequency} MHz
                    </ThemedText>
                  </View>
                  <ThemedText type="code">{network.level} dBm</ThemedText>
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
  networkText: {
    flexShrink: 1,
    gap: Spacing.half,
  },
});
