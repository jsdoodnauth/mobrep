import { CategoryId, CategoryPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useCategoryPalette(category: CategoryId) {
  const scheme = useColorScheme();
  const variant = scheme === 'dark' ? 'dark' : 'light';
  return CategoryPalette[category][variant];
}
