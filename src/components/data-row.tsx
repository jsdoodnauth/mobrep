import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type DataRowValue = string | number | boolean | null | undefined;

export type DataRowProps = {
  label: string;
  value: DataRowValue;
  /** Render the value in monospace (good for IDs, hex, raw numbers). */
  mono?: boolean;
  testID?: string;
};

function formatValue(value: DataRowValue): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function DataRow({ label, value, mono, testID }: DataRowProps) {
  const theme = useTheme();
  const display = formatValue(value);

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${display}`}
      style={[styles.row, { borderBottomColor: theme.backgroundSelected }]}
      testID={testID}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText type={mono ? 'code' : 'default'} style={styles.value} numberOfLines={2}>
        {display}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
