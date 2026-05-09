import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedScheme = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** OS-level scheme (regardless of override). null on web before hydration. */
  systemScheme: ColorSchemeName;
  /** Active scheme — what every tile/screen should render against. */
  scheme: ResolvedScheme;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  // Avoid SSR/hydration mismatches on web by treating the first render as light.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const value = useMemo<ThemeModeContextValue>(() => {
    const effectiveSystem = hydrated ? systemScheme : 'light';
    const scheme: ResolvedScheme =
      mode === 'system' ? (effectiveSystem === 'dark' ? 'dark' : 'light') : mode;
    return { mode, setMode, systemScheme, scheme };
  }, [mode, systemScheme, hydrated]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider');
  }
  return ctx;
}

/**
 * Read just the resolved scheme. Safe to call from anywhere inside the
 * provider tree; returns 'light' as a deterministic fallback if used
 * outside (e.g. in isolated jest renders).
 */
export function useResolvedScheme(): ResolvedScheme {
  const ctx = useContext(ThemeModeContext);
  return ctx?.scheme ?? 'light';
}
