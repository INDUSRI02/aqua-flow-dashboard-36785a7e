import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, User, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
  like_count: number;
  liked_by_me: boolean;
}

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    if (!user) return;
    // Fetch posts
    const { data: postsData } = await supabase
      .from("community_posts")
      .select("id, user_id, content, created_at")
      .order("created_at", { ascending: false });

    if (!postsData) { setLoading(false); return; }

    // Fetch authors
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name");

    // Fetch likes
    const { data: likes } = await supabase
      .from("community_likes")
      .select("post_id, user_id");

    const profileMap: Record<string, string> = {};
    profiles?.forEach(p => { profileMap[p.user_id] = p.display_name || "User"; });

    const mapped: Post[] = postsData.map(p => ({
      ...p,
      author_name: profileMap[p.user_id] || "User",
      like_count: likes?.filter(l => l.post_id === p.id).length || 0,
      liked_by_me: likes?.some(l => l.post_id === p.id && l.user_id === user.id) || false,
    }));

    setPosts(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [user]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("community")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_likes" }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      content: newPost.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewPost("");
    }
    setPosting(false);
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    if (!user) return;
    if (liked) {
      await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("community_likes").insert({ user_id: user.id, post_id: postId });
    }
  };

  const handleDelete = async (postId: string) => {
    await supabase.from("community_posts").delete().eq("id", postId);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">👥 Community</h1>
          <p className="text-muted-foreground">Share water conservation tips and connect with others.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* New Post */}
          <AnimatedCard>
            <div className="flex gap-3">
              <div className="rounded-full gradient-primary p-2 h-fit">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share a water-saving tip or achievement..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
                <div className="flex justify-end">
                  <motion.button
                    onClick={handlePost}
                    disabled={posting || !newPost.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" /> Post
                  </motion.button>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <AnimatedCard key={post.id} delay={i * 0.05}>
                <div className="flex items-start gap-3">
                  <div className="rounded-full gradient-primary p-2">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{post.author_name}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                      </div>
                      {post.user_id === user?.id && (
                        <button onClick={() => handleDelete(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-foreground leading-relaxed mt-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleLike(post.id, post.liked_by_me)}
                        className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors"
                      >
                        <motion.div animate={post.liked_by_me ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                          <Heart className={`h-4 w-4 ${post.liked_by_me ? "fill-destructive text-destructive" : ""}`} />
                        </motion.div>
                        {post.like_count}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Community;
