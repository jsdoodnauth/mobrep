import { render, screen, waitFor } from '@testing-library/react-native';

import BatteryScreen from '@/app/feature/battery';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

jest.mock('expo-battery', () => {
  const noop = { remove: jest.fn() };
  return {
    BatteryState: { UNKNOWN: 0, UNPLUGGED: 1, CHARGING: 2, FULL: 3 },
    getBatteryLevelAsync: jest.fn().mockResolvedValue(0.42),
    getBatteryStateAsync: jest.fn().mockResolvedValue(2),
    isLowPowerModeEnabledAsync: jest.fn().mockResolvedValue(false),
    addBatteryLevelListener: jest.fn(() => noop),
    addBatteryStateListener: jest.fn(() => noop),
    addLowPowerModeListener: jest.fn(() => noop),
  };
});

describe('BatteryScreen', () => {
  it('renders battery level, state, and low-power mode', async () => {
    render(<BatteryScreen />);
    await waitFor(() => expect(screen.getByLabelText('Level: 42%')).toBeTruthy());
    expect(screen.getByLabelText('State: Charging')).toBeTruthy();
    expect(screen.getByLabelText('Low power mode: No')).toBeTruthy();
  });
});
