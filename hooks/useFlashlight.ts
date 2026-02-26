import { useEffect, useCallback, useRef } from "react";
import { AppState, Platform } from "react-native";
import * as Brightness from "expo-brightness";

interface UseFlashlightOptions {
  onBackground?: () => void;
}

export function useFlashlight({ onBackground }: UseFlashlightOptions = {}) {
  const originalBrightness = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      // Save original brightness to restore later
      try {
        originalBrightness.current = await Brightness.getBrightnessAsync();
      } catch {}

      // Max out screen brightness on mount
      try {
        await Brightness.setBrightnessAsync(1.0);
      } catch {}
    })();

    // Listen for app state changes to restore brightness
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        onBackground?.();
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
      // Restore brightness on unmount
      if (originalBrightness.current !== null) {
        Brightness.setBrightnessAsync(originalBrightness.current).catch(
          () => {},
        );
      }
    };
  }, [onBackground]);

  const setBrightness = useCallback(async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(
        Math.min(1.0, Math.max(0.1, value)),
      );
    } catch {}
  }, []);

  return { setBrightness };
}
