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
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import CameraPage from "./CameraPage";
import DirectMessagesPage from "./DirectMessagesPage";
import ExplorePage from "./ExplorePage";
import NotificationsPage from "./NotificationsPage";
import ProfilePage from "./ProfilePage";
import ReelsPage from "./ReelsPage";

const STORIES = [
  {
    id: 0,
    username: "Your Story",
    initials: "Me",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    statusText: "Add your story...",
    isOwn: true,
  },
  {
    id: 1,
    username: "priya.s",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    statusText: "Just shipped a new AI model 🚀 The future is NOW!",
    isOwn: false,
  },
  {
    id: 2,
    username: "arjun.dev",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    statusText: "Building something incredible ⚡ Stay tuned!",
    isOwn: false,
  },
  {
    id: 3,
    username: "sneha.c",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    statusText: "Feeling great today! 🌸 Good vibes only.",
    isOwn: false,
  },
  {
    id: 4,
    username: "rahul.b",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    statusText: "New blog post is live! 📝 Link in bio.",
    isOwn: false,
  },
  {
    id: 5,
    username: "kavya.ai",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    statusText: "Exploring the frontiers of AI 🧠✨",
    isOwn: false,
  },
  {
    id: 6,
    username: "rohit.ai",
    initials: "RA",
    avatarGradient: "from-yellow-400 via-amber-500 to-orange-600",
    statusText: "Rohit AI Tech — innovation never sleeps 💡",
    isOwn: false,
  },
];

const OTHER_STORIES = STORIES.filter((s) => !s.isOwn);

const POSTS = [
  {
    id: 1,
    username: "priya.sharma",
    displayName: "Priya Sharma",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    timestamp: "2 minutes ago",
    caption:
      "Just deployed my first AI model on the cloud ☁️✨ The future is here and it's incredible! #AITech #RohitAITech #MachineLearning",
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
      "Building the next generation of smart apps 🚀 Who else is excited about the possibilities with AI? Drop a 🔥 below!",
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
      "Machine learning workshop wrapped up — absolutely mind-blowing how fast this field is moving 🧠💡 #MachineLearning #Innovation",
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
      "New blog post: 'Why AI is the backbone of tomorrow's internet' — link in bio! What do you think about AI-driven UX? 🤔",
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
      "Excited to join the Rohit AI Tech community! 🎉 This platform is exactly what I've been looking for — innovation meets social. #NewMember #RohitAITech",
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
  | "profile"
  | "camera"
  | "dms";

// ── Story Viewer ──────────────────────────────────────────────────────────────
const STORY_DURATION = 5000; // ms per story

interface StoryViewerProps {
  stories: typeof OTHER_STORIES;
  startIndex: number;
  viewedStories: Set<number>;
  onClose: (viewedIds: number[]) => void;
}

function StoryViewer({
  stories,
  startIndex,
  viewedStories,
  onClose,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenRef = useRef<Set<number>>(new Set(viewedStories));
  const progressRef = useRef(0);

  const story = stories[currentIndex];

  const goNext = useCallback(() => {
    seenRef.current.add(stories[currentIndex].id);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      onClose(Array.from(seenRef.current));
    }
  }, [currentIndex, stories, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      progressRef.current = 0;
    }
  }, [currentIndex]);

  // Tick the progress bar
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const TICK = 50;
    intervalRef.current = setInterval(() => {
      progressRef.current += (TICK / STORY_DURATION) * 100;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setProgress(100);
        if (intervalRef.current) clearInterval(intervalRef.current);
        goNext();
      } else {
        setProgress(progressRef.current);
      }
    }, TICK);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, goNext]);

  // Mark current story viewed on mount/change
  useEffect(() => {
    seenRef.current.add(story.id);
  }, [story.id]);

  const handleClose = () => {
    seenRef.current.add(story.id);
    onClose(Array.from(seenRef.current));
  };

  return (
    <motion.div
      data-ocid="story.viewer.section"
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ touchAction: "none" }}
    >
      {/* Background: gradient from story avatar */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${story.avatarGradient} opacity-25`}
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Content glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.45 0.2 300 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Progress bars ── */}
      <div className="relative z-10 flex gap-1 px-3 pt-10 pb-0">
        {stories.map((s, i) => (
          <div
            key={s.id}
            data-ocid={`story.progress.item.${i + 1}`}
            className="flex-1 h-[2.5px] rounded-full bg-white/25 overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width:
                  i < currentIndex
                    ? "100%"
                    : i === currentIndex
                      ? `${progress}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Header row ── */}
      <div className="relative z-10 flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-[2px] rounded-full bg-gradient-to-br ${story.avatarGradient} flex-shrink-0`}
          >
            <div className="h-9 w-9 rounded-full bg-black/60 flex items-center justify-center">
              <span className="text-[12px] font-bold text-white">
                {story.initials}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-white leading-tight">
              {story.username}
            </span>
            <span className="text-[11px] text-white/60 leading-tight">
              Just now
            </span>
          </div>
        </div>
        <button
          type="button"
          data-ocid="story.viewer.close_button"
          onClick={handleClose}
          className="p-2 -mr-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close story viewer"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* ── Story card content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[340px] flex flex-col items-center"
        >
          {/* Large avatar circle */}
          <div
            className={`relative h-32 w-32 rounded-full bg-gradient-to-br ${story.avatarGradient} flex items-center justify-center mb-6 shadow-2xl`}
            style={{
              boxShadow:
                "0 0 60px oklch(0.6 0.25 300 / 0.4), 0 0 100px oklch(0.5 0.2 300 / 0.2)",
            }}
          >
            <span className="text-4xl font-black text-white tracking-tight">
              {story.initials}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {story.username}
          </h2>

          <p className="text-[15px] text-white/85 text-center leading-relaxed px-4">
            {story.statusText}
          </p>
        </motion.div>
      </div>

      {/* ── Tap zones: left = prev, right = next ── */}
      <div
        className="absolute inset-0 z-20 flex"
        style={{ top: "80px", bottom: "80px" }}
      >
        <button
          type="button"
          className="flex-1 h-full"
          aria-label="Previous story"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          onClick={goPrev}
        />
        <button
          type="button"
          className="flex-1 h-full"
          aria-label="Next story"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          onClick={goNext}
        />
      </div>
    </motion.div>
  );
}

