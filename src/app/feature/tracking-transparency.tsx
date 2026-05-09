import {
  getAdvertisingId,
  getTrackingPermissionsAsync,
  isAvailable,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';

type Snapshot = {
  status: string | null;
  granted: boolean | null;
  canAskAgain: boolean | null;
  available: boolean | null;
  advertisingId: string | null;
};

const INITIAL: Snapshot = {
  status: null,
  granted: null,
  canAskAgain: null,
  available: null,
  advertisingId: null,
};

export default function TrackingTransparencyScreen() {
  const [snapshot, setSnapshot] = useState<Snapshot>(INITIAL);

  const refresh = useCallback(async () => {
    const available = isAvailable();
    if (!available) {
      setSnapshot({ ...INITIAL, available: false });
      return;
    }
    const status = await getTrackingPermissionsAsync();
    setSnapshot({
      status: status.status,
      granted: status.granted,
      canAskAgain: status.canAskAgain,
      available,
      advertisingId: status.granted ? getAdvertisingId() ?? null : null,
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    refresh();
  }, [refresh]);

  const requestPermission = useCallback(async () => {
    const status = await requestTrackingPermissionsAsync();
    setSnapshot({
      status: status.status,
      granted: status.granted,
      canAskAgain: status.canAskAgain,
      available: isAvailable(),
      advertisingId: status.granted ? getAdvertisingId() ?? null : null,
    });
  }, []);

  if (Platform.OS !== 'ios') {
    return (
      <>
        <Stack.Screen options={{ title: 'Tracking Transparency' }} />
        <ScreenContainer>
          <UnsupportedState reason="App Tracking Transparency only exists on iOS." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Tracking Transparency' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Capability</ThemedText>
          <DataRow label="Prompt available" value={snapshot.available} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Permission</ThemedText>
          <DataRow label="Status" value={snapshot.status} />
          <DataRow label="Granted" value={snapshot.granted} />
          <DataRow label="Can ask again" value={snapshot.canAskAgain} />
          <DataRow label="Advertising ID" value={snapshot.advertisingId} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Actions</ThemedText>
          <ActionButton
            category="privacy"
            label={
              snapshot.canAskAgain === false ? 'Tracking blocked' : 'Request tracking permission'
            }
            subtitle={
              snapshot.canAskAgain === false
                ? 'Enable in Settings → Privacy & Security → Tracking.'
                : 'iOS shows the App Tracking Transparency prompt.'
            }
            onPress={requestPermission}
            disabled={snapshot.canAskAgain === false || snapshot.available === false}
          />
          <ActionButton
            category="privacy"
            variant="secondary"
            label="Refresh status"
            onPress={refresh}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
