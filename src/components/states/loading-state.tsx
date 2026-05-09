import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container} accessible accessibilityRole="text" accessibilityLabel={message}>
      <ActivityIndicator color={theme.text} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  text: {
    textAlign: 'center',
  },
});
