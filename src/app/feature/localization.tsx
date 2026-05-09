import * as Localization from 'expo-localization';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function LocalizationScreen() {
  const locales = Localization.getLocales();
  const calendars = Localization.getCalendars();
  const primary = locales[0];
  const calendar = calendars[0];

  return (
    <>
      <Stack.Screen options={{ title: 'Localization' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Primary locale</ThemedText>
          <DataRow label="Tag" value={primary?.languageTag ?? null} mono />
          <DataRow label="Language" value={primary?.languageCode ?? null} />
          <DataRow label="Region" value={primary?.regionCode ?? null} />
          <DataRow label="Currency" value={primary?.currencyCode ?? null} />
          <DataRow label="Currency symbol" value={primary?.currencySymbol ?? null} />
          <DataRow label="Decimal separator" value={primary?.decimalSeparator ?? null} mono />
          <DataRow label="Digit grouping" value={primary?.digitGroupingSeparator ?? null} mono />
          <DataRow label="RTL" value={primary?.textDirection === 'rtl'} />
          <DataRow label="Measurement" value={primary?.measurementSystem ?? null} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Calendar</ThemedText>
          <DataRow label="Calendar" value={calendar?.calendar ?? null} />
          <DataRow label="Time zone" value={calendar?.timeZone ?? null} />
          <DataRow label="24-hour" value={calendar?.uses24hourClock ?? null} />
          <DataRow label="First weekday" value={calendar?.firstWeekday ?? null} />
        </View>

        {locales.length > 1 ? (
          <View style={styles.section}>
            <ThemedText type="subtitle">All locales</ThemedText>
            {locales.map((locale, index) => (
              <DataRow
                key={`${locale.languageTag}-${index}`}
                label={`#${index + 1}`}
                value={locale.languageTag}
                mono
              />
            ))}
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
