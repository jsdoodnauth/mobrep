import * as LocalAuthentication from 'expo-local-authentication';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

const AUTH_TYPE_LABELS: Record<LocalAuthentication.AuthenticationType, string> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Fingerprint',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Face',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Iris',
};

const SECURITY_LABELS: Record<LocalAuthentication.SecurityLevel, string> = {
  [LocalAuthentication.SecurityLevel.NONE]: 'None',
  [LocalAuthentication.SecurityLevel.SECRET]: 'Passcode',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK]: 'Biometric (weak)',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG]: 'Biometric (strong)',
};

type Snapshot = {
  hasHardware: boolean | null;
  enrolled: boolean | null;
  level: LocalAuthentication.SecurityLevel | null;
  types: LocalAuthentication.AuthenticationType[];
};

const INITIAL: Snapshot = { hasHardware: null, enrolled: null, level: null, types: [] };

export default function LocalAuthenticationScreen() {
  const [snapshot, setSnapshot] = useState<Snapshot>(INITIAL);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [hasHardware, enrolled, level, types] = await Promise.all([
      LocalAuthentication.hasHardwareAsync().catch(() => null),
      LocalAuthentication.isEnrolledAsync().catch(() => null),
      LocalAuthentication.getEnrolledLevelAsync().catch(() => null),
      LocalAuthentication.supportedAuthenticationTypesAsync().catch(() => [] as LocalAuthentication.AuthenticationType[]),
    ]);
    setSnapshot({ hasHardware, enrolled, level, types });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    refresh();
  }, [refresh]);

  const authenticate = useCallback(async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Mobile Report',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    if (result.success) {
      setLastResult('Success');
    } else {
      setLastResult(`Failed: ${result.error ?? 'unknown'}`);
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Local Authentication' }} />
        <ScreenContainer>
          <UnsupportedState reason="Biometric authentication is not exposed on web." />
        </ScreenContainer>
      </>
    );
  }

  const typeLabels = snapshot.types.map((t) => AUTH_TYPE_LABELS[t]).join(', ') || null;

  return (
    <>
      <Stack.Screen options={{ title: 'Local Authentication' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Capability</ThemedText>
          <DataRow label="Has hardware" value={snapshot.hasHardware} />
          <DataRow label="Enrolled" value={snapshot.enrolled} />
          <DataRow
            label="Security level"
            value={snapshot.level == null ? null : SECURITY_LABELS[snapshot.level]}
          />
          <DataRow label="Supported types" value={typeLabels} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Last attempt</ThemedText>
          <DataRow label="Result" value={lastResult} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Actions</ThemedText>
          <ActionButton
            category="hardware"
            label="Authenticate"
            subtitle="Trigger the biometric prompt."
            onPress={authenticate}
            disabled={!snapshot.hasHardware || !snapshot.enrolled}
          />
          <ActionButton
            category="hardware"
            variant="secondary"
            label="Refresh capability"
            onPress={refresh}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
