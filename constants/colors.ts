export interface FlashlightColor {
  id: string;
  hex: string;
  label: string;
}

export const FLASHLIGHT_COLORS: FlashlightColor[] = [
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

export const DEFAULT_COLOR = FLASHLIGHT_COLORS[0].hex;
export const MIN_BRIGHTNESS = 0.1;
export const MAX_BRIGHTNESS = 1.0;
export const DEFAULT_BRIGHTNESS = 1.0;
