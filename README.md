# Flashlight

> **This is a test/demo app.** Built as an experiment to see how fast you can go from zero to a working iOS app using Expo + Claude Code. Not intended for the App Store.

A dead-simple flashlight app for your iPhone. Your screen turns into a colored light. Swipe up and down to dim it. Tap to toggle the real flashlight LED.

---

## What It Does

- Your **whole screen** becomes a bright solid color — that's the flashlight
- **Swipe up** to make it brighter, **swipe down** to dim it
- **Tap anywhere** to turn your phone's actual LED flashlight on/off
- **Pick a color** from the dots on the right side (white, red, blue, etc.)
- That's it. No settings, no menus, no accounts. Just light.

---

## How to Run This on Your iPhone

You don't need Xcode. You don't need to know Swift. Follow these steps exactly.

### Step 1: Install Node.js on your computer

You need Node.js to run the project. If you're not sure whether you have it:

1. Open **Terminal** on your Mac (search "Terminal" in Spotlight)
2. Type `node --version` and press Enter
3. If you see a version number like `v18.x.x` or higher, you're good — skip to Step 2
4. If you get "command not found", go to https://nodejs.org and download the **LTS** version
5. Run the installer, click through the prompts, done

### Step 2: Download the project

In Terminal, run these commands one at a time:

```bash
git clone https://github.com/naorbrown/flashlight.git
```

```bash
cd flashlight
```

```bash
npm install
```

The last command will take a minute. Wait for it to finish.

### Step 3: Install Expo Go on your iPhone

1. Open the **App Store** on your iPhone
2. Search for **"Expo Go"**
3. Download it (it's free)

### Step 4: Start the app

In Terminal (make sure you're still in the `flashlight` folder), run:

```bash
npx expo start
```

You'll see a QR code appear in your terminal.

### Step 5: Open it on your phone

1. Open the **Camera** app on your iPhone
2. Point it at the QR code in your terminal
3. Tap the notification that says "Open in Expo Go"
4. The app loads on your phone. Done.

> **Make sure your phone and computer are on the same Wi-Fi network.** If the QR code doesn't work, try running `npx expo start --tunnel` instead (it'll install a tunnel package — say yes).

### Step 6: Allow camera access

The app will ask for camera permission the first time. **Tap Allow.** This is needed to control the LED flashlight — it doesn't take photos.

---

## Using the App

| What to do | What happens |
|---|---|
| Swipe up on the screen | Screen gets brighter |
| Swipe down on the screen | Screen gets dimmer |
| Tap anywhere on the screen | Turns the LED flashlight on/off |
| Tap a colored dot on the right | Changes the screen color |

---

## Troubleshooting

**"QR code not working"**
- Make sure your phone and computer are on the same Wi-Fi
- Try `npx expo start --tunnel` instead

**"Camera permission denied"**
- Go to iPhone Settings > scroll down to Expo Go > Camera > set to Allow
- The app still works as a screen light without it, you just can't use the LED

**"App crashes on launch"**
- Run `npx expo start --clear` to clear the cache and try again

**"npm install is failing"**
- Make sure you have Node 18 or higher: `node --version`
- Try deleting `node_modules` and running `npm install` again

---

## How It's Built

For anyone curious about the tech:

| Feature | How it works |
|---|---|
| Screen light | Full-screen colored `View` component |
| Brightness | `expo-brightness` controls actual screen brightness |
| LED flashlight | `expo-camera` with a hidden 1x1 pixel camera view |
| Swipe gesture | `react-native-gesture-handler` + `react-native-reanimated` |
| Styling | NativeWind (Tailwind CSS for React Native) |

The phone's LED is always white — only the screen changes color. Both work together.

### Project Structure

```
flashlight/
├── app/
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Main screen
├── components/
│   ├── ColorPalette.tsx     # Color picker dots
│   ├── FlashlightScreen.tsx # The big colored screen + gestures
│   └── TorchController.tsx  # Hidden camera that controls the LED
├── hooks/
│   └── useFlashlight.ts     # Screen brightness logic
├── constants/
│   └── colors.ts            # The 10 color options
└── [config files]           # Expo, Tailwind, Babel, Metro configs
```

### Tech Stack

| Package | Purpose |
|---|---|
| [Expo](https://expo.dev) SDK 54 | React Native framework — no Xcode needed |
| [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) | Hardware LED torch control |
| [expo-brightness](https://docs.expo.dev/versions/latest/sdk/brightness/) | Screen brightness API |
| [NativeWind](https://www.nativewind.dev) v4 | Tailwind CSS for phone apps |
| [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) | Swipe and tap detection |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) v4 | Smooth 60fps animations |

---

## License

MIT
