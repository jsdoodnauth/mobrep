import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CategoryId, Spacing } from '@/constants/theme';
import { useCategoryPalette } from '@/hooks/use-category-palette';

export type ActionButtonVariant = 'primary' | 'secondary';

export type ActionButtonProps = {
  label: string;
  onPress: () => void;
  /** Drives the pastel accent color. Defaults to the host screen's category. */
  category: CategoryId;
  subtitle?: string;
  variant?: ActionButtonVariant;
  disabled?: boolean;
  testID?: string;
};

export function ActionButton({
  label,
  onPress,
  category,
  subtitle,
  variant = 'primary',
  disabled,
  testID,
}: ActionButtonProps) {
  const palette = useCategoryPalette(category);
  const isPrimary = variant === 'primary';

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${label}. ${subtitle}` : label}
      accessibilityState={{ disabled: !!disabled }}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: palette.accent }
          : { backgroundColor: palette.bg, borderWidth: 1, borderColor: palette.accent },
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.body}>
        <ThemedText
          type="default"
          style={[styles.label, { color: isPrimary ? palette.onAccent : palette.fg }]}>
          {label}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            type="small"
            style={[
              styles.subtitle,
              { color: isPrimary ? palette.onAccent : palette.fg, opacity: 0.8 },
            ]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    minHeight: 56,
    justifyContent: 'center',
  },
  body: {
    gap: Spacing.half,
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
  subtitle: {},
});
