import { act, render, screen, waitFor } from '@testing-library/react-native';

import AccelerometerScreen from '@/app/feature/accelerometer';

let listener: ((value: { x: number; y: number; z: number }) => void) | null = null;

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    isAvailableAsync: jest.fn().mockResolvedValue(true),
    setUpdateInterval: jest.fn(),
    addListener: (cb: (value: { x: number; y: number; z: number }) => void) => {
      listener = cb;
      return { remove: jest.fn() };
    },
  },
}));

describe('AccelerometerScreen', () => {
  it('renders the X/Y/Z values from the sensor stream', async () => {
    render(<AccelerometerScreen />);

    await waitFor(() => expect(listener).not.toBeNull());
    act(() => listener?.({ x: 0.123, y: -0.456, z: 0.987 }));

    await waitFor(() => expect(screen.getByLabelText('X: 0.123')).toBeTruthy());
    expect(screen.getByLabelText('Y: -0.456')).toBeTruthy();
    expect(screen.getByLabelText('Z: 0.987')).toBeTruthy();
  });
});
