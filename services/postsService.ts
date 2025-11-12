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

export const createPost = async ({
  authorId,
  authorUsername,
  content,
  imageUrl,
}: PostPayload) => {
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

export const deletePost = async (postId: string, imageUrl?: string | null) => {
  try {
    // If an imageUrl is provided and looks like it references the 'posts' bucket,
    // try to remove the file from Supabase Storage. We attempt to extract the
    // path after '/posts/' in the public URL which matches the upload path.
    if (imageUrl) {
      try {
        const idx = imageUrl.indexOf("/posts/");
        if (idx !== -1) {
          const filePath = imageUrl.substring(idx + 1); // remove leading '/'
          // filePath will be like 'posts/userId/12345.jpg'
          const { error: storageError } = await supabase.storage
            .from("posts")
            .remove([filePath.replace(/^posts\//, "")]);
          if (storageError) {
            // log but don't fail the whole operation
            console.warn("Failed to remove image from storage", storageError);
          }
        }
      } catch (err) {
        console.warn("Error while attempting to delete image file:", err);
      }
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Failed to delete post", error);
      throw error;
    }
  } catch (err) {
    console.error("deletePost error", err);
    throw err;
  }
};
