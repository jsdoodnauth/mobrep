import * as Application from 'expo-application';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/use-async-data';
import { formatDate } from '@/lib/format';

type AppFacts = {
  installTime: number | null;
  lastUpdate: number | null;
  installReferrer: string | null;
  iosIdForVendor: string | null;
  androidId: string | null;
};

async function loadAppFacts(): Promise<AppFacts> {
  const facts: AppFacts = {
    installTime: null,
    lastUpdate: null,
    installReferrer: null,
    iosIdForVendor: null,
    androidId: null,
  };

  try {
    const installTime = await Application.getInstallationTimeAsync();
    facts.installTime = installTime instanceof Date ? installTime.getTime() : null;
  } catch {}

  if (Platform.OS === 'android') {
    try {
      const lastUpdate = await Application.getLastUpdateTimeAsync();
      facts.lastUpdate = lastUpdate instanceof Date ? lastUpdate.getTime() : null;
    } catch {}
    try {
      facts.installReferrer = await Application.getInstallReferrerAsync();
    } catch {}
    facts.androidId = Application.getAndroidId();
  }

  if (Platform.OS === 'ios') {
    try {
      facts.iosIdForVendor = await Application.getIosIdForVendorAsync();
    } catch {}
  }

  return facts;
}

export default function ApplicationScreen() {
  const { data } = useAsyncData<AppFacts>(loadAppFacts);

  return (
    <>
      <Stack.Screen options={{ title: 'Application' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Bundle</ThemedText>
          <DataRow label="Name" value={Application.applicationName} />
          <DataRow label="Bundle ID" value={Application.applicationId} mono />
          <DataRow label="Version" value={Application.nativeApplicationVersion} />
          <DataRow label="Build number" value={Application.nativeBuildVersion} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Install</ThemedText>
          <DataRow label="Installed" value={formatDate(data?.installTime)} />
          {Platform.OS === 'android' ? (
            <>
              <DataRow label="Last update" value={formatDate(data?.lastUpdate)} />
              <DataRow label="Install referrer" value={data?.installReferrer} mono />
            </>
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Identifier</ThemedText>
          {Platform.OS === 'ios' ? (
            <DataRow label="ID for vendor" value={data?.iosIdForVendor} mono />
          ) : null}
          {Platform.OS === 'android' ? (
            <DataRow label="Android ID" value={data?.androidId} mono />
          ) : null}
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
