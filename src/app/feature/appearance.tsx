import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { type ThemeMode, useThemeMode } from '@/hooks/use-theme-mode';

const MODE_LABELS: Record<ThemeMode, string> = {
  system: 'Match system',
  light: 'Light',
  dark: 'Dark',
};

const MODE_SUBTITLES: Record<ThemeMode, string> = {
  system: 'Follow the OS appearance setting.',
  light: 'Force the light palette.',
  dark: 'Force the dark palette.',
};

export default function AppearanceScreen() {
  const { mode, setMode, scheme, systemScheme } = useThemeMode();

  return (
    <>
      <Stack.Screen options={{ title: 'Appearance' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Status</ThemedText>
          <DataRow label="Mode" value={MODE_LABELS[mode]} />
          <DataRow label="Active scheme" value={scheme} />
          <DataRow label="OS scheme" value={systemScheme ?? null} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Choose</ThemedText>
          {(['system', 'light', 'dark'] as const).map((option) => (
            <ActionButton
              key={option}
              category="system-display"
              variant={mode === option ? 'primary' : 'secondary'}
              label={MODE_LABELS[option]}
              subtitle={MODE_SUBTITLES[option]}
              onPress={() => setMode(option)}
            />
          ))}
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          Choice is held in memory and resets when the app fully restarts.
        </ThemedText>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
  note: { textAlign: 'center', paddingHorizontal: Spacing.three },
});
