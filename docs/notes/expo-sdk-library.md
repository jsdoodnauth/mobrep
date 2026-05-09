# Expo SDK v54 — Device Info & Sensors Library Reference

> SDK Reference base URL: https://docs.expo.dev/versions/v54.0.0/sdk/
> Target: Building an app that exposes as much device information and hardware capability as possible.

---

## 🔩 Sensors

Physical hardware sensors — read raw data streams from the device's onboard sensor suite.

| Library | Package | Description | Docs |
|---|---|---|---|
| **Accelerometer** | `expo-sensors` | Measures device acceleration on X/Y/Z axes (gravity included) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/accelerometer) |
| **Gyroscope** | `expo-sensors` | Measures device rotation rate around X/Y/Z axes (rad/s) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/gyroscope) |
| **Magnetometer** | `expo-sensors` | Measures ambient magnetic field strength on X/Y/Z axes (μT) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/magnetometer) |
| **Barometer** | `expo-sensors` | Measures atmospheric pressure (hPa) and relative altitude | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/barometer) |
| **LightSensor** | `expo-sensors` | Measures ambient light level in lux (Android only) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/light-sensor) |
| **DeviceMotion** | `expo-sensors` | Fused sensor — combines accelerometer + gyroscope + orientation into one stream | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/devicemotion) |
| **Pedometer** | `expo-sensors` | Step counter using the device's built-in step detector hardware | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/pedometer) |
| **Sensors (umbrella)** | `expo-sensors` | Overview page for all sensor packages under the `expo-sensors` umbrella | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/sensors) |

```bash
npx expo install expo-sensors
```

---

## 📱 Device Information

Libraries for reading static and runtime information about the physical device and OS.

| Library | Package | Description | Docs |
|---|---|---|---|
| **Device** | `expo-device` | Model name, brand, OS version, device type, total memory, year class, whether it's a real device or emulator | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/device) |
| **Application** | `expo-application` | App bundle ID, version, build number, install time, last update time, install referrer (Android) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/application) |
| **Constants** | `expo-constants` | Expo-specific constants: session ID, manifest info, `expoVersion`, platform details, `isDevice` flag | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/constants) |
| **Battery** | `expo-battery` | Battery level (0–1), charging state, low power mode, battery state change events | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/battery) |
| **Cellular** | `expo-cellular` | Carrier name, MCC/MNC codes, cellular generation (4G/5G), allows VoIP flag | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/cellular) |
| **Network** | `expo-network` | Network type (WiFi/cellular/none), IP address, subnet mask, is connected, is internet reachable | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/network) |
| **Localization** | `expo-localization` | Device locale, language codes, region, timezone, currency, text direction (LTR/RTL) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/localization) |

```bash
npx expo install expo-device expo-application expo-constants expo-battery expo-cellular expo-network expo-localization
```

---

## ⚡ Hardware Features & Triggers

Libraries that interact with or control specific hardware on the device.

| Library | Package | Description | Docs |
|---|---|---|---|
| **Haptics** | `expo-haptics` | **Vibration motor** — trigger impact feedback (light/medium/heavy), notification feedback, and selection feedback using the taptic engine | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/haptics) |
| **Camera** | `expo-camera` | Access front/back cameras, read device camera capabilities, take photos/video, scan barcodes | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/camera) |
| **Brightness** | `expo-brightness` | Read and set screen brightness (0–1), toggle auto-brightness mode | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/brightness) |
| **LocalAuthentication** | `expo-local-authentication` | Check for biometric hardware (Face ID, fingerprint, iris), authenticate using enrolled biometrics | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/local-authentication) |
| **ScreenOrientation** | `expo-screen-orientation` | Read current orientation (portrait/landscape), lock/unlock orientation, listen for changes | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/screen-orientation) |
| **ScreenCapture** | `expo-screen-capture` | Detect when a user takes a screenshot, optionally prevent screen capture | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/screen-capture) |
| **KeepAwake** | `expo-keep-awake` | Prevent the screen from dimming/sleeping while the app is active | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/keep-awake) |

> **Note on Haptics:** `expo-haptics` is your vibration motor library. It wraps iOS Core Haptics / Android VibrationEffect. Use `Haptics.impactAsync()`, `Haptics.notificationAsync()`, and `Haptics.selectionAsync()` to trigger physical feedback patterns.

```bash
npx expo install expo-haptics expo-camera expo-brightness expo-local-authentication expo-screen-orientation expo-screen-capture expo-keep-awake
```

---

