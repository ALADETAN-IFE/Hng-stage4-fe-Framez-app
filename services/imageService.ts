import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import { supabase } from "@/lib/supabase";

export const pickImage = async (): Promise<string | null> => {
  // Request permissions
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return null;
    }
  }

  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0].uri;
};

export const uploadImage = async (uri: string, userId: string): Promise<string | null> => {
  try {
    // Convert local URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate unique filename
    const fileExt = uri.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage.from("posts").upload(filePath, blob, {
      contentType: `image/${fileExt}`,
      upsert: false,
    });

    if (error) {
      console.error("Failed to upload image", error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("Error uploading image", err);
    return null;
  }
};

