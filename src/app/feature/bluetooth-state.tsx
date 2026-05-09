import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BluetoothStateManager,
  type BluetoothState,
} from 'react-native-bluetooth-state-manager';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';

const STATE_DESCRIPTIONS: Record<BluetoothState, string> = {
  PoweredOn: 'Adapter is on and ready to scan or connect.',
  PoweredOff: 'Adapter is off in system settings.',
  Resetting: 'Adapter is resetting.',
  Unauthorized: 'App is not authorized to use Bluetooth.',
  Unsupported: 'This device does not support Bluetooth.',
  Unknown: 'Adapter state is not yet known.',
};

export default function BluetoothStateScreen() {
  const [state, setState] = useState<BluetoothState | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    const unsubscribe = BluetoothStateManager.addListener((next) => {
      setState(next);
    }, true);
    return () => unsubscribe();
  }, []);

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Bluetooth State' }} />
        <ScreenContainer>
          <UnsupportedState reason="Bluetooth state is only available on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Bluetooth State' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Adapter</ThemedText>
          <DataRow label="State" value={state} mono />
          <DataRow
            label="Description"
            value={state == null ? null : STATE_DESCRIPTIONS[state]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          <ActionButton
            category="wireless"
            label="Open Bluetooth settings"
            subtitle="Jump to the system settings page for Bluetooth."
            onPress={() => BluetoothStateManager.openSettings().catch(() => undefined)}
          />
          <ActionButton
            category="wireless"
            variant="secondary"
            label="Request to enable"
            subtitle="Android shows a system prompt; iOS opens settings."
            onPress={() => BluetoothStateManager.requestToEnable().catch(() => undefined)}
          />
          <ActionButton
            category="wireless"
            variant="secondary"
            label="Request to disable"
            onPress={() => BluetoothStateManager.requestToDisable().catch(() => undefined)}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
