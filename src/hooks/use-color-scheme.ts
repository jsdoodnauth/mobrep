import { useResolvedScheme } from '@/hooks/use-theme-mode';

/**
 * Returns the active color scheme, honoring the in-app theme override
 * mounted by `ThemeModeProvider`. Components should read from here, not
 * from `react-native` directly, so the in-app toggle takes effect.
 */
export function useColorScheme() {
  return useResolvedScheme();
}
