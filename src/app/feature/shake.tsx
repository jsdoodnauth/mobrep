import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import RNShake from 'react-native-shake';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/lib/format';

export default function ShakeScreen() {
  const [count, setCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<Date | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    const subscription = RNShake.addListener(() => {
      setCount((value) => value + 1);
      setLastEvent(new Date());
    });
    return () => subscription.remove();
  }, []);

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Shake' }} />
        <ScreenContainer>
          <UnsupportedState reason="Shake detection is only available on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Shake' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Events</ThemedText>
          <DataRow label="Total shakes" value={count} />
          <DataRow
            label="Last shake"
            value={lastEvent == null ? null : formatDate(lastEvent.getTime())}
            mono
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          <ActionButton
            category="sensors"
            variant="secondary"
            label="Reset counter"
            onPress={() => {
              setCount(0);
              setLastEvent(null);
            }}
          />
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          Shake the device side-to-side to fire an event. iOS triggers the same gesture used by
          React Native&apos;s dev menu, so this screen will also reflect dev-menu shakes.
        </ThemedText>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
