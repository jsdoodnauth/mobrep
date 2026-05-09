import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

export default function HapticsScreen() {
  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Haptics' }} />
        <ScreenContainer>
          <UnsupportedState reason="Haptics are not available on web." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Haptics' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Impact</ThemedText>
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Light"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Medium"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Heavy"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Soft"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Rigid"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Notification</ThemedText>
          <ActionButton
            category="hardware"
            label="Success"
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Warning"
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Error"
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Selection</ThemedText>
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Selection feedback"
            onPress={() => Haptics.selectionAsync()}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
