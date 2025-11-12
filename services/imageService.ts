// Use the legacy filesystem API because readAsStringAsync is deprecated in the new API
// and the legacy module still provides the compatible readAsStringAsync helper.
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import { supabase } from "@/lib/supabase";

export const pickImage = async (): Promise<string | null> => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return null;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri ?? null;
};

export const uploadImage = async (
  uri: string,
  userId: string
): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
    const contentType =
      fileExt === "png"
        ? "image/png"
        : fileExt === "gif"
          ? "image/gif"
          : "image/jpeg";

    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const arrayBuffer = byteArray.buffer;

    const { error } = await supabase.storage
      .from("posts")
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Failed to upload image", error);
      throw error;
    }

    const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
    return (data as any)?.publicUrl ?? null;
  } catch (err) {
    console.error("Error uploading image", err);
    return null;
  }
};
