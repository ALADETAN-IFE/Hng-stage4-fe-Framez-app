import { Image } from "expo-image";
import { useMemo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "@/stores/authStore";
import { usePostsStore } from "@/stores/postsStore";
import { pickImage, uploadImage } from "@/services/imageService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { feedPosts, isLoading, isSubmitting, error, loadFeedPosts, addPost, clearError } =
    usePostsStore();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const sortedPosts = useMemo(
    () =>
      [...feedPosts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [feedPosts]
  );

  useEffect(() => {
    loadFeedPosts();
  }, [loadFeedPosts]);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedImage(uri);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      clearError();
      return;
    }
    if (!content.trim() && !selectedImage) {
      return;
    }

    clearError();
    let imageUrl: string | null = null;

    // Upload image if selected
    if (selectedImage) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadImage(selectedImage, user.id);
      } catch (err) {
        console.error("Failed to upload image", err);
      } finally {
        setUploadingImage(false);
      }
    }

    await addPost({
      authorId: user.id,
      authorUsername:
        (user.user_metadata?.username as string | undefined) ?? user.email ?? "Anonymous",
      content: content.trim(),
      imageUrl,
    });

    // Reset form
    setContent("");
    setSelectedImage(null);
  };

  const onRefresh = async () => {
    await loadFeedPosts();
  };

  return (
    <SafeAreaView className="flex-1 bg-framez-midnight">
    <View className="px-5 pt-6 w-full md:w-9/10 lg:w-[700px]">
      <Text className="text-3xl font-bold text-white">Community Feed</Text>
      <View className="mt-5 rounded-3xl border border-white/5 bg-framez-slate/60 p-5 shadow-lg shadow-black/40">
        <Text className="mb-3 text-lg font-semibold text-white">Share a new frame</Text>
        <TextInput
          className="min-h-[90px] rounded-2xl border border-white/10 bg-framez-nightfall/70 px-4 py-3 text-base text-white"
          placeholder="What's inspiring you today?"
          placeholderTextColor="#94A3B8"
          multiline
          value={content}
          onChangeText={setContent}
        />
        {selectedImage && (
          <View className="mt-3">
            <Image source={{ uri: selectedImage }} className="h-40 w-full rounded-2xl" />
            <TouchableOpacity
              className="mt-2 self-end"
              onPress={() => setSelectedImage(null)}
            >
              <Text className="text-sm text-red-400">Remove image</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="mt-3 flex-row items-center justify-between">
          <TouchableOpacity
            className="rounded-full border border-white/20 bg-framez-slate/40 px-4 py-2"
            onPress={handlePickImage}
            disabled={uploadingImage}
          >
            <Text className="text-sm font-semibold text-white">
              {uploadingImage ? "Uploading..." : "📷 Add Image"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-full bg-framez-accent px-6 py-3"
            onPress={handleCreatePost}
            disabled={isSubmitting || uploadingImage}
          >
            <Text className="text-base font-semibold text-framez-nightfall">
              {isSubmitting ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
        {error ? <Text className="mt-2 text-sm text-red-400">{error}</Text> : null}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#59B2D9" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={sortedPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 16, paddingBottom: 48 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View className="rounded-3xl border border-white/5 bg-framez-slate/60 p-5">
              <Text className="text-base font-semibold text-framez-accent">
                {item.author_username}
              </Text>
              <Text className="text-xs text-framez-mist">
                {new Date(item.created_at).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
              <Text className="mt-2 text-base leading-6 text-white">{item.content}</Text>
              {item.image_url ? (
                <View className="mt-3">
                  <Image
                    source={{ uri: item.image_url }}
                    className="h-64 w-full rounded-2xl"
                    contentFit="cover"
                  />
                </View>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-sm text-framez-mist">
              No frames yet. Share your first post and inspire the community!
            </Text>
          }
        />
      )}
    </View>
    </SafeAreaView>
  );
}
