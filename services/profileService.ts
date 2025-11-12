import { supabase } from "@/lib/supabase";

export interface ProfilePayload {
  userId: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export const createProfile = async ({ userId, username, email, avatarUrl, bio }: ProfilePayload) => {
  // Try using the database function first (more secure, bypasses RLS)
  const { error: functionError } = await supabase.rpc("create_user_profile", {
    user_id: userId,
    user_username: username,
    user_email: email,
  });

  // If function doesn't exist, fall back to direct insert/update
  if (functionError && functionError.code === "42883") {
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          username,
          email,
          avatar_url: avatarUrl ?? null,
          bio: bio ?? null,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Failed to create profile", error);
      throw error;
    }
  } else if (functionError) {
    console.error("Failed to create profile via function", functionError);
    throw functionError;
  }
};

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, avatar_url, bio")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile", error);
    throw error;
  }

  return data;
};

