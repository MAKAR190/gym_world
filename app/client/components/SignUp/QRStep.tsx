import { useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";
import Title from "@/client/components/Title";
import Button from "@/client/components/Button";
import { SignUpFormType } from "@/types/FormModels";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const QRCodeStep = ({ formData }: { formData: SignUpFormType | null }) => {
  const [qrValue, setQrValue] = useState("");
  const viewShotRef = useRef<ViewShot & { capture: () => Promise<string> }>(
    null
  );

  useEffect(() => {
    if (formData && qrValue !== JSON.stringify(formData)) {
      setQrValue(JSON.stringify(formData));
    }
  }, [formData, qrValue]);

  const handleSaveQRCode = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current!.capture();
        const targetPath = `${FileSystem.cacheDirectory}gym-world-qrcode.png`;
          
        if ((await FileSystem.getInfoAsync(targetPath)).exists) {
          await FileSystem.deleteAsync(targetPath, { idempotent: true });
        }
          
        await FileSystem.moveAsync({ from: uri, to: targetPath });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(targetPath);
        } else {
          console.error("Sharing is not available");
        }
      } catch (error) {
        console.error("Error saving QR code:", error);
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="mb-5 items-center">
        <Title variant="extra-large">Your unique QR</Title>
        <Text className="text-center text-sm text-gray-500 mb-5">
          Save this QR code to restore access to your account in the future
        </Text>
      </View>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
        {qrValue ? <QRCode value={qrValue} size={256} /> : null}
      </ViewShot>
      <View className="my-10">
        <Button onPress={handleSaveQRCode} className="min-w-40" text="Save" />
      </View>
    </View>
  );
};

export default QRCodeStep;
