import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ErrorState, LoadingState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/use-async-data';
import { formatBytes } from '@/lib/format';

const APP_PREFIX = 'mobrep:';
const DEMO_KEY = `${APP_PREFIX}demo`;
const SAMPLE_LIMIT = 5;

const PACKAGE_NAME = '@react-native-async-storage/async-storage';
const PACKAGE_VERSION: string | null = (() => {
  try {
    return (require('@react-native-async-storage/async-storage/package.json') as { version: string })
      .version;
  } catch {
    return null;
  }
})();

const BACKEND = Platform.select({
  android: 'SQLite (RKStorage)',
  ios: 'File-based dictionary (RCTAsyncStorage)',
  web: 'window.localStorage',
  default: 'Unknown',
});

type Snapshot = {
  totalKeys: number;
  appKeys: readonly string[];
  appBytes: number;
};

async function loadSnapshot(): Promise<Snapshot> {
  const allKeys = await AsyncStorage.getAllKeys();
  const appKeys = allKeys.filter((key) => key.startsWith(APP_PREFIX));
  const entries = appKeys.length > 0 ? await AsyncStorage.multiGet(appKeys) : [];
  const appBytes = entries.reduce((sum, [key, value]) => {
    return sum + key.length + (value?.length ?? 0);
  }, 0);
  return { totalKeys: allKeys.length, appKeys, appBytes };
}

export default function AsyncStorageScreen() {
  const { data, loading, error, refresh } = useAsyncData(loadSnapshot);

  const writeDemo = useCallback(async () => {
    const stamp = new Date().toISOString();
    await AsyncStorage.setItem(DEMO_KEY, stamp);
    refresh();
  }, [refresh]);

  const deleteDemo = useCallback(async () => {
    await AsyncStorage.removeItem(DEMO_KEY);
    refresh();
  }, [refresh]);

  const clearAppKeys = useCallback(async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const appKeys = allKeys.filter((key) => key.startsWith(APP_PREFIX));
    if (appKeys.length > 0) await AsyncStorage.multiRemove(appKeys);
    refresh();
  }, [refresh]);

  return (
    <>
      <Stack.Screen options={{ title: 'AsyncStorage' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Library</ThemedText>
          <DataRow label="Package" value={PACKAGE_NAME} mono />
          <DataRow label="Version" value={PACKAGE_VERSION} />
          <DataRow label="Backend" value={BACKEND} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Snapshot</ThemedText>
          {loading && data == null ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error.message} />
          ) : data ? (
            <>
              <DataRow label="Total keys" value={data.totalKeys} />
              <DataRow label={`App keys (${APP_PREFIX}*)`} value={data.appKeys.length} />
              <DataRow label="App keys size" value={formatBytes(data.appBytes)} />
              <DataRow
                label="Sample keys"
                value={
                  data.appKeys.length === 0
                    ? null
                    : data.appKeys.slice(0, SAMPLE_LIMIT).join(', ')
                }
                mono
              />
            </>
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Demo writes</ThemedText>
          <ActionButton
            category="storage"
            label="Write demo key"
            subtitle={DEMO_KEY}
            onPress={writeDemo}
          />
          <ActionButton
            category="storage"
            variant="secondary"
            label="Delete demo key"
            onPress={deleteDemo}
          />
          <ActionButton
            category="storage"
            variant="secondary"
            label={`Clear ${APP_PREFIX}* keys`}
            subtitle="Only removes keys with the app prefix; never calls clear()."
            onPress={clearAppKeys}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
