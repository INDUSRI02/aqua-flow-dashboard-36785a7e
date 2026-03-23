import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { useState } from "react";

const posts = [
  { id: 1, user: "EcoWarrior", time: "2h ago", content: "Just installed a rainwater harvesting system at home! Already saving 50L/day. 🌧️", likes: 24, comments: 5 },
  { id: 2, user: "GreenThumb", time: "5h ago", content: "Did you know that mulching your garden reduces water evaporation by 70%? Try it! 🌱", likes: 18, comments: 3 },
  { id: 3, user: "WaterSaver", time: "1d ago", content: "Our community fixed 12 leaking pipes last month. Together we saved over 10,000 liters! 💪", likes: 45, comments: 8 },
  { id: 4, user: "AquaChamp", time: "2d ago", content: "Switched to a dual-flush toilet — saving 4L per flush. Small changes, big impact! 🚽💧", likes: 31, comments: 6 },
];

const Community = () => {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">👥 Community</h1>
          <p className="text-muted-foreground">Connect with fellow water conservation enthusiasts.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {posts.map((post, i) => (
            <AnimatedCard key={post.id} delay={i * 0.1}>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full gradient-primary p-2">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.user}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-6 text-muted-foreground">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors"
                >
                  <motion.div animate={liked[post.id] ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                    <Heart className={`h-4 w-4 ${liked[post.id] ? "fill-destructive text-destructive" : ""}`} />
                  </motion.div>
                  {post.likes + (liked[post.id] ? 1 : 0)}
                </motion.button>
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-accent transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Community;
