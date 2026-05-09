import { CategoryId, CategoryPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ActiveCategoryPalette = {
  bg: string;
  fg: string;
  accent: string;
  /**
   * Higher-contrast text color for use on top of `accent` (e.g. primary
   * ActionButton). In light mode the dark `fg` reads cleanly on the
   * medium accent; in dark mode the dark `bg` does.
   */
  onAccent: string;
};

export function useCategoryPalette(category: CategoryId): ActiveCategoryPalette {
  const scheme = useColorScheme();
  const variant = scheme === 'dark' ? 'dark' : 'light';
  const triple = CategoryPalette[category][variant];
  return {
    ...triple,
    onAccent: variant === 'light' ? triple.fg : triple.bg,
  };
}
