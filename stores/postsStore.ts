import { create } from "zustand";

import {
  createPost,
  fetchFeedPosts,
  fetchPostsByUser,
  PostRecord,
  deletePost as serviceDeletePost,
} from "@/services/postsService";

interface PostsState {
  feedPosts: PostRecord[];
  userPosts: PostRecord[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadFeedPosts: () => Promise<void>;
  loadUserPosts: (userId: string) => Promise<void>;
  addPost: (payload: {
    authorId: string;
    authorUsername: string;
    content: string;
    imageUrl?: string | null;
  }) => Promise<void>;
  deletePost: (postId: string, authorId?: string) => Promise<void>;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  feedPosts: [],
  userPosts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  loadFeedPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await fetchFeedPosts();
      set({ feedPosts: posts, isLoading: false });
    } catch (err) {
      console.error("Failed to load feed posts", err);
      set({
        error: "Unable to load posts. Pull to refresh to try again.",
        isLoading: false,
      });
    }
  },
  loadUserPosts: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const posts = await fetchPostsByUser(userId);
      set({ userPosts: posts, isLoading: false });
    } catch (err) {
      console.error("Failed to load user posts", err);
      set({
        error: "Unable to load your posts. Pull to refresh to try again.",
        isLoading: false,
      });
    }
  },
  addPost: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      await createPost(payload);
      // Reload feed posts after creating a new one
      await get().loadFeedPosts();
      set({ isSubmitting: false });
    } catch (err) {
      console.error("Failed to create post", err);
      set({
        error: "We couldn't share your post. Please try again.",
        isSubmitting: false,
      });
    }
  },
  // delete a post and refresh lists
  deletePost: async (postId: string, authorId?: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await serviceDeletePost(postId);
      // Reload feed and (optionally) user posts if the deleted post belonged to current user
      await get().loadFeedPosts();
      if (authorId) await get().loadUserPosts(authorId);
      set({ isSubmitting: false });
    } catch (err) {
      console.error("Failed to delete post", err);
      set({
        error: "Unable to delete post. Please try again.",
        isSubmitting: false,
      });
    }
  },
  clearError: () => set({ error: null }),
}));
