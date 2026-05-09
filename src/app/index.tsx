import { CategorySection } from '@/components/category-section';
import { ScreenContainer } from '@/components/screen-container';
import { getFeaturesByCategory } from '@/constants/features';

export default function HomeScreen() {
  const groups = getFeaturesByCategory();

  return (
    <ScreenContainer scroll>
      {groups.map(([category, features]) => (
        <CategorySection key={category} category={category} features={features} />
      ))}
    </ScreenContainer>
  );
}
