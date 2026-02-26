import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface TorchControllerProps {
  torchEnabled: boolean;
}

export default function TorchController({ torchEnabled }: TorchControllerProps) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) return null;

  return (
    <CameraView
      style={styles.hidden}
      enableTorch={torchEnabled}
    />
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01, // 0.01 not 0 — prevents Android from optimizing away the camera
  },
});
