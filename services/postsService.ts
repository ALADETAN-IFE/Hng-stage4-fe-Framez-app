import { supabase } from "@/lib/supabase";

export interface PostPayload {
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl?: string | null;
}

export interface PostRecord {
  id: string;
  author_id: string;
  author_username: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export const createPost = async ({ authorId, authorUsername, content, imageUrl }: PostPayload) => {
  const { error } = await supabase.from("posts").insert({
    author_id: authorId,
    author_username: authorUsername,
    content,
    image_url: imageUrl ?? null,
  });

  if (error) {
    console.error("Failed to create post", error);
    throw error;
  }
};

export const fetchFeedPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, author_id, author_username, content, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts", error);
    throw error;
  }

  return (data ?? []) as PostRecord[];
};

export const fetchPostsByUser = async (authorId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, author_id, author_username, content, image_url, created_at")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user posts", error);
    throw error;
  }

  return (data ?? []) as PostRecord[];
};

