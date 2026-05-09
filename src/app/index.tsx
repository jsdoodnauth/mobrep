import { StyleSheet, View } from 'react-native';

import { CategorySection } from '@/components/category-section';
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
        <View style={[styles.legendDot, { backgroundColor: theme.textSecondary }]} />
        <ThemedText type="small" themeColor="textSecondary">
          Tiles with a dot are powered by external (non-Expo-SDK) libraries.
        </ThemedText>
      </View>
      {groups.map(([category, features]) => (
        <CategorySection key={category} category={category} features={features} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  legend: {
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
