import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Post {
  id: string;
  content: string;
  authorId: string;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[]);
    };
    fetchPosts();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
    </View>
  );
}
