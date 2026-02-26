import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { MIN_BRIGHTNESS, MAX_BRIGHTNESS } from "../constants/colors";

interface FlashlightScreenProps {
  color: string;
  brightness: number;
  onBrightnessChange: (value: number) => void;
  onTap: () => void;
}

export default function FlashlightScreen({
  color,
  brightness,
  onBrightnessChange,
  onTap,
}: FlashlightScreenProps) {
  const { height: screenHeight } = useWindowDimensions();

  const brightnessShared = useSharedValue(brightness);
  const startBrightness = useSharedValue(brightness);
  const isDragging = useSharedValue(false);

  // Sync prop to shared value on mount
  useEffect(() => {
    brightnessShared.value = brightness;
  }, []);

  const panGesture = Gesture.Pan()
    .minDistance(8)
    .onBegin(() => {
      startBrightness.value = brightnessShared.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      // Swipe up = brighter (translationY is negative when swiping up)
      const normalizedDelta = -event.translationY / (screenHeight * 0.6);
      brightnessShared.value = Math.min(
        MAX_BRIGHTNESS,
        Math.max(
          MIN_BRIGHTNESS,
          startBrightness.value + normalizedDelta,
        ),
      );
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(onBrightnessChange)(brightnessShared.value);
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(onTap)();
    });

  const composed = Gesture.Race(panGesture, tapGesture);

  // Screen opacity = brightness level
  const screenStyle = useAnimatedStyle(() => ({
    opacity: brightnessShared.value,
    backgroundColor: color,
  }));

  // Brightness indicator bar on left edge
  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDragging.value ? 0.9 : 0, { duration: 300 }),
    height: `${brightnessShared.value * 100}%`,
  }));

  // Percentage text during drag
  const percentStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDragging.value ? 1 : 0, { duration: 200 }),
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View className="flex-1" style={screenStyle}>
        {/* Brightness indicator: thin bar on left edge */}
        <Animated.View
          className="absolute left-2 bottom-0 w-1 rounded-full bg-white/70"
          style={indicatorStyle}
          pointerEvents="none"
        />

        {/* Brightness percentage display */}
        <Animated.Text
          className="absolute bottom-16 left-0 right-0 text-center text-white/80 text-5xl font-extralight"
          style={percentStyle}
          pointerEvents="none"
        >
          {Math.round(brightness * 100)}%
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}
