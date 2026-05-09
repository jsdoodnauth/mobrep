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
  | 'netinfo';

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
};

export const Features: readonly Feature[] = [
  // Sensors
  {
    id: 'accelerometer',
    title: 'Accelerometer',
    description: 'X/Y/Z device acceleration including gravity.',
    category: 'sensors',
    route: '/feature/accelerometer',
    status: 'planned',
  },
  {
    id: 'gyroscope',
    title: 'Gyroscope',
    description: 'Rotation rate around each axis in rad/s.',
    category: 'sensors',
    route: '/feature/gyroscope',
    status: 'planned',
  },
  {
    id: 'magnetometer',
    title: 'Magnetometer',
    description: 'Ambient magnetic field strength in microteslas.',
    category: 'sensors',
    route: '/feature/magnetometer',
    status: 'planned',
  },
  {
    id: 'barometer',
    title: 'Barometer',
    description: 'Atmospheric pressure and relative altitude.',
    category: 'sensors',
    route: '/feature/barometer',
    status: 'planned',
  },
  {
    id: 'light-sensor',
    title: 'Light Sensor',
    description: 'Ambient light level in lux.',
    category: 'sensors',
    route: '/feature/light-sensor',
    status: 'planned',
    platforms: ['android'],
  },
  {
    id: 'device-motion',
    title: 'Device Motion',
    description: 'Fused acceleration, rotation, and orientation.',
    category: 'sensors',
    route: '/feature/device-motion',
    status: 'planned',
  },
  {
    id: 'pedometer',
    title: 'Pedometer',
    description: 'Steps from the device step detector.',
    category: 'sensors',
    route: '/feature/pedometer',
    status: 'planned',
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
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },
  {
    id: 'camera',
    title: 'Camera',
    description: 'Front and back cameras and capture capabilities.',
    category: 'hardware',
    route: '/feature/camera',
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },
  {
    id: 'brightness',
    title: 'Brightness',
    description: 'Read and adjust the screen brightness level.',
    category: 'hardware',
    route: '/feature/brightness',
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },
  {
    id: 'local-authentication',
    title: 'Local Authentication',
    description: 'Biometric authentication with Face ID or fingerprint.',
    category: 'hardware',
    route: '/feature/local-authentication',
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },
  {
    id: 'screen-orientation',
    title: 'Screen Orientation',
    description: 'Read, lock, and unlock the device orientation.',
    category: 'hardware',
    route: '/feature/screen-orientation',
    status: 'planned',
    requiresInstall: true,
  },
  {
    id: 'screen-capture',
    title: 'Screen Capture',
    description: 'Detect or prevent screenshots and screen recording.',
    category: 'hardware',
    route: '/feature/screen-capture',
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },
  {
    id: 'keep-awake',
    title: 'Keep Awake',
    description: 'Prevent the screen from dimming or sleeping.',
    category: 'hardware',
    route: '/feature/keep-awake',
    status: 'planned',
    requiresInstall: true,
  },

  // Location & Motion
  {
    id: 'location',
    title: 'Location',
    description: 'GPS coordinates, geocoding, and geofencing.',
    category: 'location-motion',
    route: '/feature/location',
    status: 'planned',
    requiresInstall: true,
  },

  // Audio & Media
  {
    id: 'audio',
    title: 'Audio',
    description: 'Microphone, recording, and audio routing.',
    category: 'audio-media',
    route: '/feature/audio',
    status: 'planned',
    requiresInstall: true,
    platforms: ['ios', 'android'],
  },

  // System & Display
  {
    id: 'status-bar',
    title: 'Status Bar',
    description: 'Status bar height, style, and visibility.',
    category: 'system-display',
    route: '/feature/status-bar',
    status: 'planned',
  },
  {
    id: 'navigation-bar',
    title: 'Navigation Bar',
    description: 'Android system navigation bar visibility and style.',
    category: 'system-display',
    route: '/feature/navigation-bar',
    status: 'planned',
    requiresInstall: true,
    platforms: ['android'],
  },
  {
    id: 'system-ui',
    title: 'System UI',
    description: 'Root background color and edge-to-edge display.',
    category: 'system-display',
    route: '/feature/system-ui',
    status: 'planned',
  },

  // Privacy
  {
    id: 'tracking-transparency',
    title: 'Tracking Transparency',
    description: 'iOS App Tracking Transparency permission state.',
    category: 'privacy',
    route: '/feature/tracking-transparency',
    status: 'planned',
    requiresInstall: true,
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