// ── Search Modal ──────────────────────────────────────────────────────────────
const SEARCH_PROFILES = STORIES.filter((s) => !s.isOwn);

interface SearchModalProps {
  onClose: () => void;
}

function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = SEARCH_PROFILES.filter((p) =>
    p.username.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <motion.div
      data-ocid="search.modal"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-white/10">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          data-ocid="search.search_input"
          type="text"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-[16px] text-white placeholder:text-white/30 outline-none"
        />
        <button
          type="button"
          data-ocid="search.close_button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close search"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Profile suggestions */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 ? (
          <p className="text-center text-white/30 text-sm mt-12">
            No profiles found
          </p>
        ) : (
          filtered.map((profile, i) => (
            <button
              key={profile.id}
              type="button"
              data-ocid={`search.item.${i + 1}`}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div
                className={`h-11 w-11 rounded-full bg-gradient-to-br ${profile.avatarGradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-[13px] font-bold text-white">
                  {profile.initials}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[14px] font-semibold text-white">
                  {profile.username}
                </span>
                <span className="text-[12px] text-white/40">Rohit AI Tech</span>
              </div>
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Main HomeFeed ─────────────────────────────────────────────────────────────
export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

  // Story viewer state
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // User profile state (lifted to top level for cross-app sharing)
  const [userDisplayName, setUserDisplayName] = useState("Rohit Mehra");
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);

  // Swipe gesture tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  // Whether the touch started in the valid swipe zone (middle feed area)
  const swipeAllowed = useRef(false);

  const HEADER_HEIGHT = 54; // px — fixed top bar
  const BOTTOM_NAV_HEIGHT = 60; // px — fixed bottom nav

  const handleTouchStart = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    const screenH = window.innerHeight;
    // Only allow swipe if touch starts in the middle feed area
    swipeAllowed.current = y > HEADER_HEIGHT && y < screenH - BOTTOM_NAV_HEIGHT;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = y;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeAllowed.current) return;
    if (activeTab === "camera" || activeTab === "dms") return;
    if (storyViewerOpen || searchOpen) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    // Only fire horizontal swipe if it's clearly more horizontal than vertical
    if (
      Math.abs(deltaX) > 60 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.5 &&
      deltaTime < 350
    ) {
      if (deltaX > 0) {
        setActiveTab("camera");
      } else {
        setActiveTab("dms");
      }
    }
  };

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

  const handleStoryTap = (storyId: number) => {
    if (storyId === 0) return;
    const idx = OTHER_STORIES.findIndex((s) => s.id === storyId);
    if (idx === -1) return;
    setActiveStoryIndex(idx);
    setStoryViewerOpen(true);
  };

  const handleStoryViewerClose = (viewedIds: number[]) => {
    setViewedStories((prev) => {
      const next = new Set(prev);
      for (const id of viewedIds) next.add(id);
      return next;
    });
    setStoryViewerOpen(false);
  };

  const isFullscreenOverlay = activeTab === "camera" || activeTab === "dms";

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen overlays */}
      {activeTab === "camera" && (
        <CameraPage onClose={() => setActiveTab("home")} />
      )}
      {activeTab === "dms" && (
        <DirectMessagesPage onClose={() => setActiveTab("home")} />
      )}

      {/* Story viewer + Search modal (portal-like, cover full screen) */}
      <AnimatePresence>
        {storyViewerOpen && (
          <StoryViewer
            stories={OTHER_STORIES}
            startIndex={activeStoryIndex}
            viewedStories={viewedStories}
            onClose={handleStoryViewerClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <div className="w-full max-w-[480px] mx-auto relative min-h-screen flex flex-col">
        {/* ── Top Bar ── */}
        {!isFullscreenOverlay &&
          activeTab !== "profile" &&
          activeTab !== "reels" &&
          activeTab !== "explore" &&
          activeTab !== "notifications" && (
            <header
              data-ocid="topbar.section"
              className="fixed top-0 z-40 w-full max-w-[480px] flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-background/85 backdrop-blur-xl"
            >
              <span className="font-display font-black text-[22px] tracking-tight shimmer-text leading-none">
                Rohit AI Tech
              </span>
              <div className="flex items-center gap-1">
                {/* Search icon */}
                <button
                  type="button"
                  data-ocid="topbar.search_button"
                  onClick={() => setSearchOpen(true)}
                  className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Search profiles"
                >
                  <Search className="h-[22px] w-[22px] text-foreground" />
                </button>
                {/* Bell icon */}
                <button
                  type="button"
                  data-ocid="topbar.button"
                  onClick={() => setActiveTab("notifications")}
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
              </div>
            </header>
          )}

        {/* ── Notifications Top Bar ── */}
        {!isFullscreenOverlay && activeTab === "notifications" && (
          <header
            data-ocid="topbar.section"
            className="fixed top-0 z-40 w-full max-w-[480px] flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-background/85 backdrop-blur-xl"
          >
            <span className="font-display font-black text-[22px] tracking-tight shimmer-text leading-none">
              Rohit AI Tech
            </span>
            <div className="w-8" />
          </header>
        )}

        {/* ── Main Content ── */}
        {!isFullscreenOverlay &&
          (activeTab === "reels" ? (
            <div className="fixed inset-0 z-30 pb-[60px]">
              <ReelsPage />
            </div>
          ) : activeTab === "profile" ? (
            <main className="flex-1 pb-[60px] overflow-y-auto">
              <ProfilePage
                displayName={userDisplayName}
                profilePhoto={userProfilePhoto}
                onUpdateProfile={(name, photo) => {
                  setUserDisplayName(name);
                  if (photo !== undefined) setUserProfilePhoto(photo);
                }}
              />
            </main>
          ) : activeTab === "explore" ? (
            <main className="flex-1 pb-[60px] overflow-y-auto">
              <ExplorePage />
            </main>
          ) : activeTab === "notifications" ? (
            <main className="flex-1 pb-[60px] overflow-y-auto">
              <NotificationsPage />
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
                                  {story.isOwn && userProfilePhoto ? (
                                    <img
                                      src={userProfilePhoto}
                                      alt="Your story"
                                      className="h-full w-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[13px] font-bold text-white tracking-tight">
                                      {story.isOwn
                                        ? getInitials(userDisplayName)
                                        : story.initials}
                                    </span>
                                  )}
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
                  &copy; {new Date().getFullYear()}{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground/50 transition-colors"
                  >
                    Built with ♥ using caffeine.ai
                  </a>
                </p>
              </div>
            </main>
          ))}

        {/* ── Bottom Navigation ── */}
        {!isFullscreenOverlay && (
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
                  activeTab === "explore"
                    ? "fill-primary/15 stroke-primary"
                    : ""
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
              aria-label="Activity"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative ${
                activeTab === "notifications"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Heart
                  className={`h-[22px] w-[22px] ${
                    activeTab === "notifications"
                      ? "fill-primary/20 stroke-primary"
                      : ""
                  }`}
                />
                {activeTab !== "notifications" && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </div>
              <span className="text-[9px] font-medium tracking-wide uppercase">
                Activity
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
              {userProfilePhoto ? (
                <img
                  src={userProfilePhoto}
                  alt="Profile"
                  className="h-[24px] w-[24px] rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="h-[24px] w-[24px] rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">
                    {getInitials(userDisplayName)}
                  </span>
                </div>
              )}
              <span className="text-[9px] font-medium tracking-wide uppercase">
                Profile
              </span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
