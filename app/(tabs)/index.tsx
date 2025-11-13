import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  Image as RNImage,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { pickImage, uploadImage } from "@/services/imageService";
import { useAuthStore } from "@/stores/authStore";
import { usePostsStore } from "@/stores/postsStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const {
    feedPosts,
    isLoading,
    isSubmitting,
    error,
    loadFeedPosts,
    addPost,
    deletePost,
    clearError,
  } = usePostsStore();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const sortedPosts = useMemo(
    () =>
      [...feedPosts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [feedPosts]
  );

  useEffect(() => {
    loadFeedPosts();
  }, [loadFeedPosts]);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      console.log("Picked image uri:", uri);
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
        (user.user_metadata?.username as string | undefined) ??
        user.email ??
        "Anonymous",
      content: content.trim(),
      imageUrl,
    });

    setContent("");
    setSelectedImage(null);
    setModalVisible(false);
  };

  const onRefresh = async () => {
    await loadFeedPosts();
  };

  const handleDeletePost = (postId: string, authorId?: string) => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId, authorId);
          } catch (err) {
            console.error("Error deleting post", err);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-framez-midnight">
      <View className="px-5 pt-6 w-full md:w-9/10 lg:w-[700px]">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">Community Feed</Text>
          <TouchableOpacity
            className="rounded-3xl border border-white/5 bg-framez-slate/60 h-10 w-10 justify-center items-center shadow-lg shadow-black/40"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-lg font-semibold text-white">+</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center p-2 bg-black/80">
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="w-full"
              >
                <View className="rounded-3xl bg-framez-slate/80 p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-lg font-semibold text-white">
                      Create a frame
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text className="text-sm text-framez-mist">Close</Text>
                    </TouchableOpacity>
                  </View>

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
                      <RNImage
                        source={{ uri: selectedImage }}
                        style={{ height: 160, width: "100%", borderRadius: 12 }}
                      />
                      <TouchableOpacity
                        className="mt-2 self-end"
                        onPress={() => setSelectedImage(null)}
                      >
                        <Text className="text-sm text-red-400">
                          Remove image
                        </Text>
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

                  {error ? (
                    <Text className="mt-2 text-sm text-red-400">{error}</Text>
                  ) : null}
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#59B2D9"
            style={{ marginTop: 32 }}
          />
        ) : (
          <FlatList
            data={sortedPosts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 16, paddingBottom: 48 }}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View className="rounded-3xl border border-white/5 bg-framez-slate/60 p-5">
                <View className="flex-row justify-between items-baseline">
                  <View>
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
                  </View>
                  {user?.id === item.author_id ? (
                    <TouchableOpacity
                      onPress={() => handleDeletePost(item.id, item.author_id)}
                    >
                      <Text className="text-sm text-red-400">Delete</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Text className="mt-2 text-base leading-6 text-white">
                  {item.content}
                </Text>
                {item.image_url ? (
                  <View className="mt-3">
                    <RNImage
                      source={{ uri: item.image_url }}
                      style={{ height: 160, width: "100%", borderRadius: 12 }}
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
