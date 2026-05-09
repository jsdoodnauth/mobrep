import { setStatusBarHidden, setStatusBarStyle } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Style = 'auto' | 'inverted' | 'light' | 'dark';

export default function StatusBarScreen() {
  const insets = useSafeAreaInsets();
  const [hidden, setHidden] = useState(false);
  const [style, setStyle] = useState<Style>('auto');

  const toggleHidden = () => {
    const next = !hidden;
    setStatusBarHidden(next, 'fade');
    setHidden(next);
  };

  const applyStyle = (next: Style) => {
    setStatusBarStyle(next);
    setStyle(next);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Status Bar' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Layout</ThemedText>
          <DataRow label="Top inset" value={insets.top} />
          {Platform.OS === 'android' ? (
            <DataRow label="Native height" value={StatusBar.currentHeight ?? null} />
          ) : null}
          <DataRow label="Hidden" value={hidden} />
          <DataRow label="Style" value={style} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Actions</ThemedText>
          <ActionButton
            category="system-display"
            label={hidden ? 'Show status bar' : 'Hide status bar'}
            subtitle="Fades the bar in or out"
            onPress={toggleHidden}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Auto style"
            onPress={() => applyStyle('auto')}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Light style"
            onPress={() => applyStyle('light')}
          />
          <ActionButton
            category="system-display"
            variant="secondary"
            label="Dark style"
            onPress={() => applyStyle('dark')}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
