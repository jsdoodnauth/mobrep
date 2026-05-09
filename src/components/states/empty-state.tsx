import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type EmptyStateProps = {
  message: string;
  title?: string;
};

export function EmptyState({ message, title = 'No data yet' }: EmptyStateProps) {
  return (
    <View style={styles.container} accessible accessibilityRole="text">
      <ThemedText type="subtitle" style={styles.text}>
        {title}
      </ThemedText>
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
