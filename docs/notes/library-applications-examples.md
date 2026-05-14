# Library Applications & Examples
> Companion to `expo-sdk-library.md` — maps sensor libraries to real-world use cases, app ideas, and implementation notes.

---

## 📡 `react-native-sensor-manager` — Android SensorManager Deep Dive

Direct access to Android's `android.hardware.SensorManager`. Unlocks sensor types that Expo and react-native-sensors don't expose.

### What it exposes

| Sensor | Android Type | Notes |
|---|---|---|
| **Ambient Thermometer** | `TYPE_AMBIENT_TEMPERATURE` | Returns environment temperature in °C. **Most consumer phones do not have this chip** — present on some Samsung flagships and rugged/industrial Android devices. Always check availability before reading. |
| **Proximity** | `TYPE_PROXIMITY` | IR sensor. Returns raw distance (cm), `maxRange`, and `isNear` boolean. Most phones only return near/far rather than a true continuous distance. |
| **Light Sensor** | `TYPE_LIGHT` | Ambient lux value. Same data as `expo-sensors` LightSensor but available through the same unified manager interface as the other sensors below. |
| **Orientation** | `TYPE_ORIENTATION` | Pre-computed `azimuth` (compass heading), `pitch`, and `roll` delivered directly by Android — no fusion math required on your side. Useful for a simple compass or inclinometer without needing an AHRS pipeline. |
| **Step Counter** | `TYPE_STEP_COUNTER` | Hardware step chip. Unlike Expo's Pedometer (session-based), this returns a **cumulative step count since last device reboot**. Useful for comparing against a known baseline. |
| **Gravity Vector** | `TYPE_GRAVITY` | Separates gravitational force from linear acceleration. Tells you which way "down" is independently of device movement. Useful for tilt/inclination without motion noise. |
| **Accelerometer** | `TYPE_ACCELEROMETER` | Raw accelerometer including gravity. |
| **Gyroscope** | `TYPE_GYROSCOPE` | Raw rotation rate (rad/s). |
| **Magnetometer** | `TYPE_MAGNETIC_FIELD` | Raw magnetic field (μT). |

### Key advantage
This library is a thin JS wrapper over the native Android API. If Android adds a new `SensorManager` sensor type, it's often accessible here before any higher-level RN library supports it.

### Usage note
```js
import SensorManager from 'react-native-sensor-manager';

SensorManager.startThermometer(1000); // poll every 1000ms
DeviceEventEmitter.addListener('Thermometer', (data) => {
  console.log(data.temp); // °C — null on most devices
});

SensorManager.startProximity(100);
DeviceEventEmitter.addListener('Proximity', (data) => {
  console.log(data.isNear, data.value, data.maxRange);
});

SensorManager.startOrientation(100);
DeviceEventEmitter.addListener('Orientation', (data) => {
  console.log(data.azimuth, data.pitch, data.roll);
});
```

---

## 🔀 Sensor Fusion & Signal Processing — Applications

The fusion pipeline: `react-native-sensors` (raw data) → `kalmanjs` (noise removal) → `ahrs` (Madgwick/Mahony filter) → stable 3D orientation output.
`react-native-sensor-fusion` wraps all three steps.

### Applications

#### 🫧 Bubble Level / Spirit Level
Fuse accelerometer + gyroscope to show a bubble that sits at the low point of the screen. Without Kalman filtering the bubble jitters constantly on minor vibrations. With it, it feels glassy and physical.

**Libraries:** `react-native-sensor-fusion` + `react-native-reanimated`
**Output used:** Fused `roll` and `pitch` angles → map to X/Y offset of SVG circle

---

#### ✈️ Artificial Horizon / Attitude Indicator
A pilot-style instrument — a horizon line that stays level with the real world as you tilt the phone. Pitch tilts it up/down, roll rotates it. The Madgwick filter is what makes this stable under movement rather than drifting.

**Libraries:** `react-native-sensor-fusion` + `react-native-reanimated`
**Output used:** Euler angles `pitch` and `roll` → SVG horizon line transform

---

#### 🧭 Tilt-Compensated 3D Compass
Raw magnetometer heading is only accurate when the phone is held perfectly flat. The moment you tilt it, the heading drifts. AHRS fusion corrects for tilt using the accelerometer so the compass reads correctly at any physical angle.

