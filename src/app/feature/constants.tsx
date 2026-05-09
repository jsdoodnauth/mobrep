import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function ConstantsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Constants' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Runtime</ThemedText>
          <DataRow label="Expo version" value={Constants.expoVersion} />
          <DataRow label="Execution env" value={Constants.executionEnvironment} />
          <DataRow label="App ownership" value={Constants.appOwnership} />
          <DataRow label="Is device" value={Constants.isDevice} />
          <DataRow label="Device name" value={Constants.deviceName} />
          <DataRow label="Session ID" value={Constants.sessionId} mono />
          <DataRow label="Installation ID" value={Constants.installationId} mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Native binary</ThemedText>
          <DataRow label="App version" value={Constants.nativeAppVersion} />
          <DataRow label="Build version" value={Constants.nativeBuildVersion} />
          <DataRow label="SDK version" value={Constants.expoConfig?.sdkVersion ?? null} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Manifest</ThemedText>
          <DataRow label="Slug" value={Constants.expoConfig?.slug ?? null} />
          <DataRow label="Scheme" value={String(Constants.expoConfig?.scheme ?? '—')} />
          <DataRow label="Orientation" value={Constants.expoConfig?.orientation ?? null} />
          <DataRow label="UI style" value={Constants.expoConfig?.userInterfaceStyle ?? null} />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
