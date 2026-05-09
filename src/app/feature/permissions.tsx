import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type Permission,
  type PermissionStatus,
} from 'react-native-permissions';

import { ActionButton } from '@/components/action-button';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategoryPalette } from '@/hooks/use-category-palette';

type PermissionRow = { label: string; permission: Permission };

const IOS_PERMISSIONS: PermissionRow[] = [
  { label: 'Camera', permission: PERMISSIONS.IOS.CAMERA },
  { label: 'Microphone', permission: PERMISSIONS.IOS.MICROPHONE },
  { label: 'Location (when in use)', permission: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE },
  { label: 'Motion', permission: PERMISSIONS.IOS.MOTION },
  { label: 'Face ID', permission: PERMISSIONS.IOS.FACE_ID },
  { label: 'Bluetooth', permission: PERMISSIONS.IOS.BLUETOOTH },
  { label: 'Photo library', permission: PERMISSIONS.IOS.PHOTO_LIBRARY },
  { label: 'App Tracking', permission: PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY },
];

const ANDROID_PERMISSIONS: PermissionRow[] = [
  { label: 'Camera', permission: PERMISSIONS.ANDROID.CAMERA },
  { label: 'Microphone', permission: PERMISSIONS.ANDROID.RECORD_AUDIO },
  { label: 'Location (fine)', permission: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION },
  { label: 'Location (coarse)', permission: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION },
  { label: 'Activity recognition', permission: PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION },
  { label: 'Bluetooth scan', permission: PERMISSIONS.ANDROID.BLUETOOTH_SCAN },
  { label: 'Bluetooth connect', permission: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT },
  { label: 'Nearby Wi-Fi devices', permission: PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES },
];

const STATUS_LABELS: Record<PermissionStatus, string> = {
  [RESULTS.UNAVAILABLE]: 'Unavailable',
  [RESULTS.DENIED]: 'Denied',
  [RESULTS.LIMITED]: 'Limited',
  [RESULTS.GRANTED]: 'Granted',
  [RESULTS.BLOCKED]: 'Blocked',
};

function getPermissionList(): PermissionRow[] {
  if (Platform.OS === 'ios') return IOS_PERMISSIONS;
  if (Platform.OS === 'android') return ANDROID_PERMISSIONS;
  return [];
}

export default function PermissionsScreen() {
  const list = getPermissionList();
  const [statuses, setStatuses] = useState<Record<string, PermissionStatus>>({});
  const theme = useTheme();
  const palette = useCategoryPalette('privacy');

  const refreshAll = useCallback(async () => {
    const entries = await Promise.all(
      list.map(async ({ permission }) => {
        const status = await check(permission).catch(() => RESULTS.UNAVAILABLE as PermissionStatus);
        return [permission, status] as const;
      }),
    );
    setStatuses(Object.fromEntries(entries));
  }, [list]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleRequest = useCallback(
    async (permission: Permission) => {
      const status = statuses[permission];
      if (status === RESULTS.BLOCKED) {
        await openSettings('application').catch(() => undefined);
        return;
      }
      const next = await request(permission).catch(() => RESULTS.UNAVAILABLE as PermissionStatus);
      setStatuses((prev) => ({ ...prev, [permission]: next }));
    },
    [statuses],
  );

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <>
        <Stack.Screen options={{ title: 'Permissions' }} />
        <ScreenContainer>
          <UnsupportedState reason="react-native-permissions only runs on iOS and Android." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Permissions' }} />
      <ScreenContainer scroll>
        <ThemedText type="subtitle">Status board</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Unified view across the permissions surfaced by Phase 2 screens, plus the upcoming
          wireless features.
        </ThemedText>

        <View style={styles.list}>
          {list.map(({ label, permission }) => {
            const status = statuses[permission] ?? RESULTS.DENIED;
            const isGranted = status === RESULTS.GRANTED || status === RESULTS.LIMITED;
            const isUnavailable = status === RESULTS.UNAVAILABLE;
            const isBlocked = status === RESULTS.BLOCKED;
            return (
              <View
                key={permission}
                style={[styles.row, { borderBottomColor: theme.backgroundSelected }]}>
                <View style={styles.rowText}>
                  <ThemedText type="default">{label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {STATUS_LABELS[status]}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => handleRequest(permission)}
                  disabled={isUnavailable}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isBlocked
                      ? `${label}: open settings`
                      : isGranted
                        ? `${label}: request again`
                        : `${label}: request`
                  }
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: isUnavailable ? palette.bg : palette.accent,
                      opacity: isUnavailable ? 0.5 : pressed ? 0.85 : 1,
                    },
                  ]}>
                  <ThemedText
                    type="small"
                    style={[styles.buttonLabel, { color: palette.onAccent }]}>
                    {isBlocked ? 'Settings' : 'Request'}
                  </ThemedText>
                </Pressable>
              </View>
            );
          })}
        </View>

        <ActionButton
          category="privacy"
          variant="secondary"
          label="Refresh all"
          onPress={refreshAll}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flexShrink: 1,
    gap: Spacing.half,
  },
  button: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  buttonLabel: {
    fontWeight: '700',
  },
});
