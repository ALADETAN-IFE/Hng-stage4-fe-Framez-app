import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image as RNImage, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import { fetchProfile } from "@/services/profileService";
import { useAuthStore } from "@/stores/authStore";
import { usePostsStore } from "@/stores/postsStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { user, signOut } = useAuthStore();
  const { userPosts, isLoading, error, loadUserPosts, deletePost } = usePostsStore();
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const profileData = await fetchProfile(user.id);
          setProfile(profileData);
          await loadUserPosts(user.id);
        } catch (err) {
          console.error("Failed to load profile data", err);
        }
      };
      loadData();
    }
  }, [user, loadUserPosts]);

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
      await loadUserPosts(user.id);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (postId: string) => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (user) await deletePost(postId, user.id);
          } catch (err) {
            console.error("Failed to delete post", err);
          }
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-framez-midnight">
        <ActivityIndicator size="large" color="#59B2D9" />
        <Text className="mt-4 text-sm text-framez-mist">
          Sign in to view and manage your Framez profile.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-framez-midnight">
    <View className="px-5 pt-6 pb-60">
      <Text className="text-3xl font-bold text-white">My Profile</Text>
      <View className="mt-6 flex-row items-center gap-4 rounded-3xl border border-white/5 bg-framez-slate/60 p-5">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-framez-accent">
          <Text className="text-2xl font-bold text-framez-nightfall">
            {(profile?.username?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">
            {profile?.username ?? (user.user_metadata?.username as string) ?? "Framez Creator"}
          </Text>
          <Text className="text-sm text-framez-mist">{profile?.email ?? user.email}</Text>
          <Text className="text-xs text-framez-mist">
            Joined {new Date(user.created_at ?? Date.now()).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          className="rounded-full border border-framez-accent/40 bg-framez-nightfall/60 px-4 py-2"
          onPress={handleSignOut}
        >
          <Text className="text-sm font-semibold text-framez-accent">Logout</Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-8 mb-8 text-xl font-semibold text-white">My Frames</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#59B2D9" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ gap: 16, paddingBottom: 64 }}
          renderItem={({ item }) => (
            <View className="rounded-3xl border border-white/5 bg-framez-slate/60 p-5">
              <View  className="flex-row justify-between items-baseline">
              <Text className="text-xs text-framez-mist">
                {new Date(item.created_at).toLocaleString(undefined, {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text className="text-sm text-red-400">Delete</Text>
                </TouchableOpacity>
              </View>
              <Text className="mt-2 text-base leading-6 text-white">{item.content}</Text>
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
              You haven&apos;t shared any frames yet. Start capturing your moments from the home tab.
            </Text>
          }
        />
      )}
      {error ? <Text className="mt-3 text-center text-sm text-red-400">{error}</Text> : null}
    </View>
    </SafeAreaView>
  );
}
