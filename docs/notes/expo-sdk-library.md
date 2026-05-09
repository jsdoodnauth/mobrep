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

> ⚠️ Most of these require a **bare/development build** (not Expo Go) since they include native modules. Use `npx expo run:android` / `npx expo run:ios` or EAS Build.

---

### 🗄️ Device & System Info

| Library | Description | Link |
|---|---|---|
| **react-native-device-info** | The most comprehensive device info library available — 80+ data points including unique device ID, device name, total/used disk space, total RAM, supported CPU ABIs, carrier name, power state, `isPinOrFingerprintSet`, `isTablet`, `getMaxMemory`, `getUsedMemory`, `getFreeDiskStorage`, `getAndroidId`, font scale, and much more. Goes significantly deeper than `expo-device`. | [npm](https://www.npmjs.com/package/react-native-device-info) / [GitHub](https://github.com/react-native-device-info/react-native-device-info) |
| **react-native-system-setting** | Read and write broad system-level settings — WiFi on/off, Bluetooth on/off, airplane mode, location services enabled/disabled, system volume, screen brightness — with a single unified API across iOS and Android. | [npm](https://www.npmjs.com/package/react-native-system-setting) / [GitHub](https://github.com/c19354837/react-native-system-setting) |
| **expo-system-info** (community) | Community Expo module surfacing additional Android-specific system properties directly from `SystemProperties` and the `Build` class (board, bootloader, display, fingerprint, hardware, product, tags). | [GitHub](https://github.com/jumpei00/expo-system-info) |

---

### 📶 Network & Connectivity

| Library | Description | Link |
|---|---|---|
| **@react-native-community/netinfo** | Detailed network state — connection type, is connected, is internet reachable, cellular generation (3G/4G/5G), WiFi SSID and BSSID, signal strength. Also available as an Expo-managed third-party package. | [npm](https://www.npmjs.com/package/@react-native-community/netinfo) / [GitHub](https://github.com/react-native-netinfo/react-native-netinfo) |
| **react-native-wifi-reborn** | Deep WiFi scanning — list all nearby networks with SSID, BSSID, signal strength (RSSI), frequency band (2.4GHz/5GHz), channel number, and security type. Also supports connecting to a WiFi network programmatically. Goes well beyond what NetInfo exposes. | [npm](https://www.npmjs.com/package/react-native-wifi-reborn) / [GitHub](https://github.com/JuanSeBestia/react-native-wifi-reborn) |
| **react-native-bluetooth-state-manager** | Read Bluetooth adapter power state (on/off/unauthorized/unsupported) and subscribe to state changes. Expo has no native BT state API. Lightweight — does not do BLE scanning, just state. | [npm](https://www.npmjs.com/package/react-native-bluetooth-state-manager) / [GitHub](https://github.com/mybigday/react-native-bluetooth-state-manager) |
| **react-native-ble-plx** | Full Bluetooth Low Energy (BLE) stack — scan for nearby BLE peripherals, read their advertisement data, RSSI signal strength, service/characteristic UUIDs. Great for showing "nearby BLE devices detected". | [npm](https://www.npmjs.com/package/react-native-ble-plx) / [GitHub](https://github.com/dotintent/react-native-ble-plx) |

---

### 🔌 Hardware & Interfaces

| Library | Description | Link |
|---|---|---|
| **react-native-nfc-manager** | NFC hardware access — check if the device has an NFC chip, check if NFC is enabled, and scan NFC tags (read NDEF records, tag type, tag ID). iOS and Android. | [npm](https://www.npmjs.com/package/react-native-nfc-manager) / [GitHub](https://github.com/revtel/react-native-nfc-manager) |
| **react-native-volume-manager** | Read and set the system audio volume across all streams (music, ring, notification, system), check silent/ringer mode state, and subscribe to volume change events. Fills a gap left by `expo-audio`. | [npm](https://www.npmjs.com/package/react-native-volume-manager) / [GitHub](https://github.com/hirbod/react-native-volume-manager) |

---

### 🔐 Permissions

| Library | Description | Link |
|---|---|---|
| **react-native-permissions** | The definitive unified permission API across iOS and Android — check, request, and open settings for every hardware permission (camera, microphone, location, contacts, bluetooth, motion & fitness, NFC, notifications, phone, sensors, face ID, health, etc.) in one consistent interface. Essential for any app that touches multiple hardware features. | [npm](https://www.npmjs.com/package/react-native-permissions) / [GitHub](https://github.com/zoontek/react-native-permissions) |

---

### 💾 Persistence (Bonus)

| Library | Description | Link |
|---|---|---|
| **@react-native-async-storage/async-storage** | Persist snapshots of device data readings across sessions — useful for logging sensor history or caching device info. | [Expo Docs](https://docs.expo.dev/versions/v54.0.0/sdk/async-storage) / [GitHub](https://github.com/react-native-async-storage/async-storage) |

---

## 🔬 Sensor-Leveraging Libraries

Libraries that sit *on top of* raw sensor hardware — they consume accelerometer, gyroscope, magnetometer, barometer, light, and proximity data and turn it into higher-level signals, gestures, orientation math, or animation drivers.

---

### 🗂️ Unified Sensor Wrappers

Higher-level APIs over the raw hardware — useful when you want one consistent interface rather than wiring up each sensor individually.

| Library | Sensors Used | Description | Link |
|---|---|---|---|
| **react-native-sensors** | Accelerometer, Gyroscope, Magnetometer, Barometer, Gravity | RxJS observable-based unified sensor API. Subscribe to any sensor as a reactive stream, set update intervals globally, and compose sensor streams together. Cleaner DX than using expo-sensors directly, especially for multi-sensor apps. | [npm](https://www.npmjs.com/package/react-native-sensors) / [GitHub](https://github.com/react-native-sensors/react-native-sensors) |
| **react-native-sensor-manager** | Accelerometer, Gyroscope, Magnetometer, Light, Proximity, Orientation, Step Counter, **Thermometer** | Android-only native module that talks directly to Android's `SensorManager`. Unlocks sensors not exposed by Expo or react-native-sensors — notably the **ambient thermometer** (CPU/environment temp), **proximity sensor** (distance in cm + isNear flag), and direct **orientation** (azimuth/pitch/roll) without fusion math. | [npm](https://www.npmjs.com/package/react-native-sensor-manager) / [GitHub](https://github.com/kprimice/react-native-sensor-manager) |

---

### 🔀 Sensor Fusion & Signal Processing

These take raw noisy sensor readings and combine or clean them into stable, meaningful output — essential if you're building anything that needs accurate 3D orientation.

| Library | Sensors Fused | Description | Link |
|---|---|---|---|
| **react-native-sensor-fusion** | Accelerometer + Gyroscope + Magnetometer | All-in-one React Native sensor fusion provider. Internally pipes `react-native-sensors` data through `kalmanjs` (noise reduction) then through the `ahrs` Madgwick/Mahony filter to produce stable heading, pitch, roll, and quaternion values. The easiest way to get accurate 3D orientation without building the pipeline yourself. | [npm](https://www.npmjs.com/package/react-native-sensor-fusion) / [GitHub](https://github.com/cawfree/react-native-sensor-fusion) |
| **ahrs** *(JS)* | Accelerometer + Gyroscope + Magnetometer | Standalone JavaScript implementation of the **Madgwick** and **Mahony** AHRS (Attitude and Heading Reference System) algorithms. Feed it raw gyro/accel/mag values at each tick and it outputs calibrated heading, pitch, and roll as Euler angles or a quaternion. Used internally by `react-native-sensor-fusion` but can be used standalone. | [npm](https://www.npmjs.com/package/ahrs) / [GitHub](https://github.com/Almende/ahrs) |
| **kalmanjs** *(JS)* | Any noisy sensor | Pure JavaScript **1D Kalman filter**. Apply to any single sensor axis to dramatically reduce noise. Great for smoothing barometer altitude readings, magnetometer compass jitter, or light sensor flickering before displaying values. | [npm](https://www.npmjs.com/package/kalmanjs) / [GitHub](https://github.com/wouterbulten/kalmanjs) |

> **How these fit together:** `react-native-sensors` reads raw hardware → `kalmanjs` removes noise per axis → `ahrs` fuses the cleaned accel+gyro+mag into stable 3D orientation. `react-native-sensor-fusion` wraps all three steps for you.

---

### 👆 Gesture & Event Detection

Libraries that interpret raw sensor streams as discrete events or recognizable gestures.

| Library | Sensor Used | Description | Link |
|---|---|---|---|
| **rn-shake** | Accelerometer | `useShake()` React hook — fires a callback when the device is shaken. Configurable threshold, update interval, minimum time between triggers, and whether to fire during or after the shake motion. Built on `react-native-sensors`. | [npm](https://www.npmjs.com/package/rn-shake) / [GitHub](https://github.com/naoufal/react-native-shake) |
| **react-native-compass-heading** | Magnetometer | Returns the device's **true north compass heading** in degrees (0–360°) and fires a listener whenever heading changes beyond a configurable threshold. Handles iOS/Android platform differences in magnetometer coordinate frames automatically. | [npm](https://www.npmjs.com/package/react-native-compass-heading) / [GitHub](https://github.com/Andy9FromSpace/react-native-compass-heading) |
| **react-native-proximity-sensor** | Proximity | Exposes the IR proximity sensor — returns raw distance value (cm), `maxRange`, and an `isNear` boolean. Fires events as objects move toward or away from the screen. | [npm](https://www.npmjs.com/package/react-native-proximity-sensor) / [GitHub](https://github.com/kibolho/react-native-proximity-sensor) |

---

### 🎨 Sensor-Driven Animation (Reanimated)

| Library | Sensors Exposed | Description | Link |
|---|---|---|---|
| **react-native-reanimated** `useAnimatedSensor` | Accelerometer, Gyroscope, Gravity, Magnetic Field, Rotation (Euler + Quaternion) | Built into Reanimated — `useAnimatedSensor(SensorType.GYROSCOPE)` gives you a **shared value** that updates on the UI thread directly, bypassing the JS bridge entirely. Use it to drive animations at 60–120fps in response to device tilt, rotation, or magnetic field changes with zero JS overhead. Supports full quaternion output for 3D rotation. | [Docs](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedSensor/) / [npm](https://www.npmjs.com/package/react-native-reanimated) |

> **Why this matters for your app:** If you want to visualize live sensor data with smooth animation (e.g. a 3D compass needle, tilt-responsive UI, gyroscope bubble level), `useAnimatedSensor` is the right tool — not `useState` + `useEffect` on a subscription, which will drop frames at high sample rates.

---

## 🤖 Advanced Android (& Cross-Platform) Capabilities

These libraries expose deeper platform intelligence — AR, real-time audio/visual analysis, on-device ML, activity recognition, and health data. Most require a **bare/dev build** and some require Android API 26+ or specific Google Play Services.

---

### 🥽 Augmented Reality (AR)

| Library | Platform | Description | Link |
|---|---|---|---|
| **@viro-community/react-viro** | Android (ARCore) / iOS (ARKit) | The most capable AR framework for React Native. Renders 3D objects, anchors content to surfaces, detects planes, and supports image tracking. Uses Google ARCore on Android. Requires a device with ARCore support. | [npm](https://www.npmjs.com/package/@viro-community/react-viro) / [GitHub](https://github.com/ViroCommunity/viro) |
| **react-native-vision-camera** | Android / iOS | Not strictly AR, but its **Frame Processors** API lets you run real-time per-frame logic on the camera feed — the foundation for camera-based AR overlays, pose tracking, and object detection without a full AR engine. Pairs with ML Kit plugins (see below). | [npm](https://www.npmjs.com/package/react-native-vision-camera) / [GitHub](https://github.com/mrousavy/react-native-vision-camera) |

> **ARCore device support:** Not all Android devices support ARCore. Check the [supported devices list](https://developers.google.com/ar/devices). Google Play Services for AR must also be installed.

---

### 🔊 Sound & Audio Analysis

| Library | Platform | Description | Link |
|---|---|---|---|
| **react-native-sound-level** | Android / iOS | Measures ambient sound level in **decibels (dB)** at a configurable polling rate. Simple and purpose-built — ideal for displaying a live microphone level meter. | [npm](https://www.npmjs.com/package/react-native-sound-level) / [GitHub](https://github.com/punarinta/react-native-sound-level) |
| **react-native-pitch-detector** | Android / iOS | Detects the dominant musical **pitch/frequency** from microphone input in real time. Returns note name and frequency in Hz. Useful for showing "what note is the room humming at". | [npm](https://www.npmjs.com/package/react-native-pitch-detector) / [GitHub](https://github.com/eddydarell/react-native-pitch-detector) |
| **react-native-live-audio-stream** | Android / iOS | Streams raw **PCM audio buffers** from the microphone in real time as base64 chunks. Gives you the raw waveform data — pair with a JS FFT library (e.g. `fft.js`) to do full frequency spectrum / waveform visualization. | [npm](https://www.npmjs.com/package/react-native-live-audio-stream) / [GitHub](https://github.com/xiph/react-native-live-audio-stream) |
| **fft.js** *(JS companion)* | Any | Pure JavaScript FFT implementation. Use alongside `react-native-live-audio-stream` to compute frequency bins from raw PCM buffers for a real-time spectrum analyzer display. | [npm](https://www.npmjs.com/package/fft.js) / [GitHub](https://github.com/indutny/fft.js) |

---

### 🏃 Motion & Activity Recognition

| Library | Platform | Description | Link |
|---|---|---|---|
| **react-native-activity-recognition** | Android (Google Activity Recognition API) / iOS (CMMotionActivityManager) | Detects **high-level physical activity** from sensor fusion — walking, running, cycling, driving, still, on foot, tilting, unknown. This is distinct from raw accelerometer data; it uses Google's on-device ML model to classify motion. Returns confidence levels per activity type. | [npm](https://www.npmjs.com/package/react-native-activity-recognition) / [GitHub](https://github.com/Daplie/react-native-activity-recognition) |

> **Note:** `expo-sensors` `Pedometer` covers step counting. `react-native-activity-recognition` goes higher-level — it classifies *what you're doing*, not just whether you're moving.

---

### 🧠 On-Device Machine Learning (Google ML Kit)

These libraries wrap **Google ML Kit** — on-device ML that runs entirely offline, no API key needed. All work on Android (and most on iOS too).

| Library | What it detects | Link |
|---|---|---|
| **@react-native-ml-kit/face-detection** | Faces in images/camera — bounding box, landmarks (eyes, nose, mouth), head euler angles, smile probability, eyes-open probability | [npm](https://www.npmjs.com/package/@react-native-ml-kit/face-detection) / [GitHub](https://github.com/a7medev/react-native-ml-kit) |
| **@react-native-ml-kit/object-detection** | Objects in images — detects and classifies objects (furniture, food, plants, etc.) with bounding boxes and confidence scores | [npm](https://www.npmjs.com/package/@react-native-ml-kit/object-detection) / [GitHub](https://github.com/a7medev/react-native-ml-kit) |
| **@react-native-ml-kit/text-recognition** | Text in images (OCR) — recognizes printed and handwritten text from camera or image input | [npm](https://www.npmjs.com/package/@react-native-ml-kit/text-recognition) / [GitHub](https://github.com/a7medev/react-native-ml-kit) |
| **@react-native-ml-kit/barcode-scanning** | Barcodes and QR codes — reads 1D/2D barcodes, returns raw value and format type | [npm](https://www.npmjs.com/package/@react-native-ml-kit/barcode-scanning) / [GitHub](https://github.com/a7medev/react-native-ml-kit) |
| **@react-native-ml-kit/image-labeling** | General scene labeling — returns a list of labels describing what's in an image (e.g. "sky", "person", "car") with confidence scores | [npm](https://www.npmjs.com/package/@react-native-ml-kit/image-labeling) / [GitHub](https://github.com/a7medev/react-native-ml-kit) |

> **Tip:** Combine `react-native-vision-camera` frame processors with ML Kit plugins for **real-time** (live camera feed) analysis rather than single-image analysis.

---

### ❤️ Health & Fitness Data

| Library | Platform | Description | Link |
|---|---|---|---|
| **react-native-health-connect** | Android 9+ (Health Connect API) | Read from Android's **Health Connect** platform — steps, heart rate, blood pressure, blood glucose, sleep sessions, calories burned, oxygen saturation, and more. This is the modern replacement for Google Fit on Android. Requires user permission grants per data type. | [npm](https://www.npmjs.com/package/react-native-health-connect) / [GitHub](https://github.com/matinzd/react-native-health-connect) |
| **react-native-google-fit** | Android (Google Fit API) | Access **Google Fit** historical and real-time health data — steps, weight, heart rate, sleep, workouts, nutrition. Google Fit is being deprecated in favour of Health Connect, but still widely used on older Android versions. | [npm](https://www.npmjs.com/package/react-native-google-fit) / [GitHub](https://github.com/StasDoskalenko/react-native-google-fit) |

> **Android API Note:** Health Connect requires Android 9+ (API 28+) with the Health Connect app installed. Full read/write access requires Android 14+ (API 34+).

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