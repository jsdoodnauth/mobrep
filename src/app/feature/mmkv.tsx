import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { formatBytes } from '@/lib/format';

const APP_PREFIX = 'mobrep:';
const DEMO_KEY = `${APP_PREFIX}demo`;
const SAMPLE_LIMIT = 5;

const PACKAGE_NAME = 'react-native-mmkv';
const PACKAGE_VERSION: string | null = (() => {
  try {
    return (require('react-native-mmkv/package.json') as { version: string }).version;
  } catch {
    return null;
  }
})();

const storage: MMKV | null = (() => {
  try {
    return createMMKV({ id: 'mobrep' });
  } catch {
    return null;
  }
})();

type Snapshot = {
  totalKeys: number;
  appKeys: readonly string[];
  totalBytes: number;
};

function readSnapshot(): Snapshot {
  if (!storage) return { totalKeys: 0, appKeys: [], totalBytes: 0 };
  const allKeys = storage.getAllKeys();
  const appKeys = allKeys.filter((key) => key.startsWith(APP_PREFIX));
  return { totalKeys: allKeys.length, appKeys, totalBytes: storage.byteSize };
}

export default function MmkvScreen() {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => readSnapshot());
  const refresh = useCallback(() => setSnapshot(readSnapshot()), []);

  const writeDemo = useCallback(() => {
    storage?.set(DEMO_KEY, new Date().toISOString());
    refresh();
  }, [refresh]);

  const deleteDemo = useCallback(() => {
    storage?.remove(DEMO_KEY);
    refresh();
  }, [refresh]);

  const clearAppKeys = useCallback(() => {
    if (!storage) return;
    const allKeys = storage.getAllKeys();
    allKeys.filter((key) => key.startsWith(APP_PREFIX)).forEach((key) => storage.remove(key));
    refresh();
  }, [refresh]);

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'MMKV' }} />
        <ScreenContainer>
          <UnsupportedState reason="react-native-mmkv requires JSI and only runs on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  if (!storage) {
    return (
      <>
        <Stack.Screen options={{ title: 'MMKV' }} />
        <ScreenContainer>
          <UnsupportedState reason="MMKV failed to initialize. Are you running in a dev client (not Expo Go)?" />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'MMKV' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Library</ThemedText>
          <DataRow label="Package" value={PACKAGE_NAME} mono />
          <DataRow label="Version" value={PACKAGE_VERSION} />
          <DataRow label="Backend" value="JSI + MMKV (Tencent)" />
          <DataRow label="Instance ID" value="mobrep" mono />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Snapshot</ThemedText>
          <DataRow label="Total keys" value={snapshot.totalKeys} />
          <DataRow label={`App keys (${APP_PREFIX}*)`} value={snapshot.appKeys.length} />
          <DataRow label="Storage size" value={formatBytes(snapshot.totalBytes)} />
          <DataRow
            label="Sample keys"
            value={
              snapshot.appKeys.length === 0
                ? null
                : snapshot.appKeys.slice(0, SAMPLE_LIMIT).join(', ')
            }
            mono
          />
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
            subtitle="Only removes keys with the app prefix; never calls clearAll()."
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
