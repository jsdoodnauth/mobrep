import {
  addScreenshotListener,
  allowScreenCaptureAsync,
  preventScreenCaptureAsync,
} from 'expo-screen-capture';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

const TAG = 'mobrep-screen-capture';

export default function ScreenCaptureScreen() {
  const [prevented, setPrevented] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = addScreenshotListener(() => {
      setScreenshotCount((count) => count + 1);
    });
    return () => sub.remove();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Screen Capture' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-screen-capture is not supported on web." />
        </ScreenContainer>
      </>
    );
  }

  const prevent = async () => {
    await preventScreenCaptureAsync(TAG);
    setPrevented(true);
  };
  const allow = async () => {
    await allowScreenCaptureAsync(TAG);
    setPrevented(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Screen Capture' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">State</ThemedText>
          <DataRow label="Capture prevented" value={prevented} />
          <DataRow label="Screenshots this session" value={screenshotCount} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Actions</ThemedText>
          <ActionButton
            category="hardware"
            label={prevented ? 'Allow capture' : 'Prevent capture'}
            subtitle={
              prevented
                ? 'Screenshots and recordings are blocked while open'
                : 'Block screenshots and screen recording'
            }
            onPress={prevented ? allow : prevent}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Reset screenshot counter"
            onPress={() => setScreenshotCount(0)}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
