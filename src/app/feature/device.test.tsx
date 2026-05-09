import { render, screen } from '@testing-library/react-native';

import DeviceScreen from './device';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

jest.mock('expo-device', () => ({
  brand: 'Apple',
  manufacturer: 'Apple',
  modelName: 'iPhone 15 Pro',
  deviceName: 'Test Device',
  deviceYearClass: 2023,
  isDevice: true,
  osName: 'iOS',
  osVersion: '17.4',
  osBuildId: '21E219',
  osInternalBuildId: null,
  totalMemory: 6 * 1024 * 1024 * 1024,
  supportedCpuArchitectures: ['arm64'],
  DeviceType: { UNKNOWN: 0, PHONE: 1, TABLET: 2, DESKTOP: 3, TV: 4 },
  getDeviceTypeAsync: jest.fn().mockResolvedValue(1),
  getMaxMemoryAsync: jest.fn().mockResolvedValue(null),
  getUptimeAsync: jest.fn().mockResolvedValue(120000),
  isRootedExperimentalAsync: jest.fn().mockResolvedValue(false),
}));

describe('DeviceScreen', () => {
  it('renders identity, OS, and memory sections from expo-device', async () => {
    render(<DeviceScreen />);
    expect(await screen.findByText('Identity')).toBeTruthy();
    expect(screen.getByText('Operating system')).toBeTruthy();
    expect(screen.getByText('Memory & runtime')).toBeTruthy();
    expect(screen.getByLabelText('Brand: Apple')).toBeTruthy();
    expect(screen.getByLabelText('Manufacturer: Apple')).toBeTruthy();
    expect(screen.getByLabelText('Model: iPhone 15 Pro')).toBeTruthy();
    expect(screen.getByLabelText('OS name: iOS')).toBeTruthy();
    expect(screen.getByLabelText('OS version: 17.4')).toBeTruthy();
    expect(screen.getByLabelText('Total memory: 6.00 GB')).toBeTruthy();
    expect(await screen.findByLabelText('Type: Phone')).toBeTruthy();
  });
});
