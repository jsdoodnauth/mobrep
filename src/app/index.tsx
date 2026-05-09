import { StyleSheet, View } from 'react-native';

import { CategorySection } from '@/components/category-section';
import { DEV_CLIENT_DOT_COLOR } from '@/components/feature-tile';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { getFeaturesByCategory } from '@/constants/features';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const groups = getFeaturesByCategory();
  const theme = useTheme();

  return (
    <ScreenContainer scroll>
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: theme.textSecondary }]} />
          <ThemedText type="small" themeColor="textSecondary">
            External (non-Expo-SDK) library
          </ThemedText>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: DEV_CLIENT_DOT_COLOR }]} />
          <ThemedText type="small" themeColor="textSecondary">
            Requires a dev client (does not run in Expo Go)
          </ThemedText>
        </View>
      </View>
      {groups.map(([category, features]) => (
        <CategorySection key={category} category={category} features={features} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  legend: {
    gap: Spacing.half,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
