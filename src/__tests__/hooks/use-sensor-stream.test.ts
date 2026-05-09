import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useSensorStream } from '@/hooks/use-sensor-stream';

function makeFakeSensor(opts: { available?: boolean | Promise<boolean> } = {}) {
  let listener: ((data: { x: number }) => void) | null = null;
  const remove = jest.fn();
  const sensor = {
    isAvailableAsync:
      opts.available === undefined
        ? undefined
        : jest.fn().mockResolvedValue(opts.available as boolean),
    setUpdateInterval: jest.fn(),
    addListener: jest.fn((cb: (data: { x: number }) => void) => {
      listener = cb;
      return { remove };
    }),
  };
  return {
    sensor,
    remove,
    emit: (value: { x: number }) => listener?.(value),
  };
}

describe('useSensorStream', () => {
  it('subscribes, applies the interval, and surfaces emitted values', async () => {
    const { sensor, emit } = makeFakeSensor({ available: true });
    const { result } = renderHook(() => useSensorStream(sensor, 100));

    await waitFor(() => expect(result.current.available).toBe(true));
    expect(sensor.setUpdateInterval).toHaveBeenCalledWith(100);

    act(() => emit({ x: 1.23 }));
    expect(result.current.data).toEqual({ x: 1.23 });
  });

  it('does not subscribe when the sensor is unavailable', async () => {
    const { sensor } = makeFakeSensor({ available: false });
    const { result } = renderHook(() => useSensorStream(sensor, 100));

    await waitFor(() => expect(result.current.available).toBe(false));
    expect(sensor.addListener).not.toHaveBeenCalled();
  });

  it('removes the subscription on unmount', async () => {
    const { sensor, remove } = makeFakeSensor({ available: true });
    const { unmount } = renderHook(() => useSensorStream(sensor, 100));

    await waitFor(() => expect(sensor.addListener).toHaveBeenCalled());
    unmount();
    expect(remove).toHaveBeenCalled();
  });

  it('assumes availability when isAvailableAsync is missing', async () => {
    const { sensor, emit } = makeFakeSensor();
    const { result } = renderHook(() => useSensorStream(sensor, 50));

    await waitFor(() => expect(sensor.addListener).toHaveBeenCalled());
    expect(result.current.available).toBe(true);
    act(() => emit({ x: 7 }));
    expect(result.current.data).toEqual({ x: 7 });
  });
});
