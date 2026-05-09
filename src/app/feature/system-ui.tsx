import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRESETS: { label: string; color: string }[] = [
  { label: 'Pastel mint', color: '#DCFCE7' },
  { label: 'Pastel rose', color: '#FCE7F3' },
  { label: 'Pastel sky', color: '#E0F2FE' },
];

export default function SystemUiScreen() {
  const theme = useTheme();
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    SystemUI.getBackgroundColorAsync().then((value) => {
      if (!cancelled) setColor(typeof value === 'string' ? value : null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const apply = async (next: string) => {
    await SystemUI.setBackgroundColorAsync(next);
    setColor(next);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'System UI' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Root background</ThemedText>
          <DataRow label="Current" value={color ?? '—'} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Presets</ThemedText>
          {PRESETS.map((preset) => (
            <ActionButton
              key={preset.color}
              category="system-display"
              variant="secondary"
              label={preset.label}
              subtitle={preset.color}
              onPress={() => apply(preset.color)}
            />
          ))}
          <ActionButton
            category="system-display"
            label="Reset to theme"
            onPress={() => apply(theme.background)}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
