import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type WifiDetails = {
  ssid?: string | null;
  bssid?: string | null;
  strength?: number | null;
  ipAddress?: string | null;
  subnet?: string | null;
  frequency?: number | null;
  linkSpeed?: number | null;
};

type CellularDetails = {
  cellularGeneration?: string | null;
  carrier?: string | null;
};

function getWifi(state: NetInfoState | null): WifiDetails {
  if (state?.type === 'wifi' && state.details) {
    const d = state.details as WifiDetails;
    return {
      ssid: d.ssid ?? null,
      bssid: d.bssid ?? null,
      strength: d.strength ?? null,
      ipAddress: d.ipAddress ?? null,
      subnet: d.subnet ?? null,
      frequency: d.frequency ?? null,
      linkSpeed: d.linkSpeed ?? null,
    };
  }
  return {};
}

function getCellular(state: NetInfoState | null): CellularDetails {
  if (state?.type === 'cellular' && state.details) {
    const d = state.details as CellularDetails;
    return { cellularGeneration: d.cellularGeneration ?? null, carrier: d.carrier ?? null };
  }
  return {};
}

export default function NetInfoScreen() {
  const [state, setState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    let cancelled = false;
    NetInfo.fetch().then((value) => {
      if (!cancelled) setState(value);
    });
    const unsubscribe = NetInfo.addEventListener((value) => {
      if (!cancelled) setState(value);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const wifi = getWifi(state);
  const cellular = getCellular(state);

  return (
    <>
      <Stack.Screen options={{ title: 'NetInfo' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Connection</ThemedText>
          <DataRow label="Type" value={state?.type ?? null} />
          <DataRow label="Connected" value={state?.isConnected ?? null} />
          <DataRow label="Internet reachable" value={state?.isInternetReachable ?? null} />
          <DataRow label="WiFi enabled" value={state?.isWifiEnabled ?? null} />
        </View>

        {state?.type === 'wifi' ? (
          <View style={styles.section}>
            <ThemedText type="subtitle">WiFi</ThemedText>
            <DataRow label="SSID" value={wifi.ssid} />
            <DataRow label="BSSID" value={wifi.bssid} mono />
            <DataRow label="Signal strength" value={wifi.strength} />
            <DataRow label="IP address" value={wifi.ipAddress} mono />
            <DataRow label="Subnet" value={wifi.subnet} mono />
            <DataRow label="Frequency (MHz)" value={wifi.frequency} />
            <DataRow label="Link speed (Mbps)" value={wifi.linkSpeed} />
          </View>
        ) : null}

        {state?.type === 'cellular' ? (
          <View style={styles.section}>
            <ThemedText type="subtitle">Cellular</ThemedText>
            <DataRow label="Generation" value={cellular.cellularGeneration} />
            <DataRow label="Carrier" value={cellular.carrier} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