**Libraries:** `react-native-sensor-fusion` (or `ahrs` standalone) + `react-native-compass-heading`
**Output used:** Fused `heading` in degrees → compass needle rotation

---

#### 🏃 Dead Reckoning / GPS-Free Positioning
Integrate accelerometer data over time to estimate movement distance and direction when GPS is unavailable (indoors, tunnels, underground). Without Kalman filtering, error accumulates too fast to be useful. With it, short-distance estimates become viable.

**Libraries:** `kalmanjs` + `expo-sensors` Accelerometer + `expo-location` (for GPS anchor point)
**Output used:** Filtered acceleration integrated twice → displacement vector

---

#### 🤸 Fall Detection
Detect a sudden large acceleration spike (the fall) followed by a period of near-stillness (lying on the ground). Raw accelerometer alone has too many false positives (dropping the phone, sitting down quickly). Kalman-filtered acceleration dramatically reduces false triggers.

**Libraries:** `kalmanjs` + `expo-sensors` Accelerometer
**Logic:** `|filtered_accel| > threshold` → start stillness timer → if still for Nms → trigger alert

---

#### ✋ 3D Gesture Pattern Recognition
Record a sequence of fused orientation values during a motion (e.g. draw a circle in the air, flick left, tilt and hold). Compare the time-series against stored templates using DTW (Dynamic Time Warping). This is how "draw a shape in the air" unlock gestures work.

**Libraries:** `react-native-sensor-fusion` + `dtw` (JS library for Dynamic Time Warping matching)
**Output used:** Quaternion sequence over time → pattern match score

---

#### ⛳ Sports Swing Analysis (Golf / Tennis)
Capture the full 3D arc of a swing as fused orientation over time, then compute metrics: swing plane angle, wrist rotation at impact, tempo (backswing time vs downswing time), follow-through symmetry.

**Libraries:** `react-native-sensor-fusion` + `react-native-sensors` (high-frequency sampling)
**Output used:** Full quaternion time-series at 100Hz → post-swing analytics

---

#### 🚶 Gait Analysis
Step counting is what Pedometer gives you. Gait analysis goes further — cadence, stride symmetry, vertical oscillation, and impact force patterns while walking or running. Relevant for fitness, physio, and sports science apps.

**Libraries:** `react-native-sensor-fusion` + `expo-sensors` Pedometer + `kalmanjs`
**Output used:** Fused accel + step events → per-stride metrics

---

## 📏 IR Proximity & Proximity-Adjacent Sensing

### The IR Proximity Sensor (`react-native-proximity-sensor`)

