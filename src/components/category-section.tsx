import { StyleSheet, View } from 'react-native';

import { FeatureTile } from '@/components/feature-tile';
import { ThemedText } from '@/components/themed-text';
import {
  CategoryId,
  CategoryMeta,
  Spacing,
} from '@/constants/theme';
import type { Feature } from '@/constants/features';
import { useCategoryPalette } from '@/hooks/use-category-palette';

export type CategorySectionProps = {
  category: CategoryId;
  features: readonly Feature[];
};

export function CategorySection({ category, features }: CategorySectionProps) {
  const palette = useCategoryPalette(category);

  return (
    <View style={styles.section} accessibilityRole="header">
      <View style={styles.header}>
        <View style={[styles.accentBar, { backgroundColor: palette.accent }]} />
        <ThemedText type="subtitle">{CategoryMeta[category].label}</ThemedText>
      </View>
      <View style={styles.grid}>
        {features.map((feature, index) => {
          const isLeft = index % 2 === 0;
          return (
            <View key={feature.id} style={[styles.cell, isLeft ? styles.cellLeft : styles.cellRight]}>
              <FeatureTile feature={feature} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const GAP = Spacing.three;

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  accentBar: {
    width: 4,
    height: 28,
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: GAP,
  },
  cell: {
    width: '50%',
    flexDirection: 'row',
  },
  cellLeft: {
    paddingRight: GAP / 2,
  },
  cellRight: {
    paddingLeft: GAP / 2,
  },
});
