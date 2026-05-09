import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const TAG = 'mobrep-keep-awake-screen';

export default function KeepAwakeScreen() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      deactivateKeepAwake(TAG);
    };
  }, []);

  const enable = async () => {
    await activateKeepAwakeAsync(TAG);
    setActive(true);
  };
  const disable = () => {
    deactivateKeepAwake(TAG);
    setActive(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Keep Awake' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Status</ThemedText>
          <DataRow label="Active" value={active} />
          <DataRow label="Tag" value={TAG} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Actions</ThemedText>
          <ActionButton
            category="hardware"
            label={active ? 'Release keep awake' : 'Hold screen awake'}
            subtitle={
              active
                ? 'The screen can dim and sleep again'
                : 'The screen will not dim while this screen is open'
            }
            onPress={active ? disable : enable}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
