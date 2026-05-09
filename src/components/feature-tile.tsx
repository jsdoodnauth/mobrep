import * as Haptics from 'expo-haptics';
import { type Href, router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Feature } from '@/constants/features';
import { useCategoryPalette } from '@/hooks/use-category-palette';

export type FeatureTileProps = {
  feature: Feature;
  /** Optional override for the press handler. Defaults to navigating to feature.route. */
  onPress?: () => void;
};

const PRESSED_SCALE = 0.96;
const PRESS_IN_DURATION_MS = 90;
const SPRING = { damping: 14, stiffness: 220 };

export function FeatureTile({ feature, onPress }: FeatureTileProps) {
  const palette = useCategoryPalette(feature.category);
  const isPlanned = feature.status === 'planned';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (isPlanned) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => undefined);
    if (onPress) {
      onPress();
      return;
    }
    router.push(feature.route as Href);
  };

  return (
    <Animated.View style={[styles.tileWrapper, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          if (isPlanned) return;
          scale.value = withTiming(PRESSED_SCALE, { duration: PRESS_IN_DURATION_MS });
        }}
        onPressOut={() => {
          if (isPlanned) return;
          scale.value = withSpring(1, SPRING);
        }}
        disabled={isPlanned}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`${feature.title}. ${feature.description}`}
        accessibilityState={{ disabled: isPlanned }}
        style={[styles.tile, { backgroundColor: palette.bg, opacity: isPlanned ? 0.6 : 1 }]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tileWrapper: {
    flex: 1,
    aspectRatio: 1,
  },
  tile: {
    flex: 1,
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
