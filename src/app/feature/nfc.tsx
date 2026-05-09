import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import NfcManager, { NfcTech, type TagEvent } from 'react-native-nfc-manager';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';

type NfcSnapshot = {
  supported: boolean | null;
  enabled: boolean | null;
};

export default function NfcScreen() {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const [snapshot, setSnapshot] = useState<NfcSnapshot>({ supported: null, enabled: null });
  const [reading, setReading] = useState(false);
  const [tag, setTag] = useState<TagEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const supported = await NfcManager.isSupported();
      const enabled = supported ? await NfcManager.isEnabled().catch(() => false) : false;
      setSnapshot({ supported, enabled });
    } catch {
      setSnapshot({ supported: false, enabled: false });
    }
  }, []);

  useEffect(() => {
    if (!isNative) return;
    let cancelled = false;
    (async () => {
      try {
        await NfcManager.start();
      } catch {
        // start can throw on devices without NFC; isSupported will reflect that.
      }
      if (!cancelled) await refresh();
    })();
    return () => {
      cancelled = true;
      NfcManager.cancelTechnologyRequest().catch(() => undefined);
    };
  }, [isNative, refresh]);

  const readTag = useCallback(async () => {
    setError(null);
    setReading(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const next = await NfcManager.getTag();
      setTag(next ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // User-cancelled scans surface as a generic error on iOS — mute the noisiest cases.
      if (!/cancelled|cancelled by user/i.test(message)) {
        setError(message);
      }
    } finally {
      await NfcManager.cancelTechnologyRequest().catch(() => undefined);
      setReading(false);
    }
  }, []);

  if (!isNative) {
    return (
      <>
        <Stack.Screen options={{ title: 'NFC' }} />
        <ScreenContainer>
          <UnsupportedState reason="NFC is only available on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  if (snapshot.supported === false) {
    return (
      <>
        <Stack.Screen options={{ title: 'NFC' }} />
        <ScreenContainer>
          <UnsupportedState reason="This device does not have an NFC chip." />
        </ScreenContainer>
      </>
    );
  }

  const techList = tag?.techTypes?.join(', ') ?? null;

  return (
    <>
      <Stack.Screen options={{ title: 'NFC' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Hardware</ThemedText>
          <DataRow label="Supported" value={snapshot.supported} />
          <DataRow label="Enabled" value={snapshot.enabled} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Last tag</ThemedText>
          <DataRow label="ID" value={tag?.id ?? null} mono />
          <DataRow label="Type" value={tag?.type ?? null} />
          <DataRow label="Technologies" value={techList} />
          <DataRow
            label="NDEF records"
            value={tag?.ndefMessage ? tag.ndefMessage.length : null}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Triggers</ThemedText>
          <ActionButton
            category="wireless"
            label={reading ? 'Hold a tag to the device…' : 'Read NFC tag'}
            subtitle={
              Platform.OS === 'ios'
                ? 'iOS shows a system scan sheet. Touch a tag to the top of the device.'
                : 'Touch an NFC tag to the back of the device.'
            }
            disabled={reading || snapshot.enabled === false}
            onPress={readTag}
          />
          <ActionButton
            category="wireless"
            variant="secondary"
            label="Refresh status"
            onPress={refresh}
          />
          {error ? (
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          ) : null}
          {snapshot.enabled === false ? (
            <ThemedText type="small" themeColor="textSecondary">
              NFC is supported but currently disabled in system settings.
            </ThemedText>
          ) : null}
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
