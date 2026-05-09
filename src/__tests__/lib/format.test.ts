import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
} from '@/lib/format';

describe('formatBytes', () => {
  it('returns null for null/undefined', () => {
    expect(formatBytes(null)).toBeNull();
    expect(formatBytes(undefined)).toBeNull();
  });

  it('uses GB above 1 GiB', () => {
    expect(formatBytes(6 * 1024 ** 3)).toBe('6.00 GB');
  });

  it('uses MB between 1 MiB and 1 GiB', () => {
    expect(formatBytes(512 * 1024 ** 2)).toBe('512 MB');
  });

  it('uses raw bytes below 1 KiB', () => {
    expect(formatBytes(512)).toBe('512 B');
  });
});

describe('formatDuration', () => {
  it('formats days/hours/minutes for long spans', () => {
    expect(formatDuration(2 * 86400 + 3 * 3600 + 5 * 60)).toBe('2d 3h 5m');
  });

  it('formats hours/minutes when < 1 day', () => {
    expect(formatDuration(3 * 3600 + 12 * 60)).toBe('3h 12m');
  });

  it('formats minutes/seconds when < 1 hour', () => {
    expect(formatDuration(75)).toBe('1m 15s');
  });

  it('returns null for null', () => {
    expect(formatDuration(null)).toBeNull();
  });
});

describe('formatPercent', () => {
  it('multiplies by 100 and appends %', () => {
    expect(formatPercent(0.42)).toBe('42%');
  });

  it('honors fractionDigits', () => {
    expect(formatPercent(0.4267, 1)).toBe('42.7%');
  });

  it('returns null for null', () => {
    expect(formatPercent(null)).toBeNull();
  });
});

describe('formatNumber', () => {
  it('rounds to the requested precision', () => {
    expect(formatNumber(1.23456, 2)).toBe('1.23');
  });

  it('returns null for null/NaN', () => {
    expect(formatNumber(null)).toBeNull();
    expect(formatNumber(NaN)).toBeNull();
  });
});
