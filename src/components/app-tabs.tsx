import { BlurView } from '@react-native-community/blur';
import { Image } from 'expo-image';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BAR_RADIUS = 24;

type AndroidTabButtonProps = TabTriggerSlotProps & {
  icon: number;
  label: string;
};

const AndroidTabButton = forwardRef<View, AndroidTabButtonProps>(
  ({ icon, label, isFocused, onPress, onLongPress, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.buttonOuter}
        {...props}
      >
        <ThemedView
          type={isFocused ? 'backgroundSelected' : undefined}
          style={[
            styles.buttonInner,
            !isFocused && { backgroundColor: 'transparent' },
          ]}
        >
          <Image
            source={icon}
            style={styles.icon}
            tintColor={isFocused ? theme.text : theme.textSecondary}
            contentFit="contain"
          />
          <ThemedText
            themeColor={isFocused ? 'text' : 'textSecondary'}
            style={styles.label}
          >
            {label}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }
);

AndroidTabButton.displayName = 'AndroidTabButton';

const AndroidTabBar = forwardRef<View, ViewProps>(({ children, style, ...props }, ref) => {
  const colorScheme = useColorScheme();
  const blurType = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <View ref={ref} style={[styles.tabBar, style]} {...props}>
      <BlurView
        style={[StyleSheet.absoluteFill, styles.blur]}
        blurType={blurType}
        blurAmount={20}
        reducedTransparencyFallbackColor={colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0'}
      />
      {children}
    </View>
  );
});

AndroidTabBar.displayName = 'AndroidTabBar';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <AndroidTabBar
          style={{ paddingBottom: insets.bottom + Spacing.two }}
        >
          <TabTrigger name="index" href="/" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/home.png')}
              label="Home"
            />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Explore"
            />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <AndroidTabButton
              icon={require('@/assets/images/tabIcons/explore.png')}
              label="Settings"
            />
          </TabTrigger>
        </AndroidTabBar>
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
    marginHorizontal: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: BAR_RADIUS,
  },
  buttonOuter: {
    flex: 1,
    alignItems: 'center',
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.four,
    width: '100%',
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
