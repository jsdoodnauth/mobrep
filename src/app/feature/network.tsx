import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/use-async-data';

type NetFacts = {
  type: Network.NetworkStateType | null;
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  ipAddress: string | null;
};

async function loadNetwork(): Promise<NetFacts> {
  const [state, ip] = await Promise.all([
    Network.getNetworkStateAsync().catch(() => null),
    Network.getIpAddressAsync().catch(() => null),
  ]);
  return {
    type: state?.type ?? null,
    isConnected: state?.isConnected ?? null,
    isInternetReachable: state?.isInternetReachable ?? null,
    ipAddress: ip,
  };
}

export default function NetworkScreen() {
  const { data, refresh } = useAsyncData<NetFacts>(loadNetwork);

  return (
    <>
      <Stack.Screen options={{ title: 'Network' }} />
      <ScreenContainer scroll onRefresh={refresh}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Connection</ThemedText>
          <DataRow label="Type" value={data?.type ?? null} />
          <DataRow label="Connected" value={data?.isConnected ?? null} />
          <DataRow label="Internet reachable" value={data?.isInternetReachable ?? null} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Address</ThemedText>
          <DataRow label="IP address" value={data?.ipAddress ?? null} mono />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
