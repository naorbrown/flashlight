# Flashlight

A dead-simple flashlight app for iOS and Android. Full-screen colored light with swipe-to-dim and hardware torch toggle.

Built with [Expo](https://expo.dev), [NativeWind](https://www.nativewind.dev), and [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).

## Features

- **Colored screen light** — 10 colors including warm white, red (night vision safe), and more
- **Swipe to dim** — drag up/down anywhere on screen to control brightness
- **Hardware torch** — tap to toggle the phone's LED flashlight
- **Zero UI chrome** — fullscreen, no headers, no nav bars, just light

## How It Works

| Feature | Mechanism |
|---------|-----------|
| Screen flashlight | Full-screen `View` with selected background color |
| Brightness control | `expo-brightness` sets actual screen brightness (0.1–1.0) |
| Hardware torch | `expo-camera` `CameraView` with `enableTorch` (hidden 1x1px) |
| Swipe gesture | `react-native-gesture-handler` Pan gesture + Reanimated |
| Styling | NativeWind (Tailwind CSS for React Native) |

> **Note:** The phone's LED torch is always white — it doesn't support colors. The "colored flashlight" is the phone screen at max brightness. Both the screen light and hardware torch work together.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) app on your phone (for testing on device)
- Physical device required for hardware torch (simulators don't have an LED)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/naorbrown/flashlight.git
cd flashlight

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then scan the QR code with **Expo Go** on your phone.

## Usage

| Action | What it does |
|--------|-------------|
| **Swipe up** | Increase screen brightness |
| **Swipe down** | Decrease screen brightness |
| **Tap** | Toggle hardware LED torch on/off |
| **Tap a color** | Change the screen light color |

## Project Structure

```
flashlight/
├── app/
│   ├── _layout.tsx          # Root layout (gesture handler wrapper)
│   └── index.tsx            # Main screen — state management
├── components/
│   ├── ColorPalette.tsx     # Right-side color swatches
│   ├── FlashlightScreen.tsx # Gesture-controlled colored screen
│   └── TorchController.tsx  # Hidden CameraView for hardware LED
├── hooks/
│   └── useFlashlight.ts     # Screen brightness API + lifecycle
├── constants/
│   └── colors.ts            # Color palette definitions
├── global.css               # Tailwind directives
├── tailwind.config.js       # NativeWind + Tailwind config
├── babel.config.js          # NativeWind + Expo presets
├── metro.config.js          # NativeWind Metro wrapper
└── app.json                 # Expo configuration
```

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| [Expo](https://expo.dev) | SDK 55 | React Native framework |
| [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) | ~55 | Hardware torch control |
| [expo-brightness](https://docs.expo.dev/versions/latest/sdk/brightness/) | ~55 | Screen brightness API |
| [expo-router](https://docs.expo.dev/router/introduction/) | ~55 | File-based routing |
| [NativeWind](https://www.nativewind.dev) | v4 | Tailwind CSS for React Native |
| [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) | ~2.30 | Pan/tap gesture recognition |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | v4 | 60fps gesture-driven animations |

## Permissions

- **Camera** (iOS & Android) — required to control the hardware LED torch. The camera preview is hidden (1x1px); no photos are taken or stored.
- **Screen brightness** — controlled via `expo-brightness`. No special permission needed on iOS. Android may request `WRITE_SETTINGS` for system-level brightness.

If camera permission is denied, the app still works as a screen-only colored flashlight — the hardware torch toggle just won't function.

## Platform Notes

- **iOS**: Screen brightness is app-scoped. Restored when the app backgrounds.
- **Android**: Auto-brightness is temporarily set to manual while the app is active, then restored.
- **Simulators**: The screen flashlight works, but the hardware torch requires a physical device.

## Building for Production

When you're ready to ship to the App Store or Google Play:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

See the [EAS Build docs](https://docs.expo.dev/build/introduction/) for full details.

## License

MIT
