import { View, TouchableOpacity, ScrollView } from "react-native";
import { FLASHLIGHT_COLORS } from "../constants/colors";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ColorPalette({
  selectedColor,
  onColorSelect,
}: ColorPaletteProps) {
  return (
    <View
      className="absolute right-3 top-0 bottom-0 justify-center items-center"
      pointerEvents="box-none"
    >
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {FLASHLIGHT_COLORS.map((color) => {
          const isSelected = selectedColor === color.hex;
          return (
            <TouchableOpacity
              key={color.id}
              onPress={() => onColorSelect(color.hex)}
              className="w-10 h-10 rounded-full"
              style={{
                backgroundColor: color.hex,
                borderWidth: 2.5,
                borderColor: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.2)",
                shadowColor: isSelected ? color.hex : "transparent",
                shadowOpacity: isSelected ? 0.8 : 0,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
                elevation: isSelected ? 8 : 0,
              }}
              accessibilityLabel={color.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
