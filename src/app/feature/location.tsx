import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { DataRow } from '@/components/data-row';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { UnsupportedState } from '@/components/states';
import { Spacing } from '@/constants/theme';
import { formatDate, formatNumber } from '@/lib/format';

const ACCURACY_LABELS: Record<number, string> = {
  [Location.Accuracy.Lowest]: 'Lowest',
  [Location.Accuracy.Low]: 'Low',
  [Location.Accuracy.Balanced]: 'Balanced',
  [Location.Accuracy.High]: 'High',
  [Location.Accuracy.Highest]: 'Highest',
  [Location.Accuracy.BestForNavigation]: 'BestForNavigation',
};

export default function LocationScreen() {
  const [permission, requestPermission] = Location.useForegroundPermissions();
  const [services, setServices] = useState<boolean | null>(null);
  const [position, setPosition] = useState<Location.LocationObject | null>(null);
  const [watching, setWatching] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const stopWatch = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setWatching(false);
  }, []);

  useEffect(() => () => stopWatch(), [stopWatch]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Location.hasServicesEnabledAsync()
      .then(setServices)
      .catch(() => setServices(null));
  }, []);

  const fetchOnce = useCallback(async () => {
    const next = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setPosition(next);
  }, []);

  const startWatch = useCallback(async () => {
    stopWatch();
    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 2000, distanceInterval: 1 },
      (next) => setPosition(next),
    );
    subscriptionRef.current = sub;
    setWatching(true);
  }, [stopWatch]);

  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen options={{ title: 'Location' }} />
        <ScreenContainer>
          <UnsupportedState reason="expo-location is not exercised on web in this demo." />
        </ScreenContainer>
      </>
    );
  }

  if (!permission) {
    return (
      <>
        <Stack.Screen options={{ title: 'Location' }} />
        <ScreenContainer>
          <View />
        </ScreenContainer>
      </>
    );
  }

  if (!permission.granted) {
    return (
      <>
        <Stack.Screen options={{ title: 'Location' }} />
        <ScreenContainer scroll>
          <View style={styles.section}>
            <ThemedText type="subtitle">Permission</ThemedText>
            <DataRow label="Status" value={permission.status} />
            <DataRow label="Can ask again" value={permission.canAskAgain} />
          </View>
          <ActionButton
            category="location-motion"
            label={permission.canAskAgain ? 'Grant location access' : 'Permission denied'}
            subtitle={
              permission.canAskAgain
                ? 'Required to read GPS coordinates.'
                : 'Enable location for this app in system settings.'
            }
            onPress={requestPermission}
            disabled={!permission.canAskAgain}
          />
        </ScreenContainer>
      </>
    );
  }

  const coords = position?.coords;

  return (
    <>
      <Stack.Screen options={{ title: 'Location' }} />
      <ScreenContainer scroll>
        <View style={styles.section}>
          <ThemedText type="subtitle">Status</ThemedText>
          <DataRow label="Permission" value={permission.status} />
          <DataRow label="Location services" value={services} />
          <DataRow
            label="Last update"
            value={position ? formatDate(position.timestamp) : null}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Coordinates</ThemedText>
          <DataRow label="Latitude" value={formatNumber(coords?.latitude ?? null, 6)} mono />
          <DataRow label="Longitude" value={formatNumber(coords?.longitude ?? null, 6)} mono />
          <DataRow label="Altitude (m)" value={formatNumber(coords?.altitude ?? null, 1)} />
          <DataRow label="Accuracy (m)" value={formatNumber(coords?.accuracy ?? null, 1)} />
          <DataRow
            label="Altitude accuracy (m)"
            value={formatNumber(coords?.altitudeAccuracy ?? null, 1)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Motion</ThemedText>
          <DataRow label="Heading (°)" value={formatNumber(coords?.heading ?? null, 1)} />
          <DataRow label="Speed (m/s)" value={formatNumber(coords?.speed ?? null, 2)} />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Request</ThemedText>
          <DataRow label="Last request accuracy" value={ACCURACY_LABELS[Location.Accuracy.Balanced]} />
          <ActionButton
            category="location-motion"
            label="Read once"
            onPress={fetchOnce}
          />
          <ActionButton
            category="location-motion"
            variant="secondary"
            label={watching ? 'Stop watching' : 'Watch position'}
            onPress={watching ? stopWatch : startWatch}
          />
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.one },
});
