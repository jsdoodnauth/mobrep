import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/unsupported-state';
import { Spacing } from '@/constants/theme';

const FACING_OPTIONS: readonly CameraType[] = ['back', 'front'];
const FLASH_OPTIONS: readonly FlashMode[] = ['off', 'auto', 'on'];

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Camera' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-camera is only exercised on iOS and Android in this demo." />
        </ScreenContainer>
      </>
    );
  }

  if (!cameraPermission) {
    return (
      <>
        <Stack.Screen options={{ title: 'Camera' }} />
        <ScreenContainer>
          <View />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Camera' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Permissions</ThemedText>
          <DataRow label="Camera" value={cameraPermission.status} />
          <DataRow label="Camera granted" value={cameraPermission.granted} />
          <DataRow label="Camera can ask again" value={cameraPermission.canAskAgain} />
          <DataRow label="Microphone" value={micPermission?.status ?? null} />
          <DataRow label="Microphone granted" value={micPermission?.granted ?? null} />
        </View>

        {!cameraPermission.granted ? (
          <ActionButton
            category="hardware"
            label={cameraPermission.canAskAgain ? 'Grant camera access' : 'Camera blocked'}
            subtitle={
              cameraPermission.canAskAgain
                ? 'Required to show the live preview.'
                : 'Enable camera for this app in system settings.'
            }
            onPress={requestCameraPermission}
            disabled={!cameraPermission.canAskAgain}
          />
        ) : (
          <>
            <View style={styles.section}>
              <ThemedText type="subtitle">Preview</ThemedText>
              <CameraView style={styles.preview} facing={facing} flash={flash} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Settings</ThemedText>
              <DataRow label="Facing" value={facing} />
              <DataRow label="Flash" value={flash} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Controls</ThemedText>
              <ActionButton
                category="hardware"
                label="Flip camera"
                subtitle={`Switch to ${facing === 'back' ? 'front' : 'back'}`}
                onPress={() =>
                  setFacing((current) => FACING_OPTIONS[(FACING_OPTIONS.indexOf(current) + 1) % FACING_OPTIONS.length])
                }
              />
              <ActionButton
                category="hardware"
                variant="secondary"
                label="Cycle flash"
                subtitle={`Currently: ${flash}`}
                onPress={() =>
                  setFlash((current) => FLASH_OPTIONS[(FLASH_OPTIONS.indexOf(current) + 1) % FLASH_OPTIONS.length])
                }
              />
              {!micPermission?.granted ? (
                <ActionButton
                  category="hardware"
                  variant="secondary"
                  label={
                    micPermission?.canAskAgain === false
                      ? 'Microphone blocked'
                      : 'Grant microphone access'
                  }
                  subtitle="Required for video recording with audio."
                  onPress={requestMicPermission}
                  disabled={micPermission?.canAskAgain === false}
                />
              ) : null}
            </View>
          </>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
  preview: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
});
