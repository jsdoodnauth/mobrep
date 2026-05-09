import { useEffect, useState } from 'react';

export type SensorLike<T> = {
  isAvailableAsync?: () => Promise<boolean>;
  setUpdateInterval: (intervalMs: number) => void;
  addListener: (listener: (data: T) => void) => { remove: () => void };
};

export type SensorStreamState<T> = {
  data: T | null;
  available: boolean | null;
  error: Error | null;
};

/**
 * Subscribe to an expo-sensors-style stream.
 *
 * Sets up the update interval and listener on mount, tears them down on
 * unmount. `available` starts as `null` (unknown) and resolves to a boolean
 * once `isAvailableAsync` reports — sensors without that method are assumed
 * available. Errors are surfaced via the `error` field but never thrown.
 */
export function useSensorStream<T>(
  sensor: SensorLike<T>,
  intervalMs: number,
): SensorStreamState<T> {
  const [data, setData] = useState<T | null>(null);
  const [available, setAvailable] = useState<boolean | null>(
    sensor.isAvailableAsync ? null : true,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: { remove: () => void } | null = null;

    async function start() {
      try {
        if (sensor.isAvailableAsync) {
          const ok = await sensor.isAvailableAsync();
          if (cancelled) return;
          setAvailable(ok);
          if (!ok) return;
        }
        sensor.setUpdateInterval(intervalMs);
        subscription = sensor.addListener((value) => {
          if (cancelled) return;
          setData(value);
        });
      } catch (cause: unknown) {
        if (cancelled) return;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
        setAvailable(false);
      }
    }

    start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [sensor, intervalMs]);

  return { data, available, error };
}