## 📍 Location & Motion

| Library | Package | Description | Docs |
|---|---|---|---|
| **Location** | `expo-location` | GPS coordinates (lat/lng/altitude/accuracy/speed/heading), geocoding, geofencing, background location tracking | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/location) |

```bash
npx expo install expo-location
```

---

## 🔊 Audio & Media Hardware

| Library | Package | Description | Docs |
|---|---|---|---|
| **Audio** | `expo-audio` | Access the microphone, record audio, query audio mode and routing (speaker/headphone/bluetooth), set audio session category | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/audio) |

```bash
npx expo install expo-audio
```

---

## 🖥️ System UI & Display Info

| Library | Package | Description | Docs |
|---|---|---|---|
| **StatusBar** | `expo-status-bar` | Read and control the status bar height, style, visibility, and background color | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/status-bar) |
| **NavigationBar** | `expo-navigation-bar` | Read and control Android navigation bar visibility and style (Android only) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/navigation-bar) |
| **SystemUI** | `expo-system-ui` | Set the root background color, control edge-to-edge display, read system UI configuration | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/system-ui) |

```bash
npx expo install expo-status-bar expo-navigation-bar expo-system-ui
```

---

## 🔐 Privacy & Permissions

| Library | Package | Description | Docs |
|---|---|---|---|
| **TrackingTransparency** | `expo-tracking-transparency` | Check iOS App Tracking Transparency status — whether the user has permitted tracking (IDFA access) | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/tracking-transparency) |

```bash
npx expo install expo-tracking-transparency
```

---

## 🌐 Network (Third-Party — Expo Managed)

| Library | Package | Description | Docs |
|---|---|---|---|
| **NetInfo** | `@react-native-community/netinfo` | Detailed network state: connection type, is connected, is internet reachable, cellular generation, WiFi SSID, signal strength | [Link](https://docs.expo.dev/versions/v54.0.0/sdk/netinfo) |

```bash
npx expo install @react-native-community/netinfo
```

---

## 📦 External Libraries

These are not part of the Expo SDK but are widely used in the React Native ecosystem and complement the above perfectly.

| Library | Description | Link |
|---|---|---|
| **react-native-device-info** | The most comprehensive device info library — 80+ data points including unique device ID, device name, total/used disk space, total RAM, supported ABIs, carrier info, power state, pinOrFingerprintSet, and much more. Goes deeper than `expo-device`. | [npm](https://www.npmjs.com/package/react-native-device-info) / [GitHub](https://github.com/react-native-device-info/react-native-device-info) |
| **react-native-permissions** | Unified permission request and check API across iOS and Android — covers every hardware permission (camera, mic, location, contacts, bluetooth, motion, etc.) in one consistent interface. | [npm](https://www.npmjs.com/package/react-native-permissions) / [GitHub](https://github.com/zoontek/react-native-permissions) |
| **@react-native-community/netinfo** | (Listed above — also available standalone outside of Expo managed) Detailed WiFi/cellular network info. | [GitHub](https://github.com/react-native-netinfo/react-native-netinfo) |
| **react-native-bluetooth-state-manager** | Read Bluetooth adapter state (on/off/unauthorized) and listen for changes. Expo has no built-in BT state API. | [npm](https://www.npmjs.com/package/react-native-bluetooth-state-manager) / [GitHub](https://github.com/mybigday/react-native-bluetooth-state-manager) |
| **expo-system-info** (community) | Community module surfacing additional Android-specific system properties via `SystemProperties` and `Build` class. | [GitHub](https://github.com/jumpei00/expo-system-info) |
| **@react-native-async-storage/async-storage** | Useful for persisting snapshots of device data readings across sessions. | [Expo Docs](https://docs.expo.dev/versions/v54.0.0/sdk/async-storage) |

---

## 🗂️ Quick Install — Everything At Once

```bash
npx expo install \
  expo-sensors \
  expo-device \
  expo-application \
  expo-constants \
  expo-battery \
  expo-cellular \
  expo-network \
  expo-localization \
  expo-haptics \
  expo-camera \
  expo-brightness \
  expo-local-authentication \
  expo-screen-orientation \
  expo-screen-capture \
  expo-keep-awake \
  expo-location \
  expo-audio \
  expo-status-bar \
  expo-navigation-bar \
  expo-system-ui \
  expo-tracking-transparency \
  @react-native-community/netinfo
```

---

*Generated from Expo SDK v54.0.0 — https://docs.expo.dev/versions/v54.0.0/*