import * as Cellular from 'expo-cellular';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/use-async-data';

const GENERATION_LABELS: Record<Cellular.CellularGeneration, string> = {
  [Cellular.CellularGeneration.UNKNOWN]: 'Unknown',
  [Cellular.CellularGeneration.CELLULAR_2G]: '2G',
  [Cellular.CellularGeneration.CELLULAR_3G]: '3G',
  [Cellular.CellularGeneration.CELLULAR_4G]: '4G',
  [Cellular.CellularGeneration.CELLULAR_5G]: '5G',
};

type CellFacts = {
  generation: Cellular.CellularGeneration | null;
  carrier: string | null;
  isoCountryCode: string | null;
  mobileCountryCode: string | null;
  mobileNetworkCode: string | null;
  allowsVoip: boolean | null;
};

async function loadCellFacts(): Promise<CellFacts> {
  const generation = await Cellular.getCellularGenerationAsync().catch(() => null);
  return {
    generation,
    carrier: Cellular.carrier ?? null,
    isoCountryCode: Cellular.isoCountryCode ?? null,
    mobileCountryCode: Cellular.mobileCountryCode ?? null,
    mobileNetworkCode: Cellular.mobileNetworkCode ?? null,
    allowsVoip: Cellular.allowsVoip ?? null,
  };
}

export default function CellularScreen() {
  const { data } = useAsyncData<CellFacts>(loadCellFacts);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Cellular' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-cellular is not available on the web." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Cellular' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Carrier</ThemedText>
          <DataRow label="Carrier" value={data?.carrier ?? null} />
          <DataRow
            label="Generation"
            value={data?.generation == null ? null : GENERATION_LABELS[data.generation]}
          />
          <DataRow label="VoIP allowed" value={data?.allowsVoip ?? null} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Codes</ThemedText>
          <DataRow label="ISO country" value={data?.isoCountryCode ?? null} mono />
          <DataRow label="Mobile country (MCC)" value={data?.mobileCountryCode ?? null} mono />
          <DataRow label="Mobile network (MNC)" value={data?.mobileNetworkCode ?? null} mono />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
