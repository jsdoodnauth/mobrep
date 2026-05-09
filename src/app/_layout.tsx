import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { Colors, Fonts } from '@/constants/theme';
import { ThemeModeProvider, useResolvedScheme } from '@/hooks/use-theme-mode';

function RootStack() {
  const scheme = useResolvedScheme();
  const isDark = scheme === 'dark';
  const palette = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
          headerTitleStyle: { fontFamily: Fonts.rounded, fontWeight: '600' },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: palette.background },
          animation: 'slide_from_right',
          animationDuration: 220,
        }}>
        <Stack.Screen name="index" options={{ title: 'Mobile Report' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <RootStack />
    </ThemeModeProvider>
  );
}
