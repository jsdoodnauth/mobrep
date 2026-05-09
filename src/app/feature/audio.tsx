import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { formatDuration } from '@/lib/format';

type PermissionState = {
  granted: boolean | null;
  canAskAgain: boolean | null;
  status: string | null;
};

const INITIAL_PERMISSION: PermissionState = { granted: null, canAskAgain: null, status: null };

export default function AudioScreen() {
  const [permission, setPermission] = useState<PermissionState>(INITIAL_PERMISSION);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [lastUri, setLastUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    AudioModule.getRecordingPermissionsAsync()
      .then((status) =>
        setPermission({
          granted: status.granted,
          canAskAgain: status.canAskAgain,
          status: status.status,
        }),
      )
      .catch(() => setPermission(INITIAL_PERMISSION));
  }, []);

  const requestPermission = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    setPermission({
      granted: status.granted,
      canAskAgain: status.canAskAgain,
      status: status.status,
    });
    if (status.granted) {
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setLastUri(recorder.uri ?? null);
      await setAudioModeAsync({ allowsRecording: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Audio' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-audio recording is only exercised on iOS and Android in this demo." />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Audio' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Microphone permission</ThemedText>
          <DataRow label="Status" value={permission.status} />
          <DataRow label="Granted" value={permission.granted} />
          <DataRow label="Can ask again" value={permission.canAskAgain} />
        </View>

        {!permission.granted ? (
          <ActionButton
            category="audio-media"
            label={permission.canAskAgain === false ? 'Microphone blocked' : 'Grant microphone access'}
            subtitle={
              permission.canAskAgain === false
                ? 'Enable microphone for this app in system settings.'
                : 'Required to demo audio recording.'
            }
            onPress={requestPermission}
            disabled={permission.canAskAgain === false}
          />
        ) : (
          <>
            <View style={styles.section}>
              <ThemedText type="subtitle">Recorder</ThemedText>
              <DataRow label="Recording" value={recorderState.isRecording} />
              <DataRow
                label="Duration"
                value={formatDuration(Math.floor((recorderState.durationMillis ?? 0) / 1000))}
              />
              <DataRow
                label="Metering (dB)"
                value={
                  recorderState.metering == null ? null : recorderState.metering.toFixed(1)
                }
              />
              <DataRow label="Last clip" value={lastUri} mono />
              <DataRow label="Last error" value={error} />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle">Controls</ThemedText>
              <ActionButton
                category="audio-media"
                label={recorderState.isRecording ? 'Stop recording' : 'Start recording'}
                onPress={recorderState.isRecording ? stopRecording : startRecording}
              />
            </View>
          </>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
