import * as Updates from "expo-updates";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface UpdatePopupProps {
  visible: boolean;
  message: string;
  updateAvailable: boolean;
  onClose: () => void;
}

const UpdatePopup: React.FC<UpdatePopupProps> = ({
  visible,
  message,
  updateAvailable,
  onClose,
}) => {
  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Error updating app:", error);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-black shadow-slate-400 p-6 rounded-lg shadow-lg">
          <Text className="text-lg mb-4 text-white">{message}</Text>
          {!updateAvailable ? (
            <View className="self-end gap-3 flex-row justify-between">
              <TouchableOpacity
                onPress={onClose}
                className="bg-blue-500 rounded-lg px-6 py-2"
              >
                <Text className="text-white text-center">Update Later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                className="bg-blue-500 rounded-lg px-6 py-2"
              >
                <Text className="text-white text-center">Update Now</Text>
              </TouchableOpacity>
            </View>
          ) : message !== "Checking for updates..." ? (
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 rounded-full px-6 py-2"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default UpdatePopup;
