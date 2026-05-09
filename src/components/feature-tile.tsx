import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Feature } from '@/constants/features';
import { useCategoryPalette } from '@/hooks/use-category-palette';

export type FeatureTileProps = {
  feature: Feature;
  /** Optional override for the press handler. Defaults to navigating to feature.route. */
  onPress?: () => void;
};

export function FeatureTile({ feature, onPress }: FeatureTileProps) {
  const palette = useCategoryPalette(feature.category);
  const isPlanned = feature.status === 'planned';

  const handlePress = () => {
    if (isPlanned) return;
    if (onPress) {
      onPress();
      return;
    }
    // typedRoutes only knows about routes whose files exist; planned routes
    // are gated by isPlanned above, so by here the file is guaranteed.
    router.push(feature.route as Href);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isPlanned}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={`${feature.title}. ${feature.description}`}
      accessibilityState={{ disabled: isPlanned }}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: palette.bg, opacity: isPlanned ? 0.6 : pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.titleRow}>
        <ThemedText type="default" style={[styles.title, { color: palette.fg }]} numberOfLines={2}>
          {feature.title}
        </ThemedText>
        {isPlanned ? (
          <View style={[styles.pill, { backgroundColor: palette.accent }]}>
            <ThemedText type="small" style={[styles.pillLabel, { color: palette.bg }]}>
              Soon
            </ThemedText>
          </View>
        ) : null}
      </View>
      <ThemedText
        type="small"
        style={[styles.description, { color: palette.fg }]}
        numberOfLines={3}>
        {feature.description}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontWeight: '600',
    flexShrink: 1,
  },
  description: {
    opacity: 0.75,
  },
  pill: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  pillLabel: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 14,
  },
});
