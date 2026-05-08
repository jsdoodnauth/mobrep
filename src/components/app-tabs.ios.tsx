import { GlassContainer, GlassView } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GlassTabButtonProps = TabTriggerSlotProps & {
  icon: ReturnType<typeof require>;
  label: string;
};

const GlassTabButton = forwardRef<View, GlassTabButtonProps>(
  ({ icon, label, isFocused, onPress, onLongPress, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';
    const theme = useTheme();

    return (
      <GlassView
        ref={ref}
        glassEffectStyle={isFocused ? 'regular' : 'clear'}
        isInteractive
        colorScheme={scheme}
        style={styles.glassButton}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.buttonInner}
          {...props}
        >
          <Image
            source={icon}
            style={styles.icon}
            tintColor={isFocused ? theme.text : theme.textSecondary}
            contentFit="contain"
          />
          <ThemedText
            type="small"
            themeColor={isFocused ? 'text' : 'textSecondary'}
            style={styles.label}
          >
            {label}
          </ThemedText>
        </Pressable>
      </GlassView>
    );
  }
);

GlassTabButton.displayName = 'GlassTabButton';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <GlassContainer
          spacing={8}
          style={[styles.tabBar, { paddingBottom: insets.bottom + Spacing.two }]}
        >
          <TabTrigger name="index" href="/" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/home.png')}
              label="Home"
            />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Explore"
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <GlassTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Settings"
            />
          </TabTrigger>
        </GlassContainer>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  glassButton: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
    flex: 1,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    gap: Spacing.half,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
  },
});
