import { useState, useCallback } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DEFAULT_COLOR, DEFAULT_BRIGHTNESS } from "../constants/colors";
import { useFlashlight } from "../hooks/useFlashlight";
import FlashlightScreen from "../components/FlashlightScreen";
import ColorPalette from "../components/ColorPalette";
import TorchController from "../components/TorchController";

export default function Index() {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [brightness, setBrightnessState] = useState(DEFAULT_BRIGHTNESS);

  const handleBackground = useCallback(() => {
    setTorchEnabled(false);
  }, []);

  const { setBrightness } = useFlashlight({ onBackground: handleBackground });

  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightnessState(value);
      setBrightness(value);
    },
    [setBrightness],
  );

  const toggleTorch = useCallback(() => {
    setTorchEnabled((prev) => !prev);
  }, []);

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <TorchController torchEnabled={torchEnabled} />
      <FlashlightScreen
        color={selectedColor}
        brightness={brightness}
        onBrightnessChange={handleBrightnessChange}
        onTap={toggleTorch}
      />
      <ColorPalette
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </View>
  );
}
