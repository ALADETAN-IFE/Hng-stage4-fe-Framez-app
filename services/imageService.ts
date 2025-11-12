import * as FileSystem from "expo-file-system";
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
    mediaTypes: ImagePicker.MediaType.Images,
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
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file extension and determine content type
    const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
    const contentType = fileExt === "png" ? "image/png" : fileExt === "gif" ? "image/gif" : "image/jpeg";

    // Generate unique filename
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    // Convert base64 to ArrayBuffer for Supabase Storage
    // Supabase Storage accepts ArrayBuffer, Blob, File, or FormData
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const arrayBuffer = byteArray.buffer;

    // Upload to Supabase Storage
    const { error } = await supabase.storage.from("posts").upload(filePath, arrayBuffer, {
      contentType,
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

