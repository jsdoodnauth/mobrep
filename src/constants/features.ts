import { CategoryDisplayOrder, CategoryId } from '@/constants/theme';

export type FeaturePlatform = 'ios' | 'android' | 'web';

export type FeatureId =
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'barometer'
  | 'light-sensor'
  | 'device-motion'
  | 'pedometer'
  | 'device'
  | 'application'
  | 'constants'
  | 'battery'
  | 'cellular'
  | 'network'
  | 'localization'
  | 'haptics'
  | 'camera'
  | 'brightness'
  | 'local-authentication'
  | 'screen-orientation'
  | 'screen-capture'
  | 'keep-awake'
  | 'location'
  | 'audio'
  | 'status-bar'
  | 'navigation-bar'
  | 'system-ui'
  | 'tracking-transparency'
  | 'netinfo'
  | 'appearance'
  | 'async-storage'
  | 'device-info'
  | 'permissions'
  | 'bluetooth-state'
  | 'volume-manager'
  | 'shake'
  | 'mmkv'
  | 'system-info'
  | 'ble'
  | 'nfc'
  | 'wifi-scan';

export type Feature = {
  id: FeatureId;
  title: string;
  description: string;
  category: CategoryId;
  route: `/feature/${FeatureId}`;
  status: 'ready' | 'planned';
  /** True if the underlying package is not yet in package.json. */
  requiresInstall?: boolean;
  /** When set, screen renders UnsupportedState on platforms not in the list. */
  platforms?: readonly FeaturePlatform[];
  /** True if backed by a non-Expo-SDK package. Renders an indicator dot on the tile. */
  external?: boolean;
  /** npm package name. Surfaced on the detail screen header subtitle. */
  package?: string;
};

