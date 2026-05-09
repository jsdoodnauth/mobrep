import { CategoryDisplayOrder } from './theme';
import { Features, getFeature, getFeaturesByCategory } from './features';

describe('Features registry', () => {
  it('declares unique feature ids', () => {
    const ids = Features.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points each feature route at its own id', () => {
    for (const feature of Features) {
      expect(feature.route).toBe(`/feature/${feature.id}`);
    }
  });

  it('uses a known category for every feature', () => {
    for (const feature of Features) {
      expect(CategoryDisplayOrder).toContain(feature.category);
    }
  });

  it('has at least one ready feature so Phase 1 can demo navigation', () => {
    expect(Features.some((f) => f.status === 'ready')).toBe(true);
  });
});

describe('getFeaturesByCategory', () => {
  it('groups features by category in display order', () => {
    const grouped = getFeaturesByCategory();
    const orderedCategories = grouped.map(([category]) => category);
    const filteredDisplayOrder = CategoryDisplayOrder.filter((category) =>
      Features.some((f) => f.category === category),
    );
    expect(orderedCategories).toEqual(filteredDisplayOrder);
  });

  it('places every feature into exactly one group', () => {
    const grouped = getFeaturesByCategory();
    const collected = grouped.flatMap(([, items]) => items.map((f) => f.id));
    expect(collected.sort()).toEqual(Features.map((f) => f.id).sort());
  });

  it('only emits non-empty groups', () => {
    for (const [, items] of getFeaturesByCategory()) {
      expect(items.length).toBeGreaterThan(0);
    }
  });
});

describe('getFeature', () => {
  it('returns the feature for a known id', () => {
    expect(getFeature('device')?.title).toBe('Device');
  });

  it('returns undefined for an unknown id', () => {
    // @ts-expect-error — exercising the runtime fallback for invalid input.
    expect(getFeature('does-not-exist')).toBeUndefined();
  });
});