The built-in IR sensor fires a beam and measures reflection. Most phones return only a binary near/far value rather than true centimeter distance (the `maxRange` value tells you the sensor's spec; `value` may just be 0 or `maxRange` in practice).

#### Applications

| Use Case | How |
|---|---|
| **Pocket detection** | Combine: proximity `isNear` + light sensor (dark) + accelerometer (face-down orientation). All three together = reliably in pocket. Any one alone has too many false positives. |
| **Screen-off on face proximity** | Replicate the "screen off during a call" behaviour in your own app — useful if you're building a custom dialer or video call UI. |
| **Wave-to-wake / gesture trigger** | Detect hand waving over the screen (rapid near→far→near cycle) as a touchless gesture. Useful for accessibility features or hands-free modes. |
| **Face-down detection** | Proximity near + accelerometer showing screen facing floor → "phone is face down" state. Used for silencing notifications. |

---

### Proximity-Adjacent: Other Range/Nearness Technologies

| Technology | Library | Range | Accuracy | Notes |
|---|---|---|---|---|
| **IR Proximity** | `react-native-proximity-sensor` | 0–5cm | Binary (near/far) on most devices | Built into every phone |
| **NFC** | `react-native-nfc-manager` | 0–4cm | Tag present/absent | Requires NFC chip + enabled |
| **BLE RSSI Ranging** | `react-native-ble-plx` | 0–30m | ±2–5m (RSSI is noisy) | Useful for "is this device in the room" logic |
| **WiFi RSSI** | `react-native-wifi-reborn` | 0–50m+ | Very rough | Signal strength only, not true range |
| **UWB (Ultra-Wideband)** | `react-native-uwb` *(early stage)* | 0–10m | ±10cm | Only on select high-end Android + iPhone 11+. Powers AirDrop spatial awareness, Pixel Nearby Share. Library support still immature. |
| **GPS** | `expo-location` | Outdoor, any range | ±3–5m (consumer) | Not proximity but absolute position |

> **BLE RSSI note:** Signal strength is a very rough proxy for distance — walls, body blocking, and RF interference all affect it. Fine for "in the same room" but not for precise ranging. UWB is the answer for precision, but hardware support is limited.

---

## 🎨 Sensor-Driven Animation — Applications & Examples

All examples below use `react-native-reanimated` `useAnimatedSensor`. The key advantage: sensor values update **on the UI thread**, bypassing the JS bridge, so animations run at full 60–120fps without frame drops.

---

### 🪟 iOS-Style Parallax / Depth Effect
**Sensor:** Gyroscope (X/Y axes)
**What it looks like:** Background elements move slightly slower than foreground as you tilt the phone — creates an illusion of depth, like looking through a window. The effect Apple uses on the iOS home screen.

```js
const gyroscope = useAnimatedSensor(SensorType.GYROSCOPE);

const cardStyle = useAnimatedStyle(() => {
  const { x, y } = gyroscope.sensor.value;
  return {
    transform: [
      { translateX: x * 8 },  // bg layer
      { translateY: y * 8 },
    ],
  };
});
// Foreground layer uses a smaller multiplier (e.g. * 3)
// creating the depth separation
```

---

### 💧 Liquid / Mercury Simulation
**Sensor:** Accelerometer (gravity vector)
**What it looks like:** A blob of "liquid" that pools to the low corner of the screen as you tilt the phone. Add a physics spring for the slosh and settling effect.

```js
const accelerometer = useAnimatedSensor(SensorType.ACCELEROMETER);

const liquidStyle = useAnimatedStyle(() => {
  const { x, y } = accelerometer.sensor.value;
  return {
    transform: [
      { translateX: withSpring(-x * 40, { damping: 8 }) },
      { translateY: withSpring(y * 40,  { damping: 8 }) },
    ],
  };
});
```

---

### 🌐 Gyroscope Panorama Viewer
**Sensor:** Gyroscope (yaw axis)
**What it looks like:** A wide/360° image that pans automatically as you physically rotate the phone left and right. Feels like looking through a viewfinder.

**Approach:** Integrate gyroscope `z` (yaw) over time to track cumulative rotation angle. Map angle to `translateX` offset on a wide image. Add clamping for non-360 images.

---

### ⚽ Tilt-Controlled Ball / Physics Game
**Sensor:** Accelerometer (X/Y)
**What it looks like:** A ball rolls around the screen responding to gravity — tilt the phone and the ball rolls toward the low side. The ball bounces off screen edges.

```js
const accel = useAnimatedSensor(SensorType.ACCELEROMETER);

// In a worklet — runs on UI thread, no bridge
const ballStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: withSpring(accel.sensor.value.x * -60) },
      { translateY: withSpring(accel.sensor.value.y * 60) },
    ],
  };
});
```

---

### 🫧 Bubble Level
**Sensor:** Accelerometer (gravity vector)
**What it looks like:** A circular bubble inside a ring — the bubble moves to the high side of the ring as you tilt the phone, settling when level. Direct visual readout of `accel.x` and `accel.y`.

**Why Reanimated matters here:** At 60fps sensor polling, `useState` in JS causes re-renders that drop frames. `useAnimatedSensor` drives the bubble position directly on the UI thread — the bubble tracks your hand with zero perceptible lag.

---

### 💳 3D Card Tilt Effect
**Sensor:** Gyroscope (X/Y axes)
**What it looks like:** A card UI element (credit card, ID card, product card) that appears to have physical depth — it rotates subtly in 3D as you tilt the phone, catching imaginary light. Common in fintech, wallet, and product showcase apps.

```js
const gyro = useAnimatedSensor(SensorType.GYROSCOPE);

const cardStyle = useAnimatedStyle(() => {
  const { x, y } = gyro.sensor.value;
  return {
    transform: [
      { perspective: 600 },
      { rotateX: `${withSpring(x * 20)}deg` },
      { rotateY: `${withSpring(-y * 20)}deg` },
    ],
  };
});
```

---

### 💥 Shake-Triggered Particle Burst
**Sensor:** Accelerometer (via `rn-shake`)
**What it looks like:** A field of particles at rest. Shaking the phone sends them scattering with random velocities. They settle back using spring animations.

**Libraries:** `rn-shake` (trigger detection) + `react-native-reanimated` (per-particle spring animation)

```js
useShake(() => {
  // Fire N spring animations with randomized
  // target positions and delays
  particles.forEach((p) => {
    p.x.value = withSpring(Math.random() * screenWidth);
    p.y.value = withSpring(Math.random() * screenHeight);
  });
}, { threshold: 3 });
```

---

### 🧭 Compass Needle
**Sensor:** Magnetometer (via `react-native-compass-heading`)
**What it looks like:** An SVG compass needle that smoothly swings to the new heading as you rotate the phone, with a spring bounce as it settles. The spring config mimics the physical inertia of a real compass needle.

```js
// react-native-compass-heading gives heading in degrees
CompassHeading.start(3, ({ heading }) => {
  needleRotation.value = withSpring(heading, {
    damping: 12,
    stiffness: 80,
  });
});

const needleStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${needleRotation.value}deg` }],
}));
```

---

### 🌅 Artificial Horizon Line
**Sensor:** Fused pitch + roll (via `react-native-sensor-fusion`)
**What it looks like:** A horizontal line that represents the real-world horizon, staying level with the earth as you tilt the phone in any direction. Visually striking as a "here's what my sensors know" demo.

**Libraries:** `react-native-sensor-fusion` + `react-native-reanimated`
**Approach:** Map `pitch` to `translateY`, `roll` to `rotateZ`. The line stays aligned with true horizontal regardless of phone orientation.

---

### 📊 Live Sensor Waveform Visualizer
**Sensor:** Any (accelerometer, gyroscope, magnetometer)
**What it looks like:** A scrolling oscilloscope-style waveform showing live sensor values on X/Y/Z axes. The waveform scrolls left as new values arrive.

**Approach:** Maintain a fixed-size circular buffer of recent values. Render as an SVG `<polyline>` path. With Reanimated, update the path string on the UI thread to avoid React re-render overhead on every sample.

---

## 🗺️ Use Case → Library Map

Quick reference for "I want to build X, what do I reach for?"

| I want to build... | Primary library | Supporting library |
|---|---|---|
| Compass app | `react-native-compass-heading` | `react-native-reanimated` (needle animation) |
| Bubble level | `react-native-sensor-fusion` | `react-native-reanimated` (bubble position) |
| Shake to trigger something | `rn-shake` | — |
| Tilt-controlled game | `useAnimatedSensor` (Reanimated) | — |
| 360° panorama viewer | `useAnimatedSensor` (gyroscope) | — |
| Parallax depth effect | `useAnimatedSensor` (gyroscope) | — |
| 3D card tilt | `useAnimatedSensor` (gyroscope) | — |
| Fall detector | `expo-sensors` Accelerometer | `kalmanjs` |
| Indoor dead reckoning | `kalmanjs` + `expo-sensors` | `expo-location` (GPS anchor) |
| Artificial horizon | `react-native-sensor-fusion` | `react-native-reanimated` |
| Pocket detection | `react-native-proximity-sensor` | `expo-sensors` LightSensor + Accelerometer |
| Swing / gait analysis | `react-native-sensor-fusion` | `react-native-sensors` (100Hz sampling) |
| Metal detector | `expo-sensors` Magnetometer | `kalmanjs` (noise removal) |
| Ambient temperature readout | `react-native-sensor-manager` | Check availability first — most phones lack the chip |
| Proximity wave gesture | `react-native-proximity-sensor` | — |
| Live sensor waveform | `useAnimatedSensor` or `react-native-sensors` | `react-native-reanimated` |
| BLE device proximity | `react-native-ble-plx` | — |

---

*Companion to `expo-sdk-library.md` — Expo SDK v54.0.0*