export const Features: readonly Feature[] = [
  // Sensors
  {
    id: 'accelerometer',
    title: 'Accelerometer',
    description: 'X/Y/Z device acceleration including gravity.',
    category: 'sensors',
    route: '/feature/accelerometer',
    status: 'ready',
  },
  {
    id: 'gyroscope',
    title: 'Gyroscope',
    description: 'Rotation rate around each axis in rad/s.',
    category: 'sensors',
    route: '/feature/gyroscope',
    status: 'ready',
  },
  {
    id: 'magnetometer',
    title: 'Magnetometer',
    description: 'Ambient magnetic field strength in microteslas.',
    category: 'sensors',
    route: '/feature/magnetometer',
    status: 'ready',
  },
  {
    id: 'barometer',
    title: 'Barometer',
    description: 'Atmospheric pressure and relative altitude.',
    category: 'sensors',
    route: '/feature/barometer',
    status: 'ready',
  },
  {
    id: 'light-sensor',
    title: 'Light Sensor',
    description: 'Ambient light level in lux.',
    category: 'sensors',
    route: '/feature/light-sensor',
    status: 'ready',
    platforms: ['android'],
  },
  {
    id: 'device-motion',
    title: 'Device Motion',
    description: 'Fused acceleration, rotation, and orientation.',
    category: 'sensors',
    route: '/feature/device-motion',
    status: 'ready',
  },
  {
    id: 'pedometer',
    title: 'Pedometer',
    description: 'Steps from the device step detector.',
    category: 'sensors',
    route: '/feature/pedometer',
    status: 'ready',
    platforms: ['ios', 'android'],
  },

  // Device Info
  {
    id: 'device',
    title: 'Device',
    description: 'Model, brand, OS, memory, and year class.',
    category: 'device-info',
    route: '/feature/device',
    status: 'ready',
  },
  {
    id: 'application',
    title: 'Application',
    description: 'Bundle ID, version, build, and install times.',
    category: 'device-info',
    route: '/feature/application',
    status: 'ready',
  },
  {
    id: 'constants',
    title: 'Constants',
    description: 'Expo session ID, manifest, and platform info.',
    category: 'device-info',
    route: '/feature/constants',
    status: 'ready',
  },
  {
    id: 'battery',
    title: 'Battery',
    description: 'Charge level, charging state, and low power mode.',
    category: 'device-info',
    route: '/feature/battery',
    status: 'ready',
  },
  {
    id: 'cellular',
    title: 'Cellular',
    description: 'Carrier, generation, and MCC/MNC codes.',
    category: 'device-info',
    route: '/feature/cellular',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'localization',
    title: 'Localization',
    description: 'Locale, region, timezone, and text direction.',
    category: 'device-info',
    route: '/feature/localization',
    status: 'ready',
  },

  // Hardware
  {
    id: 'haptics',
    title: 'Haptics',
    description: 'Trigger impact, notification, and selection feedback.',
    category: 'hardware',
    route: '/feature/haptics',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'camera',
    title: 'Camera',
    description: 'Front and back cameras and capture capabilities.',
    category: 'hardware',
    route: '/feature/camera',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'brightness',
    title: 'Brightness',
    description: 'Read and adjust the screen brightness level.',
    category: 'hardware',
    route: '/feature/brightness',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'local-authentication',
    title: 'Local Authentication',
    description: 'Biometric authentication with Face ID or fingerprint.',
    category: 'hardware',
    route: '/feature/local-authentication',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'screen-orientation',
    title: 'Screen Orientation',
    description: 'Read, lock, and unlock the device orientation.',
    category: 'hardware',
    route: '/feature/screen-orientation',
    status: 'ready',
  },
  {
    id: 'screen-capture',
    title: 'Screen Capture',
    description: 'Detect or prevent screenshots and screen recording.',
    category: 'hardware',
    route: '/feature/screen-capture',
    status: 'ready',
    platforms: ['ios', 'android'],
  },
  {
    id: 'keep-awake',
    title: 'Keep Awake',
    description: 'Prevent the screen from dimming or sleeping.',
    category: 'hardware',
    route: '/feature/keep-awake',
    status: 'ready',
  },

  // Location & Motion
  {
    id: 'location',
    title: 'Location',
    description: 'GPS coordinates, geocoding, and geofencing.',
    category: 'location-motion',
    route: '/feature/location',
    status: 'ready',
    platforms: ['ios', 'android'],
  },

  // Audio & Media
  {
    id: 'audio',
    title: 'Audio',
    description: 'Microphone, recording, and audio routing.',
    category: 'audio-media',
    route: '/feature/audio',
    status: 'ready',
    platforms: ['ios', 'android'],
  },

  // System & Display
  {
    id: 'status-bar',
    title: 'Status Bar',
    description: 'Status bar height, style, and visibility.',
    category: 'system-display',
    route: '/feature/status-bar',
    status: 'ready',
  },
  {
    id: 'navigation-bar',
    title: 'Navigation Bar',
    description: 'Android system navigation bar visibility and style.',
    category: 'system-display',
    route: '/feature/navigation-bar',
    status: 'ready',
    platforms: ['android'],
  },
  {
    id: 'system-ui',
    title: 'System UI',
    description: 'Root background color and edge-to-edge display.',
    category: 'system-display',
    route: '/feature/system-ui',
    status: 'ready',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Override the in-app light or dark theme.',
    category: 'system-display',
    route: '/feature/appearance',
    status: 'ready',
  },

  // Privacy
  {
    id: 'tracking-transparency',
    title: 'Tracking Transparency',
    description: 'iOS App Tracking Transparency permission state.',
    category: 'privacy',
    route: '/feature/tracking-transparency',
    status: 'ready',
    platforms: ['ios'],
  },

  // Network
  {
    id: 'network',
    title: 'Network',
    description: 'Connection type, IP address, and reachability.',
    category: 'network',
    route: '/feature/network',
    status: 'ready',
  },
  {
    id: 'netinfo',
    title: 'NetInfo',
    description: 'Cellular generation, WiFi SSID, and signal detail.',
    category: 'network',
    route: '/feature/netinfo',
    status: 'ready',
    external: true,
    package: '@react-native-community/netinfo',
  },

  // Wireless (external)
  {
    id: 'bluetooth-state',
    title: 'Bluetooth State',
    description: 'Adapter state and authorization changes.',
    category: 'wireless',
    route: '/feature/bluetooth-state',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-bluetooth-state-manager',
    platforms: ['ios', 'android'],
  },
  {
    id: 'ble',
    title: 'BLE Scan',
    description: 'Nearby Bluetooth Low Energy devices and RSSI.',
    category: 'wireless',
    route: '/feature/ble',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-ble-plx',
    platforms: ['ios', 'android'],
  },
  {
    id: 'nfc',
    title: 'NFC',
    description: 'Read NFC tag id, type, and technologies.',
    category: 'wireless',
    route: '/feature/nfc',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-nfc-manager',
    platforms: ['ios', 'android'],
  },
  {
    id: 'wifi-scan',
    title: 'WiFi Scan',
    description: 'Connected SSID, BSSID, RSSI, and frequency.',
    category: 'wireless',
    route: '/feature/wifi-scan',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-wifi-reborn',
    platforms: ['ios', 'android'],
  },

  // Storage (external)
  {
    id: 'async-storage',
    title: 'AsyncStorage',
    description: 'Persistent key/value snapshot and demo writes.',
    category: 'storage',
    route: '/feature/async-storage',
    status: 'ready',
    external: true,
    package: '@react-native-async-storage/async-storage',
  },
  {
    id: 'mmkv',
    title: 'MMKV',
    description: 'Fast synchronous key/value storage backed by JSI.',
    category: 'storage',
    route: '/feature/mmkv',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-mmkv',
    platforms: ['ios', 'android'],
  },

  // External — slot into existing categories
  {
    id: 'device-info',
    title: 'Device Info',
    description: 'Deeper device metadata: disk, RAM, ABIs, IDs.',
    category: 'device-info',
    route: '/feature/device-info',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-device-info',
  },
  {
    id: 'system-info',
    title: 'System Info',
    description: 'Android Build properties and SystemProperties.',
    category: 'device-info',
    route: '/feature/system-info',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'expo-system-info',
    platforms: ['android'],
  },
  {
    id: 'permissions',
    title: 'Permissions',
    description: 'Unified permission status board across iOS and Android.',
    category: 'privacy',
    route: '/feature/permissions',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-permissions',
    platforms: ['ios', 'android'],
  },
  {
    id: 'volume-manager',
    title: 'Volume',
    description: 'System volume, ringer mode, and live changes.',
    category: 'audio-media',
    route: '/feature/volume-manager',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-volume-manager',
    platforms: ['ios', 'android'],
  },
  {
    id: 'shake',
    title: 'Shake',
    description: 'Detect device shake gestures.',
    category: 'sensors',
    route: '/feature/shake',
    status: 'planned',
    requiresInstall: true,
    external: true,
    package: 'react-native-shake',
    platforms: ['ios', 'android'],
  },
];

export function getFeaturesByCategory(): readonly (readonly [CategoryId, readonly Feature[]])[] {
  return CategoryDisplayOrder.map((category) => {
    const items = Features.filter((feature) => feature.category === category);
    return [category, items] as const;
  }).filter(([, items]) => items.length > 0);
}

export function getFeature(id: FeatureId): Feature | undefined {
  return Features.find((feature) => feature.id === id);
}
