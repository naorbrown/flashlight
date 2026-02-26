import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  AppState,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Brightness from "expo-brightness";
import { CameraView, useCameraPermissions } from "expo-camera";

const COLORS = [
  { id: "white", hex: "#FFFFFF", label: "White" },
  { id: "warm-white", hex: "#FFF5E0", label: "Warm White" },
  { id: "cool-white", hex: "#E8F4FF", label: "Cool White" },
  { id: "red", hex: "#FF3B30", label: "Red" },
  { id: "green", hex: "#34C759", label: "Green" },
  { id: "blue", hex: "#007AFF", label: "Blue" },
  { id: "purple", hex: "#AF52DE", label: "Purple" },
  { id: "orange", hex: "#FF9500", label: "Orange" },
  { id: "pink", hex: "#FF2D55", label: "Pink" },
  { id: "yellow", hex: "#FFCC00", label: "Yellow" },
];

const MIN_BRIGHTNESS = 0.1;
const MAX_BRIGHTNESS = 1.0;

export default function Index() {
  const { height: screenHeight } = useWindowDimensions();

  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [brightness, setBrightnessValue] = useState(MAX_BRIGHTNESS);

  const brightnessRef = useRef(MAX_BRIGHTNESS);
  const startBrightnessRef = useRef(MAX_BRIGHTNESS);
  const originalBrightness = useRef<number | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  const percentOpacity = useRef(new Animated.Value(0)).current;

  const [permission, requestPermission] = useCameraPermissions();

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Manage screen brightness and app state
  useEffect(() => {
    (async () => {
      try {
        originalBrightness.current = await Brightness.getBrightnessAsync();
      } catch {}
      try {
        await Brightness.setBrightnessAsync(1.0);
      } catch {}
    })();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        setTorchEnabled(false);
        if (originalBrightness.current !== null) {
          Brightness.setBrightnessAsync(originalBrightness.current).catch(
            () => {},
          );
        }
      } else if (nextState === "active") {
        Brightness.setBrightnessAsync(1.0).catch(() => {});
      }
    });

    return () => {
      subscription.remove();
      if (originalBrightness.current !== null) {
        Brightness.setBrightnessAsync(originalBrightness.current).catch(
          () => {},
        );
      }
    };
  }, []);

  const updateBrightness = useCallback((value: number) => {
    const clamped = Math.min(MAX_BRIGHTNESS, Math.max(MIN_BRIGHTNESS, value));
    brightnessRef.current = clamped;
    setBrightnessValue(clamped);
    opacity.setValue(clamped);
    Brightness.setBrightnessAsync(Math.min(1.0, Math.max(0.1, clamped))).catch(
      () => {},
    );
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8,
      onPanResponderGrant: () => {
        startBrightnessRef.current = brightnessRef.current;
        Animated.timing(indicatorOpacity, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }).start();
        Animated.timing(percentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dy) > 8) {
          const normalizedDelta =
            -gestureState.dy / (screenHeight * 0.6);
          updateBrightness(startBrightnessRef.current + normalizedDelta);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.timing(indicatorOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(percentOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // If it was a tap (minimal movement), toggle torch
        if (
          Math.abs(gestureState.dx) < 10 &&
          Math.abs(gestureState.dy) < 10
        ) {
          setTorchEnabled((prev) => !prev);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Hidden camera for torch */}
      {permission?.granted && (
        <CameraView style={styles.hiddenCamera} enableTorch={torchEnabled} />
      )}

      {/* Main flashlight screen */}
      <Animated.View
        style={[
          styles.screen,
          { backgroundColor: selectedColor, opacity },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Brightness indicator bar */}
        <Animated.View
          style={[
            styles.indicator,
            {
              height: `${brightness * 100}%`,
              opacity: indicatorOpacity,
            },
          ]}
          pointerEvents="none"
        />

        {/* Brightness percentage */}
        <Animated.View
          style={[styles.percentContainer, { opacity: percentOpacity }]}
          pointerEvents="none"
        >
          <Text style={styles.percentText}>
            {Math.round(brightness * 100)}%
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Color palette */}
      <View style={styles.palette} pointerEvents="box-none">
        <ScrollView
          contentContainerStyle={styles.paletteContent}
          showsVerticalScrollIndicator={false}
        >
          {COLORS.map((color) => {
            const isSelected = selectedColor === color.hex;
            return (
              <TouchableOpacity
                key={color.id}
                onPress={() => setSelectedColor(color.hex)}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: color.hex,
                    borderColor: isSelected
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.2)",
                    shadowColor: isSelected ? color.hex : "transparent",
                    shadowOpacity: isSelected ? 0.8 : 0,
                    elevation: isSelected ? 8 : 0,
                  },
                ]}
                accessibilityLabel={color.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
  },
  screen: {
    flex: 1,
  },
  indicator: {
    position: "absolute",
    left: 8,
    bottom: 0,
    width: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  percentContainer: {
    position: "absolute",
    bottom: 64,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  percentText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 48,
    fontWeight: "200",
  },
  palette: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  paletteContent: {
    gap: 12,
    paddingVertical: 16,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
