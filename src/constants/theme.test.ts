import {
  CategoryDisplayOrder,
  CategoryMeta,
  CategoryPalette,
  Colors,
  Spacing,
} from './theme';

describe('Colors', () => {
  it('exposes the same token keys for light and dark', () => {
    expect(Object.keys(Colors.light).sort()).toEqual(Object.keys(Colors.dark).sort());
  });
});

describe('CategoryPalette', () => {
  const ids = Object.keys(CategoryMeta) as (keyof typeof CategoryMeta)[];

  it('covers every CategoryId with light + dark variants', () => {
    for (const id of ids) {
      expect(CategoryPalette[id]).toBeDefined();
      expect(CategoryPalette[id].light).toEqual(
        expect.objectContaining({ bg: expect.any(String), fg: expect.any(String), accent: expect.any(String) }),
      );
      expect(CategoryPalette[id].dark).toEqual(
        expect.objectContaining({ bg: expect.any(String), fg: expect.any(String), accent: expect.any(String) }),
      );
    }
  });

  it('uses 6-digit hex values for every color slot', () => {
    const hex = /^#[0-9A-Fa-f]{6}$/;
    for (const id of ids) {
      for (const variant of ['light', 'dark'] as const) {
        const palette = CategoryPalette[id][variant];
        expect(palette.bg).toMatch(hex);
        expect(palette.fg).toMatch(hex);
        expect(palette.accent).toMatch(hex);
      }
    }
  });
});

describe('CategoryDisplayOrder', () => {
  it('matches CategoryMeta keys in declaration order', () => {
    expect(CategoryDisplayOrder).toEqual(Object.keys(CategoryMeta));
  });
});

describe('Spacing', () => {
  it('keeps the named scale in ascending order', () => {
    const values = Object.values(Spacing);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });
});
