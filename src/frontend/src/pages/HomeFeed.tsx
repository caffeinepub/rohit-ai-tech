import {
  Bell,
  Bookmark,
  Compass,
  Film,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  Plus,
  PlusSquare,
  Send,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ExplorePage from "./ExplorePage";
import ProfilePage from "./ProfilePage";
import ReelsPage from "./ReelsPage";

const STORIES = [
  {
    id: 0,
    username: "Your Story",
    initials: "Me",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    isOwn: true,
  },
  {
    id: 1,
    username: "priya.s",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    isOwn: false,
  },
  {
    id: 2,
    username: "arjun.dev",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    isOwn: false,
  },
  {
    id: 3,
    username: "sneha.c",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    isOwn: false,
  },
  {
    id: 4,
    username: "rahul.b",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    isOwn: false,
  },
  {
    id: 5,
    username: "kavya.ai",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    isOwn: false,
  },
  {
    id: 6,
    username: "rohit.ai",
    initials: "RA",
    avatarGradient: "from-yellow-400 via-amber-500 to-orange-600",
    isOwn: false,
  },
];

const POSTS = [
  {
    id: 1,
    username: "priya.sharma",
    displayName: "Priya Sharma",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    timestamp: "2 minutes ago",
    caption:
      "Just deployed my first AI model on the cloud \u2601\ufe0f\u2728 The future is here and it's incredible! #AITech #RohitAITech #MachineLearning",
    imageGradient: "from-[#0f0035] via-[#2d1b69] to-[#1a0050]",
    imageAccent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.55 0.25 300 / 0.5) 0%, transparent 70%)",
    likes: 2481,
    comments: 34,
  },
  {
    id: 2,
    username: "arjun.dev",
    displayName: "Arjun Mehta",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    timestamp: "18 minutes ago",
    caption:
      "Building the next generation of smart apps \ud83d\ude80 Who else is excited about the possibilities with AI? Drop a \ud83d\udd25 below!",
    imageGradient: "from-[#001a1a] via-[#003333] to-[#001f3f]",
    imageAccent:
      "radial-gradient(ellipse 80% 50% at 30% 60%, oklch(0.65 0.18 185 / 0.55) 0%, transparent 65%)",
    likes: 5120,
    comments: 89,
  },
  {
    id: 3,
    username: "sneha.creates",
    displayName: "Sneha Kulkarni",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    timestamp: "1 hour ago",
    caption:
      "Machine learning workshop wrapped up \u2014 absolutely mind-blowing how fast this field is moving \ud83e\udde0\ud83d\udca1 #MachineLearning #Innovation",
    imageGradient: "from-[#1f0a00] via-[#3d1500] to-[#2a0a0a]",
    imageAccent:
      "radial-gradient(ellipse 60% 70% at 70% 30%, oklch(0.65 0.22 35 / 0.55) 0%, transparent 60%)",
    likes: 1930,
    comments: 27,
  },
  {
    id: 4,
    username: "rahul.builds",
    displayName: "Rahul Dev",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    timestamp: "3 hours ago",
    caption:
      "New blog post: \u2018Why AI is the backbone of tomorrow\u2019s internet\u2019 \u2014 link in bio! What do you think about AI-driven UX? \ud83e\udd14",
    imageGradient: "from-[#001a0d] via-[#003320] to-[#001f15]",
    imageAccent:
      "radial-gradient(ellipse 75% 55% at 40% 55%, oklch(0.62 0.2 155 / 0.5) 0%, transparent 65%)",
    likes: 8760,
    comments: 142,
  },
  {
    id: 5,
    username: "kavya.ai",
    displayName: "Kavya Nair",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    timestamp: "6 hours ago",
    caption:
      "Excited to join the Rohit AI Tech community! \ud83c\udf89 This platform is exactly what I've been looking for \u2014 innovation meets social. #NewMember #RohitAITech",
    imageGradient: "from-[#00081f] via-[#001040] to-[#000d35]",
    imageAccent:
      "radial-gradient(ellipse 65% 65% at 55% 45%, oklch(0.6 0.22 240 / 0.5) 0%, transparent 65%)",
    likes: 3410,
    comments: 58,
  },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type NavTab =
  | "home"
  | "explore"
  | "reels"
  | "create"
  | "notifications"
  | "profile";

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStoryTap = (id: number) => {
    if (id === 0) return;
    setViewedStories((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[480px] mx-auto relative min-h-screen flex flex-col">
        {/* ── Top Bar (hidden on profile, reels, and explore) ── */}
        {activeTab !== "profile" &&
          activeTab !== "reels" &&
          activeTab !== "explore" && (
            <header
              data-ocid="topbar.section"
              className="fixed top-0 z-40 w-full max-w-[480px] flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-background/85 backdrop-blur-xl"
            >
              <span className="font-display font-black text-[22px] tracking-tight shimmer-text leading-none">
                Rohit AI Tech
              </span>
              <button
                type="button"
                data-ocid="topbar.button"
                className="relative p-2 -mr-1 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-[22px] w-[22px] text-foreground" />
                <span
                  className="absolute top-1.5 right-1.5 h-[14px] w-[14px] rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  3
                </span>
              </button>
            </header>
          )}

        {/* ── Main Content ── */}
        {activeTab === "reels" ? (
          <div className="fixed inset-0 z-30 pb-[60px]">
            <ReelsPage />
          </div>
        ) : activeTab === "profile" ? (
          <main className="flex-1 pb-[60px] overflow-y-auto">
            <ProfilePage />
          </main>
        ) : activeTab === "explore" ? (
          <main className="flex-1 pb-[60px] overflow-y-auto">
            <ExplorePage />
          </main>
        ) : (
          <main className="flex-1 pt-[54px] pb-[60px]">
            {/* ── Stories Strip ── */}
            <section
              data-ocid="stories.section"
              className="border-b border-white/[0.06] py-3"
            >
              <div
                className="flex gap-3 px-3 overflow-x-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {STORIES.map((story, index) => {
                  const isViewed = viewedStories.has(story.id);

                  return (
                    <motion.button
                      key={story.id}
                      type="button"
                      data-ocid={
                        story.isOwn
                          ? "stories.add_button"
                          : `stories.item.${index}`
                      }
                      onClick={() => handleStoryTap(story.id)}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[62px]"
                      aria-label={
                        story.isOwn
                          ? "Add your story"
                          : `View ${story.username}'s story`
                      }
                    >
                      {/* Ring + Avatar */}
                      <div className="relative">
                        <div
                          className={`p-[2.5px] rounded-full transition-all duration-300 ${
                            story.isOwn
                              ? `bg-gradient-to-tr ${story.avatarGradient}`
                              : isViewed
                                ? "bg-white/20"
                                : `bg-gradient-to-tr ${story.avatarGradient}`
                          }`}
                          style={{
                            filter:
                              isViewed && !story.isOwn
                                ? "saturate(0) brightness(0.5)"
                                : undefined,
                          }}
                        >
                          <div className="p-[2px] rounded-full bg-background">
                            <div className="h-[52px] w-[52px] rounded-full bg-background flex items-center justify-center overflow-hidden">
                              <div
                                className={`h-full w-full rounded-full bg-gradient-to-br ${story.avatarGradient} flex items-center justify-center`}
                                style={{
                                  filter:
                                    isViewed && !story.isOwn
                                      ? "saturate(0) brightness(0.5)"
                                      : undefined,
                                }}
                              >
                                <span className="text-[13px] font-bold text-white tracking-tight">
                                  {story.initials}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {story.isOwn && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-[20px] w-[20px] rounded-full bg-primary border-2 border-background flex items-center justify-center z-10">
                            <Plus
                              className="h-[10px] w-[10px] text-primary-foreground"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-medium leading-tight text-center truncate w-full transition-colors ${
                          story.isOwn
                            ? "text-foreground"
                            : isViewed
                              ? "text-muted-foreground/40"
                              : "text-foreground/80"
                        }`}
                      >
                        {story.username}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* ── Feed Posts ── */}
            <div data-ocid="feed.list">
              {POSTS.map((post, index) => {
                const liked = likedPosts.has(post.id);
                const saved = savedPosts.has(post.id);
                const likeCount = liked ? post.likes + 1 : post.likes;

                return (
                  <motion.article
                    key={post.id}
                    data-ocid={`feed.item.${index + 1}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.07,
                      duration: 0.38,
                      ease: "easeOut",
                    }}
                    className="border-b border-white/[0.05]"
                  >
                    {/* Post header */}
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-[2px] rounded-full bg-gradient-to-tr ${post.avatarGradient} flex-shrink-0`}
                        >
                          <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                            <span className="text-[11px] font-bold text-foreground">
                              {post.initials}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-foreground leading-tight">
                            {post.username}
                          </span>
                          <span className="text-[11px] text-muted-foreground/70 leading-tight">
                            {post.timestamp}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1.5 -mr-1 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      </button>
                    </div>

                    {/* Full-bleed image (4:5 aspect) */}
                    <div
                      className="w-full relative overflow-hidden"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${post.imageGradient}`}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: post.imageAccent }}
                      />
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                          backgroundSize: "128px 128px",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Action bar */}
                    <div className="px-3 pt-2 pb-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3.5">
                          <button
                            type="button"
                            data-ocid={`post.like_button.${index + 1}`}
                            onClick={() => toggleLike(post.id)}
                            aria-label={liked ? "Unlike" : "Like"}
                            aria-pressed={liked}
                            className="flex items-center -ml-0.5 transition-transform active:scale-90"
                          >
                            <motion.div
                              animate={
                                liked ? { scale: [1, 1.35, 1] } : { scale: 1 }
                              }
                              transition={{ duration: 0.3 }}
                            >
                              <Heart
                                className={`h-[26px] w-[26px] transition-colors duration-150 ${
                                  liked
                                    ? "fill-red-500 text-red-500"
                                    : "text-foreground hover:text-white/70"
                                }`}
                              />
                            </motion.div>
                          </button>
                          <button
                            type="button"
                            aria-label="Comment"
                            className="text-foreground hover:text-white/70 transition-colors"
                          >
                            <MessageCircle className="h-[26px] w-[26px]" />
                          </button>
                          <button
                            type="button"
                            aria-label="Share"
                            className="text-foreground hover:text-white/70 transition-colors"
                          >
                            <Send className="h-[24px] w-[24px]" />
                          </button>
                        </div>
                        <button
                          type="button"
                          data-ocid={`post.save_button.${index + 1}`}
                          onClick={() => toggleSave(post.id)}
                          aria-label={saved ? "Unsave" : "Save"}
                          aria-pressed={saved}
                          className="-mr-0.5 transition-transform active:scale-90"
                        >
                          <Bookmark
                            className={`h-[25px] w-[25px] transition-colors duration-150 ${
                              saved
                                ? "fill-foreground text-foreground"
                                : "text-foreground hover:text-white/70"
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-[13px] font-semibold text-foreground mb-1">
                        {formatCount(likeCount)} likes
                      </p>

                      <p className="text-[13px] text-foreground leading-snug mb-1">
                        <span className="font-semibold mr-1">
                          {post.username}
                        </span>
                        <span className="text-foreground/80">
                          {post.caption}
                        </span>
                      </p>

                      <button
                        type="button"
                        className="text-[12px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-2.5"
                        aria-label={`View all ${post.comments} comments`}
                      >
                        View all {post.comments} comments
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-8 text-center">
              <p className="text-[11px] text-muted-foreground/30">
                \u00a9 {new Date().getFullYear()}.{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-muted-foreground/50 transition-colors"
                >
                  Built with \u2665 using caffeine.ai
                </a>
              </p>
            </div>
          </main>
        )}

        {/* ── Bottom Navigation ── */}
        <nav
          data-ocid="bottomnav.section"
          className="fixed bottom-0 z-40 w-full max-w-[480px] flex items-center justify-around border-t border-white/[0.06] bg-background/90 backdrop-blur-xl h-[60px]"
        >
          <button
            type="button"
            data-ocid="nav.home.tab"
            onClick={() => setActiveTab("home")}
            aria-label="Home"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === "home"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home
              className={`h-[22px] w-[22px] ${
                activeTab === "home" ? "fill-primary/15 stroke-primary" : ""
              }`}
            />
            <span className="text-[9px] font-medium tracking-wide uppercase">
              Home
            </span>
          </button>

          <button
            type="button"
            data-ocid="nav.explore.tab"
            onClick={() => setActiveTab("explore")}
            aria-label="Explore"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === "explore"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass
              className={`h-[22px] w-[22px] ${
                activeTab === "explore" ? "fill-primary/15 stroke-primary" : ""
              }`}
            />
            <span className="text-[9px] font-medium tracking-wide uppercase">
              Explore
            </span>
          </button>

          <button
            type="button"
            data-ocid="nav.reels.tab"
            onClick={() => setActiveTab("reels")}
            aria-label="Reels"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === "reels"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Film
              className={`h-[22px] w-[22px] ${
                activeTab === "reels" ? "fill-primary/15 stroke-primary" : ""
              }`}
            />
            <span className="text-[9px] font-medium tracking-wide uppercase">
              Reels
            </span>
          </button>

          <button
            type="button"
            data-ocid="nav.create.tab"
            onClick={() => setActiveTab("create")}
            aria-label="Create post"
            className="flex flex-col items-center px-3 py-1"
          >
            <div
              className={`h-10 w-10 rounded-[14px] flex items-center justify-center transition-all shadow-teal ${
                activeTab === "create"
                  ? "bg-primary scale-95"
                  : "bg-primary/90 hover:bg-primary"
              }`}
            >
              <PlusSquare className="h-5 w-5 text-primary-foreground" />
            </div>
          </button>

          <button
            type="button"
            data-ocid="nav.notifications.tab"
            onClick={() => setActiveTab("notifications")}
            aria-label="Notifications"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === "notifications"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="h-[22px] w-[22px]" />
            <span className="text-[9px] font-medium tracking-wide uppercase">
              Alerts
            </span>
          </button>

          <button
            type="button"
            data-ocid="nav.profile.tab"
            onClick={() => setActiveTab("profile")}
            aria-label="Profile"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === "profile"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-[22px] w-[22px]" />
            <span className="text-[9px] font-medium tracking-wide uppercase">
              Profile
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
